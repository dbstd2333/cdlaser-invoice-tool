import { getRawDb } from '../../db/connection';
import { products, priceVersions } from '../../db/schema/index';
import { toCamel, toCamelList } from '../../db/case-mapper';
import type { Product, PriceVersion, PriceVersionRow, PageResponse } from '@shared/contracts/types';
import type { PriceVersionQueryInput } from '@shared/schemas/index';
import { mapProduct, mapPriceVersion, mapPriceVersionRow } from './catalog-mappers';

/**
 * 商品与价格版本查询服务。
 */

/** 分页查询价格版本（页面二大表格） */
export function listPriceVersions(input: PriceVersionQueryInput): PageResponse<PriceVersionRow> {
  const raw = getRawDb();
  const { conditions, params } = buildQueryConditions(input);
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRow = raw.prepare(`SELECT COUNT(*) as cnt FROM price_versions pv JOIN products p ON p.id = pv.product_id ${whereClause}`).get(...params) as { cnt: number };
  const offset = (input.page - 1) * input.pageSize;

  const rows = raw.prepare(`
    SELECT pv.id as price_version_id, p.id as product_id, p.name, p.model, p.unit, p.tax_classification_code,
           pv.unit_price_decimal, pv.tax_rate, pv.stock_balance, pv.status as price_version_status,
           p.data_status, p.status as product_status, p.remark, pv.updated_at
    FROM price_versions pv JOIN products p ON p.id = pv.product_id
    ${whereClause}
    ORDER BY pv.updated_at DESC, pv.id DESC
    LIMIT ? OFFSET ?
  `).all(...params, input.pageSize, offset) as Record<string, unknown>[];

  return { rows: rows.map(mapPriceVersionRow), total: countRow.cnt, page: input.page, pageSize: input.pageSize };
}

/** 构建查询条件 */
function buildQueryConditions(input: PriceVersionQueryInput): { conditions: string[]; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (input.keyword?.trim()) {
    const kw = `%${input.keyword.trim()}%`;
    conditions.push('(p.name LIKE ? OR p.model LIKE ? OR p.tax_classification_code LIKE ?)');
    params.push(kw, kw, kw);
  }
  if (input.name?.trim()) {
    conditions.push('p.name LIKE ?');
    params.push(`%${input.name.trim()}%`);
  }
  if (input.model?.trim()) {
    conditions.push('p.model LIKE ?');
    params.push(`%${input.model.trim()}%`);
  }
  if (input.stockStatus && input.stockStatus !== 'all') {
    const map = { positive: 'pv.stock_balance > 0', zero: 'pv.stock_balance = 0', negative: 'pv.stock_balance < 0' };
    conditions.push(map[input.stockStatus]);
  }
  if (input.dataStatus && input.dataStatus !== 'all') {
    conditions.push('p.data_status = ?');
    params.push(input.dataStatus);
  }
  if (input.productStatus && input.productStatus !== 'all') {
    conditions.push('p.status = ?');
    params.push(input.productStatus);
  }
  if (input.priceVersionStatus && input.priceVersionStatus !== 'all') {
    conditions.push('pv.status = ?');
    params.push(input.priceVersionStatus);
  }
  if (input.minPrice) {
    conditions.push('CAST(pv.unit_price_decimal AS REAL) >= CAST(? AS REAL)');
    params.push(input.minPrice);
  }
  if (input.maxPrice) {
    conditions.push('CAST(pv.unit_price_decimal AS REAL) <= CAST(? AS REAL)');
    params.push(input.maxPrice);
  }
  return { conditions, params };
}

/** 按 ID 获取商品 */
export function getProductById(id: string): Product | null {
  const raw = getRawDb();
  const row = toCamel<typeof products.$inferSelect>(
    raw.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  return row ? mapProduct(row) : null;
}

/** 获取商品的所有价格版本 */
export function getPriceVersionsByProduct(productId: string): PriceVersion[] {
  const raw = getRawDb();
  const rows = toCamelList<typeof priceVersions.$inferSelect>(
    raw.prepare('SELECT * FROM price_versions WHERE product_id = ? ORDER BY created_at').all(productId) as Record<string, unknown>[],
  );
  return rows.map(mapPriceVersion);
}

/** 按 ID 获取价格版本 */
export function getPriceVersionById(id: string): PriceVersion | null {
  const raw = getRawDb();
  const row = toCamel<typeof priceVersions.$inferSelect>(
    raw.prepare('SELECT * FROM price_versions WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  return row ? mapPriceVersion(row) : null;
}

/** 获取多个价格版本的详细信息（用于开票前校验） */
export function getPriceVersionsByIds(ids: string[]): PriceVersion[] {
  if (ids.length === 0) return [];
  const raw = getRawDb();
  const placeholders = ids.map(() => '?').join(',');
  const rows = toCamelList<typeof priceVersions.$inferSelect>(
    raw.prepare(`SELECT * FROM price_versions WHERE id IN (${placeholders})`).all(...ids) as Record<string, unknown>[],
  );
  return rows.map(mapPriceVersion);
}
