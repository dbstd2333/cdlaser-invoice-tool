/**
 * 商品导入类型定义。
 */

export interface CatalogImportRow {
  rowIndex: number;
  name: string;
  model: string;
  unit: string;
  taxClassificationCode: string;
  unitPriceDecimal: string;
  initialStock: number | null; // 首次导入有此字段，日常导入为 null
  remark: string | null;
  errors: string[];
}

export interface CatalogImportPreviewResult {
  rows: CatalogImportRow[];
  newProductCount: number;
  newPriceVersionCount: number;
  totalStockSum: number;
  errorCount: number;
  hasErrors: boolean;
  errors: Array<{ rowIndex: number; field: string; reason: string }>;
  isInitial: boolean;
}
