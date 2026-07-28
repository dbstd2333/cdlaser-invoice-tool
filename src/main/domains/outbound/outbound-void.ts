import { getDb, getRawDb } from '../../db/connection';
import { outboundBatches, outboundLines, priceVersions } from '../../db/schema/index';
import { toCamel, toCamelList } from '../../db/case-mapper';
import { eq } from 'drizzle-orm';
import type { OutboundBatch } from '@shared/contracts/types';
import { recordAudit } from '../audit/audit-service';
import { appendLedger } from '../inventory/ledger-service';
import { markDirty } from '../audit/settings-service';
import { mapOutboundBatch } from './outbound-query';

/**
 * 销项作废服务。
 * 单事务标记作废 + 逐行恢复库存。
 */

/** 作废开票批次：单事务恢复库存，幂等 */
export function voidOutboundBatch(id: string, reason: string): OutboundBatch {
  const raw = getRawDb();
  const db = getDb();

  const batchRow = toCamel<typeof outboundBatches.$inferSelect>(
    raw.prepare('SELECT * FROM outbound_batches WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  if (!batchRow) throw new Error('开票批次不存在');
  if (batchRow.status === 'voided') return mapOutboundBatch(batchRow); // 幂等

  const tx = raw.transaction(() => {
    db.update(outboundBatches)
      .set({ status: 'voided', voidReason: reason, voidedAt: new Date().toISOString() })
      .where(eq(outboundBatches.id, id)).run();

    const lineRows = toCamelList<typeof outboundLines.$inferSelect>(
      raw.prepare('SELECT * FROM outbound_lines WHERE batch_id = ?').all(id) as Record<string, unknown>[],
    );
    for (const line of lineRows) {
      restoreOutboundLine(db, raw, id, batchRow.batchNo, reason, line);
    }

    recordAudit({
      action: 'outbound.void', entityType: 'outbound_batch', entityId: id, sourceBatchId: id,
      summary: `作废开票批次 ${batchRow.batchNo}，原因: ${reason}`,
    });
    markDirty();
  });

  tx();
  const updated = toCamel<typeof outboundBatches.$inferSelect>(
    raw.prepare('SELECT * FROM outbound_batches WHERE id = ?').get(id) as Record<string, unknown>,
  )!;
  return mapOutboundBatch(updated);
}

/** 恢复单行库存：写入正向流水并更新余额 */
function restoreOutboundLine(
  db: ReturnType<typeof getDb>,
  raw: ReturnType<typeof getRawDb>,
  batchId: string,
  batchNo: string,
  reason: string,
  line: typeof outboundLines.$inferSelect,
): void {
  const pvRow = raw.prepare('SELECT stock_balance FROM price_versions WHERE id = ?').get(line.priceVersionId) as { stock_balance: number } | undefined;
  if (!pvRow) throw new Error(`价格版本 ${line.priceVersionId} 不存在`);

  const balanceBefore = pvRow.stock_balance;
  const balanceAfter = balanceBefore + line.quantity;

  appendLedger({
    priceVersionId: line.priceVersionId, changeQuantity: line.quantity, balanceBefore,
    sourceType: 'outbound_void', sourceId: batchId, reason: `销项作废 ${batchNo}: ${reason}`,
  });

  db.update(priceVersions)
    .set({ stockBalance: balanceAfter, updatedAt: new Date().toISOString() })
    .where(eq(priceVersions.id, line.priceVersionId)).run();
}
