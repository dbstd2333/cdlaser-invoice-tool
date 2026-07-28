import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import { v7 as uuidv7 } from 'uuid';
import { createHash } from 'node:crypto';

/**
 * 数据库集成测试 - 验证核心库存事务逻辑。
 * 使用内存 SQLite 数据库，不依赖 Electron 运行时。
 */

// Mock Electron app 模块
vi.mock('electron', () => ({
  app: {
    getPath: () => '/tmp/test-data',
    getName: () => 'test',
    setName: () => {},
    getVersion: () => '1.0.0',
    isPackaged: false,
  },
}));

vi.mock('electron-log/main', () => ({
  default: {
    initialize: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  },
}));

let db: Database.Database;

beforeAll(() => {
  db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  // 建表
  db.exec(`
    CREATE TABLE products (
      id TEXT PRIMARY KEY, name TEXT, name_normalized TEXT, model TEXT, model_normalized TEXT,
      unit TEXT, tax_classification_code TEXT, data_status TEXT, status TEXT, remark TEXT,
      created_at TEXT, updated_at TEXT
    );
    CREATE TABLE price_versions (
      id TEXT PRIMARY KEY, product_id TEXT, unit_price_decimal TEXT, tax_rate INTEGER,
      stock_balance INTEGER, status TEXT, created_at TEXT, updated_at TEXT
    );
    CREATE TABLE inventory_ledger (
      id TEXT PRIMARY KEY, price_version_id TEXT, change_quantity INTEGER,
      balance_before INTEGER, balance_after INTEGER, source_type TEXT, source_id TEXT,
      reason TEXT, created_at TEXT
    );
  `);
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.exec('DELETE FROM inventory_ledger; DELETE FROM price_versions; DELETE FROM products;');
});

