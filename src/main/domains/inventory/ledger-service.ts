import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { inventoryLedger } from '../../db/schema/index';

import type { InventoryLedger, LedgerSourceType } from '@shared/contracts/types';
import { markDirty } from '../audit/settings-service';

/**
 * 库存流水服务 - 记录所有库存变更的不可变证据。
 * price_versions.stock_balance 用于查询，inventory_ledger 为变更证据。
 * 两者必须在同一事务更新。
 */

/**
 * 写入一条库存流水并返回变更后的余额。
 * 调用方必须在同一事务内更新 price_versions.stock_balance。
 */
export function appendLedger(params: {
  priceVersionId: string;
  changeQuantity: number;
  balanceBefore: number;
  sourceType: LedgerSourceType;
  sourceId: string;
  reason?: string | null;
}): { balanceAfter: number; ledgerId: string } {
  const db = getDb();
  const ledgerId = uuidv7();
  const balanceAfter = params.balanceBefore + params.changeQuantity;

  db.insert(inventoryLedger).values({
    id: ledgerId,
    priceVersionId: params.priceVersionId,
    changeQuantity: params.changeQuantity,
    balanceBefore: params.balanceBefore,
    balanceAfter,
    sourceType: params.sourceType,
    sourceId: params.sourceId,
    reason: params.reason ?? null,
    createdAt: new Date().toISOString(),
  }).run();

  markDirty();
  return { balanceAfter, ledgerId };
}

/** 查询某价格版本的库存流水 */
export function queryLedger(
  priceVersionId: string,
  page: number,
  pageSize: number,
): { rows: InventoryLedger[]; total: number } {
  const raw = getRawDb();
  const countRow = raw.prepare(`
    SELECT COUNT(*) as cnt FROM inventory_ledger WHERE price_version_id = ?
  `).get(priceVersionId) as { cnt: number };

  const offset = (page - 1) * pageSize;
  // raw SQL 返回 snake_case 列名，需映射为 camelCase 以匹配 InventoryLedger 类型
  const rawRows = raw.prepare(`
    SELECT * FROM inventory_ledger
    WHERE price_version_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT ? OFFSET ?
  `).all(priceVersionId, pageSize, offset) as Record<string, unknown>[];

  const rows: InventoryLedger[] = rawRows.map((r) => ({
    id: r.id as string,
    priceVersionId: r.price_version_id as string,
    changeQuantity: r.change_quantity as number,
    balanceBefore: r.balance_before as number,
    balanceAfter: r.balance_after as number,
    sourceType: r.source_type as LedgerSourceType,
    sourceId: r.source_id as string,
    reason: (r.reason as string | null) ?? null,
    createdAt: r.created_at as string,
  }));

  return { rows, total: countRow.cnt };
}

/**
 * 由流水重算指定价格版本的当前余额，用于一致性检查。
 * 重算逻辑：取流水最后一条的 balance_after。
 */
export function recomputeBalance(priceVersionId: string): number | null {
  const raw = getRawDb();
  const lastEntry = raw.prepare(`
    SELECT balance_after FROM inventory_ledger
    WHERE price_version_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `).get(priceVersionId) as { balance_after: number } | undefined;
  return lastEntry?.balance_after ?? null;
}

/**
 * 全量一致性检查：逐个价格版本比对 stock_balance 与流水重算值。
 * 返回不一致的价格版本列表。
 */
export function consistencyCheck(): {
  consistent: boolean;
  mismatches: Array<{ priceVersionId: string; cachedBalance: number; recomputedBalance: number | null }>;
} {
  const raw = getRawDb();
  const versions = raw.prepare(`
    SELECT id, stock_balance FROM price_versions
  `).all() as { id: string; stock_balance: number }[];

  const mismatches: Array<{ priceVersionId: string; cachedBalance: number; recomputedBalance: number | null }> = [];
  for (const v of versions) {
    const recomputed = recomputeBalance(v.id);
    // 如果没有流水记录，余额应为 0
    const expected = recomputed ?? 0;
    if (v.stock_balance !== expected) {
      mismatches.push({
        priceVersionId: v.id,
        cachedBalance: v.stock_balance,
        recomputedBalance: recomputed,
      });
    }
  }

  return { consistent: mismatches.length === 0, mismatches };
}
