import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { priceVersions } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import type { InventoryAdjustInput } from '@shared/schemas/index';
import { appendLedger } from '../inventory/ledger-service';
import { recordAudit } from '../audit/audit-service';
import { markDirty } from '../audit/settings-service';
import { getPriceVersionById } from '../catalog/catalog-service';

/**
 * 库存调整服务 - 人工调整库存。
 * 调整量必须为非零整数，原因必填，生成独立库存流水，不直接覆盖库存值。
 */
export function adjustInventory(input: InventoryAdjustInput): { newBalance: number; ledgerId: string } {
  const pv = getPriceVersionById(input.priceVersionId);
  if (!pv) throw new Error('价格版本不存在');

  const db = getDb();
  const raw = getRawDb();
  const balanceBefore = pv.stockBalance;
  const balanceAfter = balanceBefore + input.changeQuantity;
  const ledgerId = uuidv7();

  const tx = raw.transaction(() => {
    const { ledgerId: id } = appendLedger({
      priceVersionId: input.priceVersionId,
      changeQuantity: input.changeQuantity,
      balanceBefore,
      sourceType: 'adjustment',
      sourceId: ledgerId,
      reason: input.reason,
    });

    db.update(priceVersions)
      .set({ stockBalance: balanceAfter, updatedAt: new Date().toISOString() })
      .where(eq(priceVersions.id, input.priceVersionId))
      .run();

    recordAudit({
      action: 'inventory.adjust',
      entityType: 'price_version',
      entityId: input.priceVersionId,
      sourceBatchId: ledgerId,
      summary: `人工调整 ${input.changeQuantity > 0 ? '+' : ''}${input.changeQuantity}，原因: ${input.reason}`,
      fieldChanges: [
        { fieldPath: 'stockBalance', oldValue: String(balanceBefore), newValue: String(balanceAfter) },
      ],
    });

    markDirty();
    // 确保使用同一 ledgerId
    if (id !== ledgerId) {
      raw.prepare('UPDATE inventory_ledger SET id = ? WHERE id = ?').run(ledgerId, id);
    }
  });

  tx();
  return { newBalance: balanceAfter, ledgerId };
}
