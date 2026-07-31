import { getRawDb } from '../../db/connection';
import { products } from '../../db/schema/index';
import { toCamel, toCamelList } from '../../db/case-mapper';
import type { PageResponse, Product } from '@shared/contracts/types';
import type { ProductQueryInput, StockSummary } from '@shared/schemas/index';
import { mapProduct } from './catalog-mappers';

/** 分页查询商品库存。 */
export function listProducts(input: ProductQueryInput): PageResponse<Product> {
  const raw = getRawDb();
  const { conditions, params } = buildQueryConditions(input);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const total = (raw.prepare(`SELECT COUNT(*) AS count FROM products ${where}`).get(...params) as { count: number }).count;
  const offset = (input.page - 1) * input.pageSize;
  const rows = toCamelList<typeof products.$inferSelect>(
    raw.prepare(`SELECT * FROM products ${where} ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`)
      .all(...params, input.pageSize, offset) as Record<string, unknown>[],
  );
  return { rows: rows.map(mapProduct), total, page: input.page, pageSize: input.pageSize };
}

/** 构建商品查询条件。 */
function buildQueryConditions(input: ProductQueryInput): { conditions: string[]; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (input.keyword?.trim()) {
    const keyword = `%${input.keyword.trim()}%`;
    conditions.push('(name LIKE ? OR model LIKE ? OR tax_classification_code LIKE ?)');
    params.push(keyword, keyword, keyword);
  }
  if (input.name?.trim()) {
    conditions.push('name LIKE ?');
    params.push(`%${input.name.trim()}%`);
  }
  if (input.model?.trim()) {
    conditions.push('model LIKE ?');
    params.push(`%${input.model.trim()}%`);
  }
  if (input.stockStatus && input.stockStatus !== 'all') {
    conditions.push({ positive: 'stock_balance > 0', zero: 'stock_balance = 0', negative: 'stock_balance < 0' }[input.stockStatus]);
  }
  if (input.dataStatus && input.dataStatus !== 'all') {
    conditions.push('data_status = ?');
    params.push(input.dataStatus);
  }
  if (input.productStatus && input.productStatus !== 'all') {
    conditions.push('status = ?');
    params.push(input.productStatus);
  }
  if (input.minPrice) {
    conditions.push('CAST(unit_price_decimal AS REAL) >= CAST(? AS REAL)');
    params.push(input.minPrice);
  }
  if (input.maxPrice) {
    conditions.push('CAST(unit_price_decimal AS REAL) <= CAST(? AS REAL)');
    params.push(input.maxPrice);
  }
  return { conditions, params };
}

/** 按 ID 获取商品。 */
export function getProductById(id: string): Product | null {
  const row = toCamel<typeof products.$inferSelect>(
    getRawDb().prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  return row ? mapProduct(row) : null;
}

/** 批量获取商品，用于开票前校验。 */
export function getProductsByIds(ids: string[]): Product[] {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const rows = toCamelList<typeof products.$inferSelect>(
    getRawDb().prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(...ids) as Record<string, unknown>[],
  );
  return rows.map(mapProduct);
}

/** 汇总正库存、负库存绝对值与净库存。 */
export function getStockSummary(): StockSummary {
  const row = getRawDb().prepare(`
    SELECT
      SUM(CASE WHEN stock_balance > 0 THEN stock_balance ELSE 0 END) AS positive,
      SUM(CASE WHEN stock_balance < 0 THEN ABS(stock_balance) ELSE 0 END) AS negative,
      SUM(stock_balance) AS total
    FROM products
  `).get() as { positive: number | null; negative: number | null; total: number | null };
  return { positiveStock: row.positive ?? 0, negativeStock: row.negative ?? 0, totalStock: row.total ?? 0 };
}
