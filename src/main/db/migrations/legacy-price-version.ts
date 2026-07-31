import type Database from 'better-sqlite3';

/** 将旧版多价格数据合并为商品唯一含税单价和库存。 */
export function migrateLegacyPriceVersions(db: Database.Database): void {
  const legacyTable = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'price_versions'").get();
  if (!legacyTable) return;
  addProductColumns(db);
  db.transaction(() => {
    mergeProductValues(db);
    for (const table of ['outbound_lines', 'inbound_lines', 'replenishment_export_lines', 'inventory_ledger']) {
      migrateReferenceColumn(db, table);
    }
    rebuildMergedLedgerBalances(db);
    db.exec('DROP TABLE price_versions');
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

/** 选取最近启用价格，并合并同商品的全部库存。 */
function mergeProductValues(db: Database.Database): void {
  db.exec(`
    UPDATE products
    SET unit_price_decimal = COALESCE((
          SELECT unit_price_decimal FROM price_versions
          WHERE product_id = products.id
          ORDER BY CASE status WHEN 'active' THEN 0 ELSE 1 END, updated_at DESC, id DESC LIMIT 1
        ), unit_price_decimal),
        tax_rate = COALESCE((
          SELECT tax_rate FROM price_versions
          WHERE product_id = products.id
          ORDER BY CASE status WHEN 'active' THEN 0 ELSE 1 END, updated_at DESC, id DESC LIMIT 1
        ), tax_rate),
        stock_balance = COALESCE((
          SELECT SUM(stock_balance) FROM price_versions WHERE product_id = products.id
        ), 0)
  `);
}

/** 把历史表的旧外键转换为商品外键。 */
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
    SET price_version_id = COALESCE(
      (SELECT product_id FROM price_versions WHERE id = ${table}.price_version_id),
      price_version_id
    );
    ALTER TABLE ${table} RENAME COLUMN price_version_id TO product_id;
  `);
}

/** 按时间重算合并后的商品级流水余额。 */
function rebuildMergedLedgerBalances(db: Database.Database): void {
  if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'inventory_ledger'").get()) return;
  const rows = db.prepare(`
    SELECT id, product_id, change_quantity FROM inventory_ledger ORDER BY created_at, id
  `).all() as Array<{ id: string; product_id: string; change_quantity: number }>;
  const balances = new Map<string, number>();
  const update = db.prepare('UPDATE inventory_ledger SET balance_before = ?, balance_after = ? WHERE id = ?');
  for (const row of rows) {
    const before = balances.get(row.product_id) ?? 0;
    const after = before + row.change_quantity;
    update.run(before, after, row.id);
    balances.set(row.product_id, after);
  }
}
