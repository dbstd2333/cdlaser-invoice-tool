import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { createHash } from 'node:crypto';
import { v7 as uuidv7 } from 'uuid';

/** 不同价格商品独立库存模型的数据库集成测试。 */
let db: Database.Database;

beforeAll(() => {
  db = new Database(':memory:');
  db.exec(`
    CREATE TABLE products (
      id TEXT PRIMARY KEY, name TEXT, name_normalized TEXT, model TEXT, model_normalized TEXT,
      unit TEXT, tax_classification_code TEXT, unit_price_decimal TEXT, tax_rate INTEGER,
      stock_balance INTEGER, data_status TEXT, status TEXT, remark TEXT, created_at TEXT, updated_at TEXT
    );
    CREATE TABLE inventory_ledger (
      id TEXT PRIMARY KEY, product_id TEXT, change_quantity INTEGER,
      balance_before INTEGER, balance_after INTEGER, source_type TEXT, source_id TEXT,
      reason TEXT, created_at TEXT
    );
  `);
});

afterAll(() => db.close());
beforeEach(() => db.exec('DELETE FROM inventory_ledger; DELETE FROM products;'));

/** 插入测试商品并返回商品 ID。 */
function insertProduct(stockBalance: number, unitPrice = '100.00'): string {
  const id = uuidv7();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO products (
      id, name, name_normalized, model, model_normalized, unit, tax_classification_code,
      unit_price_decimal, tax_rate, stock_balance, data_status, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, '测试商品', '测试商品', 'A1', 'a1', '个', '1010', unitPrice, 13, stockBalance, 'complete', 'active', now, now);
  return id;
}

/** 模拟一次库存变化并写入商品级流水。 */
function changeStock(productId: string, change: number, sourceType: string): number {
  const row = db.prepare('SELECT stock_balance FROM products WHERE id = ?').get(productId) as { stock_balance: number };
  const after = row.stock_balance + change;
  const now = new Date().toISOString();
  db.prepare('UPDATE products SET stock_balance = ?, updated_at = ? WHERE id = ?').run(after, now, productId);
  db.prepare(`
    INSERT INTO inventory_ledger (
      id, product_id, change_quantity, balance_before, balance_after, source_type, source_id, reason, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(uuidv7(), productId, change, row.stock_balance, after, sourceType, uuidv7(), sourceType, now);
  return after;
}

describe('商品级库存事务', () => {
  it('扣减库存后记录同一商品流水', () => {
    const productId = insertProduct(10);
    expect(changeStock(productId, -3, 'outbound')).toBe(7);
    const ledger = db.prepare('SELECT * FROM inventory_ledger WHERE product_id = ?').get(productId) as {
      change_quantity: number; balance_before: number; balance_after: number;
    };
    expect(ledger).toMatchObject({ change_quantity: -3, balance_before: 10, balance_after: 7 });
  });

  it('允许负库存，作废后恢复', () => {
    const productId = insertProduct(2);
    expect(changeStock(productId, -5, 'outbound')).toBe(-3);
    expect(changeStock(productId, 5, 'outbound_void')).toBe(2);
  });

  it('同名同型号不同价格使用独立商品和库存', () => {
    const firstId = insertProduct(2, '100');
    const secondId = insertProduct(-3, '128.5');
    expect(changeStock(firstId, -1, 'outbound')).toBe(1);

    const rows = db.prepare(`
      SELECT id, unit_price_decimal, stock_balance FROM products ORDER BY unit_price_decimal
    `).all();
    expect(rows).toEqual([
      { id: firstId, unit_price_decimal: '100', stock_balance: 1 },
      { id: secondId, unit_price_decimal: '128.5', stock_balance: -3 },
    ]);
  });
});

describe('月底负库存导出条件', () => {
  it('只查询负库存启用商品', () => {
    insertProduct(5);
    insertProduct(0);
    insertProduct(-12);
    const rows = db.prepare("SELECT stock_balance FROM products WHERE stock_balance < 0 AND status = 'active'").all() as Array<{ stock_balance: number }>;
    expect(rows).toEqual([{ stock_balance: -12 }]);
  });
});

describe('进项导入哈希去重', () => {
  it('相同内容生成相同哈希', () => {
    const hash = (content: string) => createHash('sha256').update(content).digest('hex');
    expect(hash('test content')).toBe(hash('test content'));
    expect(hash('test content')).not.toBe(hash('other content'));
  });
});
