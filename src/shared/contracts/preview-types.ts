import type {
  Customer,
  PageResponse,
  FieldHistoryEntry,
  PriceVersion,
  PriceVersionRow,
  Product,
  OutboundBatch,
  OutboundLine,
  InboundBatch,
  InboundLine,
  ReplenishmentExport,
  ReplenishmentExportLine,
  InventoryLedger,
  InitStatus,
} from './types';

/**
 * 预览结果类型 - 主进程与渲染进程共享。
 * 这些类型定义导入/导出预览阶段的数据结构。
 */

export interface CustomerImportPreviewRow {
  rowIndex: number;
  name: string;
  taxId: string;
  shortCode: string | null;
  address: string | null;
  phone: string | null;
  bankName: string | null;
  bankAccount: string | null;
  email: string | null;
  isDefaultAddress: boolean;
  errors: string[];
}

export interface CustomerImportPreviewResult {
  rows: CustomerImportPreviewRow[];
  newCount: number;
  duplicateTaxIdCount: number;
  errorCount: number;
  hasErrors: boolean;
  errors: Array<{ rowIndex: number; field: string; reason: string }>;
}

export interface CatalogImportRow {
  rowIndex: number;
  name: string;
  model: string;
  unit: string;
  taxClassificationCode: string;
  unitPriceDecimal: string;
  initialStock: number | null;
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
  priceVersionId: string | null;
  isNewPriceVersion: boolean;
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
  newPriceVersionCount: number;
}

export interface BackupStatus {
  status: 'unconfigured' | 'idle' | 'testing' | 'backing_up' | 'restoring' | 'error';
  lastBackupTime: string | null;
  lastBackupSize: number | null;
  dirty: boolean;
  lastError: string | null;
  credentialConfigured: boolean;
}

export interface BackupHistoryItem {
  objectKey: string;
  backupTime: string;
  size: number;
  appVersion: string;
  schemaVersion: string;
  backupType: 'auto' | 'manual';
  checksumStatus: 'verified' | 'unknown';
}

export interface S3Config {
  serviceType: 'aws' | 'compatible';
  endpoint?: string;
  region: string;
  bucket: string;
  prefix?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  pathStyle: boolean;
  autoBackup: boolean;
  retentionCount: number;
  restorePassword?: string;
}

export type {
  Customer,
  PageResponse,
  FieldHistoryEntry,
  PriceVersion,
  PriceVersionRow,
  Product,
  OutboundBatch,
  OutboundLine,
  InboundBatch,
  InboundLine,
  ReplenishmentExport,
  ReplenishmentExportLine,
  InventoryLedger,
  InitStatus,
};