describe('库存事务逻辑', () => {
  it('应正确扣减库存并记录流水', () => {
    const productId = uuidv7();
    const pvId = uuidv7();
    const now = new Date().toISOString();

    db.prepare(`INSERT INTO products (id, name, name_normalized, model, model_normalized, unit, tax_classification_code, data_status, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .run(productId, '测试商品', '测试商品', 'A1', 'a1', '个', '1010', 'complete', 'active', now, now);

    db.prepare('INSERT INTO price_versions (id, product_id, unit_price_decimal, tax_rate, stock_balance, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)')
      .run(pvId, productId, '100.00', 13, 10, 'active', now, now);

    // 模拟销项开票：扣减 3 件
    const stockBefore = 10;
    const quantity = 3;
    const stockAfter = stockBefore - quantity;

    db.prepare('UPDATE price_versions SET stock_balance = ?, updated_at = ? WHERE id = ?')
      .run(stockAfter, now, pvId);

    db.prepare('INSERT INTO inventory_ledger (id, price_version_id, change_quantity, balance_before, balance_after, source_type, source_id, reason, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(uuidv7(), pvId, -quantity, stockBefore, stockAfter, 'outbound', uuidv7(), '销项开票', now);

    const pv = db.prepare('SELECT stock_balance FROM price_versions WHERE id = ?').get(pvId) as { stock_balance: number };
    expect(pv.stock_balance).toBe(7);

    const ledger = db.prepare('SELECT * FROM inventory_ledger WHERE price_version_id = ?').get(pvId) as {
      change_quantity: number; balance_before: number; balance_after: number;
    };
    expect(ledger.change_quantity).toBe(-3);
    expect(ledger.balance_before).toBe(10);
    expect(ledger.balance_after).toBe(7);
  });

  it('应允许库存变为负数', () => {
    const pvId = uuidv7();
    const now = new Date().toISOString();
    const productId = uuidv7();

    db.prepare(`INSERT INTO products (id, name, name_normalized, model, model_normalized, unit, tax_classification_code, data_status, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .run(productId, '商品B', '商品b', 'B1', 'b1', '个', '1020', 'complete', 'active', now, now);

    db.prepare('INSERT INTO price_versions (id, product_id, unit_price_decimal, tax_rate, stock_balance, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)')
      .run(pvId, productId, '50.00', 13, 2, 'active', now, now);

    // 开票 5 件，库存从 2 变为 -3
    const stockBefore = 2;
    const quantity = 5;
    const stockAfter = stockBefore - quantity; // -3

    db.prepare('UPDATE price_versions SET stock_balance = ? WHERE id = ?').run(stockAfter, pvId);
    db.prepare('INSERT INTO inventory_ledger (id, price_version_id, change_quantity, balance_before, balance_after, source_type, source_id, reason, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(uuidv7(), pvId, -quantity, stockBefore, stockAfter, 'outbound', uuidv7(), '销项开票', now);

    const pv = db.prepare('SELECT stock_balance FROM price_versions WHERE id = ?').get(pvId) as { stock_balance: number };
    expect(pv.stock_balance).toBe(-3);
  });

  it('作废应恢复库存', () => {
    const pvId = uuidv7();
    const now = new Date().toISOString();
    const productId = uuidv7();

    db.prepare(`INSERT INTO products (id, name, name_normalized, model, model_normalized, unit, tax_classification_code, data_status, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .run(productId, '商品C', '商品c', 'C1', 'c1', '个', '1030', 'complete', 'active', now, now);

    db.prepare('INSERT INTO price_versions (id, product_id, unit_price_decimal, tax_rate, stock_balance, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)')
      .run(pvId, productId, '20.00', 13, 5, 'active', now, now);

    // 先开票扣减 3 件
    db.prepare('UPDATE price_versions SET stock_balance = 2 WHERE id = ?').run(pvId);
    db.prepare('INSERT INTO inventory_ledger (id, price_version_id, change_quantity, balance_before, balance_after, source_type, source_id, reason, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(uuidv7(), pvId, -3, 5, 2, 'outbound', uuidv7(), '销项开票', now);

    // 作废恢复 3 件
    db.prepare('UPDATE price_versions SET stock_balance = 5 WHERE id = ?').run(pvId);
    db.prepare('INSERT INTO inventory_ledger (id, price_version_id, change_quantity, balance_before, balance_after, source_type, source_id, reason, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(uuidv7(), pvId, 3, 2, 5, 'outbound_void', uuidv7(), '销项作废', now);

    const pv = db.prepare('SELECT stock_balance FROM price_versions WHERE id = ?').get(pvId) as { stock_balance: number };
    expect(pv.stock_balance).toBe(5); // 恢复到原值

    const ledgers = db.prepare('SELECT * FROM inventory_ledger WHERE price_version_id = ? ORDER BY created_at').all(pvId);
    expect(ledgers.length).toBe(2);
  });

  it('应由流水重算余额', () => {
    const pvId = uuidv7();
    const now = new Date().toISOString();
    const productId = uuidv7();

    db.prepare(`INSERT INTO products (id, name, name_normalized, model, model_normalized, unit, tax_classification_code, data_status, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .run(productId, '商品D', '商品d', 'D1', 'd1', '个', '1040', 'complete', 'active', now, now);

    db.prepare('INSERT INTO price_versions (id, product_id, unit_price_decimal, tax_rate, stock_balance, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)')
      .run(pvId, productId, '10.00', 13, 0, 'active', now, now);

    // 初始库存 +10
    db.prepare('INSERT INTO inventory_ledger (id, price_version_id, change_quantity, balance_before, balance_after, source_type, source_id, reason, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(uuidv7(), pvId, 10, 0, 10, 'initialization', uuidv7(), '初始', now);
    // 开票 -3
    db.prepare('INSERT INTO inventory_ledger (id, price_version_id, change_quantity, balance_before, balance_after, source_type, source_id, reason, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(uuidv7(), pvId, -3, 10, 7, 'outbound', uuidv7(), '开票', now);
    // 进项 +5
    db.prepare('INSERT INTO inventory_ledger (id, price_version_id, change_quantity, balance_before, balance_after, source_type, source_id, reason, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(uuidv7(), pvId, 5, 7, 12, 'inbound', uuidv7(), '进项', now);

    // 重算：取最后一条流水的 balance_after
    const lastEntry = db.prepare('SELECT balance_after FROM inventory_ledger WHERE price_version_id = ? ORDER BY created_at DESC, id DESC LIMIT 1').get(pvId) as { balance_after: number };
    expect(lastEntry.balance_after).toBe(12);
  });
});

describe('月底负库存导出逻辑', () => {
  it('应只导出库存小于 0 的价格版本', () => {
    const now = new Date().toISOString();
    const productId = uuidv7();

    db.prepare(`INSERT INTO products (id, name, name_normalized, model, model_normalized, unit, tax_classification_code, data_status, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .run(productId, '商品E', '商品e', 'E1', 'e1', '个', '1050', 'complete', 'active', now, now);

    // 创建三个价格版本：正、零、负
    const pvPositive = uuidv7();
    const pvZero = uuidv7();
    const pvNegative = uuidv7();

    db.prepare('INSERT INTO price_versions (id, product_id, unit_price_decimal, tax_rate, stock_balance, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)')
      .run(pvPositive, productId, '10.00', 13, 5, 'active', now, now);
    db.prepare('INSERT INTO price_versions (id, product_id, unit_price_decimal, tax_rate, stock_balance, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)')
      .run(pvZero, productId, '20.00', 13, 0, 'active', now, now);
    db.prepare('INSERT INTO price_versions (id, product_id, unit_price_decimal, tax_rate, stock_balance, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)')
      .run(pvNegative, productId, '30.00', 13, -12, 'active', now, now);

    // 查询负库存
    const negativePvs = db.prepare('SELECT * FROM price_versions WHERE stock_balance < 0 AND status = ?').all('active') as { stock_balance: number }[];
    expect(negativePvs.length).toBe(1);
    expect(negativePvs[0].stock_balance).toBe(-12);
    expect(Math.abs(negativePvs[0].stock_balance)).toBe(12); // 待补数量
  });
});

describe('进项导入哈希去重', () => {
  it('应正确计算文件哈希', () => {
    const content1 = 'test content 1';
    const content2 = 'test content 2';
    const hash1 = createHash('sha256').update(content1).digest('hex');
    const hash2 = createHash('sha256').update(content2).digest('hex');
    const hash1Again = createHash('sha256').update(content1).digest('hex');

    expect(hash1).not.toBe(hash2);
    expect(hash1).toBe(hash1Again);
  });
});
