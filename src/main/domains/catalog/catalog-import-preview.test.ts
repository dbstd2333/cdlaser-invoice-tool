import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import Database from 'better-sqlite3';

/**
 * 商品导入预览单元测试 - 验证文件内自动去重与单价精度四舍五入。
 * 用内存 SQLite mock 数据库连接，不依赖 Electron 运行时。
 */

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
  default: { info: () => {}, warn: () => {}, error: () => {} },
}));

// 用 vi.hoisted 让 mock 工厂能引用到测试 db 引用
const { dbRef } = vi.hoisted(() => ({
  dbRef: { current: null as Database.Database | null },
}));

vi.mock('../../db/connection', () => ({
  getRawDb: () => {
    if (!dbRef.current) throw new Error('数据库未初始化');
    return dbRef.current;
  },
  getDb: () => {
    if (!dbRef.current) throw new Error('数据库未初始化');
    return dbRef.current;
  },
}));

import { buildInitialImportPreview, buildDailyImportPreview } from './catalog-import-preview';

beforeAll(() => {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE products (
      id TEXT PRIMARY KEY, name TEXT, name_normalized TEXT, model TEXT, model_normalized TEXT,
      unit TEXT, tax_classification_code TEXT, unit_price_decimal TEXT, tax_rate INTEGER,
      stock_balance INTEGER, data_status TEXT, status TEXT, remark TEXT, created_at TEXT, updated_at TEXT
    );
  `);
  dbRef.current = db;
});

afterAll(() => {
  dbRef.current?.close();
});

beforeEach(() => {
  dbRef.current!.exec('DELETE FROM products;');
});

describe('商品导入预览 - 自动去重与单价精度', () => {
  const baseRow = {
    rowIndex: 1,
    name: '激光器',
    model: 'CD-100',
    unit: '个',
    taxClassificationCode: '1090127010100000000',
    unitPriceDecimal: '188.00',
    initialStock: 10,
    remark: null,
  };

  it('文件内相同商品+型号+单价自动去重，不阻断导入', () => {
    const preview = buildInitialImportPreview([
      { ...baseRow, rowIndex: 2 },
      { ...baseRow, rowIndex: 3 },
      { ...baseRow, rowIndex: 4 },
    ]);

    expect(preview.dedupedRowCount).toBe(2);
    expect(preview.hasErrors).toBe(false);
    expect(preview.errorCount).toBe(0);
    // 仅首行有效：新增 1 个商品。
    expect(preview.newProductCount).toBe(1);
    expect(preview.updatedProductCount).toBe(0);
    // 首行正常，后续行标记去重
    expect(preview.rows[0].deduped).toBe(false);
    expect(preview.rows[1].deduped).toBe(true);
    expect(preview.rows[2].deduped).toBe(true);
    expect(preview.rows[1].errors[0]).toContain('与第 2 行商品重复');
  });

  it('单价超过 13 位小数自动四舍五入，并按舍入后值去重', () => {
    // 0.123456789012345(15 位) 与 0.12345678901234(14 位) 四舍五入到 13 位均为 0.1234567890123
    const preview = buildInitialImportPreview([
      { ...baseRow, rowIndex: 2, unitPriceDecimal: '0.123456789012345' },
      { ...baseRow, rowIndex: 3, unitPriceDecimal: '0.12345678901234' },
    ]);

    expect(preview.dedupedRowCount).toBe(1);
    expect(preview.hasErrors).toBe(false);
  });

  it('不同型号视为不同商品，不去重', () => {
    const preview = buildInitialImportPreview([
      { ...baseRow, rowIndex: 2, model: 'CD-100' },
      { ...baseRow, rowIndex: 3, model: 'CD-200' },
    ]);

    expect(preview.dedupedRowCount).toBe(0);
    expect(preview.newProductCount).toBe(2);
    expect(preview.updatedProductCount).toBe(0);
  });

  it('同一商品不同单价仍只保留一个当前价', () => {
    const preview = buildInitialImportPreview([
      { ...baseRow, rowIndex: 2, unitPriceDecimal: '188.00' },
      { ...baseRow, rowIndex: 3, unitPriceDecimal: '199.00' },
    ]);

    expect(preview.dedupedRowCount).toBe(1);
    expect(preview.newProductCount).toBe(1);
  });

  it('日常导入同样自动去重', () => {
    const preview = buildDailyImportPreview([
      { ...baseRow, rowIndex: 2 },
      { ...baseRow, rowIndex: 3 },
    ]);

    expect(preview.dedupedRowCount).toBe(1);
    expect(preview.hasErrors).toBe(false);
    // 日常导入不累加库存
    expect(preview.totalStockSum).toBe(0);
  });
});
