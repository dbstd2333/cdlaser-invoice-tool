import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

/**
 * 数据库 Schema 定义 - 对应技术 PRD 第 6 节数据模型。
 * 主键统一为 UUIDv7 文本，时间统一为 UTC ISO 8601 文本。
 */

/** 客户表 */
export const customers = sqliteTable(
  'customers',
  {
    id: text('id').primaryKey(),
    category: text('category').notNull().default('客户分类'),
    name: text('name').notNull(),
    taxId: text('tax_id').notNull(),
    taxIdNormalized: text('tax_id_normalized').notNull(),
    shortCode: text('short_code'),
    address: text('address'),
    phone: text('phone'),
    bankName: text('bank_name'),
    bankAccount: text('bank_account'),
    email: text('email'),
    isDefaultAddress: integer('is_default_address', { mode: 'boolean' }).notNull().default(false),
    status: text('status', { enum: ['active', 'inactive'] }).notNull().default('active'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => ({
    taxIdNormalizedUnique: uniqueIndex('customers_tax_id_normalized_unique').on(table.taxIdNormalized),
    nameIdx: index('customers_name_idx').on(table.name),
    statusIdx: index('customers_status_idx').on(table.status),
  }),
);

/** 商品表 */
export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    nameNormalized: text('name_normalized').notNull(),
    model: text('model').notNull(),
    modelNormalized: text('model_normalized').notNull(),
    unit: text('unit').notNull(),
    taxClassificationCode: text('tax_classification_code').notNull(),
    unitPriceDecimal: text('unit_price_decimal').notNull(),
    taxRate: integer('tax_rate').notNull().default(13),
    stockBalance: integer('stock_balance').notNull().default(0),
    dataStatus: text('data_status', { enum: ['complete', 'incomplete'] }).notNull().default('complete'),
    status: text('status', { enum: ['active', 'inactive'] }).notNull().default('active'),
    remark: text('remark'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => ({
    nameModelUnique: uniqueIndex('products_name_model_unique').on(table.nameNormalized, table.modelNormalized),
    statusIdx: index('products_status_idx').on(table.status),
    stockIdx: index('products_stock_idx').on(table.stockBalance),
  }),
);

/** 销项开票批次表 */
export const outboundBatches = sqliteTable(
  'outbound_batches',
  {
    id: text('id').primaryKey(),
    batchNo: text('batch_no').notNull().unique(),
    customerId: text('customer_id').notNull(),
    customerSnapshot: text('customer_snapshot').notNull(),
    exportedAt: text('exported_at').notNull(),
    status: text('status', { enum: ['valid', 'voided'] }).notNull().default('valid'),
    voidReason: text('void_reason'),
    voidedAt: text('voided_at'),
    xlsxBlob: text('xlsx_blob').notNull(),
    xlsxSha256: text('xlsx_sha256').notNull(),
    totalQuantity: integer('total_quantity').notNull().default(0),
    totalAmountCent: integer('total_amount_cent').notNull().default(0),
    totalTaxCent: integer('total_tax_cent').notNull().default(0),
    totalCent: integer('total_cent').notNull().default(0),
    lineCount: integer('line_count').notNull().default(0),
  },
  (table) => ({
    exportedAtIdx: index('outbound_batches_exported_at_idx').on(table.exportedAt, table.id),
    statusIdx: index('outbound_batches_status_idx').on(table.status, table.exportedAt),
    customerIdx: index('outbound_batches_customer_idx').on(table.customerId),
  }),
);

/** 销项开票明细行表 */
export const outboundLines = sqliteTable(
  'outbound_lines',
  {
    id: text('id').primaryKey(),
    batchId: text('batch_id').notNull().references(() => outboundBatches.id),
    productId: text('product_id').notNull(),
    name: text('name').notNull(),
    taxClassificationCode: text('tax_classification_code').notNull(),
    model: text('model').notNull(),
    unit: text('unit').notNull(),
    unitPriceDecimal: text('unit_price_decimal').notNull(),
    taxRate: integer('tax_rate').notNull().default(13),
    quantity: integer('quantity').notNull(),
    amountCent: integer('amount_cent').notNull(),
    taxCent: integer('tax_cent').notNull(),
    totalCent: integer('total_cent').notNull(),
    stockBefore: integer('stock_before').notNull(),
    stockAfter: integer('stock_after').notNull(),
  },
  (table) => ({
    batchIdx: index('outbound_lines_batch_idx').on(table.batchId),
    productIdx: index('outbound_lines_product_idx').on(table.productId),
  }),
);

/** 进项批次表 */
export const inboundBatches = sqliteTable(
  'inbound_batches',
  {
    id: text('id').primaryKey(),
    batchNo: text('batch_no').notNull().unique(),
    originalFileName: text('original_file_name').notNull(),
    originalFileBlob: text('original_file_blob').notNull(),
    fileSha256: text('file_sha256').notNull().unique(),
    contentSha256: text('content_sha256').notNull().unique(),
    importedAt: text('imported_at').notNull(),
    status: text('status', { enum: ['imported', 'voided'] }).notNull().default('imported'),
    voidReason: text('void_reason'),
    voidedAt: text('voided_at'),
    ignoredRowCount: integer('ignored_row_count').notNull().default(0),
    totalQuantity: integer('total_quantity').notNull().default(0),
    totalAmountCent: integer('total_amount_cent').notNull().default(0),
    totalTaxCent: integer('total_tax_cent').notNull().default(0),
    totalCent: integer('total_cent').notNull().default(0),
  },
  (table) => ({
    importedAtIdx: index('inbound_batches_imported_at_idx').on(table.importedAt),
  }),
);

/** 进项明细行表 */
export const inboundLines = sqliteTable(
  'inbound_lines',
  {
    id: text('id').primaryKey(),
    batchId: text('batch_id').notNull().references(() => inboundBatches.id),
    sourceSheet: text('source_sheet').notNull(),
    sourceRow: integer('source_row').notNull(),
    invoiceDate: text('invoice_date'),
    invoiceNo: text('invoice_no'),
    sellerName: text('seller_name'),
    productId: text('product_id').notNull(),
    name: text('name').notNull(),
    model: text('model').notNull(),
    unit: text('unit').notNull(),
    unitPriceDecimal: text('unit_price_decimal').notNull(),
    quantity: integer('quantity').notNull(),
    amountCent: integer('amount_cent').notNull(),
    taxCent: integer('tax_cent').notNull(),
    totalCent: integer('total_cent').notNull(),
  },
  (table) => ({
    batchIdx: index('inbound_lines_batch_idx').on(table.batchId),
    productIdx: index('inbound_lines_product_idx').on(table.productId),
  }),
);

/** 月底补票导出记录表 */
export const replenishmentExports = sqliteTable(
  'replenishment_exports',
  {
    id: text('id').primaryKey(),
    exportNo: text('export_no').notNull().unique(),
    exportedAt: text('exported_at').notNull(),
    negativeStockSnapshotAt: text('negative_stock_snapshot_at').notNull(),
    xlsxBlob: text('xlsx_blob').notNull(),
    xlsxSha256: text('xlsx_sha256').notNull(),
    totalQuantity: integer('total_quantity').notNull().default(0),
    totalAmountCent: integer('total_amount_cent').notNull().default(0),
    totalTaxCent: integer('total_tax_cent').notNull().default(0),
    totalCent: integer('total_cent').notNull().default(0),
    lineCount: integer('line_count').notNull().default(0),
  },
  (table) => ({
    exportedAtIdx: index('replenishment_exports_exported_at_idx').on(table.exportedAt),
  }),
);

/** 月底补票导出明细表 */
export const replenishmentExportLines = sqliteTable(
  'replenishment_export_lines',
  {
    id: text('id').primaryKey(),
    exportId: text('export_id').notNull().references(() => replenishmentExports.id),
    productId: text('product_id').notNull(),
    name: text('name').notNull(),
    model: text('model').notNull(),
    unit: text('unit').notNull(),
    unitPriceDecimal: text('unit_price_decimal').notNull(),
    stockBalanceSnapshot: integer('stock_balance_snapshot').notNull(),
    replenishmentQuantity: integer('replenishment_quantity').notNull(),
    amountCent: integer('amount_cent').notNull(),
    taxCent: integer('tax_cent').notNull(),
    totalCent: integer('total_cent').notNull(),
  },
  (table) => ({
    exportIdx: index('replenishment_export_lines_export_idx').on(table.exportId),
  }),
);

/** 导入任务表 */
export const importJobs = sqliteTable('import_jobs', {
  id: text('id').primaryKey(),
  jobType: text('job_type').notNull(),
  fileName: text('file_name').notNull(),
  fileSha256: text('file_sha256'),
  status: text('status', { enum: ['previewing', 'confirmed', 'failed', 'expired'] }).notNull().default('previewing'),
  stats: text('stats'),
  errors: text('errors'),
  previewToken: text('preview_token'),
  previewData: text('preview_data'),
  createdAt: text('created_at').notNull(),
  confirmedAt: text('confirmed_at'),
});

/** 库存流水表 */
export const inventoryLedger = sqliteTable(
  'inventory_ledger',
  {
    id: text('id').primaryKey(),
    productId: text('product_id').notNull(),
    changeQuantity: integer('change_quantity').notNull(),
    balanceBefore: integer('balance_before').notNull(),
    balanceAfter: integer('balance_after').notNull(),
    sourceType: text('source_type', {
      enum: ['initialization', 'outbound', 'outbound_void', 'inbound', 'inbound_void', 'adjustment'],
    }).notNull(),
    sourceId: text('source_id').notNull(),
    reason: text('reason'),
    createdAt: text('created_at').notNull(),
  },
  (table) => ({
    productIdx: index('inventory_ledger_product_idx').on(table.productId, table.createdAt),
    sourceIdx: index('inventory_ledger_source_idx').on(table.sourceType, table.sourceId),
  }),
);

/** 审计事件表 */
export const auditEvents = sqliteTable(
  'audit_events',
  {
    id: text('id').primaryKey(),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    sourceBatchId: text('source_batch_id'),
    operator: text('operator').notNull().default('本机财务'),
    createdAt: text('created_at').notNull(),
    summary: text('summary'),
  },
  (table) => ({
    entityIdx: index('audit_events_entity_idx').on(table.entityType, table.entityId, table.createdAt),
  }),
);

/** 字段级变更表 */
export const auditFieldChanges = sqliteTable(
  'audit_field_changes',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id').notNull().references(() => auditEvents.id),
    fieldPath: text('field_path').notNull(),
    oldValue: text('old_value'),
    newValue: text('new_value'),
  },
  (table) => ({
    eventIdx: index('audit_field_changes_event_idx').on(table.eventId),
  }),
);

/** 应用设置表 */
export const appSettings = sqliteTable('app_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export type CustomerRow = typeof customers.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type OutboundBatchRow = typeof outboundBatches.$inferSelect;
export type OutboundLineRow = typeof outboundLines.$inferSelect;
export type InboundBatchRow = typeof inboundBatches.$inferSelect;
export type InboundLineRow = typeof inboundLines.$inferSelect;
export type ReplenishmentExportRow = typeof replenishmentExports.$inferSelect;
export type ReplenishmentExportLineRow = typeof replenishmentExportLines.$inferSelect;
export type InventoryLedgerRow = typeof inventoryLedger.$inferSelect;
export type AuditEventRow = typeof auditEvents.$inferSelect;
export type AuditFieldChangeRow = typeof auditFieldChanges.$inferSelect;
export type ImportJobRow = typeof importJobs.$inferSelect;
export type AppSettingRow = typeof appSettings.$inferSelect;
