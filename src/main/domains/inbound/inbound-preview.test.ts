import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

vi.mock('electron', () => ({
  app: { getPath: () => '/tmp/test-data', getName: () => 'test', setName: () => {}, getVersion: () => '1.0.0', isPackaged: false },
}));

vi.mock('electron-log/main', () => ({ default: { info: () => {}, warn: () => {}, error: () => {} } }));

const { dbRef } = vi.hoisted(() => ({ dbRef: { current: null as Database.Database | null } }));

vi.mock('../../db/connection', () => ({
  getRawDb: () => {
    if (!dbRef.current) throw new Error('数据库未初始化');
    return dbRef.current;
  },
}));

import { buildInboundPreview } from './inbound-preview';
import type { InboundRawRow } from './inbound-types';

beforeAll(() => {
  dbRef.current = new Database(':memory:');
  dbRef.current.exec(`
    CREATE TABLE products (
      id TEXT PRIMARY KEY, name TEXT, name_normalized TEXT, model TEXT, model_normalized TEXT,
      unit TEXT, unit_price_decimal TEXT, stock_balance INTEGER
    );
    CREATE TABLE inbound_batches (id TEXT PRIMARY KEY, file_sha256 TEXT, content_sha256 TEXT);
  `);
});

afterAll(() => dbRef.current?.close());
beforeEach(() => dbRef.current!.exec('DELETE FROM products; DELETE FROM inbound_batches;'));

/** 构造一行可通过字段校验的进项数据。 */
function inboundRow(price: string, model = 'A1'): InboundRawRow {
  return {
    sourceSheet: '明细', sourceRow: 2, invoiceDate: null, invoiceNo: null, sellerName: null,
    name: '测试商品', model, unit: '个', quantity: 2, unitPriceDecimal: price,
    amountYuan: null, taxYuan: null, totalYuan: null,
  };
}

/** 插入一个可精确匹配的价格商品。 */
function insertProduct(id: string, price: string, stock = -5): void {
  dbRef.current!.prepare(`
    INSERT INTO products VALUES (?, '测试商品', '测试商品', 'A1', 'a1', '个', ?, ?)
  `).run(id, price, stock);
}

describe('进项导入按商品价格精确匹配', () => {
  it('同名同型号不同价格分别匹配独立商品', () => {
    insertProduct('p100', '100');
    insertProduct('p120', '120');

    const result = buildInboundPreview([
      { ...inboundRow('100'), sourceRow: 2 },
      { ...inboundRow('120'), sourceRow: 3 },
    ], 'file-1');

    expect(result.hasErrors).toBe(false);
    expect(result.lines.map((line) => line.productId)).toEqual(['p100', 'p120']);
  });

  it('名称型号已存在但价格未建档时阻止导入', () => {
    insertProduct('p100', '100');

    const result = buildInboundPreview([inboundRow('130')], 'file-2');

    expect(result.hasErrors).toBe(true);
    expect(result.errors[0].reason).toContain('商品日常导入');
    expect(result.lines[0].productId).toBeNull();
  });

  it('全新名称型号仍允许进项流程自动建档', () => {
    const result = buildInboundPreview([inboundRow('88', 'B1')], 'file-3');

    expect(result.hasErrors).toBe(false);
    expect(result.lines[0]).toMatchObject({ isNewProduct: true, productId: null, matched: true });
  });
});
