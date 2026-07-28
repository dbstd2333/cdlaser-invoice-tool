/**
 * 月底负库存导出类型定义。
 */

export interface ReplenishmentPreviewLine {
  priceVersionId: string;
  name: string;
  model: string;
  unit: string;
  unitPriceDecimal: string;
  stockBalanceSnapshot: number;
  replenishmentQuantity: number;
  amountCent: number;
  taxCent: number;
  totalCent: number;
}
