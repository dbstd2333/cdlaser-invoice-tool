import { getDb, getRawDb } from '../../db/connection';
import { inboundBatches, inboundLines, priceVersions } from '../../db/schema/index';
import { toCamel, toCamelList } from '../../db/case-mapper';
import { eq } from 'drizzle-orm';
import type { InboundBatch, InboundLine, PageResponse } from '@shared/contracts/types';
import { recordAudit } from '../audit/audit-service';
import { appendLedger } from '../inventory/ledger-service';
import { markDirty } from '../audit/settings-service';

/**
 * 进项导入查询服务。
 * 分页列表、详情和作废。
 */

/** 将数据库行映射为业务实体 */
function mapInboundBatch(row: typeof inboundBatches.$inferSelect): InboundBatch {
  return {
    id: row.id, batchNo: row.batchNo, originalFileName: row.originalFileName,
    fileSha256: row.fileSha256, contentSha256: row.contentSha256, importedAt: row.importedAt,
    status: row.status, voidReason: row.voidReason, voidedAt: row.voidedAt,
    ignoredRowCount: row.ignoredRowCount, totalQuantity: row.totalQuantity,
    totalAmountCent: row.totalAmountCent, totalTaxCent: row.totalTaxCent, totalCent: row.totalCent,
  };
}

/** 将明细行映射为业务实体 */
function mapInboundLine(row: typeof inboundLines.$inferSelect): InboundLine {
  return {
    id: row.id, batchId: row.batchId, sourceSheet: row.sourceSheet, sourceRow: row.sourceRow,
    invoiceDate: row.invoiceDate, invoiceNo: row.invoiceNo, sellerName: row.sellerName,
    priceVersionId: row.priceVersionId, name: row.name, model: row.model, unit: row.unit,
    unitPriceDecimal: row.unitPriceDecimal, quantity: row.quantity,
    amountCent: row.amountCent, taxCent: row.taxCent, totalCent: row.totalCent,
  };
}

/** 分页查询进项批次 */
export function listInboundBatches(page: number, pageSize: number): PageResponse<InboundBatch> {
  const raw = getRawDb();
  const countRow = raw.prepare('SELECT COUNT(*) as cnt FROM inbound_batches').get() as { cnt: number };
  const offset = (page - 1) * pageSize;
  const rows = toCamelList<typeof inboundBatches.$inferSelect>(
    raw.prepare('SELECT * FROM inbound_batches ORDER BY imported_at DESC, id DESC LIMIT ? OFFSET ?')
      .all(pageSize, offset) as Record<string, unknown>[],
  );
  return { rows: rows.map(mapInboundBatch), total: countRow.cnt, page, pageSize };
}

/** 获取进项批次详情 */
export function getInboundDetail(id: string): { batch: InboundBatch; lines: InboundLine[] } | null {
  const raw = getRawDb();
  const batchRow = toCamel<typeof inboundBatches.$inferSelect>(
    raw.prepare('SELECT * FROM inbound_batches WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  if (!batchRow) return null;

  const lineRows = toCamelList<typeof inboundLines.$inferSelect>(
    raw.prepare('SELECT * FROM inbound_lines WHERE batch_id = ? ORDER BY source_row').all(id) as Record<string, unknown>[],
  );
  return { batch: mapInboundBatch(batchRow), lines: lineRows.map(mapInboundLine) };
}

/** 作废进项批次：整批反向扣减库存 */
export function voidInboundBatch(id: string, reason: string): InboundBatch {
  const raw = getRawDb();
  const db = getDb();

  const batchRow = toCamel<typeof inboundBatches.$inferSelect>(
    raw.prepare('SELECT * FROM inbound_batches WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  if (!batchRow) throw new Error('进项批次不存在');
  if (batchRow.status === 'voided') return mapInboundBatch(batchRow); // 幂等

  const tx = raw.transaction(() => {
    db.update(inboundBatches)
      .set({ status: 'voided', voidReason: reason, voidedAt: new Date().toISOString() })
      .where(eq(inboundBatches.id, id)).run();

    const lineRows = toCamelList<typeof inboundLines.$inferSelect>(
      raw.prepare('SELECT * FROM inbound_lines WHERE batch_id = ?').all(id) as Record<string, unknown>[],
    );
    for (const line of lineRows) {
      reverseInboundLine(db, raw, id, batchRow.batchNo, reason, line);
    }

    recordAudit({
      action: 'inbound.void', entityType: 'inbound_batch', entityId: id, sourceBatchId: id,
      summary: `作废进项批次 ${batchRow.batchNo}，原因: ${reason}`,
    });
    markDirty();
  });

  tx();
  const updated = toCamel<typeof inboundBatches.$inferSelect>(
    raw.prepare('SELECT * FROM inbound_batches WHERE id = ?').get(id) as Record<string, unknown>,
  )!;
  return mapInboundBatch(updated);
}

/** 反向扣减单行库存 */
function reverseInboundLine(
  db: ReturnType<typeof getDb>,
  raw: ReturnType<typeof getRawDb>,
  batchId: string,
  batchNo: string,
  reason: string,
  line: typeof inboundLines.$inferSelect,
): void {
  const pvRow = raw.prepare('SELECT stock_balance FROM price_versions WHERE id = ?').get(line.priceVersionId) as { stock_balance: number } | undefined;
  if (!pvRow) return;

  const balanceBefore = pvRow.stock_balance;
  const balanceAfter = balanceBefore - line.quantity;

  appendLedger({
    priceVersionId: line.priceVersionId, changeQuantity: -line.quantity, balanceBefore,
    sourceType: 'inbound_void', sourceId: batchId, reason: `进项作废 ${batchNo}: ${reason}`,
  });

  db.update(priceVersions)
    .set({ stockBalance: balanceAfter, updatedAt: new Date().toISOString() })
    .where(eq(priceVersions.id, line.priceVersionId)).run();
}
