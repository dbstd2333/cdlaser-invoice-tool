import type { EntityId, IsoTimestamp } from './common';

/** 进项领域类型。 */

export type InboundBatchStatus = 'imported' | 'voided';

export interface InboundBatch {
  id: EntityId;
  batchNo: string;
  originalFileName: string;
  fileSha256: string;
  contentSha256: string;
  importedAt: IsoTimestamp;
  status: InboundBatchStatus;
  voidReason: string | null;
  voidedAt: IsoTimestamp | null;
  ignoredRowCount: number;
  totalQuantity: number;
  totalAmountCent: number;
  totalTaxCent: number;
  totalCent: number;
}

export interface InboundLine {
  id: EntityId;
  batchId: EntityId;
  sourceSheet: string;
  sourceRow: number;
  invoiceDate: string | null;
  invoiceNo: string | null;
  sellerName: string | null;
  priceVersionId: EntityId;
  name: string;
  model: string;
  unit: string;
  unitPriceDecimal: string;
  quantity: number;
  amountCent: number;
  taxCent: number;
  totalCent: number;
}
