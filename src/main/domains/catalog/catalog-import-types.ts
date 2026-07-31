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
  /** 文件内相同商品和型号自动去重（仅保留首行，确认时不写入） */
  deduped: boolean;
}

export interface CatalogImportPreviewResult {
  rows: CatalogImportRow[];
  newProductCount: number;
  updatedProductCount: number;
  totalStockSum: number;
  errorCount: number;
  /** 文件内自动去重的行数（相同商品+型号+单价） */
  dedupedRowCount: number;
  hasErrors: boolean;
  errors: Array<{ rowIndex: number; field: string; reason: string }>;
  isInitial: boolean;
}
