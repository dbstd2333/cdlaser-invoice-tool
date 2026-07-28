import { getRawDb } from '../../db/connection';
import { customers } from '../../db/schema/index';
import { toCamel, toCamelList } from '../../db/case-mapper';
import type { Customer, PageResponse } from '@shared/contracts/types';
import type { CustomerQueryInput } from '@shared/schemas/index';
import { mapCustomerRow } from './customer-mappers';

/**
 * 客户查询服务。
 */

/** 分页查询客户 */
export function listCustomers(input: CustomerQueryInput): PageResponse<Customer> {
  const raw = getRawDb();
  const { conditions, params } = buildQueryConditions(input);
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRow = raw.prepare(`SELECT COUNT(*) as cnt FROM customers ${whereClause}`).get(...params) as { cnt: number };
  const offset = (input.page - 1) * input.pageSize;
  const rows = toCamelList<typeof customers.$inferSelect>(
    raw.prepare(`SELECT * FROM customers ${whereClause} ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`)
      .all(...params, input.pageSize, offset) as Record<string, unknown>[],
  );

  return { rows: rows.map(mapCustomerRow), total: countRow.cnt, page: input.page, pageSize: input.pageSize };
}

/** 构建查询条件 */
function buildQueryConditions(input: CustomerQueryInput): { conditions: string[]; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (input.keyword?.trim()) {
    const kw = `%${input.keyword.trim()}%`;
    conditions.push('(name LIKE ? OR short_code LIKE ? OR tax_id LIKE ? OR phone LIKE ? OR bank_account LIKE ?)');
    params.push(kw, kw, kw, kw, kw);
  }
  if (input.status && input.status !== 'all') {
    conditions.push('status = ?');
    params.push(input.status);
  }
  if (input.isDefaultAddress != null) {
    conditions.push('is_default_address = ?');
    params.push(input.isDefaultAddress ? 1 : 0);
  }
  if (input.dataCompleteness && input.dataCompleteness !== 'all') {
    if (input.dataCompleteness === 'complete') {
      conditions.push('(address IS NOT NULL AND phone IS NOT NULL AND bank_name IS NOT NULL AND bank_account IS NOT NULL AND email IS NOT NULL)');
    } else {
      conditions.push('(address IS NULL OR phone IS NULL OR bank_name IS NULL OR bank_account IS NULL OR email IS NULL)');
    }
  }
  return { conditions, params };
}

/** 按 ID 获取客户 */
export function getCustomerById(id: string): Customer | null {
  const raw = getRawDb();
  const row = toCamel<typeof customers.$inferSelect>(
    raw.prepare('SELECT * FROM customers WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  return row ? mapCustomerRow(row) : null;
}
