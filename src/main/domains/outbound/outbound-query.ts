import { getRawDb } from '../../db/connection';
import { outboundBatches, outboundLines } from '../../db/schema/index';
import { toCamel, toCamelList } from '../../db/case-mapper';
import type { OutboundBatch, OutboundLine, PageResponse } from '@shared/contracts/types';
import type { OutboundQueryInput } from '@shared/schemas/index';

/**
 * 销项开票查询服务。
 * 分页列表、详情和原始 XLSX 下载。
 */

/** 将数据库行映射为业务实体 */
export function mapOutboundBatch(row: typeof outboundBatches.$inferSelect): OutboundBatch {
  return {
    id: row.id, batchNo: row.batchNo, customerId: row.customerId,
    customerSnapshot: JSON.parse(row.customerSnapshot), exportedAt: row.exportedAt,
    status: row.status, voidReason: row.voidReason, voidedAt: row.voidedAt,
    totalQuantity: row.totalQuantity, totalAmountCent: row.totalAmountCent,
    totalTaxCent: row.totalTaxCent, totalCent: row.totalCent, lineCount: row.lineCount,
  };
}

/** 将明细行映射为业务实体 */
function mapOutboundLine(row: typeof outboundLines.$inferSelect): OutboundLine {
  return {
    id: row.id, batchId: row.batchId, priceVersionId: row.priceVersionId,
    name: row.name, taxClassificationCode: row.taxClassificationCode,
    model: row.model, unit: row.unit, unitPriceDecimal: row.unitPriceDecimal,
    taxRate: row.taxRate, quantity: row.quantity, amountCent: row.amountCent,
    taxCent: row.taxCent, totalCent: row.totalCent,
    stockBefore: row.stockBefore, stockAfter: row.stockAfter,
  };
}

/** 分页查询开票记录 */
export function listOutboundBatches(input: OutboundQueryInput): PageResponse<OutboundBatch> {
  const raw = getRawDb();
  const { conditions, params } = buildQueryConditions(input);
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRow = raw.prepare(`SELECT COUNT(*) as cnt FROM outbound_batches ${whereClause}`).get(...params) as { cnt: number };
  const offset = (input.page - 1) * input.pageSize;
  const rows = toCamelList<typeof outboundBatches.$inferSelect>(
    raw.prepare(`SELECT * FROM outbound_batches ${whereClause} ORDER BY exported_at DESC, id DESC LIMIT ? OFFSET ?`)
      .all(...params, input.pageSize, offset) as Record<string, unknown>[],
  );

  return { rows: rows.map(mapOutboundBatch), total: countRow.cnt, page: input.page, pageSize: input.pageSize };
}

/** 构建查询条件 */
function buildQueryConditions(input: OutboundQueryInput): { conditions: string[]; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (input.batchNo?.trim()) {
    conditions.push('batch_no LIKE ?');
    params.push(`%${input.batchNo.trim()}%`);
  }
  if (input.customerName?.trim()) {
    conditions.push('customer_snapshot LIKE ?');
    params.push(`%${input.customerName.trim()}%`);
  }
  if (input.status && input.status !== 'all') {
    conditions.push('status = ?');
    params.push(input.status);
  }
  if (input.dateFrom) {
    conditions.push('exported_at >= ?');
    params.push(input.dateFrom);
  }
  if (input.dateTo) {
    conditions.push('exported_at <= ?');
    params.push(input.dateTo);
  }
  if (input.productKeyword?.trim()) {
    const kw = `%${input.productKeyword.trim()}%`;
    conditions.push('id IN (SELECT DISTINCT batch_id FROM outbound_lines WHERE name LIKE ? OR model LIKE ?)');
    params.push(kw, kw);
  }
  return { conditions, params };
}

/** 获取开票批次详情（含明细） */
export function getOutboundDetail(id: string): { batch: OutboundBatch; lines: OutboundLine[] } | null {
  const raw = getRawDb();
  const batchRow = toCamel<typeof outboundBatches.$inferSelect>(
    raw.prepare('SELECT * FROM outbound_batches WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  if (!batchRow) return null;

  const lineRows = toCamelList<typeof outboundLines.$inferSelect>(
    raw.prepare('SELECT * FROM outbound_lines WHERE batch_id = ? ORDER BY id').all(id) as Record<string, unknown>[],
  );
  return { batch: mapOutboundBatch(batchRow), lines: lineRows.map(mapOutboundLine) };
}

/** 获取原始 XLSX Buffer（用于重新下载） */
export function getOutboundXlsx(id: string): { buffer: Buffer; batchNo: string; customerName: string } | null {
  const raw = getRawDb();
  const row = raw.prepare('SELECT xlsx_blob, batch_no, customer_snapshot FROM outbound_batches WHERE id = ?').get(id) as { xlsx_blob: string; batch_no: string; customer_snapshot: string } | undefined;
  if (!row) return null;
  let customerName = '';
  try {
    customerName = (JSON.parse(row.customer_snapshot) as { name?: string }).name ?? '';
  } catch { /* ignore */ }
  return { buffer: Buffer.from(row.xlsx_blob, 'base64'), batchNo: row.batch_no, customerName };
}
