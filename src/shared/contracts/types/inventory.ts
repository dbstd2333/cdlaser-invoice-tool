import type { EntityId, IsoTimestamp } from './common';

/** 库存领域类型。 */

export type LedgerSourceType =
  | 'initialization' | 'outbound' | 'outbound_void'
  | 'inbound' | 'inbound_void' | 'adjustment';

export interface InventoryLedger {
  id: EntityId;
  priceVersionId: EntityId;
  changeQuantity: number;
  balanceBefore: number;
  balanceAfter: number;
  sourceType: LedgerSourceType;
  sourceId: EntityId;
  reason: string | null;
  createdAt: IsoTimestamp;
}

export interface ReplenishmentExport {
  id: EntityId;
  exportNo: string;
  exportedAt: IsoTimestamp;
  negativeStockSnapshotAt: IsoTimestamp;
  totalQuantity: number;
  totalAmountCent: number;
  totalTaxCent: number;
  totalCent: number;
  lineCount: number;
}

export interface ReplenishmentExportLine {
  id: EntityId;
  exportId: EntityId;
  priceVersionId: EntityId;
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
