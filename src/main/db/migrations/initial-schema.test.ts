import { afterEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { runMigrations } from './initial-schema';

/** 验证旧价格版本数据可无损收敛为商品唯一价。 */
describe('旧价格版本迁移', () => {
  let db: Database.Database | null = null;

  afterEach(() => {
    db?.close();
    db = null;
  });

  it('新数据库只创建商品唯一价模型', () => {
    db = new Database(':memory:');
    runMigrations(db);
    const columns = db.prepare('PRAGMA table_info(products)').all() as Array<{ name: string }>;
    expect(columns.map((column) => column.name)).toEqual(expect.arrayContaining([
      'unit_price_decimal',
      'tax_rate',
      'stock_balance',
    ]));
    expect(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'price_versions'").get()).toBeUndefined();
  });

  it('合并库存、保留最近含税价并迁移历史引用', () => {
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE products (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, name_normalized TEXT NOT NULL,
        model TEXT NOT NULL, model_normalized TEXT NOT NULL, unit TEXT NOT NULL,
        tax_classification_code TEXT NOT NULL, data_status TEXT NOT NULL,
        status TEXT NOT NULL, remark TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
      CREATE TABLE price_versions (
        id TEXT PRIMARY KEY, product_id TEXT NOT NULL, unit_price_decimal TEXT NOT NULL,
        tax_rate INTEGER NOT NULL, stock_balance INTEGER NOT NULL, status TEXT NOT NULL,
        created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
      CREATE TABLE inventory_ledger (
        id TEXT PRIMARY KEY, price_version_id TEXT NOT NULL, change_quantity INTEGER NOT NULL,
        balance_before INTEGER NOT NULL, balance_after INTEGER NOT NULL, source_type TEXT NOT NULL,
        source_id TEXT NOT NULL, reason TEXT, created_at TEXT NOT NULL
      );
    `);
    db.prepare(`
      INSERT INTO products VALUES ('p1', '商品', '商品', 'A', 'a', '个', '101', 'complete', 'active', NULL, '2026-01-01', '2026-01-01')
    `).run();
    db.prepare(`
      INSERT INTO price_versions VALUES
        ('v1', 'p1', '100.00', 13, 3, 'active', '2026-01-01', '2026-01-01'),
        ('v2', 'p1', '120.00', 13, -1, 'active', '2026-02-01', '2026-02-01')
    `).run();
    db.prepare(`
      INSERT INTO inventory_ledger VALUES
        ('l1', 'v1', 3, 0, 3, 'initialization', 'b1', NULL, '2026-01-01'),
        ('l2', 'v2', -1, 0, -1, 'outbound', 'b2', NULL, '2026-02-01')
    `).run();

    runMigrations(db);

    const product = db.prepare('SELECT unit_price_decimal, stock_balance FROM products WHERE id = ?').get('p1') as {
      unit_price_decimal: string; stock_balance: number;
    };
    expect(product).toEqual({ unit_price_decimal: '120.00', stock_balance: 2 });
    expect(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'price_versions'").get()).toBeUndefined();
    expect(db.prepare('SELECT product_id, balance_before, balance_after FROM inventory_ledger ORDER BY created_at').all()).toEqual([
      { product_id: 'p1', balance_before: 0, balance_after: 3 },
      { product_id: 'p1', balance_before: 3, balance_after: 2 },
    ]);
  });
});
