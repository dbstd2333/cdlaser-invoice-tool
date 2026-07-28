import { getRawDb } from '../../db/connection';
import { calcAmountCent, calcTaxCent, calcTotalCent } from '@shared/money/index';
import type { ReplenishmentPreviewLine } from './replenishment-types';

/**
 * 月底负库存预览服务。
 * 查询所有 stock_balance < 0 的启用价格版本，不写入数据库，不生成文件。
 */

/** 预览月底负库存导出 */
export function previewReplenishment(): { lines: ReplenishmentPreviewLine[]; snapshotAt: string } {
  const raw = getRawDb();
  const rows = raw.prepare(`
    SELECT pv.id as price_version_id, p.name, p.model, p.unit,
           pv.unit_price_decimal, pv.stock_balance
    FROM price_versions pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.stock_balance < 0 AND pv.status = 'active' AND p.status = 'active'
    ORDER BY p.name, p.model, pv.unit_price_decimal
  `).all() as ReplenishmentRow[];

  const lines: ReplenishmentPreviewLine[] = rows.map((r) => {
    const replenishmentQuantity = Math.abs(r.stock_balance);
    const amountCent = calcAmountCent(replenishmentQuantity, r.unit_price_decimal);
    const taxCent = calcTaxCent(amountCent);
    const totalCent = calcTotalCent(amountCent, taxCent);
    return {
      priceVersionId: r.price_version_id, name: r.name, model: r.model, unit: r.unit,
      unitPriceDecimal: r.unit_price_decimal, stockBalanceSnapshot: r.stock_balance,
      replenishmentQuantity, amountCent, taxCent, totalCent,
    };
  });

  return { lines, snapshotAt: new Date().toISOString() };
}

interface ReplenishmentRow {
  price_version_id: string;
  name: string;
  model: string;
  unit: string;
  unit_price_decimal: string;
  stock_balance: number;
}
