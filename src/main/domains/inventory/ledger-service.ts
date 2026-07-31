import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { inventoryLedger } from '../../db/schema/index';

import type { InventoryLedger, LedgerSourceType } from '@shared/contracts/types';
import { markDirty } from '../audit/settings-service';

/**
 * 库存流水服务 - 记录所有库存变更的不可变证据。
 * products.stock_balance 用于查询，inventory_ledger 为变更证据。
 * 两者必须在同一事务更新。
 */

/**
 * 写入一条库存流水并返回变更后的余额。
 * 调用方必须在同一事务内更新 products.stock_balance。
 */
export function appendLedger(params: {
  productId: string;
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
    productId: params.productId,
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

/** 按商品查询库存流水。 */
export function queryLedger(params: {
  productId: string;
  page: number;
  pageSize: number;
}): { rows: InventoryLedger[]; total: number } {
  const raw = getRawDb();
  const { productId, page, pageSize } = params;

  const countRow = raw.prepare(`
    SELECT COUNT(*) as cnt FROM inventory_ledger l WHERE l.product_id = ?
  `).get(productId) as { cnt: number };

  const offset = (page - 1) * pageSize;
  const rawRows = raw.prepare(`
    SELECT l.* FROM inventory_ledger l WHERE l.product_id = ?
    ORDER BY l.created_at DESC, l.id DESC
    LIMIT ? OFFSET ?
  `).all(productId, pageSize, offset) as Record<string, unknown>[];

  const rows: InventoryLedger[] = rawRows.map((r) => ({
    id: r.id as string,
    productId: r.product_id as string,
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
 * 由流水重算指定商品的当前余额，用于一致性检查。
 * 重算逻辑：取流水最后一条的 balance_after。
 */
export function recomputeBalance(productId: string): number | null {
  const raw = getRawDb();
  const lastEntry = raw.prepare(`
    SELECT balance_after FROM inventory_ledger
    WHERE product_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `).get(productId) as { balance_after: number } | undefined;
  return lastEntry?.balance_after ?? null;
}

/**
 * 全量一致性检查：逐个商品比对 stock_balance 与流水重算值。
 */
export function consistencyCheck(): {
  consistent: boolean;
  mismatches: Array<{ productId: string; cachedBalance: number; recomputedBalance: number | null }>;
} {
  const raw = getRawDb();
  const products = raw.prepare(`
    SELECT id, stock_balance FROM products
  `).all() as { id: string; stock_balance: number }[];

  const mismatches: Array<{ productId: string; cachedBalance: number; recomputedBalance: number | null }> = [];
  for (const product of products) {
    const recomputed = recomputeBalance(product.id);
    // 如果没有流水记录，余额应为 0
    const expected = recomputed ?? 0;
    if (product.stock_balance !== expected) {
      mismatches.push({
        productId: product.id,
        cachedBalance: product.stock_balance,
        recomputedBalance: recomputed,
      });
    }
  }

  return { consistent: mismatches.length === 0, mismatches };
}
