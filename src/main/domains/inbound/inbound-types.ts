import type { InboundBatch, InboundLine } from '@shared/contracts/types';

/**
 * 进项导入类型定义。
 */

export interface InboundRawRow {
  sourceSheet: string;
  sourceRow: number;
  invoiceDate: string | null;
  invoiceNo: string | null;
  sellerName: string | null;
  name: string;
  model: string;
  unit: string;
  quantity: number | null;
  unitPriceDecimal: string;
  amountYuan: string | null;
  taxYuan: string | null;
  totalYuan: string | null;
}

export interface InboundPreviewLine {
  sourceSheet: string;
  sourceRow: number;
  invoiceDate: string | null;
  invoiceNo: string | null;
  sellerName: string | null;
  name: string;
  model: string;
  unit: string;
  unitPriceDecimal: string;
  quantity: number;
  amountCent: number;
  taxCent: number;
  totalCent: number;
  isNewProduct: boolean;
  productId: string | null;
  priceChanged: boolean;
  matched: boolean;
  errors: string[];
}

export interface InboundIgnoredRow {
  sourceSheet: string;
  sourceRow: number;
  reason: string;
  description: string;
}

export interface InboundPreviewResult {
  lines: InboundPreviewLine[];
  ignoredRows: InboundIgnoredRow[];
  fileSha256: string;
  contentSha256: string;
  hasErrors: boolean;
  errors: Array<{ sourceSheet: string; sourceRow: number; field: string; reason: string }>;
  totalQuantity: number;
  totalAmountCent: number;
  totalTaxCent: number;
  totalCent: number;
  newProductCount: number;
  updatedProductCount: number;
}

export type { InboundBatch, InboundLine };
