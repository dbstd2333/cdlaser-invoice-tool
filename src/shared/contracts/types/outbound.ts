import type { EntityId, IsoTimestamp } from './common';
import type { CustomerSnapshot } from './customer';

/** 销项领域类型。 */

export type OutboundBatchStatus = 'valid' | 'voided';

export interface OutboundBatch {
  id: EntityId;
  batchNo: string;
  customerId: EntityId;
  customerSnapshot: CustomerSnapshot;
  exportedAt: IsoTimestamp;
  status: OutboundBatchStatus;
  voidReason: string | null;
  voidedAt: IsoTimestamp | null;
  totalQuantity: number;
  totalAmountCent: number;
  totalTaxCent: number;
  totalCent: number;
  lineCount: number;
}

export interface OutboundLine {
  id: EntityId;
  batchId: EntityId;
  priceVersionId: EntityId;
  name: string;
  taxClassificationCode: string;
  model: string;
  unit: string;
  unitPriceDecimal: string;
  taxRate: number;
  quantity: number;
  amountCent: number;
  taxCent: number;
  totalCent: number;
  stockBefore: number;
  stockAfter: number;
}
