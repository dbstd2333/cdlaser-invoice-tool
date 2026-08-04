import type Database from 'better-sqlite3';

interface LegacyPriceVersion {
  id: string;
  product_id: string;
  unit_price_decimal: string;
  tax_rate: number;
  stock_balance: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface LegacyProduct {
  id: string;
  name: string;
  name_normalized: string;
  model: string;
  model_normalized: string;
  unit: string;
  tax_classification_code: string;
  data_status: string;
  status: string;
  remark: string | null;
  created_at: string;
  updated_at: string;
}

/** 将旧版价格版本展开为相互独立的商品记录。 */
export function migrateLegacyPriceVersions(db: Database.Database): void {
  const legacyTable = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'price_versions'").get();
  if (!legacyTable) return;
  addProductColumns(db);
  db.transaction(() => {
    db.exec('DROP INDEX IF EXISTS products_name_model_unique');
    createReferenceMap(db);
    expandPriceVersions(db);
    for (const table of ['outbound_lines', 'inbound_lines', 'replenishment_export_lines', 'inventory_ledger']) {
      migrateReferenceColumn(db, table);
    }
    db.exec('DROP TABLE price_versions');
    db.exec('DROP TABLE legacy_price_product_map');
  })();
}

/** 为旧商品表增加新模型字段。 */
function addProductColumns(db: Database.Database): void {
  const columns = db.prepare('PRAGMA table_info(products)').all() as Array<{ name: string }>;
  const names = new Set(columns.map((column) => column.name));
  if (!names.has('unit_price_decimal')) db.exec("ALTER TABLE products ADD COLUMN unit_price_decimal TEXT NOT NULL DEFAULT '0'");
  if (!names.has('tax_rate')) db.exec('ALTER TABLE products ADD COLUMN tax_rate INTEGER NOT NULL DEFAULT 13');
  if (!names.has('stock_balance')) db.exec('ALTER TABLE products ADD COLUMN stock_balance INTEGER NOT NULL DEFAULT 0');
}

/** 创建价格版本到新商品 ID 的临时映射。 */
function createReferenceMap(db: Database.Database): void {
  db.exec(`
    CREATE TEMP TABLE legacy_price_product_map (
      price_version_id TEXT PRIMARY KEY NOT NULL,
      product_id TEXT NOT NULL
    )
  `);
}

/** 将每个旧价格版本转换为独立商品，并保留首个版本的原商品 ID。 */
function expandPriceVersions(db: Database.Database): void {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at, id').all() as LegacyProduct[];
  const versionsQuery = db.prepare(`
    SELECT * FROM price_versions WHERE product_id = ? ORDER BY created_at, id
  `);
  const insertMap = db.prepare('INSERT INTO legacy_price_product_map VALUES (?, ?)');
  const updateProduct = db.prepare(`
    UPDATE products SET unit_price_decimal = ?, tax_rate = ?, stock_balance = ?, status = ?, updated_at = ?
    WHERE id = ?
  `);
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, name_normalized, model, model_normalized, unit, tax_classification_code,
      unit_price_decimal, tax_rate, stock_balance, data_status, status, remark, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const product of products) {
    const versions = versionsQuery.all(product.id) as LegacyPriceVersion[];
    versions.forEach((version, index) => {
      const targetId = index === 0 ? product.id : version.id;
      const status = product.status === 'inactive' || version.status === 'inactive' ? 'inactive' : 'active';
      if (index === 0) {
        updateProduct.run(
          version.unit_price_decimal,
          version.tax_rate,
          version.stock_balance,
          status,
          version.updated_at,
          targetId,
        );
      } else {
        insertProduct.run(
          targetId,
          product.name,
          product.name_normalized,
          product.model,
          product.model_normalized,
          product.unit,
          product.tax_classification_code,
          version.unit_price_decimal,
          version.tax_rate,
          version.stock_balance,
          product.data_status,
          status,
          product.remark,
          version.created_at,
          version.updated_at,
        );
      }
      insertMap.run(version.id, targetId);
    });
  }
}

/** 把历史表的价格版本外键转换为独立商品外键。 */
function migrateReferenceColumn(db: Database.Database, table: string): void {
  if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)) return;
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  if (!columns.some((column) => column.name === 'price_version_id')) return;
  const indexes = db.prepare(`PRAGMA index_list(${table})`).all() as Array<{ name: string }>;
  for (const index of indexes) {
    if (index.name.includes('price_version')) db.exec(`DROP INDEX IF EXISTS "${index.name}"`);
  }
  db.exec(`
    UPDATE ${table}
    SET price_version_id = COALESCE((
      SELECT product_id FROM legacy_price_product_map
      WHERE price_version_id = ${table}.price_version_id
    ), price_version_id);
    ALTER TABLE ${table} RENAME COLUMN price_version_id TO product_id;
  `);
}
