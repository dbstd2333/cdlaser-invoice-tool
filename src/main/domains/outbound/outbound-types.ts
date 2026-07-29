/**
 * 销项开票类型定义。
 */

/** 校验开票草稿结果（打开 Modal 前重新读取并校验） */
export interface DraftValidationResult {
  validLines: Array<{
    priceVersionId: string;
    name: string;
    model: string;
    unit: string;
    unitPriceDecimal: string;
    taxRate: number;
    stockBalance: number;
    quantity: number;
  }>;
  invalidPriceVersionIds: string[];
  errors: string[];
}

/** 导出事务结果 */
export interface OutboundExportResult {
  batchId: string;
  batchNo: string;
  customerName: string;
  xlsxBuffer: Buffer;
  exportedAt: string;
  totalQuantity: number;
  totalAmountCent: number;
  totalTaxCent: number;
  totalCent: number;
}
