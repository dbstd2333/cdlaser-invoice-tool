import { getDb, getRawDb } from '../../db/connection';
import { outboundBatches, outboundLines, products } from '../../db/schema/index';
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
  const productRow = raw.prepare('SELECT stock_balance FROM products WHERE id = ?').get(line.productId) as { stock_balance: number } | undefined;
  if (!productRow) throw new Error(`商品 ${line.productId} 不存在`);

  const balanceBefore = productRow.stock_balance;
  const balanceAfter = balanceBefore + line.quantity;

  appendLedger({
    productId: line.productId, changeQuantity: line.quantity, balanceBefore,
    sourceType: 'outbound_void', sourceId: batchId, reason: `销项作废 ${batchNo}: ${reason}`,
  });

  db.update(products)
    .set({ stockBalance: balanceAfter, updatedAt: new Date().toISOString() })
    .where(eq(products.id, line.productId)).run();
}
