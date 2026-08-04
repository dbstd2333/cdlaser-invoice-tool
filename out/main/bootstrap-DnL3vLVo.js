//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let electron = require("electron");
let node_path = require("node:path");
let electron_log_main = require("electron-log/main");
electron_log_main = __toESM(electron_log_main);
let better_sqlite3 = require("better-sqlite3");
better_sqlite3 = __toESM(better_sqlite3);
let drizzle_orm_better_sqlite3 = require("drizzle-orm/better-sqlite3");
let node_fs = require("node:fs");
node_fs = __toESM(node_fs);
let drizzle_orm_sqlite_core = require("drizzle-orm/sqlite-core");
let decimal_js = require("decimal.js");
decimal_js = __toESM(decimal_js);
let zod = require("zod");
let uuid = require("uuid");
let drizzle_orm = require("drizzle-orm");
let xlsx = require("xlsx");
xlsx = __toESM(xlsx);
let node_fs_promises = require("node:fs/promises");
let jszip = require("jszip");
jszip = __toESM(jszip);
let node_crypto = require("node:crypto");
let cos_nodejs_sdk_v5 = require("cos-nodejs-sdk-v5");
cos_nodejs_sdk_v5 = __toESM(cos_nodejs_sdk_v5);
//#region src/main/db/schema/index.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	appSettings: () => appSettings,
	auditEvents: () => auditEvents,
	auditFieldChanges: () => auditFieldChanges,
	customers: () => customers,
	importJobs: () => importJobs,
	inboundBatches: () => inboundBatches,
	inboundLines: () => inboundLines,
	inventoryLedger: () => inventoryLedger,
	outboundBatches: () => outboundBatches,
	outboundLines: () => outboundLines,
	products: () => products,
	replenishmentExportLines: () => replenishmentExportLines,
	replenishmentExports: () => replenishmentExports
});
/**
* 数据库 Schema 定义 - 对应技术 PRD 第 6 节数据模型。
* 主键统一为 UUIDv7 文本，时间统一为 UTC ISO 8601 文本。
*/
/** 客户表 */
var customers = (0, drizzle_orm_sqlite_core.sqliteTable)("customers", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	category: (0, drizzle_orm_sqlite_core.text)("category").notNull().default("客户分类"),
	name: (0, drizzle_orm_sqlite_core.text)("name").notNull(),
	taxId: (0, drizzle_orm_sqlite_core.text)("tax_id").notNull(),
	taxIdNormalized: (0, drizzle_orm_sqlite_core.text)("tax_id_normalized").notNull(),
	shortCode: (0, drizzle_orm_sqlite_core.text)("short_code"),
	address: (0, drizzle_orm_sqlite_core.text)("address"),
	phone: (0, drizzle_orm_sqlite_core.text)("phone"),
	bankName: (0, drizzle_orm_sqlite_core.text)("bank_name"),
	bankAccount: (0, drizzle_orm_sqlite_core.text)("bank_account"),
	email: (0, drizzle_orm_sqlite_core.text)("email"),
	isDefaultAddress: (0, drizzle_orm_sqlite_core.integer)("is_default_address", { mode: "boolean" }).notNull().default(false),
	status: (0, drizzle_orm_sqlite_core.text)("status", { enum: ["active", "inactive"] }).notNull().default("active"),
	createdAt: (0, drizzle_orm_sqlite_core.text)("created_at").notNull(),
	updatedAt: (0, drizzle_orm_sqlite_core.text)("updated_at").notNull()
}, (table) => ({
	taxIdNormalizedUnique: (0, drizzle_orm_sqlite_core.uniqueIndex)("customers_tax_id_normalized_unique").on(table.taxIdNormalized),
	nameIdx: (0, drizzle_orm_sqlite_core.index)("customers_name_idx").on(table.name),
	statusIdx: (0, drizzle_orm_sqlite_core.index)("customers_status_idx").on(table.status)
}));
/** 商品表 */
var products = (0, drizzle_orm_sqlite_core.sqliteTable)("products", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	name: (0, drizzle_orm_sqlite_core.text)("name").notNull(),
	nameNormalized: (0, drizzle_orm_sqlite_core.text)("name_normalized").notNull(),
	model: (0, drizzle_orm_sqlite_core.text)("model").notNull(),
	modelNormalized: (0, drizzle_orm_sqlite_core.text)("model_normalized").notNull(),
	unit: (0, drizzle_orm_sqlite_core.text)("unit").notNull(),
	taxClassificationCode: (0, drizzle_orm_sqlite_core.text)("tax_classification_code").notNull(),
	unitPriceDecimal: (0, drizzle_orm_sqlite_core.text)("unit_price_decimal").notNull(),
	taxRate: (0, drizzle_orm_sqlite_core.integer)("tax_rate").notNull().default(13),
	stockBalance: (0, drizzle_orm_sqlite_core.integer)("stock_balance").notNull().default(0),
	dataStatus: (0, drizzle_orm_sqlite_core.text)("data_status", { enum: ["complete", "incomplete"] }).notNull().default("complete"),
	status: (0, drizzle_orm_sqlite_core.text)("status", { enum: ["active", "inactive"] }).notNull().default("active"),
	remark: (0, drizzle_orm_sqlite_core.text)("remark"),
	createdAt: (0, drizzle_orm_sqlite_core.text)("created_at").notNull(),
	updatedAt: (0, drizzle_orm_sqlite_core.text)("updated_at").notNull()
}, (table) => ({
	nameModelPriceUnique: (0, drizzle_orm_sqlite_core.uniqueIndex)("products_name_model_price_unique").on(table.nameNormalized, table.modelNormalized, table.unitPriceDecimal),
	nameModelIdx: (0, drizzle_orm_sqlite_core.index)("products_name_model_idx").on(table.nameNormalized, table.modelNormalized),
	statusIdx: (0, drizzle_orm_sqlite_core.index)("products_status_idx").on(table.status),
	stockIdx: (0, drizzle_orm_sqlite_core.index)("products_stock_idx").on(table.stockBalance)
}));
/** 销项开票批次表 */
var outboundBatches = (0, drizzle_orm_sqlite_core.sqliteTable)("outbound_batches", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	batchNo: (0, drizzle_orm_sqlite_core.text)("batch_no").notNull().unique(),
	customerId: (0, drizzle_orm_sqlite_core.text)("customer_id").notNull(),
	customerSnapshot: (0, drizzle_orm_sqlite_core.text)("customer_snapshot").notNull(),
	exportedAt: (0, drizzle_orm_sqlite_core.text)("exported_at").notNull(),
	status: (0, drizzle_orm_sqlite_core.text)("status", { enum: ["valid", "voided"] }).notNull().default("valid"),
	voidReason: (0, drizzle_orm_sqlite_core.text)("void_reason"),
	voidedAt: (0, drizzle_orm_sqlite_core.text)("voided_at"),
	xlsxBlob: (0, drizzle_orm_sqlite_core.text)("xlsx_blob").notNull(),
	xlsxSha256: (0, drizzle_orm_sqlite_core.text)("xlsx_sha256").notNull(),
	totalQuantity: (0, drizzle_orm_sqlite_core.integer)("total_quantity").notNull().default(0),
	totalAmountCent: (0, drizzle_orm_sqlite_core.integer)("total_amount_cent").notNull().default(0),
	totalTaxCent: (0, drizzle_orm_sqlite_core.integer)("total_tax_cent").notNull().default(0),
	totalCent: (0, drizzle_orm_sqlite_core.integer)("total_cent").notNull().default(0),
	lineCount: (0, drizzle_orm_sqlite_core.integer)("line_count").notNull().default(0)
}, (table) => ({
	exportedAtIdx: (0, drizzle_orm_sqlite_core.index)("outbound_batches_exported_at_idx").on(table.exportedAt, table.id),
	statusIdx: (0, drizzle_orm_sqlite_core.index)("outbound_batches_status_idx").on(table.status, table.exportedAt),
	customerIdx: (0, drizzle_orm_sqlite_core.index)("outbound_batches_customer_idx").on(table.customerId)
}));
/** 销项开票明细行表 */
var outboundLines = (0, drizzle_orm_sqlite_core.sqliteTable)("outbound_lines", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	batchId: (0, drizzle_orm_sqlite_core.text)("batch_id").notNull().references(() => outboundBatches.id),
	productId: (0, drizzle_orm_sqlite_core.text)("product_id").notNull(),
	name: (0, drizzle_orm_sqlite_core.text)("name").notNull(),
	taxClassificationCode: (0, drizzle_orm_sqlite_core.text)("tax_classification_code").notNull(),
	model: (0, drizzle_orm_sqlite_core.text)("model").notNull(),
	unit: (0, drizzle_orm_sqlite_core.text)("unit").notNull(),
	unitPriceDecimal: (0, drizzle_orm_sqlite_core.text)("unit_price_decimal").notNull(),
	taxRate: (0, drizzle_orm_sqlite_core.integer)("tax_rate").notNull().default(13),
	quantity: (0, drizzle_orm_sqlite_core.integer)("quantity").notNull(),
	amountCent: (0, drizzle_orm_sqlite_core.integer)("amount_cent").notNull(),
	taxCent: (0, drizzle_orm_sqlite_core.integer)("tax_cent").notNull(),
	totalCent: (0, drizzle_orm_sqlite_core.integer)("total_cent").notNull(),
	stockBefore: (0, drizzle_orm_sqlite_core.integer)("stock_before").notNull(),
	stockAfter: (0, drizzle_orm_sqlite_core.integer)("stock_after").notNull()
}, (table) => ({
	batchIdx: (0, drizzle_orm_sqlite_core.index)("outbound_lines_batch_idx").on(table.batchId),
	productIdx: (0, drizzle_orm_sqlite_core.index)("outbound_lines_product_idx").on(table.productId)
}));
/** 进项批次表 */
var inboundBatches = (0, drizzle_orm_sqlite_core.sqliteTable)("inbound_batches", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	batchNo: (0, drizzle_orm_sqlite_core.text)("batch_no").notNull().unique(),
	originalFileName: (0, drizzle_orm_sqlite_core.text)("original_file_name").notNull(),
	originalFileBlob: (0, drizzle_orm_sqlite_core.text)("original_file_blob").notNull(),
	fileSha256: (0, drizzle_orm_sqlite_core.text)("file_sha256").notNull().unique(),
	contentSha256: (0, drizzle_orm_sqlite_core.text)("content_sha256").notNull().unique(),
	importedAt: (0, drizzle_orm_sqlite_core.text)("imported_at").notNull(),
	status: (0, drizzle_orm_sqlite_core.text)("status", { enum: ["imported", "voided"] }).notNull().default("imported"),
	voidReason: (0, drizzle_orm_sqlite_core.text)("void_reason"),
	voidedAt: (0, drizzle_orm_sqlite_core.text)("voided_at"),
	ignoredRowCount: (0, drizzle_orm_sqlite_core.integer)("ignored_row_count").notNull().default(0),
	totalQuantity: (0, drizzle_orm_sqlite_core.integer)("total_quantity").notNull().default(0),
	totalAmountCent: (0, drizzle_orm_sqlite_core.integer)("total_amount_cent").notNull().default(0),
	totalTaxCent: (0, drizzle_orm_sqlite_core.integer)("total_tax_cent").notNull().default(0),
	totalCent: (0, drizzle_orm_sqlite_core.integer)("total_cent").notNull().default(0)
}, (table) => ({ importedAtIdx: (0, drizzle_orm_sqlite_core.index)("inbound_batches_imported_at_idx").on(table.importedAt) }));
/** 进项明细行表 */
var inboundLines = (0, drizzle_orm_sqlite_core.sqliteTable)("inbound_lines", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	batchId: (0, drizzle_orm_sqlite_core.text)("batch_id").notNull().references(() => inboundBatches.id),
	sourceSheet: (0, drizzle_orm_sqlite_core.text)("source_sheet").notNull(),
	sourceRow: (0, drizzle_orm_sqlite_core.integer)("source_row").notNull(),
	invoiceDate: (0, drizzle_orm_sqlite_core.text)("invoice_date"),
	invoiceNo: (0, drizzle_orm_sqlite_core.text)("invoice_no"),
	sellerName: (0, drizzle_orm_sqlite_core.text)("seller_name"),
	productId: (0, drizzle_orm_sqlite_core.text)("product_id").notNull(),
	name: (0, drizzle_orm_sqlite_core.text)("name").notNull(),
	model: (0, drizzle_orm_sqlite_core.text)("model").notNull(),
	unit: (0, drizzle_orm_sqlite_core.text)("unit").notNull(),
	unitPriceDecimal: (0, drizzle_orm_sqlite_core.text)("unit_price_decimal").notNull(),
	quantity: (0, drizzle_orm_sqlite_core.integer)("quantity").notNull(),
	amountCent: (0, drizzle_orm_sqlite_core.integer)("amount_cent").notNull(),
	taxCent: (0, drizzle_orm_sqlite_core.integer)("tax_cent").notNull(),
	totalCent: (0, drizzle_orm_sqlite_core.integer)("total_cent").notNull()
}, (table) => ({
	batchIdx: (0, drizzle_orm_sqlite_core.index)("inbound_lines_batch_idx").on(table.batchId),
	productIdx: (0, drizzle_orm_sqlite_core.index)("inbound_lines_product_idx").on(table.productId)
}));
/** 月底补票导出记录表 */
var replenishmentExports = (0, drizzle_orm_sqlite_core.sqliteTable)("replenishment_exports", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	exportNo: (0, drizzle_orm_sqlite_core.text)("export_no").notNull().unique(),
	exportedAt: (0, drizzle_orm_sqlite_core.text)("exported_at").notNull(),
	negativeStockSnapshotAt: (0, drizzle_orm_sqlite_core.text)("negative_stock_snapshot_at").notNull(),
	xlsxBlob: (0, drizzle_orm_sqlite_core.text)("xlsx_blob").notNull(),
	xlsxSha256: (0, drizzle_orm_sqlite_core.text)("xlsx_sha256").notNull(),
	totalQuantity: (0, drizzle_orm_sqlite_core.integer)("total_quantity").notNull().default(0),
	totalAmountCent: (0, drizzle_orm_sqlite_core.integer)("total_amount_cent").notNull().default(0),
	totalTaxCent: (0, drizzle_orm_sqlite_core.integer)("total_tax_cent").notNull().default(0),
	totalCent: (0, drizzle_orm_sqlite_core.integer)("total_cent").notNull().default(0),
	lineCount: (0, drizzle_orm_sqlite_core.integer)("line_count").notNull().default(0)
}, (table) => ({ exportedAtIdx: (0, drizzle_orm_sqlite_core.index)("replenishment_exports_exported_at_idx").on(table.exportedAt) }));
/** 月底补票导出明细表 */
var replenishmentExportLines = (0, drizzle_orm_sqlite_core.sqliteTable)("replenishment_export_lines", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	exportId: (0, drizzle_orm_sqlite_core.text)("export_id").notNull().references(() => replenishmentExports.id),
	productId: (0, drizzle_orm_sqlite_core.text)("product_id").notNull(),
	name: (0, drizzle_orm_sqlite_core.text)("name").notNull(),
	model: (0, drizzle_orm_sqlite_core.text)("model").notNull(),
	unit: (0, drizzle_orm_sqlite_core.text)("unit").notNull(),
	unitPriceDecimal: (0, drizzle_orm_sqlite_core.text)("unit_price_decimal").notNull(),
	stockBalanceSnapshot: (0, drizzle_orm_sqlite_core.integer)("stock_balance_snapshot").notNull(),
	replenishmentQuantity: (0, drizzle_orm_sqlite_core.integer)("replenishment_quantity").notNull(),
	amountCent: (0, drizzle_orm_sqlite_core.integer)("amount_cent").notNull(),
	taxCent: (0, drizzle_orm_sqlite_core.integer)("tax_cent").notNull(),
	totalCent: (0, drizzle_orm_sqlite_core.integer)("total_cent").notNull()
}, (table) => ({ exportIdx: (0, drizzle_orm_sqlite_core.index)("replenishment_export_lines_export_idx").on(table.exportId) }));
/** 导入任务表 */
var importJobs = (0, drizzle_orm_sqlite_core.sqliteTable)("import_jobs", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	jobType: (0, drizzle_orm_sqlite_core.text)("job_type").notNull(),
	fileName: (0, drizzle_orm_sqlite_core.text)("file_name").notNull(),
	fileSha256: (0, drizzle_orm_sqlite_core.text)("file_sha256"),
	status: (0, drizzle_orm_sqlite_core.text)("status", { enum: [
		"previewing",
		"confirmed",
		"failed",
		"expired"
	] }).notNull().default("previewing"),
	stats: (0, drizzle_orm_sqlite_core.text)("stats"),
	errors: (0, drizzle_orm_sqlite_core.text)("errors"),
	previewToken: (0, drizzle_orm_sqlite_core.text)("preview_token"),
	previewData: (0, drizzle_orm_sqlite_core.text)("preview_data"),
	createdAt: (0, drizzle_orm_sqlite_core.text)("created_at").notNull(),
	confirmedAt: (0, drizzle_orm_sqlite_core.text)("confirmed_at")
});
/** 库存流水表 */
var inventoryLedger = (0, drizzle_orm_sqlite_core.sqliteTable)("inventory_ledger", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	productId: (0, drizzle_orm_sqlite_core.text)("product_id").notNull(),
	changeQuantity: (0, drizzle_orm_sqlite_core.integer)("change_quantity").notNull(),
	balanceBefore: (0, drizzle_orm_sqlite_core.integer)("balance_before").notNull(),
	balanceAfter: (0, drizzle_orm_sqlite_core.integer)("balance_after").notNull(),
	sourceType: (0, drizzle_orm_sqlite_core.text)("source_type", { enum: [
		"initialization",
		"outbound",
		"outbound_void",
		"inbound",
		"inbound_void",
		"adjustment"
	] }).notNull(),
	sourceId: (0, drizzle_orm_sqlite_core.text)("source_id").notNull(),
	reason: (0, drizzle_orm_sqlite_core.text)("reason"),
	createdAt: (0, drizzle_orm_sqlite_core.text)("created_at").notNull()
}, (table) => ({
	productIdx: (0, drizzle_orm_sqlite_core.index)("inventory_ledger_product_idx").on(table.productId, table.createdAt),
	sourceIdx: (0, drizzle_orm_sqlite_core.index)("inventory_ledger_source_idx").on(table.sourceType, table.sourceId)
}));
/** 审计事件表 */
var auditEvents = (0, drizzle_orm_sqlite_core.sqliteTable)("audit_events", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	action: (0, drizzle_orm_sqlite_core.text)("action").notNull(),
	entityType: (0, drizzle_orm_sqlite_core.text)("entity_type").notNull(),
	entityId: (0, drizzle_orm_sqlite_core.text)("entity_id").notNull(),
	sourceBatchId: (0, drizzle_orm_sqlite_core.text)("source_batch_id"),
	operator: (0, drizzle_orm_sqlite_core.text)("operator").notNull().default("本机财务"),
	createdAt: (0, drizzle_orm_sqlite_core.text)("created_at").notNull(),
	summary: (0, drizzle_orm_sqlite_core.text)("summary")
}, (table) => ({ entityIdx: (0, drizzle_orm_sqlite_core.index)("audit_events_entity_idx").on(table.entityType, table.entityId, table.createdAt) }));
/** 字段级变更表 */
var auditFieldChanges = (0, drizzle_orm_sqlite_core.sqliteTable)("audit_field_changes", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey(),
	eventId: (0, drizzle_orm_sqlite_core.text)("event_id").notNull().references(() => auditEvents.id),
	fieldPath: (0, drizzle_orm_sqlite_core.text)("field_path").notNull(),
	oldValue: (0, drizzle_orm_sqlite_core.text)("old_value"),
	newValue: (0, drizzle_orm_sqlite_core.text)("new_value")
}, (table) => ({ eventIdx: (0, drizzle_orm_sqlite_core.index)("audit_field_changes_event_idx").on(table.eventId) }));
/** 应用设置表 */
var appSettings = (0, drizzle_orm_sqlite_core.sqliteTable)("app_settings", {
	key: (0, drizzle_orm_sqlite_core.text)("key").primaryKey(),
	value: (0, drizzle_orm_sqlite_core.text)("value").notNull()
});
//#endregion
//#region src/shared/money/index.ts
/**
* 金额计算工具模块。
* 所有业务金额计算统一使用 decimal.js，禁止使用 JS Number 浮点直接计算。
* 金额、税额、价税合计均以「人民币分」整数存储；单价以「含税单价」规范化十进制字符串存储，
* 计算不含税金额时由 taxExclusiveUnitPrice 反推（含税单价 ÷ 1.13）。
*/
decimal_js.default.set({
	rounding: decimal_js.default.ROUND_HALF_UP,
	precision: 40
});
var TAX_RATE_DECIMAL = "0.13";
var TAX_RATE_FACTOR = new decimal_js.default("0.13");
/** 价税合计系数 = 1 + 税率 = 1.13，含税单价 ÷ 该值得不含税单价 */
var TAX_INCLUSIVE_FACTOR = new decimal_js.default(1).plus(TAX_RATE_FACTOR);
/**
* 规范化含税单价字符串：去除首尾空白，去除科学计数法，校验为正数。
* 小数位数超过 UNIT_PRICE_MAX_DECIMALS（13）位时自动四舍五入到 13 位（而非报错），
* 避免导入文件因单价精度被整批阻断；单价以十进制字符串存储，无浮点损失。
* 返回不含前导零的最简十进制字符串（保留有效小数）。
*/
function normalizeUnitPrice(input) {
	const d = new decimal_js.default(String(input).trim());
	if (!d.isFinite()) throw new Error("单价不是有效数字");
	if (d.lte(0)) throw new Error("单价必须大于 0");
	return d.toDecimalPlaces(13, decimal_js.default.ROUND_HALF_UP).toString();
}
/**
* 含税单价 -> 不含税单价（含税单价 ÷ 1.13），四舍五入到 13 位小数。
* 用于销项导出填入金税模板的「商品单价」列（国税标准为不含税单价），
* 以及由含税单价计算不含税金额。
*/
function taxExclusiveUnitPrice(taxInclusive) {
	return new decimal_js.default(String(taxInclusive).trim()).div(TAX_INCLUSIVE_FACTOR).toDecimalPlaces(13, decimal_js.default.ROUND_HALF_UP).toString();
}
/**
* 计算不含税金额（分）= 数量 ×（含税单价 ÷ 1.13），四舍五入到 2 位。
* unitPriceDecimal 为含税单价，内部先经 taxExclusiveUnitPrice 反推不含税单价，
* 保证「不含税单价 × 数量 = 不含税金额」与金税模板一致。
*/
function calcAmountCent(quantity, unitPriceDecimal) {
	const exclusive = new decimal_js.default(taxExclusiveUnitPrice(unitPriceDecimal));
	return new decimal_js.default(quantity).times(exclusive).toDecimalPlaces(2, decimal_js.default.ROUND_HALF_UP).times(100).round().toNumber();
}
/** 销项开票默认金额系数（金额 = 含税单价 × 系数） */
var OUTBOUND_AMOUNT_FACTOR = "1.09";
/**
* 销项开票金额（分）= 含税单价 × 数量 × 系数，四舍五入到 2 位。
* 直接按含税单价乘固定系数，不另算税额/价税合计/不含税金额。
*/
function calcOutboundAmountCent(quantity, taxInclusiveUnitPrice, factor = OUTBOUND_AMOUNT_FACTOR) {
	return new decimal_js.default(quantity).times(new decimal_js.default(taxInclusiveUnitPrice)).times(new decimal_js.default(factor)).toDecimalPlaces(2, decimal_js.default.ROUND_HALF_UP).times(100).round().toNumber();
}
/** 最终金额（分）按数量反推每件开票单价，保留 13 位小数。 */
function amountCentToUnitPrice(amountCent, quantity) {
	if (!Number.isInteger(amountCent) || amountCent <= 0) throw new Error("金额必须为正整数分");
	if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("数量必须为正整数");
	return new decimal_js.default(amountCent).div(100).div(quantity).toDecimalPlaces(13, decimal_js.default.ROUND_HALF_UP).toString();
}
/** 单价 × 系数（保留 13 位小数），用于销项导出「商品单价」列 = 含税单价 × 系数 */
function scaleUnitPrice(unitPrice, factor) {
	return new decimal_js.default(String(unitPrice)).times(new decimal_js.default(factor)).toDecimalPlaces(13, decimal_js.default.ROUND_HALF_UP).toString();
}
/**
* 计算税额（分）= 金额（分）× 13%，四舍五入到 2 位。
*/
function calcTaxCent(amountCent) {
	return new decimal_js.default(amountCent).times(TAX_RATE_FACTOR).toDecimalPlaces(0, decimal_js.default.ROUND_HALF_UP).toNumber();
}
/** 价税合计（分）= 金额 + 税额 */
function calcTotalCent(amountCent, taxCent) {
	return amountCent + taxCent;
}
/** 将分转换为元字符串，保留 2 位小数 */
function centToYuan(cent) {
	return new decimal_js.default(cent).div(100).toFixed(2);
}
//#endregion
//#region src/main/db/migrations/legacy-price-version.ts
/** 将旧版价格版本展开为相互独立的商品记录。 */
function migrateLegacyPriceVersions(db) {
	if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'price_versions'").get()) return;
	addProductColumns(db);
	db.transaction(() => {
		db.exec("DROP INDEX IF EXISTS products_name_model_unique");
		createReferenceMap(db);
		expandPriceVersions(db);
		for (const table of [
			"outbound_lines",
			"inbound_lines",
			"replenishment_export_lines",
			"inventory_ledger"
		]) migrateReferenceColumn(db, table);
		db.exec("DROP TABLE price_versions");
		db.exec("DROP TABLE legacy_price_product_map");
	})();
}
/** 为旧商品表增加新模型字段。 */
function addProductColumns(db) {
	const columns = db.prepare("PRAGMA table_info(products)").all();
	const names = new Set(columns.map((column) => column.name));
	if (!names.has("unit_price_decimal")) db.exec("ALTER TABLE products ADD COLUMN unit_price_decimal TEXT NOT NULL DEFAULT '0'");
	if (!names.has("tax_rate")) db.exec("ALTER TABLE products ADD COLUMN tax_rate INTEGER NOT NULL DEFAULT 13");
	if (!names.has("stock_balance")) db.exec("ALTER TABLE products ADD COLUMN stock_balance INTEGER NOT NULL DEFAULT 0");
}
/** 创建价格版本到新商品 ID 的临时映射。 */
function createReferenceMap(db) {
	db.exec(`
    CREATE TEMP TABLE legacy_price_product_map (
      price_version_id TEXT PRIMARY KEY NOT NULL,
      product_id TEXT NOT NULL
    )
  `);
}
/** 将每个旧价格版本转换为独立商品，并保留首个版本的原商品 ID。 */
function expandPriceVersions(db) {
	const products = db.prepare("SELECT * FROM products ORDER BY created_at, id").all();
	const versionsQuery = db.prepare(`
    SELECT * FROM price_versions WHERE product_id = ? ORDER BY created_at, id
  `);
	const insertMap = db.prepare("INSERT INTO legacy_price_product_map VALUES (?, ?)");
	const updateProduct = db.prepare(`
    UPDATE products SET unit_price_decimal = ?, tax_rate = ?, stock_balance = ?, status = ?, updated_at = ?
    WHERE id = ?
  `);
	const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, name_normalized, model, model_normalized, unit, tax_classification_code,
      unit_price_decimal, tax_rate, stock_balance, data_status, status, remark, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
	for (const product of products) versionsQuery.all(product.id).forEach((version, index) => {
		const targetId = index === 0 ? product.id : version.id;
		const status = product.status === "inactive" || version.status === "inactive" ? "inactive" : "active";
		if (index === 0) updateProduct.run(version.unit_price_decimal, version.tax_rate, version.stock_balance, status, version.updated_at, targetId);
		else insertProduct.run(targetId, product.name, product.name_normalized, product.model, product.model_normalized, product.unit, product.tax_classification_code, version.unit_price_decimal, version.tax_rate, version.stock_balance, product.data_status, status, product.remark, version.created_at, version.updated_at);
		insertMap.run(version.id, targetId);
	});
}
/** 把历史表的价格版本外键转换为独立商品外键。 */
function migrateReferenceColumn(db, table) {
	if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)) return;
	if (!db.prepare(`PRAGMA table_info(${table})`).all().some((column) => column.name === "price_version_id")) return;
	const indexes = db.prepare(`PRAGMA index_list(${table})`).all();
	for (const index of indexes) if (index.name.includes("price_version")) db.exec(`DROP INDEX IF EXISTS "${index.name}"`);
	db.exec(`
    UPDATE ${table}
    SET price_version_id = COALESCE((
      SELECT product_id FROM legacy_price_product_map
      WHERE price_version_id = ${table}.price_version_id
    ), price_version_id);
    ALTER TABLE ${table} RENAME COLUMN price_version_id TO product_id;
  `);
}
//#endregion
//#region src/main/db/migrations/initial-schema.ts
/**
* 数据库建表迁移 SQL。
* 从 connection.ts 拆分以控制文件长度。
* 使用 CREATE TABLE IF NOT EXISTS 确保结构一致。
*/
/** 执行建表 SQL */
function runMigrations(db) {
	migrateLegacyPriceVersions(db);
	db.exec(MIGRATION_SQL);
	normalizeProductPrices(db);
	createProductIndexes(db);
}
/** 将历史商品价格统一转换为唯一索引使用的规范化十进制字符串。 */
function normalizeProductPrices(db) {
	const rows = db.prepare("SELECT id, unit_price_decimal FROM products").all();
	const update = db.prepare("UPDATE products SET unit_price_decimal = ? WHERE id = ?");
	for (const row of rows) {
		if (row.unit_price_decimal === "0") continue;
		update.run(normalizeUnitPrice(row.unit_price_decimal), row.id);
	}
}
/** 用名称、型号和规范化价格建立商品唯一约束。 */
function createProductIndexes(db) {
	db.exec(`
    DROP INDEX IF EXISTS products_name_model_unique;
    CREATE UNIQUE INDEX IF NOT EXISTS products_name_model_price_unique
      ON products(name_normalized, model_normalized, unit_price_decimal);
    CREATE INDEX IF NOT EXISTS products_name_model_idx ON products(name_normalized, model_normalized);
  `);
}
var MIGRATION_SQL = `
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY NOT NULL,
    category TEXT NOT NULL DEFAULT '客户分类',
    name TEXT NOT NULL,
    tax_id TEXT NOT NULL,
    tax_id_normalized TEXT NOT NULL,
    short_code TEXT,
    address TEXT,
    phone TEXT,
    bank_name TEXT,
    bank_account TEXT,
    email TEXT,
    is_default_address INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS customers_tax_id_normalized_unique ON customers(tax_id_normalized);
  CREATE INDEX IF NOT EXISTS customers_name_idx ON customers(name);
  CREATE INDEX IF NOT EXISTS customers_status_idx ON customers(status);

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    name_normalized TEXT NOT NULL,
    model TEXT NOT NULL,
    model_normalized TEXT NOT NULL,
    unit TEXT NOT NULL,
    tax_classification_code TEXT NOT NULL,
    unit_price_decimal TEXT NOT NULL,
    tax_rate INTEGER NOT NULL DEFAULT 13,
    stock_balance INTEGER NOT NULL DEFAULT 0,
    data_status TEXT NOT NULL DEFAULT 'complete',
    status TEXT NOT NULL DEFAULT 'active',
    remark TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
  CREATE INDEX IF NOT EXISTS products_stock_idx ON products(stock_balance);

  CREATE TABLE IF NOT EXISTS outbound_batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_no TEXT NOT NULL UNIQUE,
    customer_id TEXT NOT NULL,
    customer_snapshot TEXT NOT NULL,
    exported_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid',
    void_reason TEXT,
    voided_at TEXT,
    xlsx_blob TEXT NOT NULL,
    xlsx_sha256 TEXT NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    total_amount_cent INTEGER NOT NULL DEFAULT 0,
    total_tax_cent INTEGER NOT NULL DEFAULT 0,
    total_cent INTEGER NOT NULL DEFAULT 0,
    line_count INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS outbound_batches_exported_at_idx ON outbound_batches(exported_at, id);
  CREATE INDEX IF NOT EXISTS outbound_batches_status_idx ON outbound_batches(status, exported_at);
  CREATE INDEX IF NOT EXISTS outbound_batches_customer_idx ON outbound_batches(customer_id);

  CREATE TABLE IF NOT EXISTS outbound_lines (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES outbound_batches(id),
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    tax_classification_code TEXT NOT NULL,
    model TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price_decimal TEXT NOT NULL,
    tax_rate INTEGER NOT NULL DEFAULT 13,
    quantity INTEGER NOT NULL,
    amount_cent INTEGER NOT NULL,
    tax_cent INTEGER NOT NULL,
    total_cent INTEGER NOT NULL,
    stock_before INTEGER NOT NULL,
    stock_after INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS outbound_lines_batch_idx ON outbound_lines(batch_id);
  CREATE INDEX IF NOT EXISTS outbound_lines_product_idx ON outbound_lines(product_id);

  CREATE TABLE IF NOT EXISTS inbound_batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_no TEXT NOT NULL UNIQUE,
    original_file_name TEXT NOT NULL,
    original_file_blob TEXT NOT NULL,
    file_sha256 TEXT NOT NULL UNIQUE,
    content_sha256 TEXT NOT NULL UNIQUE,
    imported_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'imported',
    void_reason TEXT,
    voided_at TEXT,
    ignored_row_count INTEGER NOT NULL DEFAULT 0,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    total_amount_cent INTEGER NOT NULL DEFAULT 0,
    total_tax_cent INTEGER NOT NULL DEFAULT 0,
    total_cent INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS inbound_batches_imported_at_idx ON inbound_batches(imported_at);

  CREATE TABLE IF NOT EXISTS inbound_lines (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES inbound_batches(id),
    source_sheet TEXT NOT NULL,
    source_row INTEGER NOT NULL,
    invoice_date TEXT,
    invoice_no TEXT,
    seller_name TEXT,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price_decimal TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    amount_cent INTEGER NOT NULL,
    tax_cent INTEGER NOT NULL,
    total_cent INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS inbound_lines_batch_idx ON inbound_lines(batch_id);
  CREATE INDEX IF NOT EXISTS inbound_lines_product_idx ON inbound_lines(product_id);

  CREATE TABLE IF NOT EXISTS replenishment_exports (
    id TEXT PRIMARY KEY NOT NULL,
    export_no TEXT NOT NULL UNIQUE,
    exported_at TEXT NOT NULL,
    negative_stock_snapshot_at TEXT NOT NULL,
    xlsx_blob TEXT NOT NULL,
    xlsx_sha256 TEXT NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    total_amount_cent INTEGER NOT NULL DEFAULT 0,
    total_tax_cent INTEGER NOT NULL DEFAULT 0,
    total_cent INTEGER NOT NULL DEFAULT 0,
    line_count INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS replenishment_exports_exported_at_idx ON replenishment_exports(exported_at);

  CREATE TABLE IF NOT EXISTS replenishment_export_lines (
    id TEXT PRIMARY KEY NOT NULL,
    export_id TEXT NOT NULL REFERENCES replenishment_exports(id),
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price_decimal TEXT NOT NULL,
    stock_balance_snapshot INTEGER NOT NULL,
    replenishment_quantity INTEGER NOT NULL,
    amount_cent INTEGER NOT NULL,
    tax_cent INTEGER NOT NULL,
    total_cent INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS replenishment_export_lines_export_idx ON replenishment_export_lines(export_id);

  CREATE TABLE IF NOT EXISTS import_jobs (
    id TEXT PRIMARY KEY NOT NULL,
    job_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_sha256 TEXT,
    status TEXT NOT NULL DEFAULT 'previewing',
    stats TEXT,
    errors TEXT,
    preview_token TEXT,
    preview_data TEXT,
    created_at TEXT NOT NULL,
    confirmed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS inventory_ledger (
    id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    change_quantity INTEGER NOT NULL,
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    source_type TEXT NOT NULL,
    source_id TEXT NOT NULL,
    reason TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS inventory_ledger_product_idx ON inventory_ledger(product_id, created_at);
  CREATE INDEX IF NOT EXISTS inventory_ledger_source_idx ON inventory_ledger(source_type, source_id);

  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    source_batch_id TEXT,
    operator TEXT NOT NULL DEFAULT '本机财务',
    created_at TEXT NOT NULL,
    summary TEXT
  );
  CREATE INDEX IF NOT EXISTS audit_events_entity_idx ON audit_events(entity_type, entity_id, created_at);

  CREATE TABLE IF NOT EXISTS audit_field_changes (
    id TEXT PRIMARY KEY NOT NULL,
    event_id TEXT NOT NULL REFERENCES audit_events(id),
    field_path TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT
  );
  CREATE INDEX IF NOT EXISTS audit_field_changes_event_idx ON audit_field_changes(event_id);

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`;
//#endregion
//#region src/main/db/connection.ts
var dbInstance = null;
var drizzleInstance = null;
/** 获取数据库文件路径（Electron userData 下专用目录） */
function getDbPath() {
	const dataDir = (0, node_path.resolve)(electron.app.getPath("userData"), "data");
	if (!(0, node_fs.existsSync)(dataDir)) (0, node_fs.mkdirSync)(dataDir, { recursive: true });
	return (0, node_path.resolve)(dataDir, "invoice-tool.db");
}
/** 获取数据库临时快照路径（用于迁移前备份） */
function getDbSnapshotPath() {
	return getDbPath() + ".snapshot";
}
/** 创建数据库文件快照（迁移前调用） */
function createDbSnapshot$1() {
	const dbPath = getDbPath();
	if ((0, node_fs.existsSync)(dbPath)) (0, node_fs.copyFileSync)(dbPath, getDbSnapshotPath());
}
/** 回滚到迁移前快照 */
function rollbackDbSnapshot() {
	const snapshotPath = getDbSnapshotPath();
	if ((0, node_fs.existsSync)(snapshotPath)) {
		const dbPath = getDbPath();
		if ((0, node_fs.existsSync)(dbPath)) (0, node_fs.unlinkSync)(dbPath);
		(0, node_fs.renameSync)(snapshotPath, dbPath);
	}
}
/** 清理快照文件 */
function cleanupSnapshot() {
	const snapshotPath = getDbSnapshotPath();
	if ((0, node_fs.existsSync)(snapshotPath)) (0, node_fs.unlinkSync)(snapshotPath);
}
/**
* 初始化数据库连接并执行建表。
* 启用外键约束、WAL 模式、busy_timeout。
*/
function initDatabase() {
	if (drizzleInstance) return drizzleInstance;
	const dbPath = getDbPath();
	electron_log_main.default.info(`[db] 初始化数据库: ${dbPath}`);
	dbInstance = new better_sqlite3.default(dbPath);
	dbInstance.pragma("journal_mode = WAL");
	dbInstance.pragma("foreign_keys = ON");
	dbInstance.pragma("busy_timeout = 5000");
	dbInstance.pragma("synchronous = NORMAL");
	createDbSnapshot$1();
	try {
		runMigrations(dbInstance);
		cleanupSnapshot();
		electron_log_main.default.info("[db] 建表迁移完成");
	} catch (err) {
		electron_log_main.default.error("[db] 迁移失败，回滚到快照:", err);
		rollbackDbSnapshot();
		throw err;
	}
	drizzleInstance = (0, drizzle_orm_better_sqlite3.drizzle)(dbInstance, { schema: schema_exports });
	drizzleInstance.$raw = dbInstance;
	return drizzleInstance;
}
/** 数据库完整性检查 */
function checkIntegrity(db) {
	const result = db.pragma("integrity_check");
	return result.length === 1 && result[0].integrity_check === "ok";
}
/** 关闭数据库连接 */
function closeDatabase() {
	if (dbInstance) {
		dbInstance.close();
		dbInstance = null;
		drizzleInstance = null;
	}
}
/** 获取原始 better-sqlite3 实例 */
function getRawDb() {
	if (!dbInstance) throw new Error("数据库未初始化");
	return dbInstance;
}
/** 获取 Drizzle 实例 */
function getDb() {
	if (!drizzleInstance) throw new Error("数据库未初始化");
	return drizzleInstance;
}
//#endregion
//#region src/main/security/ipc-security.ts
/**
* IPC 安全工具 - 校验每个 IPC 请求的频道、参数和窗口来源。
* 所有 IPC 使用 invoke/handle 请求响应模型，入参出参均经 Zod 校验。
*/
/** 校验失败错误 */
var IpcValidationError = class extends Error {
	fieldErrors;
	constructor(message, fieldErrors) {
		super(message);
		this.fieldErrors = fieldErrors;
		this.name = "IpcValidationError";
	}
};
/** 已注册的允许调用窗口集合 */
var allowedWindows = /* @__PURE__ */ new Set();
/** 注册允许调用 IPC 的窗口 */
function registerAllowedWindow(window) {
	allowedWindows.add(window.webContents.id);
	window.on("closed", () => {
		allowedWindows.delete(window.webContents.id);
	});
}
/** 校验调用方是否为已授权窗口 */
function validateSender(sender) {
	if (!allowedWindows.has(sender.id)) {
		electron_log_main.default.error(`[ipc-security] 拒绝未授权窗口的 IPC 调用: senderId=${sender.id}`);
		throw new Error("未授权的调用来源");
	}
}
/** Zod 错误转字段错误数组 */
function formatZodError(error) {
	return error.issues.map((e) => ({
		path: e.path.join("."),
		message: e.message
	}));
}
/**
* 注册一个带校验的 IPC handler。
* 自动校验窗口来源和入参 Schema，捕获异常并返回标准错误结构。
*/
function registerHandler(channel, inputSchema, handler) {
	electron.ipcMain.handle(channel, async (event, ...args) => {
		try {
			validateSender(event.sender);
			let input;
			if (inputSchema) {
				const parseResult = inputSchema.safeParse(args[0]);
				if (!parseResult.success) throw new IpcValidationError("参数校验失败", formatZodError(parseResult.error));
				input = parseResult.data;
			} else input = args[0];
			const result = await handler(input, event.sender);
			return {
				ok: true,
				data: JSON.parse(JSON.stringify(result))
			};
		} catch (err) {
			if (err instanceof IpcValidationError) {
				electron_log_main.default.warn(`[ipc] 校验失败 ${channel}:`, err.message);
				return {
					ok: false,
					error: err.message,
					fieldErrors: err.fieldErrors
				};
			}
			const message = err instanceof Error ? err.message : String(err);
			electron_log_main.default.error(`[ipc] 处理失败 ${channel}:`, message);
			return {
				ok: false,
				error: message
			};
		}
	});
}
//#endregion
//#region src/shared/contracts/channels.ts
/**
* IPC 频道定义 - 按业务命名空间组织。
* 主进程通过 ipcMain.handle 注册，渲染进程通过 preload 暴露的 API 调用。
*/
var IPC_CHANNELS = {
	system: {
		getVersion: "system.getVersion",
		getInitStatus: "system.getInitStatus",
		getDbHealth: "system.getDbHealth",
		getDiskSpace: "system.getDiskSpace",
		exportDiagnostics: "system.exportDiagnostics",
		selectFile: "system.selectFile"
	},
	customers: {
		list: "customers.list",
		getById: "customers.getById",
		create: "customers.create",
		update: "customers.update",
		toggleStatus: "customers.toggleStatus",
		initialImportPreview: "customers.initialImportPreview",
		initialImportConfirm: "customers.initialImportConfirm",
		downloadTemplate: "customers.downloadTemplate",
		history: "customers.history"
	},
	catalog: {
		listProducts: "catalog.listProducts",
		getProductById: "catalog.getProductById",
		createProduct: "catalog.createProduct",
		updateProduct: "catalog.updateProduct",
		deleteProduct: "catalog.deleteProduct",
		initialImportPreview: "catalog.initialImportPreview",
		initialImportConfirm: "catalog.initialImportConfirm",
		dailyImportPreview: "catalog.dailyImportPreview",
		dailyImportConfirm: "catalog.dailyImportConfirm",
		downloadTemplate: "catalog.downloadTemplate",
		fieldHistory: "catalog.fieldHistory",
		stockSummary: "catalog.stockSummary"
	},
	outbound: {
		validateDraft: "outbound.validateDraft",
		export: "outbound.export",
		list: "outbound.list",
		getDetail: "outbound.getDetail",
		download: "outbound.download",
		void: "outbound.void",
		monthlyTax: "outbound.monthlyTax"
	},
	replenishment: {
		preview: "replenishment.preview",
		export: "replenishment.export",
		list: "replenishment.list",
		getDetail: "replenishment.getDetail",
		download: "replenishment.download"
	},
	inbound: {
		preview: "inbound.preview",
		confirm: "inbound.confirm",
		downloadTemplate: "inbound.downloadTemplate",
		list: "inbound.list",
		getDetail: "inbound.getDetail",
		void: "inbound.void"
	},
	inventory: {
		ledger: "inventory.ledger",
		adjust: "inventory.adjust",
		consistencyCheck: "inventory.consistencyCheck"
	},
	backup: {
		getStatus: "backup.getStatus",
		getConfig: "backup.getConfig",
		saveConfig: "backup.saveConfig",
		testConnection: "backup.testConnection",
		create: "backup.create",
		list: "backup.list",
		restore: "backup.restore",
		getTaskStatus: "backup.getTaskStatus"
	}
};
//#endregion
//#region src/shared/schemas/index.ts
/**
* Zod 校验 Schema 集合 - 所有 IPC 入参和出参均经此校验。
* 注意：不使用 .default() 以避免 Zod input/output 类型推断不一致。
* 默认值在各领域服务中处理。
*/
/** 通用分页请求 */
var pageRequestSchema = zod.z.object({
	page: zod.z.number().int().min(1),
	pageSize: zod.z.number().int().refine((v) => [
		20,
		50,
		100
	].includes(v))
});
/** 文件选择对话框请求 */
var selectFileSchema = zod.z.object({
	title: zod.z.string().optional(),
	extensions: zod.z.array(zod.z.string().min(1)).min(1)
});
/** 客户新增/编辑 */
var customerUpsertSchema = zod.z.object({
	id: zod.z.string().optional(),
	name: zod.z.string().min(1, "客户名称必填").max(100),
	taxId: zod.z.string().min(1, "纳税人识别号必填"),
	shortCode: zod.z.string().nullable().optional(),
	address: zod.z.string().nullable().optional(),
	phone: zod.z.string().nullable().optional(),
	bankName: zod.z.string().nullable().optional(),
	bankAccount: zod.z.string().nullable().optional(),
	email: zod.z.union([
		zod.z.string().email("邮箱格式不正确"),
		zod.z.literal(""),
		zod.z.null()
	]).optional(),
	isDefaultAddress: zod.z.boolean().optional(),
	status: zod.z.enum(["active", "inactive"]).optional()
});
/** 客户搜索/筛选 */
var customerQuerySchema = zod.z.object({
	keyword: zod.z.string().optional(),
	status: zod.z.enum([
		"active",
		"inactive",
		"all"
	]).optional(),
	isDefaultAddress: zod.z.boolean().nullable().optional(),
	dataCompleteness: zod.z.enum([
		"complete",
		"incomplete",
		"all"
	]).optional(),
	...pageRequestSchema.shape
});
/** 商品新增/编辑 */
var productUpsertSchema = zod.z.object({
	id: zod.z.string().optional(),
	name: zod.z.string().min(1, "项目名称必填"),
	model: zod.z.string().min(1, "规格型号必填"),
	unit: zod.z.string().min(1, "单位必填").max(20),
	taxClassificationCode: zod.z.string().min(1, "税收分类编码必填").max(19),
	unitPriceDecimal: zod.z.string().min(1, "含税单价必填"),
	taxRate: zod.z.number().int().min(0).max(100).optional(),
	remark: zod.z.string().nullable().optional(),
	status: zod.z.enum(["active", "inactive"]).optional()
});
/** 商品库存查询 */
var productQuerySchema = zod.z.object({
	keyword: zod.z.string().optional(),
	name: zod.z.string().optional(),
	model: zod.z.string().optional(),
	stockStatus: zod.z.enum([
		"positive",
		"zero",
		"negative",
		"all"
	]).optional(),
	dataStatus: zod.z.enum([
		"complete",
		"incomplete",
		"all"
	]).optional(),
	productStatus: zod.z.enum([
		"active",
		"inactive",
		"all"
	]).optional(),
	minPrice: zod.z.string().optional(),
	maxPrice: zod.z.string().optional(),
	...pageRequestSchema.shape
});
/** 销项开票行 */
var outboundLineInputSchema = zod.z.object({
	productId: zod.z.string().min(1),
	quantity: zod.z.number().int().positive("数量必须为正整数"),
	amountCent: zod.z.number().int().positive("金额必须大于 0").optional()
});
/** 销项导出请求 */
var outboundExportSchema = zod.z.object({
	customerId: zod.z.string().min(1),
	lines: zod.z.array(outboundLineInputSchema).min(1, "至少选择一行").max(2e3, "单次最多 2000 条明细"),
	amountFactor: zod.z.string().optional()
});
/** 开票记录查询 */
var outboundQuerySchema = zod.z.object({
	batchNo: zod.z.string().optional(),
	customerName: zod.z.string().optional(),
	productKeyword: zod.z.string().optional(),
	dateFrom: zod.z.string().optional(),
	dateTo: zod.z.string().optional(),
	status: zod.z.enum([
		"valid",
		"voided",
		"all"
	]).optional(),
	...pageRequestSchema.shape
});
zod.z.object({ filePath: zod.z.string().min(1) });
zod.z.object({ previewToken: zod.z.string().min(1) });
/** 库存调整 */
var inventoryAdjustSchema = zod.z.object({
	productId: zod.z.string().min(1),
	changeQuantity: zod.z.number().int().refine((v) => v !== 0, "调整量必须为非零整数"),
	reason: zod.z.string().min(1, "调整原因必填")
});
/** 库存流水查询 */
var ledgerQuerySchema = zod.z.object({
	productId: zod.z.string().min(1),
	...pageRequestSchema.shape
});
/** 库存汇总（按 stock_balance 符号聚合） */
var stockSummarySchema = zod.z.object({});
/** 字段历史查询 */
var fieldHistoryQuerySchema = zod.z.object({
	entityType: zod.z.string().min(1),
	entityId: zod.z.string().min(1),
	...pageRequestSchema.shape
});
zod.z.object({ id: zod.z.string().min(1) });
/** 作废请求 */
var voidRequestSchema = zod.z.object({
	id: zod.z.string().min(1),
	reason: zod.z.string().min(1, "作废原因必填")
});
/** 腾讯云 COS 配置 */
var cosConfigSchema = zod.z.object({
	region: zod.z.string().trim().min(1, "Region 必填"),
	bucket: zod.z.string().trim().regex(/^[a-z0-9][a-z0-9.-]*-\d+$/, "Bucket 格式应为 BucketName-APPID"),
	prefix: zod.z.string().optional(),
	secretId: zod.z.string().optional(),
	secretKey: zod.z.string().optional(),
	securityToken: zod.z.string().optional(),
	autoBackup: zod.z.boolean().optional(),
	retentionCount: zod.z.number().int().min(1).max(100).optional(),
	restorePassword: zod.z.string().optional()
});
/** 备份恢复请求 */
var restoreRequestSchema = zod.z.object({
	objectKey: zod.z.string().min(1),
	restorePassword: zod.z.string().min(1)
});
//#endregion
//#region src/main/domains/audit/settings-service.ts
/**
* 应用设置服务 - 管理 app_settings 表中的非密钥配置。
* 客户首次导入、商品首次导入、模板版本、备份策略等。
*/
var SETTING_KEYS = {
	customerInitialImportDone: "customer_initial_import_done",
	productInitialImportDone: "product_initial_import_done",
	templateVersion: "template_version",
	templateSha256: "template_sha256",
	backupAutoBackup: "backup_auto_backup",
	backupRetention: "backup_retention",
	backupDirty: "backup_dirty",
	installId: "install_id"
};
/** 读取设置值 */
function getSetting(key) {
	return getRawDb().prepare("SELECT value FROM app_settings WHERE key = ?").get(key)?.value ?? null;
}
/** 写入设置值 */
function setSetting(key, value) {
	getDb().insert(appSettings).values({
		key,
		value
	}).onConflictDoUpdate({
		target: appSettings.key,
		set: { value }
	}).run();
}
/** 读取布尔型设置 */
function getBoolSetting(key) {
	return getSetting(key) === "true";
}
/** 写入布尔型设置 */
function setBoolSetting(key, value) {
	setSetting(key, value ? "true" : "false");
}
/** 读取初始化状态 */
function getInitStatus() {
	return {
		customerInitialImportDone: getBoolSetting(SETTING_KEYS.customerInitialImportDone),
		productInitialImportDone: getBoolSetting(SETTING_KEYS.productInitialImportDone),
		templateVersion: getSetting(SETTING_KEYS.templateVersion)
	};
}
/** 标记客户首次导入完成 */
function markCustomerInitialImportDone() {
	setBoolSetting(SETTING_KEYS.customerInitialImportDone, true);
}
/** 标记商品首次导入完成 */
function markProductInitialImportDone() {
	setBoolSetting(SETTING_KEYS.productInitialImportDone, true);
}
/** 获取或生成安装 ID */
function getOrCreateInstallId() {
	let id = getSetting(SETTING_KEYS.installId);
	if (!id) {
		id = crypto.randomUUID();
		setSetting(SETTING_KEYS.installId, id);
	}
	return id;
}
/** 标记数据已变更（待备份） */
function markDirty() {
	setBoolSetting(SETTING_KEYS.backupDirty, true);
}
/** 清除待备份标记 */
function clearDirty() {
	setBoolSetting(SETTING_KEYS.backupDirty, false);
}
/** 读取待备份标记 */
function isDirty() {
	return getBoolSetting(SETTING_KEYS.backupDirty);
}
//#endregion
//#region src/main/domains/inventory/ledger-service.ts
/**
* 库存流水服务 - 记录所有库存变更的不可变证据。
* products.stock_balance 用于查询，inventory_ledger 为变更证据。
* 两者必须在同一事务更新。
*/
/**
* 写入一条库存流水并返回变更后的余额。
* 调用方必须在同一事务内更新 products.stock_balance。
*/
function appendLedger(params) {
	const db = getDb();
	const ledgerId = (0, uuid.v7)();
	const balanceAfter = params.balanceBefore + params.changeQuantity;
	db.insert(inventoryLedger).values({
		id: ledgerId,
		productId: params.productId,
		changeQuantity: params.changeQuantity,
		balanceBefore: params.balanceBefore,
		balanceAfter,
		sourceType: params.sourceType,
		sourceId: params.sourceId,
		reason: params.reason ?? null,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}).run();
	markDirty();
	return {
		balanceAfter,
		ledgerId
	};
}
/** 按商品查询库存流水。 */
function queryLedger(params) {
	const raw = getRawDb();
	const { productId, page, pageSize } = params;
	const countRow = raw.prepare(`
    SELECT COUNT(*) as cnt FROM inventory_ledger l WHERE l.product_id = ?
  `).get(productId);
	const offset = (page - 1) * pageSize;
	return {
		rows: raw.prepare(`
    SELECT l.* FROM inventory_ledger l WHERE l.product_id = ?
    ORDER BY l.created_at DESC, l.id DESC
    LIMIT ? OFFSET ?
  `).all(productId, pageSize, offset).map((r) => ({
			id: r.id,
			productId: r.product_id,
			changeQuantity: r.change_quantity,
			balanceBefore: r.balance_before,
			balanceAfter: r.balance_after,
			sourceType: r.source_type,
			sourceId: r.source_id,
			reason: r.reason ?? null,
			createdAt: r.created_at
		})),
		total: countRow.cnt
	};
}
/**
* 由流水重算指定商品的当前余额，用于一致性检查。
* 重算逻辑：取流水最后一条的 balance_after。
*/
function recomputeBalance(productId) {
	return getRawDb().prepare(`
    SELECT balance_after FROM inventory_ledger
    WHERE product_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `).get(productId)?.balance_after ?? null;
}
/**
* 全量一致性检查：逐个商品比对 stock_balance 与流水重算值。
*/
function consistencyCheck() {
	const products = getRawDb().prepare(`
    SELECT id, stock_balance FROM products
  `).all();
	const mismatches = [];
	for (const product of products) {
		const recomputed = recomputeBalance(product.id);
		const expected = recomputed ?? 0;
		if (product.stock_balance !== expected) mismatches.push({
			productId: product.id,
			cachedBalance: product.stock_balance,
			recomputedBalance: recomputed
		});
	}
	return {
		consistent: mismatches.length === 0,
		mismatches
	};
}
//#endregion
//#region src/main/ipc/system-ipc.ts
/**
* 系统 IPC 处理器 - 版本、初始化状态、数据库健康、磁盘空间、诊断包导出。
*/
/** 脱敏：移除完整税号、银行账号、密钥等敏感信息 */
function sanitizeText(text) {
	return text.replace(/纳税(人)?(识别号|税号)[：:\s]*([0-9A-Za-z]{4})[0-9A-Za-z]+([0-9A-Za-z]{4})/g, "$1$2: $3****$4").replace(/银行账号[：:\s]*\d+(\d{4})/g, "银行账号: ****$1").replace(/bank_account[：:\s]*\d+(\d{4})/g, "bank_account: ****$1").replace(/AKID[A-Za-z0-9]+/g, "AKID****").replace(/secret[_-]?id[":\s]+["']?[^"',}\s]+/gi, "secret_id: ***").replace(/secret[_-]?key[":\s]+["']?[^"',}\s]+/gi, "secret_key: ***").replace(/security[_-]?token[":\s]+["']?[^"',}\s]+/gi, "security_token: ***").replace(/restore[_-]?password[":\s]+["']?[^"',}\s]+/gi, "restore_password: ***");
}
/** 读取最近日志文件（脱敏后） */
function collectSanitizedLogs() {
	const logDir = (0, node_path.resolve)(electron.app.getPath("userData"), "logs");
	if (!(0, node_fs.existsSync)(logDir)) return "(无日志目录)";
	try {
		const files = (0, node_fs.readdirSync)(logDir).filter((f) => f.endsWith(".log")).sort().reverse().slice(0, 3);
		const parts = [];
		for (const file of files) {
			const content = (0, node_fs.readFileSync)((0, node_path.resolve)(logDir, file), "utf-8");
			parts.push(`=== ${file} ===\n${sanitizeText(content)}`);
		}
		return parts.join("\n\n") || "(无日志文件)";
	} catch {
		return "(读取日志失败)";
	}
}
/** 收集数据库健康信息 */
function collectDbHealth() {
	try {
		const raw = getRawDb();
		const integrityResult = raw.pragma("integrity_check");
		const integrityOk = integrityResult.length === 1 && integrityResult[0].integrity_check === "ok";
		const { consistent, mismatches } = consistencyCheck();
		const tables = [
			"customers",
			"products",
			"outbound_batches",
			"outbound_lines",
			"inbound_batches",
			"inbound_lines",
			"inventory_ledger",
			"audit_events"
		];
		const counts = {};
		for (const table of tables) counts[table] = raw.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get().cnt;
		return JSON.stringify({
			integrityOk,
			ledgerConsistent: consistent,
			mismatchCount: mismatches.length,
			recordCounts: counts
		}, null, 2);
	} catch (err) {
		return `数据库健康检查失败: ${err.message}`;
	}
}
function registerSystemIpc() {
	registerHandler(IPC_CHANNELS.system.getVersion, null, () => {
		return {
			version: electron.app.getVersion(),
			electron: process.versions.electron
		};
	});
	registerHandler(IPC_CHANNELS.system.getInitStatus, null, () => {
		return getInitStatus();
	});
	/** 文件选择对话框 - sandbox 模式下渲染进程无法获取 File.path，统一由主进程弹出原生对话框 */
	registerHandler(IPC_CHANNELS.system.selectFile, selectFileSchema, (input, sender) => {
		const parentWindow = electron.BrowserWindow.fromWebContents(sender);
		const options = {
			title: input.title ?? "选择文件",
			properties: ["openFile"],
			filters: [{
				name: "Excel 文件",
				extensions: input.extensions
			}]
		};
		return (parentWindow ? electron.dialog.showOpenDialog(parentWindow, options) : electron.dialog.showOpenDialog(options)).then((result) => {
			if (result.canceled || result.filePaths.length === 0) return {
				canceled: true,
				filePath: null
			};
			return {
				canceled: false,
				filePath: result.filePaths[0]
			};
		});
	});
	registerHandler(IPC_CHANNELS.system.getDbHealth, null, () => {
		try {
			const integrityOk = checkIntegrity(getRawDb());
			const { consistent, mismatches } = consistencyCheck();
			return {
				integrityOk,
				consistent,
				mismatchCount: mismatches.length
			};
		} catch (err) {
			return {
				integrityOk: false,
				consistent: false,
				mismatchCount: 0,
				error: err.message
			};
		}
	});
	registerHandler(IPC_CHANNELS.system.getDiskSpace, null, () => {
		try {
			const stats = (0, node_fs.statfsSync)((0, node_path.resolve)(electron.app.getPath("userData"), "data"));
			return {
				available: stats.bavail * stats.bsize,
				total: stats.blocks * stats.bsize
			};
		} catch {
			return {
				available: null,
				total: null
			};
		}
	});
	/** 导出诊断包：只包含脱敏日志、版本和数据库健康结果 */
	registerHandler(IPC_CHANNELS.system.exportDiagnostics, null, async () => {
		const saveResult = await electron.dialog.showSaveDialog({
			title: "导出诊断包",
			defaultPath: `诊断包-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.txt`,
			filters: [{
				name: "文本文件",
				extensions: ["txt"]
			}]
		});
		if (saveResult.canceled || !saveResult.filePath) return { saved: false };
		const report = [
			"========================================",
			"成都莱盛发票库存管理工具 - 诊断包",
			"========================================",
			"",
			`生成时间: ${(/* @__PURE__ */ new Date()).toISOString()}`,
			`应用版本: ${electron.app.getVersion()}`,
			`Electron 版本: ${process.versions.electron}`,
			`Node.js 版本: ${process.versions.node}`,
			`平台: ${process.platform} ${process.arch}`,
			"",
			"--- 初始化状态 ---",
			JSON.stringify(getInitStatus(), null, 2),
			"",
			"--- 数据库健康 ---",
			collectDbHealth(),
			"",
			"--- 日志（已脱敏） ---",
			collectSanitizedLogs(),
			"",
			"========================================",
			"诊断包结束",
			"========================================"
		].join("\n");
		(0, node_fs.writeFileSync)(saveResult.filePath, report, "utf-8");
		electron_log_main.default.info(`[system] 诊断包已导出到: ${saveResult.filePath}`);
		return {
			saved: true,
			path: saveResult.filePath
		};
	});
}
//#endregion
//#region src/main/domains/customers/customer-mappers.ts
/**
* 客户数据库行映射。
*/
/** 将数据库行映射为业务实体 */
function mapCustomerRow(row) {
	return {
		id: row.id,
		name: row.name,
		taxId: row.taxId,
		taxIdNormalized: row.taxIdNormalized,
		shortCode: row.shortCode,
		address: row.address,
		phone: row.phone,
		bankName: row.bankName,
		bankAccount: row.bankAccount,
		email: row.email,
		isDefaultAddress: row.isDefaultAddress,
		status: row.status,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}
//#endregion
//#region src/main/db/case-mapper.ts
/**
* 行映射工具 - 将 raw SQL `SELECT *` 返回的 snake_case 键转换为 camelCase。
* better-sqlite3 按数据库物理列名返回（snake_case），而 Drizzle 的 $inferSelect
* 类型与业务代码使用 camelCase，直接断言会导致带下划线的字段为 undefined。
*/
/** 将单个对象的键从 snake_case 转为 camelCase */
function toCamel(row) {
	if (row == null) return null;
	const result = {};
	for (const key of Object.keys(row)) {
		const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
		result[camelKey] = row[key];
	}
	return result;
}
/** 批量转换行数组的键 */
function toCamelList(rows) {
	return rows.map((row) => toCamel(row));
}
//#endregion
//#region src/main/domains/customers/customer-query.ts
/**
* 客户查询服务。
*/
/** 分页查询客户 */
function listCustomers(input) {
	const raw = getRawDb();
	const { conditions, params } = buildQueryConditions$2(input);
	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
	const countRow = raw.prepare(`SELECT COUNT(*) as cnt FROM customers ${whereClause}`).get(...params);
	const offset = (input.page - 1) * input.pageSize;
	return {
		rows: toCamelList(raw.prepare(`SELECT * FROM customers ${whereClause} ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`).all(...params, input.pageSize, offset)).map(mapCustomerRow),
		total: countRow.cnt,
		page: input.page,
		pageSize: input.pageSize
	};
}
/** 构建查询条件 */
function buildQueryConditions$2(input) {
	const conditions = [];
	const params = [];
	if (input.keyword?.trim()) {
		const kw = `%${input.keyword.trim()}%`;
		conditions.push("(name LIKE ? OR short_code LIKE ? OR tax_id LIKE ? OR phone LIKE ? OR bank_account LIKE ?)");
		params.push(kw, kw, kw, kw, kw);
	}
	if (input.status && input.status !== "all") {
		conditions.push("status = ?");
		params.push(input.status);
	}
	if (input.isDefaultAddress != null) {
		conditions.push("is_default_address = ?");
		params.push(input.isDefaultAddress ? 1 : 0);
	}
	if (input.dataCompleteness && input.dataCompleteness !== "all") if (input.dataCompleteness === "complete") conditions.push("(address IS NOT NULL AND phone IS NOT NULL AND bank_name IS NOT NULL AND bank_account IS NOT NULL AND email IS NOT NULL)");
	else conditions.push("(address IS NULL OR phone IS NULL OR bank_name IS NULL OR bank_account IS NULL OR email IS NULL)");
	return {
		conditions,
		params
	};
}
/** 按 ID 获取客户 */
function getCustomerById(id) {
	const row = toCamel(getRawDb().prepare("SELECT * FROM customers WHERE id = ?").get(id));
	return row ? mapCustomerRow(row) : null;
}
//#endregion
//#region src/shared/contracts/normalize.ts
/**
* 文本规范化工具 - 用于唯一键计算和搜索。
* 去除首尾空白、全角空格、不可见字符，统一大小写用于规范化键。
*/
/** 去除首尾空白和不可见空格（含全角空格、零宽字符等） */
function trimInvisible(input) {
	if (input == null) return "";
	return String(input).replace(/[​-‍﻿]/g, "").replace(/　/g, " ").trim();
}
/** 规范化名称/型号键：去空白 + 全角转半角 + 小写 */
function normalizeKey(input) {
	return fullWidthToHalf(trimInvisible(input)).toLowerCase();
}
/** 全角字符转半角 */
function fullWidthToHalf(input) {
	return input.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248)).replace(/　/g, " ");
}
/** 规范化税号：去除空白、横线等分隔符，转大写 */
function normalizeTaxId(input) {
	return trimInvisible(input).replace(/[\s-]/g, "").toUpperCase();
}
/** 规范化银行账号：去除空白和横线 */
function normalizeBankAccount(input) {
	return trimInvisible(input).replace(/[\s-]/g, "");
}
/** 检测字符串是否为科学计数法（可能丢失精度的数值化标识） */
function isScientificNotation(input) {
	return /^[+-]?\d+\.?\d*[eE][+-]?\d+$/.test(trimInvisible(input));
}
/** 检测 Excel 数值单元格是否超过 15 位整数精度 */
function isOverPrecisionNumeric(input) {
	if (typeof input !== "number" || !Number.isFinite(input) || !Number.isInteger(input)) return false;
	return Math.abs(input) >= 0x38d7ea4c68000;
}
/** XML 文本实体转义 */
function escapeXml(input) {
	return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
/** CSV/Excel 公式注入转义：以 = + - @ 开头的文本前置单引号 */
function escapeFormulaInjection(input) {
	const trimmed = input;
	if (/^[=+\-@]/.test(trimmed)) return `'${trimmed}`;
	return trimmed;
}
/** 生成批次号：年月日时分秒 + 随机后缀 */
function generateBatchNo(prefix) {
	const now = /* @__PURE__ */ new Date();
	return `${prefix}${`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`}${`${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`}${Math.floor(Math.random() * 1e4).toString().padStart(4, "0")}`;
}
//#endregion
//#region src/main/domains/audit/audit-service.ts
/**
* 审计服务 - 记录业务动作和字段级变更。
* 所有导入、导出、作废、调整、备份恢复及系统迁移都通过此服务记录操作事件。
*/
var OPERATOR = "本机财务";
/**
* 记录一条审计事件，可选附带字段级变更。
* 必须在数据库事务内调用，确保审计与业务数据一致性。
*/
function recordAudit(params) {
	const db = getDb();
	const eventId = (0, uuid.v7)();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	db.insert(auditEvents).values({
		id: eventId,
		action: params.action,
		entityType: params.entityType,
		entityId: params.entityId,
		sourceBatchId: params.sourceBatchId ?? null,
		operator: OPERATOR,
		createdAt: now,
		summary: params.summary ?? null
	}).run();
	if (params.fieldChanges && params.fieldChanges.length > 0) {
		const rows = params.fieldChanges.filter((c) => c.oldValue !== c.newValue).map((c) => ({
			id: (0, uuid.v7)(),
			eventId,
			fieldPath: c.fieldPath,
			oldValue: c.oldValue,
			newValue: c.newValue
		}));
		if (rows.length > 0) db.insert(auditFieldChanges).values(rows).run();
	}
	return eventId;
}
/** 比较两个值，生成字段变更记录（仅当值不同时） */
function diffField(fieldPath, oldValue, newValue) {
	const oldStr = oldValue == null ? null : String(oldValue);
	const newStr = newValue == null ? null : String(newValue);
	if (oldStr === newStr) return null;
	return {
		fieldPath,
		oldValue: oldStr,
		newValue: newStr
	};
}
/** 查询某实体的字段历史 */
function queryFieldHistory(entityType, entityId, page, pageSize) {
	const parsed = fieldHistoryQuerySchema.parse({
		entityType,
		entityId,
		page,
		pageSize
	});
	const raw = getRawDb();
	const total = raw.prepare(`
    SELECT COUNT(*) as cnt FROM audit_events
    WHERE entity_type = ? AND entity_id = ?
  `).get(parsed.entityType, parsed.entityId).cnt;
	const offset = (parsed.page - 1) * parsed.pageSize;
	const events = raw.prepare(`
    SELECT id, action, source_batch_id, operator, created_at, summary
    FROM audit_events
    WHERE entity_type = ? AND entity_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(parsed.entityType, parsed.entityId, parsed.pageSize, offset);
	const eventIds = events.map((e) => e.id);
	const changesMap = /* @__PURE__ */ new Map();
	if (eventIds.length > 0) {
		const placeholders = eventIds.map(() => "?").join(",");
		const changesRows = raw.prepare(`
      SELECT id, event_id, field_path, old_value, new_value FROM audit_field_changes WHERE event_id IN (${placeholders})
    `).all(...eventIds);
		for (const c of changesRows) {
			const list = changesMap.get(c.event_id) ?? [];
			list.push({
				id: c.id,
				fieldPath: c.field_path,
				oldValue: c.old_value,
				newValue: c.new_value
			});
			changesMap.set(c.event_id, list);
		}
	}
	const rows = [];
	for (const e of events) {
		const changes = changesMap.get(e.id) ?? [];
		if (changes.length === 0) rows.push({
			id: e.id,
			createdAt: e.created_at,
			action: e.action,
			fieldPath: "*",
			oldValue: null,
			newValue: null,
			sourceBatchId: e.source_batch_id,
			operator: e.operator,
			summary: e.summary
		});
		else for (const c of changes) rows.push({
			id: c.id,
			createdAt: e.created_at,
			action: e.action,
			fieldPath: c.fieldPath,
			oldValue: c.oldValue,
			newValue: c.newValue,
			sourceBatchId: e.source_batch_id,
			operator: e.operator,
			summary: e.summary
		});
	}
	return {
		rows,
		total
	};
}
//#endregion
//#region src/main/domains/customers/customer-crud.ts
/**
* 客户 CRUD 服务。
*/
/** 新增客户 */
function createCustomer(input) {
	const db = getDb();
	const taxIdNormalized = normalizeTaxId(input.taxId);
	validateScientificNotation(input);
	ensureTaxIdUnique(taxIdNormalized);
	const id = (0, uuid.v7)();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	db.insert(customers).values(buildInsertValues(id, now, input, taxIdNormalized)).run();
	recordAudit({
		action: "customer.create",
		entityType: "customer",
		entityId: id,
		summary: `新增客户: ${trimInvisible(input.name)}`
	});
	markDirty();
	return getCustomerById(id);
}
/** 编辑客户 */
function updateCustomer(input) {
	if (!input.id) throw new Error("客户 ID 必填");
	const db = getDb();
	const old = getCustomerById(input.id);
	if (!old) throw new Error("客户不存在");
	const taxIdNormalized = normalizeTaxId(input.taxId);
	ensureTaxIdUnique(taxIdNormalized, input.id);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const updates = buildInsertValues(input.id, now, input, taxIdNormalized);
	delete updates.id;
	delete updates.createdAt;
	db.update(customers).set(updates).where((0, drizzle_orm.eq)(customers.id, input.id)).run();
	const deltas = buildCustomerDeltas(old, updates);
	recordAudit({
		action: "customer.update",
		entityType: "customer",
		entityId: input.id,
		summary: `编辑客户: ${updates.name}`,
		fieldChanges: deltas
	});
	markDirty();
	return getCustomerById(input.id);
}
/** 切换客户状态（启用/停用） */
function toggleCustomerStatus(id) {
	const customer = getCustomerById(id);
	if (!customer) throw new Error("客户不存在");
	const db = getDb();
	const newStatus = customer.status === "active" ? "inactive" : "active";
	db.update(customers).set({
		status: newStatus,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}).where((0, drizzle_orm.eq)(customers.id, id)).run();
	recordAudit({
		action: newStatus === "active" ? "customer.activate" : "customer.deactivate",
		entityType: "customer",
		entityId: id,
		summary: `${newStatus === "active" ? "恢复" : "停用"}客户: ${customer.name}`,
		fieldChanges: [diffField("status", customer.status, newStatus)]
	});
	markDirty();
	return getCustomerById(id);
}
/** 校验科学计数法 */
function validateScientificNotation(input) {
	if (input.bankAccount && isScientificNotation(input.bankAccount)) throw new Error("银行账号疑似科学计数法，已丢失精度");
	if (input.phone && isScientificNotation(input.phone)) throw new Error("电话疑似科学计数法，已丢失精度");
}
/** 校验税号唯一性 */
function ensureTaxIdUnique(taxIdNormalized, excludeId) {
	if (excludeId ? getRawDb().prepare("SELECT id FROM customers WHERE tax_id_normalized = ? AND id != ?").get(taxIdNormalized, excludeId) : getRawDb().prepare("SELECT id FROM customers WHERE tax_id_normalized = ?").get(taxIdNormalized)) throw new Error("纳税人识别号已存在");
}
/** 构建插入值对象 */
function buildInsertValues(id, now, input, taxIdNormalized) {
	const bankAccount = input.bankAccount ? normalizeBankAccount(input.bankAccount) : input.bankAccount ?? null;
	const email = input.email === "" ? null : input.email ?? null;
	return {
		id,
		category: "",
		name: trimInvisible(input.name),
		taxId: trimInvisible(input.taxId),
		taxIdNormalized,
		shortCode: input.shortCode ? trimInvisible(input.shortCode) : null,
		address: input.address ? trimInvisible(input.address) : null,
		phone: input.phone ? trimInvisible(input.phone) : null,
		bankName: input.bankName ? trimInvisible(input.bankName) : null,
		bankAccount,
		email,
		isDefaultAddress: input.isDefaultAddress ?? false,
		status: input.status ?? "active",
		createdAt: now,
		updatedAt: now
	};
}
/** 构建客户字段变更记录 */
function buildCustomerDeltas(old, updates) {
	return [
		diffField("name", old.name, updates.name),
		diffField("taxId", old.taxId, updates.taxId),
		diffField("shortCode", old.shortCode, updates.shortCode),
		diffField("address", old.address, updates.address),
		diffField("phone", old.phone, updates.phone),
		diffField("bankName", old.bankName, updates.bankName),
		diffField("bankAccount", old.bankAccount, updates.bankAccount),
		diffField("email", old.email, updates.email),
		diffField("isDefaultAddress", old.isDefaultAddress, updates.isDefaultAddress),
		diffField("status", old.status, updates.status)
	].filter((d) => d !== null);
}
//#endregion
//#region src/main/domains/customers/customer-import-service.ts
/** 预览令牌 -> 预览数据缓存 */
var previewCache$2 = /* @__PURE__ */ new Map();
/** 校验单行客户数据，返回错误列表 */
function validateRow$1(row, raw) {
	const errors = [];
	if (!row.name) errors.push("客户名称必填");
	if (!row.taxId) errors.push("纳税人识别号必填");
	if (row.taxId && raw.taxIdUnsafeNumericPrecision) errors.push("纳税人识别号被 Excel 自动转为数字，超过 15 位已丢失精度，请以文本格式填写或使用系统模板");
	if (row.phone && isScientificNotation(row.phone)) errors.push("电话疑似科学计数法，已丢失精度");
	if (row.phone && raw.phoneUnsafeNumericPrecision) errors.push("电话被 Excel 自动转为数字，超过 15 位已丢失精度，请以文本格式填写或使用系统模板");
	if (row.bankAccount && isScientificNotation(row.bankAccount)) errors.push("银行账号疑似科学计数法，已丢失精度");
	if (row.bankAccount && raw.bankAccountUnsafeNumericPrecision) errors.push("银行账号被 Excel 自动转为数字，超过 15 位已丢失精度，请以文本格式（系统模板）填写");
	if (row.email && row.email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push("邮箱格式不正确");
	return errors;
}
/** 构建预览结果：解析行数据并校验重复 */
function buildCustomerPreview(rawRows) {
	const seenTaxIds = /* @__PURE__ */ new Map();
	const rows = [];
	const errors = [];
	for (const raw of rawRows) {
		const taxIdNormalized = raw.taxId ? normalizeTaxId(raw.taxId) : "";
		const row = {
			rowIndex: raw.rowIndex,
			name: raw.name,
			taxId: raw.taxId ? trimInvisible(raw.taxId) : "",
			shortCode: raw.shortCode,
			address: raw.address,
			phone: raw.phone,
			bankName: raw.bankName,
			bankAccount: raw.bankAccount,
			phoneUnsafeNumericPrecision: raw.phoneUnsafeNumericPrecision,
			email: raw.email,
			isDefaultAddress: raw.isDefaultAddress,
			errors: []
		};
		const rowErrors = validateRow$1(row, raw);
		row.errors = rowErrors;
		rowErrors.forEach((e) => errors.push({
			rowIndex: raw.rowIndex,
			field: "",
			reason: e
		}));
		if (taxIdNormalized) if (seenTaxIds.has(taxIdNormalized)) {
			const errMsg = `纳税人识别号与第 ${seenTaxIds.get(taxIdNormalized)} 行重复`;
			row.errors.push(errMsg);
			errors.push({
				rowIndex: raw.rowIndex,
				field: "taxId",
				reason: errMsg
			});
		} else seenTaxIds.set(taxIdNormalized, raw.rowIndex);
		if (taxIdNormalized) {
			if (getRawDb().prepare("SELECT id FROM customers WHERE tax_id_normalized = ?").get(taxIdNormalized)) {
				const errMsg = "纳税人识别号已存在于系统中";
				row.errors.push(errMsg);
				errors.push({
					rowIndex: raw.rowIndex,
					field: "taxId",
					reason: errMsg
				});
			}
		}
		rows.push(row);
	}
	const errorCount = rows.filter((r) => r.errors.length > 0).length;
	return {
		rows,
		newCount: rows.filter((r) => r.errors.length === 0).length,
		duplicateTaxIdCount: rows.filter((r) => r.errors.some((e) => e.includes("识别号与第") || e === "纳税人识别号已存在于系统中")).length,
		errorCount,
		hasErrors: errorCount > 0,
		errors
	};
}
/** 生成预览令牌并缓存 */
function cacheCustomerPreview(result) {
	const token = (0, uuid.v7)();
	previewCache$2.set(token, result);
	setTimeout(() => previewCache$2.delete(token), 1800 * 1e3);
	return token;
}
/** 确认客户首次导入：事务性批量写入 */
function confirmCustomerInitialImport(token) {
	if (getInitStatus().customerInitialImportDone) throw new Error("客户首次导入已完成，不能重复执行");
	const preview = previewCache$2.get(token);
	if (!preview) throw new Error("预览已过期，请重新选择文件");
	if (preview.hasErrors) throw new Error("存在错误行，无法导入");
	const db = getDb();
	const raw = getRawDb();
	const validRows = preview.rows.filter((r) => r.errors.length === 0);
	raw.transaction(() => {
		for (const row of validRows) {
			const id = (0, uuid.v7)();
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const taxIdNormalized = normalizeTaxId(row.taxId);
			const bankAccount = row.bankAccount ? normalizeBankAccount(row.bankAccount) : null;
			const email = row.email === "" ? null : row.email ?? null;
			db.insert(customers).values({
				id,
				category: "",
				name: trimInvisible(row.name),
				taxId: trimInvisible(row.taxId),
				taxIdNormalized,
				shortCode: row.shortCode ? trimInvisible(row.shortCode) : null,
				address: row.address ? trimInvisible(row.address) : null,
				phone: row.phone ? trimInvisible(row.phone) : null,
				bankName: row.bankName ? trimInvisible(row.bankName) : null,
				bankAccount,
				email,
				isDefaultAddress: row.isDefaultAddress,
				status: "active",
				createdAt: now,
				updatedAt: now
			}).run();
			recordAudit({
				action: "customer.initial_import",
				entityType: "customer",
				entityId: id,
				summary: `首次导入客户: ${trimInvisible(row.name)}`
			});
		}
		markCustomerInitialImportDone();
		markDirty();
	})();
	previewCache$2.delete(token);
	return { imported: validRows.length };
}
//#endregion
//#region src/main/excel/importers/parser-utils.ts
xlsx.set_fs(node_fs);
var XpCell = class {
	value;
	col;
	constructor(value, col) {
		this.value = value;
		this.col = col;
	}
	get result() {
		return this.value;
	}
};
var XpRow = class {
	values;
	rowNumber;
	constructor(values, rowNumber) {
		this.values = values;
		this.rowNumber = rowNumber;
	}
	getCell(col) {
		return new XpCell((col >= 1 && col <= this.values.length ? this.values[col - 1] : null) ?? null, col);
	}
	eachCell(callback, includeEmpty = false) {
		for (let c = 1; c <= this.values.length; c++) {
			const v = this.values[c - 1];
			if (!includeEmpty && (v == null || v === "")) continue;
			callback(new XpCell(v ?? null, c), c);
		}
	}
};
var XpSheet = class {
	name;
	matrix;
	constructor(name, ws) {
		this.name = name;
		this.matrix = xlsx.utils.sheet_to_json(ws, {
			header: 1,
			blankrows: true,
			defval: null,
			raw: true
		}) ?? [];
	}
	get rowCount() {
		return this.matrix.length;
	}
	getRow(row) {
		return new XpRow(row >= 1 && row <= this.matrix.length ? this.matrix[row - 1] : [], row);
	}
};
/** 读取工作簿 */
async function readWorkbook(filePath) {
	const workbook = xlsx.readFile(filePath, { cellDates: true });
	return { worksheets: workbook.SheetNames.map((name) => new XpSheet(name, workbook.Sheets[name])) };
}
/** 将单元格值转为文本，避免数字精度丢失 */
function cellToText(cell) {
	if (!cell) return "";
	const val = cell.result ?? cell.value;
	if (val == null) return "";
	if (typeof val === "string") return val;
	if (typeof val === "number") return String(val);
	if (val instanceof Date) return val.toISOString().split("T")[0];
	if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
	if (typeof val === "object") {
		const obj = val;
		if ("text" in obj && typeof obj.text === "string") return obj.text;
		if ("richText" in obj && Array.isArray(obj.richText)) return obj.richText.map((r) => r.text).join("");
	}
	return String(val);
}
/** 将标识符单元格转为文本，并保留原始数值精度风险 */
function cellToIdentifierText(cell) {
	if (!cell) return {
		text: "",
		unsafeNumericPrecision: false
	};
	const value = cell.result ?? cell.value;
	return {
		text: cellToText(cell),
		unsafeNumericPrecision: isOverPrecisionNumeric(value)
	};
}
/** 将单元格值转为数字（整数） */
function cellToInt(cell) {
	if (!cell) return null;
	const val = cell.result ?? cell.value;
	if (val == null || val === "") return null;
	if (typeof val === "number") return Number.isInteger(val) ? val : null;
	const str = String(val).trim();
	if (!str) return null;
	const n = Number(str);
	return Number.isFinite(n) && Number.isInteger(n) ? n : null;
}
/** 按表头名称查找列索引 */
function findColumnIndex(headerRow, names) {
	let foundCol = -1;
	headerRow.eachCell((cell, col) => {
		if (foundCol > 0) return;
		const headerText = trimInvisible(cellToText(cell)).toLowerCase();
		for (const name of names) if (headerText === name.toLowerCase() || headerText.includes(name.toLowerCase())) {
			foundCol = col;
			return;
		}
	}, true);
	return foundCol;
}
//#endregion
//#region src/main/excel/importers/customer-parser.ts
/**
* 客户导入 Excel 解析器。
*/
/** 解析客户首次导入 Excel */
async function parseCustomerExcel(filePath) {
	const sheet = (await readWorkbook(filePath)).worksheets[0];
	if (!sheet) throw new Error("Excel 文件没有工作表");
	const headerRow = sheet.getRow(1);
	const colMap = {
		name: findColumnIndex(headerRow, [
			"客户名称",
			"名称",
			"name"
		]),
		taxId: findColumnIndex(headerRow, [
			"纳税人识别号",
			"税号",
			"tax_id"
		]),
		shortCode: findColumnIndex(headerRow, ["简码", "short_code"]),
		address: findColumnIndex(headerRow, ["地址", "address"]),
		phone: findColumnIndex(headerRow, ["电话", "phone"]),
		bankName: findColumnIndex(headerRow, [
			"开户行",
			"开户行名称",
			"bank_name"
		]),
		bankAccount: findColumnIndex(headerRow, [
			"银行账号",
			"账号",
			"bank_account"
		]),
		email: findColumnIndex(headerRow, ["邮箱", "email"]),
		isDefaultAddress: findColumnIndex(headerRow, ["是否默认地址", "默认地址"])
	};
	if (colMap.name === -1 || colMap.taxId === -1) throw new Error("未找到「客户名称」或「纳税人识别号」列，请使用系统模板");
	const rows = [];
	for (let r = 2; r <= sheet.rowCount; r++) {
		const row = sheet.getRow(r);
		const name = trimInvisible(cellToText(row.getCell(colMap.name)));
		const taxIdCell = cellToIdentifierText(row.getCell(colMap.taxId));
		const taxId = trimInvisible(taxIdCell.text);
		if (!name && !taxId) continue;
		const bankAccountCell = colMap.bankAccount > 0 ? cellToIdentifierText(row.getCell(colMap.bankAccount)) : {
			text: "",
			unsafeNumericPrecision: false
		};
		const phoneCell = colMap.phone > 0 ? cellToIdentifierText(row.getCell(colMap.phone)) : {
			text: "",
			unsafeNumericPrecision: false
		};
		rows.push({
			rowIndex: r,
			name,
			taxId,
			taxIdUnsafeNumericPrecision: taxIdCell.unsafeNumericPrecision,
			shortCode: colMap.shortCode > 0 ? trimInvisible(cellToText(row.getCell(colMap.shortCode))) || null : null,
			address: colMap.address > 0 ? trimInvisible(cellToText(row.getCell(colMap.address))) || null : null,
			phone: trimInvisible(phoneCell.text) || null,
			phoneUnsafeNumericPrecision: phoneCell.unsafeNumericPrecision,
			bankName: colMap.bankName > 0 ? trimInvisible(cellToText(row.getCell(colMap.bankName))) || null : null,
			bankAccount: trimInvisible(bankAccountCell.text) || null,
			bankAccountUnsafeNumericPrecision: bankAccountCell.unsafeNumericPrecision,
			email: colMap.email > 0 ? trimInvisible(cellToText(row.getCell(colMap.email))) || null : null,
			isDefaultAddress: colMap.isDefaultAddress > 0 ? [
				"是",
				"true",
				"1",
				"yes",
				"y"
			].includes(trimInvisible(cellToText(row.getCell(colMap.isDefaultAddress))).toLowerCase()) : false
		});
	}
	return rows;
}
//#endregion
//#region src/main/excel/importers/catalog-parser.ts
/**
* 商品导入 Excel 解析器。
* 支持首次导入（含初始库存）和日常导入。
*/
/** 解析商品首次/日常导入 Excel */
async function parseCatalogExcel(filePath, isInitial) {
	const sheet = (await readWorkbook(filePath)).worksheets[0];
	if (!sheet) throw new Error("Excel 文件没有工作表");
	const headerRow = sheet.getRow(1);
	const colMap = {
		name: findColumnIndex(headerRow, [
			"项目名称",
			"商品名称",
			"名称",
			"name"
		]),
		model: findColumnIndex(headerRow, [
			"规格型号",
			"型号",
			"model"
		]),
		unit: findColumnIndex(headerRow, ["单位", "unit"]),
		taxCode: findColumnIndex(headerRow, [
			"税收分类编码",
			"税收编码",
			"tax_code"
		]),
		price: findColumnIndex(headerRow, [
			"含税单价",
			"单价",
			"unit_price"
		]),
		stock: findColumnIndex(headerRow, [
			"初始库存",
			"库存",
			"stock"
		]),
		remark: findColumnIndex(headerRow, ["备注", "remark"])
	};
	if (colMap.name === -1 || colMap.model === -1 || colMap.price === -1) throw new Error("未找到必要列（项目名称、规格型号、单价），请使用系统模板");
	const rows = [];
	for (let r = 2; r <= sheet.rowCount; r++) {
		const row = sheet.getRow(r);
		const name = trimInvisible(cellToText(row.getCell(colMap.name)));
		const model = trimInvisible(cellToText(row.getCell(colMap.model)));
		if (!name && !model) continue;
		rows.push({
			rowIndex: r,
			name,
			model,
			unit: colMap.unit > 0 ? trimInvisible(cellToText(row.getCell(colMap.unit))) : "",
			taxClassificationCode: colMap.taxCode > 0 ? trimInvisible(cellToText(row.getCell(colMap.taxCode))) : "",
			unitPriceDecimal: trimInvisible(cellToText(row.getCell(colMap.price))),
			initialStock: isInitial && colMap.stock > 0 ? cellToInt(row.getCell(colMap.stock)) : null,
			remark: colMap.remark > 0 ? trimInvisible(cellToText(row.getCell(colMap.remark))) || null : null
		});
	}
	return rows;
}
//#endregion
//#region src/main/excel/importers/inbound-parser.ts
/**
* 总部进项票 Excel 解析器。
* 按表头定位列，合并相同业务键的行。
*/
/** 解析总部进项票 Excel */
async function parseInboundExcel(filePath) {
	const workbook = await readWorkbook(filePath);
	const allRows = [];
	for (const sheet of workbook.worksheets) {
		const sheetName = sheet.name;
		const colMap = buildInboundColMap(sheet.getRow(1));
		if (colMap.name === -1) {
			electron_log_main.default.info(`[inbound-parse] 工作表「${sheetName}」未找到品名列，跳过`);
			continue;
		}
		parseInboundSheet(sheet, sheetName, colMap, allRows);
	}
	return {
		rows: allRows,
		fileName: filePath.split("/").pop() || "unknown.xlsx"
	};
}
/** 构建进项票列映射 */
function buildInboundColMap(headerRow) {
	return {
		invoiceDate: findColumnIndex(headerRow, [
			"开票日期",
			"发票日期",
			"日期"
		]),
		invoiceNo: findColumnIndex(headerRow, [
			"发票号",
			"发票号码",
			"发票编号"
		]),
		sellerName: findColumnIndex(headerRow, [
			"销售方名称",
			"销方名称",
			"销售方"
		]),
		name: findColumnIndex(headerRow, [
			"品名",
			"货物名称",
			"项目名称",
			"商品名称"
		]),
		model: findColumnIndex(headerRow, [
			"规格型号",
			"型号",
			"规格"
		]),
		unit: findColumnIndex(headerRow, ["单位"]),
		quantity: findColumnIndex(headerRow, ["数量"]),
		price: findColumnIndex(headerRow, ["含税单价", "单价"]),
		amount: findColumnIndex(headerRow, ["金额", "不含税金额"]),
		tax: findColumnIndex(headerRow, ["税额", "税"]),
		total: findColumnIndex(headerRow, ["合计", "价税合计"])
	};
}
/** 解析单个工作表 */
function parseInboundSheet(sheet, sheetName, colMap, allRows) {
	for (let r = 2; r <= sheet.rowCount; r++) {
		const row = sheet.getRow(r);
		const name = trimInvisible(cellToText(row.getCell(colMap.name)));
		const model = colMap.model > 0 ? trimInvisible(cellToText(row.getCell(colMap.model))) : "";
		const unit = colMap.unit > 0 ? trimInvisible(cellToText(row.getCell(colMap.unit))) : "";
		if (!name && !model && !unit) continue;
		const quantityStr = colMap.quantity > 0 ? cellToText(row.getCell(colMap.quantity)) : "";
		let quantity = null;
		if (quantityStr?.trim()) {
			const n = Number(quantityStr.trim());
			if (Number.isFinite(n)) quantity = n;
		}
		allRows.push({
			sourceSheet: sheetName,
			sourceRow: r,
			invoiceDate: colMap.invoiceDate > 0 ? trimInvisible(cellToText(row.getCell(colMap.invoiceDate))) || null : null,
			invoiceNo: colMap.invoiceNo > 0 ? trimInvisible(cellToText(row.getCell(colMap.invoiceNo))) || null : null,
			sellerName: colMap.sellerName > 0 ? trimInvisible(cellToText(row.getCell(colMap.sellerName))) || null : null,
			name,
			model,
			unit,
			quantity,
			unitPriceDecimal: colMap.price > 0 ? trimInvisible(cellToText(row.getCell(colMap.price))) : "",
			amountYuan: colMap.amount > 0 ? trimInvisible(cellToText(row.getCell(colMap.amount))) || null : null,
			taxYuan: colMap.tax > 0 ? trimInvisible(cellToText(row.getCell(colMap.tax))) || null : null,
			totalYuan: colMap.total > 0 ? trimInvisible(cellToText(row.getCell(colMap.total))) || null : null
		});
	}
}
//#endregion
//#region src/main/excel/importers/template-generator.ts
xlsx.set_fs(node_fs);
/**
* 导入模板生成器 - 生成客户、商品和进项的下载模板。
* 基于 SheetJS 社区版（从官方 CDN 安装：https://cdn.sheetjs.com）。
*
* 注意：SheetJS 社区版不支持写入单元格样式（加粗、填充、数字格式 @、
* 数据校验、冻结窗格、自动筛选）。因此模板仅保证数据正确性与列宽，
* 原有视觉样式与“文本格式”保护需在后续用 SheetJS Pro 或 xlsx-js-style 增强。
* 为保证导入解析时的标识符精度，生成模板时这些列请以文本方式填写数据。
*/
/** 由表头与列宽构建工作表（仅列宽，无样式） */
function buildSheet(headers, widths) {
	const ws = xlsx.utils.aoa_to_sheet([headers]);
	ws["!cols"] = widths.map((w) => ({ wch: w }));
	return ws;
}
/** 创建只包含指定工作表的工作簿 */
function bookWithSheet(name, ws) {
	const wb = xlsx.utils.book_new();
	xlsx.utils.book_append_sheet(wb, ws, name);
	return wb;
}
/** 生成客户导入模板并保存到指定路径 */
async function generateCustomerTemplate(savePath) {
	xlsx.writeFile(bookWithSheet("客户信息", buildSheet([
		"客户名称",
		"纳税人识别号",
		"简码",
		"地址",
		"电话",
		"开户行名称",
		"银行账号",
		"联系邮箱",
		"是否默认地址"
	], [
		30,
		25,
		15,
		40,
		15,
		25,
		25,
		25,
		15
	])), savePath);
}
/** 生成商品导入模板并保存到指定路径 */
async function generateCatalogTemplate(savePath, isInitial) {
	const headers = [
		"项目名称",
		"规格型号",
		"单位",
		"税收分类编码",
		"含税单价"
	];
	const widths = [
		30,
		20,
		10,
		20,
		15
	];
	if (isInitial) {
		headers.push("初始库存");
		widths.push(12);
	}
	headers.push("备注");
	widths.push(30);
	xlsx.writeFile(bookWithSheet("商品信息", buildSheet(headers, widths)), savePath);
}
/** 生成月初总部进项导入模板并保存到指定路径 */
async function generateInboundTemplate(savePath) {
	xlsx.writeFile(bookWithSheet("进项明细", buildSheet([
		"开票日期",
		"发票号码",
		"销售方名称",
		"品名",
		"规格型号",
		"单位",
		"数量",
		"含税单价",
		"不含税金额",
		"税额",
		"价税合计"
	], [
		14,
		22,
		30,
		30,
		20,
		10,
		12,
		16,
		16,
		14,
		16
	])), savePath);
}
//#endregion
//#region src/main/ipc/customers-ipc.ts
/**
* 客户 IPC 处理器。
*/
function registerCustomersIpc() {
	registerHandler(IPC_CHANNELS.customers.list, customerQuerySchema, (input) => {
		return listCustomers(input);
	});
	registerHandler(IPC_CHANNELS.customers.getById, null, (id) => {
		return getCustomerById(id);
	});
	registerHandler(IPC_CHANNELS.customers.create, customerUpsertSchema, (input) => {
		return createCustomer(input);
	});
	registerHandler(IPC_CHANNELS.customers.update, customerUpsertSchema, (input) => {
		return updateCustomer(input);
	});
	registerHandler(IPC_CHANNELS.customers.toggleStatus, null, (id) => {
		return toggleCustomerStatus(id);
	});
	registerHandler(IPC_CHANNELS.customers.initialImportPreview, null, async (filePath, _sender) => {
		if (getInitStatus().customerInitialImportDone) throw new Error("客户首次导入已完成，不能重复执行");
		const preview = buildCustomerPreview((await parseCustomerExcel(filePath)).map((p) => ({
			rowIndex: p.rowIndex,
			name: p.name,
			taxId: p.taxId,
			taxIdUnsafeNumericPrecision: p.taxIdUnsafeNumericPrecision,
			shortCode: p.shortCode,
			address: p.address,
			phone: p.phone,
			bankName: p.bankName,
			bankAccount: p.bankAccount,
			bankAccountUnsafeNumericPrecision: p.bankAccountUnsafeNumericPrecision,
			phoneUnsafeNumericPrecision: p.phoneUnsafeNumericPrecision,
			email: p.email,
			isDefaultAddress: p.isDefaultAddress
		})));
		return {
			token: cacheCustomerPreview(preview),
			preview
		};
	});
	registerHandler(IPC_CHANNELS.customers.initialImportConfirm, null, (token) => {
		return confirmCustomerInitialImport(token);
	});
	registerHandler(IPC_CHANNELS.customers.history, fieldHistoryQuerySchema, (input) => {
		return queryFieldHistory(input.entityType, input.entityId, input.page, input.pageSize);
	});
	registerHandler(IPC_CHANNELS.customers.downloadTemplate, null, async (_input, _sender) => {
		const result = await electron.dialog.showSaveDialog({
			title: "保存客户导入模板",
			defaultPath: "客户导入模板.xlsx",
			filters: [{
				name: "Excel",
				extensions: ["xlsx"]
			}]
		});
		if (result.canceled || !result.filePath) return { saved: false };
		await generateCustomerTemplate(result.filePath);
		return {
			saved: true,
			path: result.filePath
		};
	});
}
//#endregion
//#region src/main/domains/catalog/catalog-mappers.ts
/** 将商品数据库行映射为业务实体。 */
function mapProduct(row) {
	return {
		id: row.id,
		name: row.name,
		nameNormalized: row.nameNormalized,
		model: row.model,
		modelNormalized: row.modelNormalized,
		unit: row.unit,
		taxClassificationCode: row.taxClassificationCode,
		unitPriceDecimal: row.unitPriceDecimal,
		taxRate: row.taxRate,
		stockBalance: row.stockBalance,
		dataStatus: row.dataStatus,
		status: row.status,
		remark: row.remark,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}
//#endregion
//#region src/main/domains/catalog/catalog-query.ts
/** 分页查询商品库存。 */
function listProducts(input) {
	const raw = getRawDb();
	const { conditions, params } = buildQueryConditions$1(input);
	const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
	const total = raw.prepare(`SELECT COUNT(*) AS count FROM products ${where}`).get(...params).count;
	const offset = (input.page - 1) * input.pageSize;
	return {
		rows: toCamelList(raw.prepare(`SELECT * FROM products ${where} ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`).all(...params, input.pageSize, offset)).map(mapProduct),
		total,
		page: input.page,
		pageSize: input.pageSize
	};
}
/** 构建商品查询条件。 */
function buildQueryConditions$1(input) {
	const conditions = [];
	const params = [];
	if (input.keyword?.trim()) {
		const keyword = `%${input.keyword.trim()}%`;
		conditions.push("(name LIKE ? OR model LIKE ? OR tax_classification_code LIKE ?)");
		params.push(keyword, keyword, keyword);
	}
	if (input.name?.trim()) {
		conditions.push("name LIKE ?");
		params.push(`%${input.name.trim()}%`);
	}
	if (input.model?.trim()) {
		conditions.push("model LIKE ?");
		params.push(`%${input.model.trim()}%`);
	}
	if (input.stockStatus && input.stockStatus !== "all") conditions.push({
		positive: "stock_balance > 0",
		zero: "stock_balance = 0",
		negative: "stock_balance < 0"
	}[input.stockStatus]);
	if (input.dataStatus && input.dataStatus !== "all") {
		conditions.push("data_status = ?");
		params.push(input.dataStatus);
	}
	if (input.productStatus && input.productStatus !== "all") {
		conditions.push("status = ?");
		params.push(input.productStatus);
	}
	if (input.minPrice) {
		conditions.push("CAST(unit_price_decimal AS REAL) >= CAST(? AS REAL)");
		params.push(input.minPrice);
	}
	if (input.maxPrice) {
		conditions.push("CAST(unit_price_decimal AS REAL) <= CAST(? AS REAL)");
		params.push(input.maxPrice);
	}
	return {
		conditions,
		params
	};
}
/** 按 ID 获取商品。 */
function getProductById(id) {
	const row = toCamel(getRawDb().prepare("SELECT * FROM products WHERE id = ?").get(id));
	return row ? mapProduct(row) : null;
}
/** 批量获取商品，用于开票前校验。 */
function getProductsByIds(ids) {
	if (!ids.length) return [];
	const placeholders = ids.map(() => "?").join(",");
	return toCamelList(getRawDb().prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(...ids)).map(mapProduct);
}
/** 汇总正库存、负库存绝对值与净库存。 */
function getStockSummary() {
	const row = getRawDb().prepare(`
    SELECT
      SUM(CASE WHEN stock_balance > 0 THEN stock_balance ELSE 0 END) AS positive,
      SUM(CASE WHEN stock_balance < 0 THEN ABS(stock_balance) ELSE 0 END) AS negative,
      SUM(stock_balance) AS total
    FROM products
  `).get();
	return {
		positiveStock: row.positive ?? 0,
		negativeStock: row.negative ?? 0,
		totalStock: row.total ?? 0
	};
}
//#endregion
//#region src/main/domains/catalog/catalog-crud.ts
/** 新增商品，同名同型号可按不同含税单价分别建档。 */
function createProduct(input) {
	const { nameNorm, modelNorm } = normalizeProductKeys(input.name, input.model);
	const unitPriceDecimal = normalizeUnitPrice(input.unitPriceDecimal);
	ensureProductUnique(nameNorm, modelNorm, unitPriceDecimal);
	const id = (0, uuid.v7)();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const taxCode = trimInvisible(input.taxClassificationCode);
	getDb().insert(products).values({
		id,
		name: trimInvisible(input.name),
		nameNormalized: nameNorm,
		model: trimInvisible(input.model),
		modelNormalized: modelNorm,
		unit: trimInvisible(input.unit),
		taxClassificationCode: taxCode,
		unitPriceDecimal,
		taxRate: input.taxRate ?? 13,
		stockBalance: 0,
		dataStatus: taxCode ? "complete" : "incomplete",
		status: input.status ?? "active",
		remark: input.remark ? trimInvisible(input.remark) : null,
		createdAt: now,
		updatedAt: now
	}).run();
	recordAudit({
		action: "product.create",
		entityType: "product",
		entityId: id,
		summary: `新增商品: ${input.name}`
	});
	markDirty();
	return getProductById(id);
}
/** 编辑商品资料及其独立含税单价。 */
function updateProduct(input) {
	if (!input.id) throw new Error("商品 ID 必填");
	const old = getProductById(input.id);
	if (!old) throw new Error("商品不存在");
	const { nameNorm, modelNorm } = normalizeProductKeys(input.name, input.model);
	const unitPriceDecimal = normalizeUnitPrice(input.unitPriceDecimal);
	ensureProductUnique(nameNorm, modelNorm, unitPriceDecimal, input.id);
	const taxCode = trimInvisible(input.taxClassificationCode);
	const updates = {
		name: trimInvisible(input.name),
		nameNormalized: nameNorm,
		model: trimInvisible(input.model),
		modelNormalized: modelNorm,
		unit: trimInvisible(input.unit),
		taxClassificationCode: taxCode,
		unitPriceDecimal,
		taxRate: input.taxRate ?? 13,
		dataStatus: taxCode ? "complete" : "incomplete",
		status: input.status ?? "active",
		remark: input.remark ? trimInvisible(input.remark) : null,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	getDb().update(products).set(updates).where((0, drizzle_orm.eq)(products.id, input.id)).run();
	recordAudit({
		action: "product.update",
		entityType: "product",
		entityId: input.id,
		summary: `编辑商品: ${updates.name}`,
		fieldChanges: buildProductDeltas(old, updates)
	});
	markDirty();
	return getProductById(input.id);
}
/** 删除没有库存和业务记录的商品。 */
function deleteProduct(id) {
	const product = getProductById(id);
	if (!product) throw new Error("商品不存在");
	if (product.stockBalance !== 0) throw new Error("商品库存不为 0，请先清空库存再删除");
	const raw = getRawDb();
	for (const [table, label] of [
		["outbound_lines", "销项开票"],
		["inbound_lines", "进项"],
		["replenishment_export_lines", "月底补票"]
	]) if (raw.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE product_id = ?`).get(id).count) throw new Error(`存在${label}记录，不能删除`);
	raw.transaction(() => {
		raw.prepare("DELETE FROM inventory_ledger WHERE product_id = ?").run(id);
		getDb().delete(products).where((0, drizzle_orm.eq)(products.id, id)).run();
		recordAudit({
			action: "product.delete",
			entityType: "product",
			entityId: id,
			summary: `删除商品: ${product.name}`
		});
		markDirty();
	})();
}
/** 规范化商品唯一键。 */
function normalizeProductKeys(name, model) {
	return {
		nameNorm: normalizeKey(name),
		modelNorm: normalizeKey(model)
	};
}
/** 校验规范化名称、型号和含税单价组合唯一。 */
function ensureProductUnique(nameNorm, modelNorm, unitPriceDecimal, excludeId) {
	if (excludeId ? getRawDb().prepare(`
        SELECT id FROM products
        WHERE name_normalized = ? AND model_normalized = ? AND unit_price_decimal = ? AND id != ?
      `).get(nameNorm, modelNorm, unitPriceDecimal, excludeId) : getRawDb().prepare(`
        SELECT id FROM products
        WHERE name_normalized = ? AND model_normalized = ? AND unit_price_decimal = ?
      `).get(nameNorm, modelNorm, unitPriceDecimal)) throw new Error("该项目名称、规格型号和含税单价组合已存在");
}
/** 生成商品字段审计差异。 */
function buildProductDeltas(old, updates) {
	return [
		diffField("name", old.name, updates.name),
		diffField("model", old.model, updates.model),
		diffField("unit", old.unit, updates.unit),
		diffField("taxClassificationCode", old.taxClassificationCode, updates.taxClassificationCode),
		diffField("unitPriceDecimal", old.unitPriceDecimal, updates.unitPriceDecimal),
		diffField("taxRate", old.taxRate, updates.taxRate),
		diffField("dataStatus", old.dataStatus, updates.dataStatus),
		diffField("status", old.status, updates.status),
		diffField("remark", old.remark, updates.remark)
	].filter((delta) => delta !== null);
}
//#endregion
//#region src/main/domains/catalog/catalog-import-preview.ts
/**
* 商品导入预览服务。
* 首次导入和日常导入的预览构建，包含校验和重复检测。
*/
/** 预览令牌缓存 */
var previewCache$1 = /* @__PURE__ */ new Map();
/** 缓存预览，返回令牌 */
function cacheCatalogPreview(result) {
	const token = (0, uuid.v7)();
	previewCache$1.set(token, result);
	setTimeout(() => previewCache$1.delete(token), 1800 * 1e3);
	return token;
}
/** 获取缓存的预览 */
function getCachedPreview(token) {
	return previewCache$1.get(token);
}
/** 删除缓存的预览 */
function deleteCachedPreview(token) {
	previewCache$1.delete(token);
}
/** 校验单行 */
function validateRow(row, isInitial) {
	const errors = [];
	if (!row.name) errors.push("项目名称必填");
	if (!row.model) errors.push("规格型号必填");
	if (!row.unit) errors.push("单位必填");
	if (!row.taxClassificationCode) errors.push("税收分类编码必填");
	if (!row.unitPriceDecimal) errors.push("单价必填");
	try {
		if (row.unitPriceDecimal) normalizeUnitPrice(row.unitPriceDecimal);
	} catch (e) {
		errors.push(`单价错误: ${e.message}`);
	}
	if (isInitial && row.initialStock != null && !Number.isInteger(row.initialStock)) errors.push("初始库存必须为整数");
	return errors;
}
/** 安全规范化单价（出错返回原值） */
function normalizeUnitPriceSafe$1(input) {
	try {
		return normalizeUnitPrice(input);
	} catch {
		return trimInvisible(input);
	}
}
/** 构建首次导入预览 */
function buildInitialImportPreview(rawRows) {
	return buildPreview(rawRows, true);
}
/** 构建日常导入预览 */
function buildDailyImportPreview(rawRows) {
	return buildPreview(rawRows, false);
}
/** 构建预览的通用逻辑 */
function buildPreview(rawRows, isInitial) {
	const rows = [];
	const errors = [];
	const seenPriceKeys = /* @__PURE__ */ new Map();
	const acceptedProductKeys = /* @__PURE__ */ new Set();
	const productMetadata = /* @__PURE__ */ new Map();
	let newProductCount = 0;
	let newPriceVariantCount = 0;
	let totalStockSum = 0;
	let dedupedRowCount = 0;
	for (const raw of rawRows) {
		const row = {
			...raw,
			initialStock: isInitial ? raw.initialStock : null,
			errors: [],
			deduped: false
		};
		const rowErrors = validateRow(row, isInitial);
		row.errors = rowErrors;
		rowErrors.forEach((e) => errors.push({
			rowIndex: raw.rowIndex,
			field: "",
			reason: e
		}));
		const nameNorm = normalizeKey(row.name);
		const modelNorm = normalizeKey(row.model);
		const unitPriceNormalized = row.unitPriceDecimal ? normalizeUnitPriceSafe$1(row.unitPriceDecimal) : "";
		const productKey = `${nameNorm}|${modelNorm}`;
		const priceKey = `${productKey}|${unitPriceNormalized}`;
		if (rowErrors.length === 0 && seenPriceKeys.has(priceKey)) {
			row.deduped = true;
			row.errors = [`与第 ${seenPriceKeys.get(priceKey)} 行商品和价格重复，已自动去重`];
			dedupedRowCount++;
		} else if (rowErrors.length === 0) seenPriceKeys.set(priceKey, raw.rowIndex);
		if (rowErrors.length === 0 && !row.deduped) {
			const metadata = {
				unit: trimInvisible(row.unit),
				taxCode: trimInvisible(row.taxClassificationCode)
			};
			const knownMetadata = productMetadata.get(productKey);
			if (knownMetadata && knownMetadata.unit !== metadata.unit) {
				const error = `单位与同文件商品不一致（已有: ${knownMetadata.unit}）`;
				row.errors.push(error);
				errors.push({
					rowIndex: raw.rowIndex,
					field: "",
					reason: error
				});
			}
			if (knownMetadata && knownMetadata.taxCode !== metadata.taxCode) {
				const error = "税收分类编码与同文件商品不一致";
				row.errors.push(error);
				errors.push({
					rowIndex: raw.rowIndex,
					field: "",
					reason: error
				});
			}
			const dbCheck = checkDatabaseConflict(row, nameNorm, modelNorm, unitPriceNormalized, isInitial);
			dbCheck.errors.forEach((e) => {
				row.errors.push(e);
				errors.push({
					rowIndex: raw.rowIndex,
					field: "",
					reason: e
				});
			});
			if (dbCheck.errors.length === 0 && row.errors.length === 0) {
				if (dbCheck.hasExistingNameModel || acceptedProductKeys.has(productKey)) newPriceVariantCount++;
				else newProductCount++;
				acceptedProductKeys.add(productKey);
				productMetadata.set(productKey, metadata);
				if (isInitial && row.initialStock != null) totalStockSum += row.initialStock;
			}
		}
		rows.push(row);
	}
	const errorCount = rows.filter((r) => r.errors.length > 0 && !r.deduped).length;
	return {
		rows,
		newProductCount,
		newPriceVariantCount,
		totalStockSum: isInitial ? totalStockSum : 0,
		errorCount,
		dedupedRowCount,
		hasErrors: errorCount > 0,
		errors,
		isInitial
	};
}
/** 检查与数据库已有商品的冲突 */
function checkDatabaseConflict(row, nameNorm, modelNorm, unitPriceNormalized, isInitial) {
	const errors = [];
	const existingProducts = getRawDb().prepare("SELECT id, unit, tax_classification_code, unit_price_decimal FROM products WHERE name_normalized = ? AND model_normalized = ?").all(nameNorm, modelNorm);
	if (existingProducts.length > 0) {
		const metadataProduct = existingProducts[0];
		if (metadataProduct.unit !== trimInvisible(row.unit)) errors.push(`单位与已有商品不一致（已有: ${metadataProduct.unit}）`);
		if (metadataProduct.tax_classification_code !== trimInvisible(row.taxClassificationCode)) errors.push("税收分类编码与已有商品不一致");
		if (existingProducts.some((product) => product.unit_price_decimal === unitPriceNormalized)) errors.push(isInitial ? "该商品和含税单价已存在" : "该商品和含税单价已存在，日常导入不允许重复");
	}
	return {
		errors,
		hasExistingNameModel: existingProducts.length > 0
	};
}
//#endregion
//#region src/main/domains/catalog/catalog-import-confirm.ts
/** 首次导入名称型号价格唯一的商品及其初始库存。 */
function confirmInitialImport(token) {
	if (getInitStatus().productInitialImportDone) throw new Error("商品首次导入已完成，不能重复执行");
	const preview = requirePreview(token);
	const batchId = (0, uuid.v7)();
	const result = getRawDb().transaction(() => {
		const imported = writeRows(preview.rows, true, batchId);
		markProductInitialImportDone();
		markDirty();
		return imported;
	})();
	deleteCachedPreview(token);
	return result;
}
/** 日常导入新增商品记录，不覆盖已有商品价格或库存。 */
function confirmDailyImport(token) {
	if (!getInitStatus().productInitialImportDone) throw new Error("商品首次导入尚未完成，不能执行日常导入");
	const result = writeRows(requirePreview(token).rows, false, (0, uuid.v7)());
	deleteCachedPreview(token);
	return result;
}
/** 校验并读取缓存预览。 */
function requirePreview(token) {
	const preview = getCachedPreview(token);
	if (!preview) throw new Error("预览已过期，请重新选择文件");
	if (preview.hasErrors) throw new Error("存在错误行，无法导入");
	return preview;
}
/** 在单个事务中写入商品导入行。 */
function writeRows(rows, isInitial, batchId) {
	let createdCount = 0;
	let newProductCount = 0;
	let newPriceVariantCount = 0;
	const validRows = rows.filter((row) => row.errors.length === 0 && !row.deduped);
	getRawDb().transaction(() => {
		for (const row of validRows) {
			const hasNameModel = hasProductGroup(row);
			const productId = insertProduct(row, isInitial ? row.initialStock ?? 0 : 0);
			createdCount++;
			if (hasNameModel) newPriceVariantCount++;
			else newProductCount++;
			if (isInitial && (row.initialStock ?? 0) !== 0) appendLedger({
				productId,
				changeQuantity: row.initialStock ?? 0,
				balanceBefore: 0,
				sourceType: "initialization",
				sourceId: batchId,
				reason: "首次导入初始库存"
			});
			recordAudit({
				action: isInitial ? "catalog.initial_import" : "catalog.daily_import",
				entityType: "product",
				entityId: productId,
				sourceBatchId: batchId,
				summary: `${isInitial ? "首次" : "日常"}导入: ${row.name} ${row.model} @ ${row.unitPriceDecimal}`
			});
		}
		markDirty();
	})();
	return {
		createdCount,
		newProductCount,
		newPriceVariantCount
	};
}
/** 判断名称和型号组合是否已有任一价格商品。 */
function hasProductGroup(row) {
	const existing = getRawDb().prepare("SELECT id FROM products WHERE name_normalized = ? AND model_normalized = ?").get(normalizeKey(row.name), normalizeKey(row.model));
	return Boolean(existing);
}
/** 新增导入商品。 */
function insertProduct(row, stockBalance) {
	const productId = (0, uuid.v7)();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	getDb().insert(products).values({
		id: productId,
		name: trimInvisible(row.name),
		nameNormalized: normalizeKey(row.name),
		model: trimInvisible(row.model),
		modelNormalized: normalizeKey(row.model),
		unit: trimInvisible(row.unit),
		taxClassificationCode: trimInvisible(row.taxClassificationCode),
		unitPriceDecimal: normalizeUnitPrice(row.unitPriceDecimal),
		taxRate: 13,
		stockBalance,
		dataStatus: "complete",
		status: "active",
		remark: row.remark ? trimInvisible(row.remark) : null,
		createdAt: now,
		updatedAt: now
	}).run();
	return productId;
}
//#endregion
//#region src/main/ipc/catalog-ipc.ts
/**
* 商品 IPC 处理器。
*/
function registerCatalogIpc() {
	registerHandler(IPC_CHANNELS.catalog.listProducts, productQuerySchema, (input) => {
		return listProducts(input);
	});
	registerHandler(IPC_CHANNELS.catalog.getProductById, null, (id) => {
		return getProductById(id);
	});
	registerHandler(IPC_CHANNELS.catalog.createProduct, productUpsertSchema, (input) => {
		return createProduct(input);
	});
	registerHandler(IPC_CHANNELS.catalog.updateProduct, productUpsertSchema, (input) => {
		return updateProduct(input);
	});
	registerHandler(IPC_CHANNELS.catalog.deleteProduct, null, (id) => {
		return deleteProduct(id);
	});
	registerHandler(IPC_CHANNELS.catalog.initialImportPreview, null, async (filePath) => {
		if (getInitStatus().productInitialImportDone) throw new Error("商品首次导入已完成，不能重复执行");
		const preview = buildInitialImportPreview((await parseCatalogExcel(filePath, true)).map((p) => ({
			rowIndex: p.rowIndex,
			name: p.name,
			model: p.model,
			unit: p.unit,
			taxClassificationCode: p.taxClassificationCode,
			unitPriceDecimal: p.unitPriceDecimal,
			initialStock: p.initialStock,
			remark: p.remark
		})));
		return {
			token: cacheCatalogPreview(preview),
			preview
		};
	});
	registerHandler(IPC_CHANNELS.catalog.initialImportConfirm, null, (token) => {
		return confirmInitialImport(token);
	});
	registerHandler(IPC_CHANNELS.catalog.dailyImportPreview, null, async (filePath) => {
		if (!getInitStatus().productInitialImportDone) throw new Error("商品首次导入尚未完成，不能执行日常导入");
		const preview = buildDailyImportPreview((await parseCatalogExcel(filePath, false)).map((p) => ({
			rowIndex: p.rowIndex,
			name: p.name,
			model: p.model,
			unit: p.unit,
			taxClassificationCode: p.taxClassificationCode,
			unitPriceDecimal: p.unitPriceDecimal,
			initialStock: null,
			remark: p.remark
		})));
		return {
			token: cacheCatalogPreview(preview),
			preview
		};
	});
	registerHandler(IPC_CHANNELS.catalog.dailyImportConfirm, null, (token) => {
		return confirmDailyImport(token);
	});
	registerHandler(IPC_CHANNELS.catalog.fieldHistory, fieldHistoryQuerySchema, (input) => {
		return queryFieldHistory(input.entityType, input.entityId, input.page, input.pageSize);
	});
	registerHandler(IPC_CHANNELS.catalog.stockSummary, stockSummarySchema, () => {
		return getStockSummary();
	});
	registerHandler("catalog.getProductsByIds", null, (ids) => {
		return getProductsByIds(ids);
	});
	registerHandler(IPC_CHANNELS.catalog.downloadTemplate, null, async (input, _sender) => {
		const result = await electron.dialog.showSaveDialog({
			title: input.isInitial ? "保存商品首次导入模板" : "保存商品日常导入模板",
			defaultPath: input.isInitial ? "商品首次导入模板.xlsx" : "商品日常导入模板.xlsx",
			filters: [{
				name: "Excel",
				extensions: ["xlsx"]
			}]
		});
		if (result.canceled || !result.filePath) return { saved: false };
		await generateCatalogTemplate(result.filePath, input.isInitial);
		return {
			saved: true,
			path: result.filePath
		};
	});
}
//#endregion
//#region src/main/domains/outbound/outbound-validate.ts
/** 重新读取商品当前状态和含税单价，校验开票草稿。 */
function validateDraft(input) {
	const result = {
		validLines: [],
		invalidProductIds: [],
		errors: []
	};
	const customer = getCustomerById(input.customerId);
	if (!customer) {
		result.errors.push("客户不存在");
		return result;
	}
	if (customer.status !== "active") {
		result.errors.push("客户已停用，不能开票");
		return result;
	}
	for (const line of input.lines) {
		const row = getRawDb().prepare(`
      SELECT id, name, model, unit, unit_price_decimal, tax_rate, stock_balance, data_status, status
      FROM products WHERE id = ?
    `).get(line.productId);
		if (!row) {
			result.invalidProductIds.push(line.productId);
			result.errors.push(`商品 ${line.productId} 不存在`);
			continue;
		}
		const error = validateProduct(row);
		if (error) {
			result.invalidProductIds.push(line.productId);
			result.errors.push(error);
			continue;
		}
		result.validLines.push({
			productId: row.id,
			name: row.name,
			model: row.model,
			unit: row.unit,
			unitPriceDecimal: row.unit_price_decimal,
			taxRate: row.tax_rate,
			stockBalance: row.stock_balance,
			quantity: line.quantity,
			amountCent: line.amountCent
		});
	}
	return result;
}
/** 校验商品是否可以开票。 */
function validateProduct(row) {
	if (row.status !== "active") return `商品「${row.name}」已停用`;
	if (row.data_status !== "complete") return `商品「${row.name}」资料不完整`;
	return null;
}
//#endregion
//#region src/main/excel/tax-template/template-validator.ts
/**
* 税务模板 XLSX 验证器。
* 验证生成文件的结构完整性：可解压、工作表存在、版本信息保留。
*/
var DETAIL_SHEET_NAME$1 = "1-明细模板";
/**
* 验证生成的 XLSX 结构完整性。
*/
async function validateTaxTemplateXlsx(buf, expectedLineCount) {
	const zip = await jszip.default.loadAsync(buf);
	if (!zip.file("xl/workbook.xml")) throw new Error("生成的 XLSX 缺少 workbook.xml");
	const workbookXml = await zip.file("xl/workbook.xml").async("string");
	const sheetNames = [...workbookXml.matchAll(/<sheet[^>]*name="([^"]+)"/g)].map((m) => m[1]);
	if (sheetNames.length < 4) electron_log_main.default.warn(`[tax-template] 工作表数量异常: ${sheetNames.length}`);
	if (!sheetNames.includes(DETAIL_SHEET_NAME$1)) throw new Error(`生成的 XLSX 缺少工作表「${DETAIL_SHEET_NAME$1}」`);
	if (!/excelVersion|version/i.test(workbookXml)) electron_log_main.default.warn("[tax-template] 未在 workbook.xml 中检测到版本信息（可能在其他部件中）");
	electron_log_main.default.info(`[tax-template] 验证通过，明细行数: ${expectedLineCount}`);
}
//#endregion
//#region src/main/excel/tax-template/template-writer.ts
/**
* 税务模板 OOXML 定点修改器。
* 基准文件为「发票开具项目信息导入模板.xlsx」，数据工作表为「1-明细模板」。
* 采用 ZIP/OOXML 定点修改，仅修改明细工作表 XML 的第 4 行及以后数据，
* 其他 XML、关系、样式、隐藏工作表和版本单元保持字节级不变。
*/
var TEMPLATE_FILE_NAME = "发票开具项目信息导入模板.xlsx";
var DETAIL_SHEET_NAME = "1-明细模板";
var DATA_START_ROW = 4;
var DATA_STYLE_INDEX = 1;
/** 查找模板文件路径 */
function findTemplatePath() {
	const candidates = [(0, node_path.resolve)(process.cwd(), "resources/templates", TEMPLATE_FILE_NAME), (0, node_path.resolve)(electron.app.getAppPath(), "..", "resources", "templates", TEMPLATE_FILE_NAME)];
	if (process.resourcesPath) candidates.push((0, node_path.resolve)(process.resourcesPath, "templates", TEMPLATE_FILE_NAME));
	for (const p of candidates) try {
		(0, node_fs.readFileSync)(p);
		return p;
	} catch {}
	return candidates[candidates.length - 1];
}
/**
* 将 Excel 列号转换为字母（1 -> A, 27 -> AA）
*/
function colToLetter(col) {
	let result = "";
	while (col > 0) {
		const mod = (col - 1) % 26;
		result = String.fromCharCode(65 + mod) + result;
		col = Math.floor((col - 1) / 26);
	}
	return result;
}
/**
* 构造一个 OOXML 行的 XML 字符串。
* 列顺序：A 项目名称、B 商品和服务税收分类编码、C 规格型号、D 单位、
*         E 商品数量、F 商品单价、G 金额、H 税率。
* 全部以 inlineStr 文本写入并套用 DATA_STYLE_INDEX（文本格式）样式，
* 与模板第 4 行示例数据一致，避免 19 位税收分类编码以数值存储时丢失精度。
*/
function buildRowXml(rowIndex, line) {
	const r = String(rowIndex);
	const cells = [];
	const values = [
		line.name,
		line.taxClassificationCode,
		line.model,
		line.unit,
		String(line.quantity),
		line.unitPriceDecimal,
		line.amountYuan,
		line.taxRate
	];
	for (let col = 0; col < values.length; col++) {
		const cellRef = `${colToLetter(col + 1)}${rowIndex}`;
		const val = values[col];
		cells.push(`<c r="${cellRef}" t="inlineStr" s="${DATA_STYLE_INDEX}"><is><t xml:space="preserve">${escapeXml(val)}</t></is></c>`);
	}
	return `<row r="${r}">${cells.join("")}</row>`;
}
/**
* 定点修改税务模板，生成包含明细数据的 XLSX Buffer。
* 仅修改「1-明细模板」工作表的第 4 行及以后，其他部件保持不变。
*/
async function generateTaxTemplateXlsx(lines) {
	if (lines.length > 2e3) throw new Error("明细行数超过 2000 行上限");
	const templateBuf = (0, node_fs.readFileSync)(findTemplatePath());
	const zip = await jszip.default.loadAsync(templateBuf);
	const sheetMatch = (await zip.file("xl/workbook.xml").async("string")).match(new RegExp(`<sheet[^>]*name="${DETAIL_SHEET_NAME.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}"[^>]*r:id="([^"]+)"`));
	if (!sheetMatch) throw new Error(`模板中未找到工作表「${DETAIL_SHEET_NAME}」`);
	const sheetRId = sheetMatch[1];
	const relMatch = (await zip.file("xl/_rels/workbook.xml.rels").async("string")).match(new RegExp(`Id="${sheetRId}"[^>]*Target="([^"]+)"`));
	if (!relMatch) throw new Error("未找到工作表关系目标");
	const sheetPath = relMatch[1].startsWith("/") ? relMatch[1].slice(1) : `xl/${relMatch[1]}`;
	const sheetXml = await zip.file(sheetPath).async("string");
	const newRows = [];
	for (let i = 0; i < lines.length; i++) newRows.push(buildRowXml(DATA_START_ROW + i, lines[i]));
	const newRowsXml = newRows.join("");
	const sheetDataMatch = sheetXml.match(/<sheetData[^>]*>([\s\S]*?)<\/sheetData>/);
	if (!sheetDataMatch) throw new Error("工作表 XML 中未找到 sheetData");
	const newSheetData = `<sheetData>${(sheetDataMatch[1].match(/<row[^>]*>[\s\S]*?<\/row>/g) || []).slice(0, DATA_START_ROW - 1).join("")}${newRowsXml}</sheetData>`;
	let newSheetXml = sheetXml.replace(/<sheetData[^>]*>[\s\S]*?<\/sheetData>/, newSheetData);
	const endRow = DATA_START_ROW + lines.length - 1;
	newSheetXml = newSheetXml.replace(/<dimension[^>]*ref="([A-Z]+\d+):([A-Z]+)\d+"/, (_match, start, col) => `<dimension ref="${start}:${col}${endRow}"`);
	zip.file(sheetPath, newSheetXml);
	return await zip.generateAsync({
		type: "nodebuffer",
		compression: "DEFLATE",
		compressionOptions: { level: 6 }
	});
}
/** 将 XLSX Buffer 转为 Base64 字符串存储 */
function xlsxToBase64(buf) {
	return buf.toString("base64");
}
/** 计算 Buffer 的 SHA-256 */
function computeSha256(buf) {
	return (0, node_crypto.createHash)("sha256").update(buf).digest("hex");
}
//#endregion
//#region src/main/domains/outbound/outbound-export.ts
/**
* 销项导出事务。
* 生成 XLSX -> 验证结构 -> 单事务写入批次、明细、库存流水、余额和审计。
*/
/** 执行销项导出事务 */
async function executeOutboundExport(input) {
	const draft = validateDraft(input);
	if (draft.errors.length > 0) throw new Error(draft.errors.join("; "));
	if (draft.validLines.length === 0) throw new Error("没有有效的开票行");
	const customer = getCustomerById(input.customerId);
	const sortedLines = [...draft.validLines].sort((a, b) => a.productId.localeCompare(b.productId));
	const amountFactor = input.amountFactor ?? "1.09";
	const xlsxBuffer = await generateTaxTemplateXlsx(buildTaxLines(sortedLines, amountFactor));
	await validateTaxTemplateXlsx(xlsxBuffer, sortedLines.length);
	const xlsxSha256 = computeSha256(xlsxBuffer);
	const xlsxBase64 = xlsxToBase64(xlsxBuffer);
	const totals = calculateTotals$1(sortedLines, amountFactor);
	const batchId = (0, uuid.v7)();
	const batchNo = generateBatchNo("OUT");
	const exportedAt = (/* @__PURE__ */ new Date()).toISOString();
	const customerSnapshot = JSON.stringify(buildCustomerSnapshot(customer));
	const db = getDb();
	const raw = getRawDb();
	raw.transaction(() => {
		db.insert(outboundBatches).values({
			id: batchId,
			batchNo,
			customerId: customer.id,
			customerSnapshot,
			exportedAt,
			status: "valid",
			xlsxBlob: xlsxBase64,
			xlsxSha256,
			lineCount: sortedLines.length,
			...totals
		}).run();
		for (const line of sortedLines) processOutboundLine(db, raw, batchId, batchNo, exportedAt, line, amountFactor);
		recordAudit({
			action: "outbound.export",
			entityType: "outbound_batch",
			entityId: batchId,
			sourceBatchId: batchId,
			summary: `销项开票 ${batchNo}，客户: ${customer.name}，明细 ${sortedLines.length} 行`
		});
		markDirty();
	})();
	return {
		batchId,
		batchNo,
		customerName: customer.name,
		xlsxBuffer,
		exportedAt,
		...totals
	};
}
/** 构造税务模板行 */
function buildTaxLines(lines, factor) {
	return lines.map((l) => {
		const amountCent = resolveLineAmountCent(l, factor);
		const product = getProductById(l.productId);
		return {
			name: escapeFormulaInjection(trimInvisible(l.name)),
			taxClassificationCode: product.taxClassificationCode,
			model: escapeFormulaInjection(trimInvisible(l.model)),
			unit: escapeFormulaInjection(trimInvisible(l.unit)),
			quantity: l.quantity,
			unitPriceDecimal: l.amountCent ? amountCentToUnitPrice(amountCent, l.quantity) : scaleUnitPrice(normalizeUnitPrice(l.unitPriceDecimal), factor),
			amountYuan: centToYuan(amountCent),
			taxRate: TAX_RATE_DECIMAL
		};
	});
}
/** 计算汇总金额（PRD §7.5：税额=金额×13%，价税合计=金额+税额） */
function calculateTotals$1(lines, factor) {
	let totalQuantity = 0, totalAmountCent = 0, totalTaxCent = 0;
	for (const line of lines) {
		totalQuantity += line.quantity;
		const amountCent = resolveLineAmountCent(line, factor);
		totalAmountCent += amountCent;
		totalTaxCent += calcTaxCent(amountCent);
	}
	return {
		totalQuantity,
		totalAmountCent,
		totalTaxCent,
		totalCent: calcTotalCent(totalAmountCent, totalTaxCent)
	};
}
/** 处理单行：扣减库存、写明细、写流水 */
function processOutboundLine(db, raw, batchId, batchNo, exportedAt, line, factor) {
	const productRow = raw.prepare("SELECT stock_balance FROM products WHERE id = ?").get(line.productId);
	if (!productRow) throw new Error(`商品 ${line.productId} 不存在`);
	const stockBefore = productRow.stock_balance;
	const stockAfter = stockBefore - line.quantity;
	const amountCent = resolveLineAmountCent(line, factor);
	const product = getProductById(line.productId);
	db.insert(outboundLines).values({
		id: (0, uuid.v7)(),
		batchId,
		productId: line.productId,
		name: product.name,
		taxClassificationCode: product.taxClassificationCode,
		model: product.model,
		unit: product.unit,
		unitPriceDecimal: normalizeUnitPrice(line.unitPriceDecimal),
		taxRate: 13,
		quantity: line.quantity,
		amountCent,
		taxCent: calcTaxCent(amountCent),
		totalCent: calcTotalCent(amountCent, calcTaxCent(amountCent)),
		stockBefore,
		stockAfter
	}).run();
	appendLedger({
		productId: line.productId,
		changeQuantity: -line.quantity,
		balanceBefore: stockBefore,
		sourceType: "outbound",
		sourceId: batchId,
		reason: `销项开票 ${batchNo}`
	});
	db.update(products).set({
		stockBalance: stockAfter,
		updatedAt: exportedAt
	}).where((0, drizzle_orm.eq)(products.id, line.productId)).run();
}
/** 优先使用用户编辑后的最终金额，否则按统一系数计算。 */
function resolveLineAmountCent(line, factor) {
	return line.amountCent ?? calcOutboundAmountCent(line.quantity, line.unitPriceDecimal, factor);
}
/** 构建客户快照 */
function buildCustomerSnapshot(customer) {
	return {
		name: customer.name,
		taxId: customer.taxId,
		address: customer.address,
		phone: customer.phone,
		bankName: customer.bankName,
		bankAccount: customer.bankAccount
	};
}
//#endregion
//#region src/main/domains/outbound/outbound-query.ts
/**
* 销项开票查询服务。
* 分页列表、详情和原始 XLSX 下载。
*/
/** 将数据库行映射为业务实体 */
function mapOutboundBatch(row) {
	return {
		id: row.id,
		batchNo: row.batchNo,
		customerId: row.customerId,
		customerSnapshot: JSON.parse(row.customerSnapshot),
		exportedAt: row.exportedAt,
		status: row.status,
		voidReason: row.voidReason,
		voidedAt: row.voidedAt,
		totalQuantity: row.totalQuantity,
		totalAmountCent: row.totalAmountCent,
		totalTaxCent: row.totalTaxCent,
		totalCent: row.totalCent,
		lineCount: row.lineCount
	};
}
/** 将明细行映射为业务实体 */
function mapOutboundLine(row) {
	return {
		id: row.id,
		batchId: row.batchId,
		productId: row.productId,
		name: row.name,
		taxClassificationCode: row.taxClassificationCode,
		model: row.model,
		unit: row.unit,
		unitPriceDecimal: row.unitPriceDecimal,
		taxRate: row.taxRate,
		quantity: row.quantity,
		amountCent: row.amountCent,
		taxCent: row.taxCent,
		totalCent: row.totalCent,
		stockBefore: row.stockBefore,
		stockAfter: row.stockAfter
	};
}
/** 分页查询开票记录 */
function listOutboundBatches(input) {
	const raw = getRawDb();
	const { conditions, params } = buildQueryConditions(input);
	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
	const countRow = raw.prepare(`SELECT COUNT(*) as cnt FROM outbound_batches ${whereClause}`).get(...params);
	const offset = (input.page - 1) * input.pageSize;
	return {
		rows: toCamelList(raw.prepare(`SELECT * FROM outbound_batches ${whereClause} ORDER BY exported_at DESC, id DESC LIMIT ? OFFSET ?`).all(...params, input.pageSize, offset)).map(mapOutboundBatch),
		total: countRow.cnt,
		page: input.page,
		pageSize: input.pageSize
	};
}
/**
* 本月有效票税额合计（分）。
* 算法：对每张 status='valid' 且 exported_at 在本月内的开票记录，
* 取金额（totalAmountCent）× 0.13（calcTaxCent），逐张求和。
*/
function getMonthlyTaxCent() {
	const raw = getRawDb();
	const now = /* @__PURE__ */ new Date();
	const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).toISOString();
	const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
	return raw.prepare(`SELECT total_amount_cent FROM outbound_batches WHERE status = 'valid' AND exported_at >= ? AND exported_at <= ?`).all(start, end).reduce((sum, r) => sum + calcTaxCent(r.total_amount_cent), 0);
}
/** 构建查询条件 */
function buildQueryConditions(input) {
	const conditions = [];
	const params = [];
	if (input.batchNo?.trim()) {
		conditions.push("batch_no LIKE ?");
		params.push(`%${input.batchNo.trim()}%`);
	}
	if (input.customerName?.trim()) {
		conditions.push("customer_snapshot LIKE ?");
		params.push(`%${input.customerName.trim()}%`);
	}
	if (input.status && input.status !== "all") {
		conditions.push("status = ?");
		params.push(input.status);
	}
	if (input.dateFrom) {
		conditions.push("exported_at >= ?");
		params.push(input.dateFrom);
	}
	if (input.dateTo) {
		conditions.push("exported_at <= ?");
		params.push(input.dateTo);
	}
	if (input.productKeyword?.trim()) {
		const kw = `%${input.productKeyword.trim()}%`;
		conditions.push("id IN (SELECT DISTINCT batch_id FROM outbound_lines WHERE name LIKE ? OR model LIKE ?)");
		params.push(kw, kw);
	}
	return {
		conditions,
		params
	};
}
/** 获取开票批次详情（含明细） */
function getOutboundDetail(id) {
	const raw = getRawDb();
	const batchRow = toCamel(raw.prepare("SELECT * FROM outbound_batches WHERE id = ?").get(id));
	if (!batchRow) return null;
	const lineRows = toCamelList(raw.prepare("SELECT * FROM outbound_lines WHERE batch_id = ? ORDER BY id").all(id));
	return {
		batch: mapOutboundBatch(batchRow),
		lines: lineRows.map(mapOutboundLine)
	};
}
/** 获取原始 XLSX Buffer（用于重新下载） */
function getOutboundXlsx(id) {
	const row = getRawDb().prepare("SELECT xlsx_blob, batch_no, customer_snapshot FROM outbound_batches WHERE id = ?").get(id);
	if (!row) return null;
	let customerName = "";
	try {
		customerName = JSON.parse(row.customer_snapshot).name ?? "";
	} catch {}
	return {
		buffer: Buffer.from(row.xlsx_blob, "base64"),
		batchNo: row.batch_no,
		customerName
	};
}
//#endregion
//#region src/main/domains/outbound/outbound-void.ts
/**
* 销项作废服务。
* 单事务标记作废 + 逐行恢复库存。
*/
/** 作废开票批次：单事务恢复库存，幂等 */
function voidOutboundBatch(id, reason) {
	const raw = getRawDb();
	const db = getDb();
	const batchRow = toCamel(raw.prepare("SELECT * FROM outbound_batches WHERE id = ?").get(id));
	if (!batchRow) throw new Error("开票批次不存在");
	if (batchRow.status === "voided") return mapOutboundBatch(batchRow);
	raw.transaction(() => {
		db.update(outboundBatches).set({
			status: "voided",
			voidReason: reason,
			voidedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).where((0, drizzle_orm.eq)(outboundBatches.id, id)).run();
		const lineRows = toCamelList(raw.prepare("SELECT * FROM outbound_lines WHERE batch_id = ?").all(id));
		for (const line of lineRows) restoreOutboundLine(db, raw, id, batchRow.batchNo, reason, line);
		recordAudit({
			action: "outbound.void",
			entityType: "outbound_batch",
			entityId: id,
			sourceBatchId: id,
			summary: `作废开票批次 ${batchRow.batchNo}，原因: ${reason}`
		});
		markDirty();
	})();
	return mapOutboundBatch(toCamel(raw.prepare("SELECT * FROM outbound_batches WHERE id = ?").get(id)));
}
/** 恢复单行库存：写入正向流水并更新余额 */
function restoreOutboundLine(db, raw, batchId, batchNo, reason, line) {
	const productRow = raw.prepare("SELECT stock_balance FROM products WHERE id = ?").get(line.productId);
	if (!productRow) throw new Error(`商品 ${line.productId} 不存在`);
	const balanceBefore = productRow.stock_balance;
	const balanceAfter = balanceBefore + line.quantity;
	appendLedger({
		productId: line.productId,
		changeQuantity: line.quantity,
		balanceBefore,
		sourceType: "outbound_void",
		sourceId: batchId,
		reason: `销项作废 ${batchNo}: ${reason}`
	});
	db.update(products).set({
		stockBalance: balanceAfter,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}).where((0, drizzle_orm.eq)(products.id, line.productId)).run();
}
//#endregion
//#region src/main/ipc/outbound-ipc.ts
/**
* 销项开票 IPC 处理器 - 导出、列表、详情、下载、作废。
*/
/** 清理文件名中的非法字符 */
function sanitizeFileName(name) {
	return name.replace(/[\\/:*?"<>|]/g, "").trim() || "未命名";
}
function registerOutboundIpc() {
	registerHandler(IPC_CHANNELS.outbound.validateDraft, outboundExportSchema, (input) => {
		return validateDraft(input);
	});
	registerHandler(IPC_CHANNELS.outbound.export, outboundExportSchema, async (input, _sender) => {
		const result = await executeOutboundExport(input);
		const saveResult = await electron.dialog.showSaveDialog({
			title: "保存税务模板",
			defaultPath: `销项开票_${sanitizeFileName(result.customerName)}_${result.batchNo}.xlsx`,
			filters: [{
				name: "Excel",
				extensions: ["xlsx"]
			}]
		});
		if (saveResult.canceled || !saveResult.filePath) {
			voidOutboundBatch(result.batchId, "导出时用户取消保存");
			return {
				saved: false,
				batchId: result.batchId,
				batchNo: result.batchNo
			};
		}
		const tempPath = saveResult.filePath + ".tmp";
		try {
			await (0, node_fs_promises.writeFile)(tempPath, result.xlsxBuffer);
			await (0, node_fs_promises.rename)(tempPath, saveResult.filePath);
			return {
				saved: true,
				batchId: result.batchId,
				batchNo: result.batchNo,
				path: saveResult.filePath,
				totalQuantity: result.totalQuantity,
				totalAmountCent: result.totalAmountCent,
				totalTaxCent: result.totalTaxCent,
				totalCent: result.totalCent
			};
		} catch (err) {
			electron_log_main.default.error("[outbound] 文件保存失败:", err);
			try {
				await (0, node_fs_promises.unlink)(tempPath);
			} catch {}
			voidOutboundBatch(result.batchId, "文件保存失败，自动回滚");
			throw new Error(`文件保存失败: ${err.message}`);
		}
	});
	registerHandler(IPC_CHANNELS.outbound.list, outboundQuerySchema, (input) => {
		return listOutboundBatches(input);
	});
	registerHandler(IPC_CHANNELS.outbound.getDetail, null, (id) => {
		return getOutboundDetail(id);
	});
	registerHandler(IPC_CHANNELS.outbound.download, null, async (id, _sender) => {
		const xlsxData = getOutboundXlsx(id);
		if (!xlsxData) throw new Error("开票记录不存在");
		const saveResult = await electron.dialog.showSaveDialog({
			title: "重新下载开票文件",
			defaultPath: `销项开票_${sanitizeFileName(xlsxData.customerName)}_${xlsxData.batchNo}.xlsx`,
			filters: [{
				name: "Excel",
				extensions: ["xlsx"]
			}]
		});
		if (saveResult.canceled || !saveResult.filePath) return { saved: false };
		await (0, node_fs_promises.writeFile)(saveResult.filePath, xlsxData.buffer);
		return {
			saved: true,
			path: saveResult.filePath
		};
	});
	registerHandler(IPC_CHANNELS.outbound.void, voidRequestSchema, (input) => {
		return voidOutboundBatch(input.id, input.reason);
	});
	registerHandler(IPC_CHANNELS.outbound.monthlyTax, null, () => {
		return { taxCent: getMonthlyTaxCent() };
	});
}
//#endregion
//#region src/main/domains/inventory/replenishment-preview.ts
/**
* 月底负库存预览服务。
* 查询所有 stock_balance < 0 的启用商品，不写入数据库，不生成文件。
*/
/** 预览月底负库存导出 */
function previewReplenishment() {
	return {
		lines: getRawDb().prepare(`
    SELECT id as product_id, name, model, unit, unit_price_decimal, stock_balance
    FROM products
    WHERE stock_balance < 0 AND status = 'active'
    ORDER BY name, model
  `).all().map((r) => {
			const replenishmentQuantity = Math.abs(r.stock_balance);
			const amountCent = calcAmountCent(replenishmentQuantity, r.unit_price_decimal);
			const taxCent = calcTaxCent(amountCent);
			const totalCent = calcTotalCent(amountCent, taxCent);
			return {
				productId: r.product_id,
				name: r.name,
				model: r.model,
				unit: r.unit,
				unitPriceDecimal: r.unit_price_decimal,
				stockBalanceSnapshot: r.stock_balance,
				replenishmentQuantity,
				amountCent,
				taxCent,
				totalCent
			};
		}),
		snapshotAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region src/main/domains/inventory/replenishment-excel.ts
xlsx.set_fs(node_fs);
/**
* 月底负库存导出 Excel 生成（基于 SheetJS 社区版）。
*
* 注意：SheetJS 社区版不支持写入单元格样式（加粗、填充等），
* 因此表头与总计行的加粗样式会丢失，仅保留数据与列宽。
*/
/** 生成月底负库存导出 Excel Buffer */
async function generateReplenishmentExcel(lines) {
	const headers = [
		"项目名称",
		"型号",
		"单位",
		"待补数量",
		"含税单价",
		"不含税金额",
		"税率",
		"税额",
		"价税合计"
	];
	const widths = [
		30,
		20,
		10,
		12,
		15,
		15,
		8,
		15,
		15
	];
	const aoa = [headers];
	const totals = {
		qty: 0,
		amount: 0,
		tax: 0,
		total: 0
	};
	for (const line of lines) {
		aoa.push([
			escapeFormulaInjection(line.name),
			escapeFormulaInjection(line.model),
			escapeFormulaInjection(line.unit),
			line.replenishmentQuantity,
			line.unitPriceDecimal,
			centToYuan(line.amountCent),
			TAX_RATE_DECIMAL,
			centToYuan(line.taxCent),
			centToYuan(line.totalCent)
		]);
		totals.qty += line.replenishmentQuantity;
		totals.amount += line.amountCent;
		totals.tax += line.taxCent;
		totals.total += line.totalCent;
	}
	aoa.push([
		"总计",
		null,
		null,
		totals.qty,
		null,
		centToYuan(totals.amount),
		null,
		centToYuan(totals.tax),
		centToYuan(totals.total)
	]);
	const ws = xlsx.utils.aoa_to_sheet(aoa);
	ws["!cols"] = widths.map((w) => ({ wch: w }));
	const wb = xlsx.utils.book_new();
	xlsx.utils.book_append_sheet(wb, ws, "月底负库存导出");
	const buf = xlsx.write(wb, {
		type: "buffer",
		bookType: "xlsx"
	});
	return Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
}
//#endregion
//#region src/main/domains/inventory/replenishment-export.ts
/**
* 月底负库存导出事务。
* 生成 Excel 并保存快照和记录，导出本身不改变库存。
*/
/** 执行月底导出：生成 Excel 并保存快照和记录 */
async function executeReplenishmentExport() {
	const { lines, snapshotAt } = previewReplenishment();
	if (lines.length === 0) {
		electron_log_main.default.info("[replenishment] 当前无需向总部补票");
		return null;
	}
	const xlsxBuffer = await generateReplenishmentExcel(lines);
	const xlsxSha256 = computeSha256(xlsxBuffer);
	const xlsxBase64 = xlsxToBase64(xlsxBuffer);
	const exportId = (0, uuid.v7)();
	const exportNo = generateBatchNo("REP");
	const exportedAt = (/* @__PURE__ */ new Date()).toISOString();
	const totals = calculateTotals(lines);
	const db = getDb();
	getRawDb().transaction(() => {
		db.insert(replenishmentExports).values({
			id: exportId,
			exportNo,
			exportedAt,
			negativeStockSnapshotAt: snapshotAt,
			xlsxBlob: xlsxBase64,
			xlsxSha256,
			lineCount: lines.length,
			...totals
		}).run();
		for (const line of lines) insertExportLine(db, exportId, line);
		recordAudit({
			action: "replenishment.export",
			entityType: "replenishment_export",
			entityId: exportId,
			sourceBatchId: exportId,
			summary: `月底负库存导出 ${exportNo}，共 ${lines.length} 行`
		});
		markDirty();
	})();
	return {
		exportId,
		exportNo,
		xlsxBuffer,
		lineCount: lines.length
	};
}
/** 计算汇总金额 */
function calculateTotals(lines) {
	let totalQuantity = 0, totalAmountCent = 0, totalTaxCent = 0, totalCent = 0;
	for (const line of lines) {
		totalQuantity += line.replenishmentQuantity;
		totalAmountCent += line.amountCent;
		totalTaxCent += line.taxCent;
		totalCent += line.totalCent;
	}
	return {
		totalQuantity,
		totalAmountCent,
		totalTaxCent,
		totalCent
	};
}
/** 插入导出明细行 */
function insertExportLine(db, exportId, line) {
	db.insert(replenishmentExportLines).values({
		id: (0, uuid.v7)(),
		exportId,
		productId: line.productId,
		name: line.name,
		model: line.model,
		unit: line.unit,
		unitPriceDecimal: line.unitPriceDecimal,
		stockBalanceSnapshot: line.stockBalanceSnapshot,
		replenishmentQuantity: line.replenishmentQuantity,
		amountCent: line.amountCent,
		taxCent: line.taxCent,
		totalCent: line.totalCent
	}).run();
}
//#endregion
//#region src/main/domains/inventory/replenishment-query.ts
/**
* 月底负库存导出查询服务。
* 分页列表、详情和原始 XLSX 下载。
*/
/** 将导出记录映射为业务实体 */
function mapExport(row) {
	return {
		id: row.id,
		exportNo: row.exportNo,
		exportedAt: row.exportedAt,
		negativeStockSnapshotAt: row.negativeStockSnapshotAt,
		totalQuantity: row.totalQuantity,
		totalAmountCent: row.totalAmountCent,
		totalTaxCent: row.totalTaxCent,
		totalCent: row.totalCent,
		lineCount: row.lineCount
	};
}
/** 将明细行映射为业务实体 */
function mapExportLine(row) {
	return {
		id: row.id,
		exportId: row.exportId,
		productId: row.productId,
		name: row.name,
		model: row.model,
		unit: row.unit,
		unitPriceDecimal: row.unitPriceDecimal,
		stockBalanceSnapshot: row.stockBalanceSnapshot,
		replenishmentQuantity: row.replenishmentQuantity,
		amountCent: row.amountCent,
		taxCent: row.taxCent,
		totalCent: row.totalCent
	};
}
/** 分页查询月底导出历史 */
function listReplenishmentExports(page, pageSize) {
	const raw = getRawDb();
	const countRow = raw.prepare("SELECT COUNT(*) as cnt FROM replenishment_exports").get();
	const offset = (page - 1) * pageSize;
	return {
		rows: toCamelList(raw.prepare("SELECT * FROM replenishment_exports ORDER BY exported_at DESC, id DESC LIMIT ? OFFSET ?").all(pageSize, offset)).map(mapExport),
		total: countRow.cnt,
		page,
		pageSize
	};
}
/** 获取月底导出详情 */
function getReplenishmentDetail(id) {
	const raw = getRawDb();
	const exportRow = toCamel(raw.prepare("SELECT * FROM replenishment_exports WHERE id = ?").get(id));
	if (!exportRow) return null;
	const lineRows = toCamelList(raw.prepare("SELECT * FROM replenishment_export_lines WHERE export_id = ? ORDER BY id").all(id));
	return {
		exportRecord: mapExport(exportRow),
		lines: lineRows.map(mapExportLine)
	};
}
/** 获取月底导出原始 XLSX */
function getReplenishmentXlsx(id) {
	const row = getRawDb().prepare("SELECT xlsx_blob, export_no FROM replenishment_exports WHERE id = ?").get(id);
	if (!row) return null;
	return {
		buffer: Buffer.from(row.xlsx_blob, "base64"),
		exportNo: row.export_no
	};
}
//#endregion
//#region src/main/ipc/replenishment-ipc.ts
/**
* 月底负库存导出 IPC 处理器。
*/
function registerReplenishmentIpc() {
	registerHandler(IPC_CHANNELS.replenishment.preview, null, () => {
		return previewReplenishment();
	});
	registerHandler(IPC_CHANNELS.replenishment.export, null, async (_input, _sender) => {
		const result = await executeReplenishmentExport();
		if (!result) return {
			exported: false,
			reason: "当前无需向总部补票"
		};
		const saveResult = await electron.dialog.showSaveDialog({
			title: "保存月底负库存导出",
			defaultPath: `月底负库存导出_${result.exportNo}.xlsx`,
			filters: [{
				name: "Excel",
				extensions: ["xlsx"]
			}]
		});
		if (saveResult.canceled || !saveResult.filePath) return {
			exported: true,
			saved: false,
			exportId: result.exportId,
			exportNo: result.exportNo
		};
		await (0, node_fs_promises.writeFile)(saveResult.filePath, result.xlsxBuffer);
		return {
			exported: true,
			saved: true,
			exportId: result.exportId,
			exportNo: result.exportNo,
			path: saveResult.filePath,
			lineCount: result.lineCount
		};
	});
	registerHandler(IPC_CHANNELS.replenishment.list, pageRequestSchema, (input) => {
		return listReplenishmentExports(input.page, input.pageSize);
	});
	registerHandler(IPC_CHANNELS.replenishment.getDetail, null, (id) => {
		return getReplenishmentDetail(id);
	});
	registerHandler(IPC_CHANNELS.replenishment.download, null, async (id, _sender) => {
		const xlsxData = getReplenishmentXlsx(id);
		if (!xlsxData) throw new Error("导出记录不存在");
		const saveResult = await electron.dialog.showSaveDialog({
			title: "重新下载月底导出文件",
			defaultPath: `月底负库存导出_${xlsxData.exportNo}.xlsx`,
			filters: [{
				name: "Excel",
				extensions: ["xlsx"]
			}]
		});
		if (saveResult.canceled || !saveResult.filePath) return { saved: false };
		await (0, node_fs_promises.writeFile)(saveResult.filePath, xlsxData.buffer);
		return {
			saved: true,
			path: saveResult.filePath
		};
	});
}
//#endregion
//#region src/main/domains/inbound/inbound-preview.ts
/**
* 进项导入预览服务。
* 解析、哈希计算、行聚合、已有商品匹配和全量校验。
*/
/** 计算文件 SHA-256 */
function computeFileSha256(filePath) {
	const buf = (0, node_fs.readFileSync)(filePath);
	return (0, node_crypto.createHash)("sha256").update(buf).digest("hex");
}
/** 计算标准化内容哈希（基于业务键） */
function computeContentSha256(lines) {
	const content = lines.map((l) => `${normalizeKey(l.name)}|${normalizeKey(l.model)}|${normalizeKey(l.unit)}|${l.unitPriceDecimal}|${l.quantity}`).sort().join("\n");
	return (0, node_crypto.createHash)("sha256").update(content).digest("hex");
}
/** 安全规范化单价（出错返回原值） */
function normalizeUnitPriceSafe(input) {
	try {
		return normalizeUnitPrice(input);
	} catch {
		return trimInvisible(input);
	}
}
/** 校验非库存费用行：型号、单位和数量均为空 */
function isNonInventoryExpenseRow(model, unit, quantity) {
	return !model && !unit && (quantity == null || quantity === 0);
}
/** 校验单行必填字段，返回错误列表 */
function validateRowFields(name, model, unit, price, quantity) {
	const errors = [];
	if (!name) errors.push("品名必填");
	if (!model) errors.push("型号必填");
	if (!unit) errors.push("单位必填");
	if (!price) errors.push("单价必填");
	if (quantity == null) errors.push("数量必填");
	else if (!Number.isInteger(quantity) || quantity <= 0) errors.push("数量必须为正整数");
	return errors;
}
/** 聚合相同业务键的行 */
function aggregateRows(rawRows) {
	const aggregatedMap = /* @__PURE__ */ new Map();
	for (const raw of rawRows) {
		const name = trimInvisible(raw.name);
		const model = trimInvisible(raw.model);
		const unit = trimInvisible(raw.unit);
		const price = raw.unitPriceDecimal ? normalizeUnitPriceSafe(raw.unitPriceDecimal) : "";
		const key = `${normalizeKey(name)}|${normalizeKey(model)}|${normalizeKey(unit)}|${price}`;
		if (aggregatedMap.has(key)) {
			const entry = aggregatedMap.get(key);
			entry.totalQuantity += raw.quantity;
			entry.rows.push(raw);
		} else aggregatedMap.set(key, {
			firstRow: raw,
			totalQuantity: raw.quantity,
			rows: [raw]
		});
	}
	return aggregatedMap;
}
/** 按名称、型号和规范化含税单价精确匹配已有商品。 */
function matchExistingProduct(name, model, unit, price, quantity) {
	const raw = getRawDb();
	const nameNorm = normalizeKey(name);
	const modelNorm = normalizeKey(model);
	const result = {
		isNewProduct: false,
		productId: null,
		matched: false,
		errors: [],
		newProductCount: 0
	};
	const existingProduct = raw.prepare(`
    SELECT id, unit, unit_price_decimal, stock_balance FROM products
    WHERE name_normalized = ? AND model_normalized = ? AND unit_price_decimal = ?
  `).get(nameNorm, modelNorm, price);
	if (existingProduct) {
		result.productId = existingProduct.id;
		if (existingProduct.unit !== unit) result.errors.push(`单位不一致（已有: ${existingProduct.unit}，导入: ${unit}）`);
		result.matched = true;
		if (existingProduct.stock_balance < 0 && quantity > Math.abs(existingProduct.stock_balance)) result.errors.push(`当前库存 ${existingProduct.stock_balance}，导入数量 ${quantity} 超过待补数量 ${Math.abs(existingProduct.stock_balance)}`);
	} else if (raw.prepare(`
      SELECT id FROM products WHERE name_normalized = ? AND model_normalized = ? LIMIT 1
    `).get(nameNorm, modelNorm)) result.errors.push(`含税单价 ${price} 尚未建档，请先通过商品日常导入新增该价格商品`);
	else {
		result.isNewProduct = true;
		result.newProductCount = 1;
		result.matched = true;
	}
	return result;
}
/**
* 构建进项导入预览。
* @param rawRows 从 Excel 解析的原始行
* @param fileSha256 文件 SHA-256
*/
function buildInboundPreview(rawRows, fileSha256) {
	const lines = [];
	const ignoredRows = [];
	const errors = [];
	for (const raw of rawRows) {
		const name = trimInvisible(raw.name);
		const model = trimInvisible(raw.model);
		const unit = trimInvisible(raw.unit);
		const price = raw.unitPriceDecimal ? normalizeUnitPriceSafe(raw.unitPriceDecimal) : "";
		if (isNonInventoryExpenseRow(model, unit, raw.quantity)) {
			ignoredRows.push({
				sourceSheet: raw.sourceSheet,
				sourceRow: raw.sourceRow,
				reason: "非库存费用行",
				description: name || "(空品名)"
			});
			continue;
		}
		const partialErrors = validateRowFields(name, model, unit, price, raw.quantity);
		if (partialErrors.length > 0) {
			for (const e of partialErrors) errors.push({
				sourceSheet: raw.sourceSheet,
				sourceRow: raw.sourceRow,
				field: "",
				reason: e
			});
			lines.push(buildErrorLine(raw, name, model, unit, price, partialErrors));
			continue;
		}
	}
	const aggregatedMap = aggregateRows(rawRows.filter((r) => {
		const model = trimInvisible(r.model);
		const unit = trimInvisible(r.unit);
		const price = r.unitPriceDecimal ? normalizeUnitPriceSafe(r.unitPriceDecimal) : "";
		return !isNonInventoryExpenseRow(model, unit, r.quantity) && validateRowFields(trimInvisible(r.name), model, unit, price, r.quantity).length === 0;
	}));
	let totalQuantity = 0;
	let totalAmountCent = 0;
	let totalTaxCent = 0;
	let totalCent = 0;
	let newProductCount = 0;
	for (const [, entry] of aggregatedMap) {
		const raw = entry.firstRow;
		const name = trimInvisible(raw.name);
		const model = trimInvisible(raw.model);
		const unit = trimInvisible(raw.unit);
		const price = normalizeUnitPrice(raw.unitPriceDecimal);
		const quantity = entry.totalQuantity;
		const amountCent = calcAmountCent(quantity, price);
		const taxCent = calcTaxCent(amountCent);
		const totalLine = calcTotalCent(amountCent, taxCent);
		totalQuantity += quantity;
		totalAmountCent += amountCent;
		totalTaxCent += taxCent;
		totalCent += totalLine;
		const match = matchExistingProduct(name, model, unit, price, quantity);
		newProductCount += match.newProductCount;
		if (match.errors.length > 0) for (const e of match.errors) errors.push({
			sourceSheet: raw.sourceSheet,
			sourceRow: raw.sourceRow,
			field: "",
			reason: e
		});
		lines.push({
			sourceSheet: raw.sourceSheet,
			sourceRow: raw.sourceRow,
			invoiceDate: raw.invoiceDate,
			invoiceNo: raw.invoiceNo,
			sellerName: raw.sellerName,
			name,
			model,
			unit,
			unitPriceDecimal: price,
			quantity,
			amountCent,
			taxCent,
			totalCent: totalLine,
			isNewProduct: match.isNewProduct,
			productId: match.productId,
			matched: match.matched,
			errors: match.errors
		});
	}
	const contentSha256 = computeContentSha256(lines.filter((l) => l.errors.length === 0));
	if (getRawDb().prepare("SELECT id FROM inbound_batches WHERE file_sha256 = ? OR content_sha256 = ?").get(fileSha256, contentSha256)) errors.push({
		sourceSheet: "",
		sourceRow: 0,
		field: "file",
		reason: "该文件已导入过，不允许重复导入"
	});
	const hasErrors = errors.length > 0;
	return {
		lines,
		ignoredRows,
		fileSha256,
		contentSha256,
		hasErrors,
		errors,
		totalQuantity: hasErrors ? 0 : totalQuantity,
		totalAmountCent: hasErrors ? 0 : totalAmountCent,
		totalTaxCent: hasErrors ? 0 : totalTaxCent,
		totalCent: hasErrors ? 0 : totalCent,
		newProductCount
	};
}
/** 构建错误行 */
function buildErrorLine(raw, name, model, unit, price, errors) {
	return {
		sourceSheet: raw.sourceSheet,
		sourceRow: raw.sourceRow,
		invoiceDate: raw.invoiceDate,
		invoiceNo: raw.invoiceNo,
		sellerName: raw.sellerName,
		name,
		model,
		unit,
		unitPriceDecimal: price,
		quantity: raw.quantity ?? 0,
		amountCent: 0,
		taxCent: 0,
		totalCent: 0,
		isNewProduct: false,
		productId: null,
		matched: false,
		errors
	};
}
//#endregion
//#region src/main/domains/inbound/inbound-confirm.ts
/**
* 进项导入确认服务。
* 预览缓存管理和单事务写入。
*/
/** 预览缓存 */
var previewCache = /* @__PURE__ */ new Map();
/** 缓存进项预览，返回令牌 */
function cacheInboundPreview(result, filePath, originalFileName) {
	const token = (0, uuid.v7)();
	previewCache.set(token, {
		result,
		filePath,
		originalFileName
	});
	setTimeout(() => previewCache.delete(token), 1800 * 1e3);
	return token;
}
/** 确认进项导入：单事务写入批次、明细、库存流水 */
function confirmInboundImport(token) {
	const cached = previewCache.get(token);
	if (!cached) throw new Error("预览已过期，请重新选择文件");
	const { result, filePath, originalFileName } = cached;
	if (result.hasErrors) throw new Error("存在错误，无法导入");
	if (computeFileSha256(filePath) !== result.fileSha256) throw new Error("文件已变更，请重新预览");
	const fileBase64 = (0, node_fs.readFileSync)(filePath).toString("base64");
	const db = getDb();
	const raw = getRawDb();
	const batchId = (0, uuid.v7)();
	const batchNo = generateBatchNo("INB");
	raw.transaction(() => {
		insertInboundBatch(db, batchId, batchNo, originalFileName, fileBase64, result);
		for (const line of result.lines) processInboundLine(db, raw, batchId, batchNo, line);
		recordAudit({
			action: "inbound.import",
			entityType: "inbound_batch",
			entityId: batchId,
			sourceBatchId: batchId,
			summary: `月初进项导入 ${batchNo}，共 ${result.lines.length} 行`
		});
		markDirty();
	})();
	previewCache.delete(token);
	return {
		batchId,
		batchNo,
		lineCount: result.lines.length
	};
}
/** 插入进项批次记录 */
function insertInboundBatch(db, batchId, batchNo, fileName, fileBase64, result) {
	db.insert(inboundBatches).values({
		id: batchId,
		batchNo,
		originalFileName: fileName,
		originalFileBlob: fileBase64,
		fileSha256: result.fileSha256,
		contentSha256: result.contentSha256,
		importedAt: (/* @__PURE__ */ new Date()).toISOString(),
		status: "imported",
		ignoredRowCount: result.ignoredRows.length,
		totalQuantity: result.totalQuantity,
		totalAmountCent: result.totalAmountCent,
		totalTaxCent: result.totalTaxCent,
		totalCent: result.totalCent
	}).run();
}
/** 处理单行进项：自动建档或匹配精确价格，再写明细和库存流水。 */
function processInboundLine(db, raw, batchId, batchNo, line) {
	let productId = line.productId;
	if (line.isNewProduct && !productId) productId = createAutoProduct(db, batchId, line);
	const balanceBefore = getStockBalance(raw, productId);
	const balanceAfter = balanceBefore + line.quantity;
	db.insert(inboundLines).values({
		id: (0, uuid.v7)(),
		batchId,
		sourceSheet: line.sourceSheet,
		sourceRow: line.sourceRow,
		invoiceDate: line.invoiceDate,
		invoiceNo: line.invoiceNo,
		sellerName: line.sellerName,
		productId,
		name: line.name,
		model: line.model,
		unit: line.unit,
		unitPriceDecimal: line.unitPriceDecimal,
		quantity: line.quantity,
		amountCent: line.amountCent,
		taxCent: line.taxCent,
		totalCent: line.totalCent
	}).run();
	appendLedger({
		productId,
		changeQuantity: line.quantity,
		balanceBefore,
		sourceType: "inbound",
		sourceId: batchId,
		reason: `月初进项导入 ${batchNo}`
	});
	db.update(products).set({
		stockBalance: balanceAfter,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}).where((0, drizzle_orm.eq)(products.id, productId)).run();
}
/** 自动创建新商品（缺税收编码标记 incomplete） */
function createAutoProduct(db, batchId, line) {
	const productId = (0, uuid.v7)();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	db.insert(products).values({
		id: productId,
		name: line.name,
		nameNormalized: normalizeKey(line.name),
		model: line.model,
		modelNormalized: normalizeKey(line.model),
		unit: line.unit,
		taxClassificationCode: "",
		unitPriceDecimal: line.unitPriceDecimal,
		taxRate: 13,
		stockBalance: 0,
		dataStatus: "incomplete",
		status: "active",
		remark: null,
		createdAt: now,
		updatedAt: now
	}).run();
	recordAudit({
		action: "product.auto_create",
		entityType: "product",
		entityId: productId,
		sourceBatchId: batchId,
		summary: `进项导入自动建档: ${line.name} ${line.model}`
	});
	return productId;
}
/** 读取商品当前库存。 */
function getStockBalance(raw, productId) {
	return raw.prepare("SELECT stock_balance FROM products WHERE id = ?").get(productId)?.stock_balance ?? 0;
}
//#endregion
//#region src/main/domains/inbound/inbound-query.ts
/**
* 进项导入查询服务。
* 分页列表、详情和作废。
*/
/** 将数据库行映射为业务实体 */
function mapInboundBatch(row) {
	return {
		id: row.id,
		batchNo: row.batchNo,
		originalFileName: row.originalFileName,
		fileSha256: row.fileSha256,
		contentSha256: row.contentSha256,
		importedAt: row.importedAt,
		status: row.status,
		voidReason: row.voidReason,
		voidedAt: row.voidedAt,
		ignoredRowCount: row.ignoredRowCount,
		totalQuantity: row.totalQuantity,
		totalAmountCent: row.totalAmountCent,
		totalTaxCent: row.totalTaxCent,
		totalCent: row.totalCent
	};
}
/** 将明细行映射为业务实体 */
function mapInboundLine(row) {
	return {
		id: row.id,
		batchId: row.batchId,
		sourceSheet: row.sourceSheet,
		sourceRow: row.sourceRow,
		invoiceDate: row.invoiceDate,
		invoiceNo: row.invoiceNo,
		sellerName: row.sellerName,
		productId: row.productId,
		name: row.name,
		model: row.model,
		unit: row.unit,
		unitPriceDecimal: row.unitPriceDecimal,
		quantity: row.quantity,
		amountCent: row.amountCent,
		taxCent: row.taxCent,
		totalCent: row.totalCent
	};
}
/** 分页查询进项批次 */
function listInboundBatches(page, pageSize) {
	const raw = getRawDb();
	const countRow = raw.prepare("SELECT COUNT(*) as cnt FROM inbound_batches").get();
	const offset = (page - 1) * pageSize;
	return {
		rows: toCamelList(raw.prepare("SELECT * FROM inbound_batches ORDER BY imported_at DESC, id DESC LIMIT ? OFFSET ?").all(pageSize, offset)).map(mapInboundBatch),
		total: countRow.cnt,
		page,
		pageSize
	};
}
/** 获取进项批次详情 */
function getInboundDetail(id) {
	const raw = getRawDb();
	const batchRow = toCamel(raw.prepare("SELECT * FROM inbound_batches WHERE id = ?").get(id));
	if (!batchRow) return null;
	const lineRows = toCamelList(raw.prepare("SELECT * FROM inbound_lines WHERE batch_id = ? ORDER BY source_row").all(id));
	return {
		batch: mapInboundBatch(batchRow),
		lines: lineRows.map(mapInboundLine)
	};
}
/** 作废进项批次：整批反向扣减库存 */
function voidInboundBatch(id, reason) {
	const raw = getRawDb();
	const db = getDb();
	const batchRow = toCamel(raw.prepare("SELECT * FROM inbound_batches WHERE id = ?").get(id));
	if (!batchRow) throw new Error("进项批次不存在");
	if (batchRow.status === "voided") return mapInboundBatch(batchRow);
	raw.transaction(() => {
		db.update(inboundBatches).set({
			status: "voided",
			voidReason: reason,
			voidedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).where((0, drizzle_orm.eq)(inboundBatches.id, id)).run();
		const lineRows = toCamelList(raw.prepare("SELECT * FROM inbound_lines WHERE batch_id = ?").all(id));
		for (const line of lineRows) reverseInboundLine(db, raw, id, batchRow.batchNo, reason, line);
		recordAudit({
			action: "inbound.void",
			entityType: "inbound_batch",
			entityId: id,
			sourceBatchId: id,
			summary: `作废进项批次 ${batchRow.batchNo}，原因: ${reason}`
		});
		markDirty();
	})();
	return mapInboundBatch(toCamel(raw.prepare("SELECT * FROM inbound_batches WHERE id = ?").get(id)));
}
/** 反向扣减单行库存 */
function reverseInboundLine(db, raw, batchId, batchNo, reason, line) {
	const productRow = raw.prepare("SELECT stock_balance FROM products WHERE id = ?").get(line.productId);
	if (!productRow) return;
	const balanceBefore = productRow.stock_balance;
	const balanceAfter = balanceBefore - line.quantity;
	appendLedger({
		productId: line.productId,
		changeQuantity: -line.quantity,
		balanceBefore,
		sourceType: "inbound_void",
		sourceId: batchId,
		reason: `进项作废 ${batchNo}: ${reason}`
	});
	db.update(products).set({
		stockBalance: balanceAfter,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}).where((0, drizzle_orm.eq)(products.id, line.productId)).run();
}
//#endregion
//#region src/main/ipc/inbound-ipc.ts
/**
* 月初进项导入 IPC 处理器。
*/
function registerInboundIpc() {
	registerHandler(IPC_CHANNELS.inbound.preview, null, async (filePath) => {
		const fileSha256 = computeFileSha256(filePath);
		const { rows, fileName } = await parseInboundExcel(filePath);
		const preview = buildInboundPreview(rows, fileSha256);
		return {
			token: cacheInboundPreview(preview, filePath, fileName),
			preview
		};
	});
	registerHandler(IPC_CHANNELS.inbound.confirm, null, (token) => {
		return confirmInboundImport(token);
	});
	registerHandler(IPC_CHANNELS.inbound.downloadTemplate, null, async (_input, _sender) => {
		const result = await electron.dialog.showSaveDialog({
			title: "保存月初总部进项导入模板",
			defaultPath: "月初总部进项导入模板.xlsx",
			filters: [{
				name: "Excel",
				extensions: ["xlsx"]
			}]
		});
		if (result.canceled || !result.filePath) return { saved: false };
		await generateInboundTemplate(result.filePath);
		return {
			saved: true,
			path: result.filePath
		};
	});
	registerHandler(IPC_CHANNELS.inbound.list, pageRequestSchema, (input) => {
		return listInboundBatches(input.page, input.pageSize);
	});
	registerHandler(IPC_CHANNELS.inbound.getDetail, null, (id) => {
		return getInboundDetail(id);
	});
	registerHandler(IPC_CHANNELS.inbound.void, voidRequestSchema, (input) => {
		return voidInboundBatch(input.id, input.reason);
	});
}
//#endregion
//#region src/main/domains/inventory/adjust-service.ts
/**
* 库存调整服务 - 人工调整库存。
* 调整量必须为非零整数，原因必填，生成独立库存流水，不直接覆盖库存值。
*/
function adjustInventory(input) {
	const product = getProductById(input.productId);
	if (!product) throw new Error("商品不存在");
	const db = getDb();
	const raw = getRawDb();
	const balanceBefore = product.stockBalance;
	const balanceAfter = balanceBefore + input.changeQuantity;
	const ledgerId = (0, uuid.v7)();
	raw.transaction(() => {
		const { ledgerId: id } = appendLedger({
			productId: input.productId,
			changeQuantity: input.changeQuantity,
			balanceBefore,
			sourceType: "adjustment",
			sourceId: ledgerId,
			reason: input.reason
		});
		db.update(products).set({
			stockBalance: balanceAfter,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).where((0, drizzle_orm.eq)(products.id, input.productId)).run();
		recordAudit({
			action: "inventory.adjust",
			entityType: "product",
			entityId: input.productId,
			sourceBatchId: ledgerId,
			summary: `人工调整 ${input.changeQuantity > 0 ? "+" : ""}${input.changeQuantity}，原因: ${input.reason}`,
			fieldChanges: [{
				fieldPath: "stockBalance",
				oldValue: String(balanceBefore),
				newValue: String(balanceAfter)
			}]
		});
		markDirty();
		if (id !== ledgerId) raw.prepare("UPDATE inventory_ledger SET id = ? WHERE id = ?").run(ledgerId, id);
	})();
	return {
		newBalance: balanceAfter,
		ledgerId
	};
}
//#endregion
//#region src/main/ipc/inventory-ipc.ts
/**
* 库存 IPC 处理器 - 流水查询、人工调整、一致性检查。
*/
function registerInventoryIpc() {
	registerHandler(IPC_CHANNELS.inventory.ledger, ledgerQuerySchema, (input) => {
		return queryLedger({
			productId: input.productId,
			page: input.page,
			pageSize: input.pageSize
		});
	});
	registerHandler(IPC_CHANNELS.inventory.adjust, inventoryAdjustSchema, (input) => {
		return adjustInventory(input);
	});
	registerHandler(IPC_CHANNELS.inventory.consistencyCheck, null, () => {
		return consistencyCheck();
	});
}
//#endregion
//#region src/main/domains/backup/backup-config.ts
/**
* 腾讯云 COS 配置管理。
* 敏感字段使用 Electron safeStorage 加密存储。
*/
var CONFIG_FILE = "cos-config.enc";
/** 获取配置文件路径 */
function getConfigPath() {
	const dataDir = (0, node_path.resolve)(electron.app.getPath("userData"), "data");
	if (!(0, node_fs.existsSync)(dataDir)) (0, node_fs.mkdirSync)(dataDir, { recursive: true });
	return (0, node_path.resolve)(dataDir, CONFIG_FILE);
}
/** 加密保存 COS 配置（敏感字段用 safeStorage 加密） */
function saveCosConfig(config) {
	const nonSensitive = {
		region: config.region,
		bucket: config.bucket,
		prefix: config.prefix,
		autoBackup: config.autoBackup,
		retentionCount: config.retentionCount
	};
	const sensitive = {
		secretId: config.secretId || "",
		secretKey: config.secretKey || "",
		securityToken: config.securityToken || "",
		restorePassword: config.restorePassword || ""
	};
	const encryptedSensitive = electron.safeStorage.encryptString(JSON.stringify(sensitive));
	(0, node_fs.writeFileSync)(getConfigPath(), JSON.stringify({
		nonSensitive,
		sensitive: encryptedSensitive.toString("base64")
	}), "utf-8");
}
/** 读取 COS 配置（敏感字段在主进程内解密） */
function loadCosConfig() {
	const configPath = getConfigPath();
	if (!(0, node_fs.existsSync)(configPath)) return null;
	try {
		const payload = JSON.parse((0, node_fs.readFileSync)(configPath, "utf-8"));
		const sensitiveBuf = Buffer.from(payload.sensitive, "base64");
		let sensitive = {
			secretId: "",
			secretKey: "",
			securityToken: "",
			restorePassword: ""
		};
		if (electron.safeStorage.isEncryptionAvailable() && sensitiveBuf.length > 0) try {
			sensitive = JSON.parse(electron.safeStorage.decryptString(sensitiveBuf));
		} catch {
			electron_log_main.default.warn("[backup] 解密敏感配置失败");
		}
		return {
			...payload.nonSensitive,
			secretId: sensitive.secretId || void 0,
			secretKey: sensitive.secretKey || void 0,
			securityToken: sensitive.securityToken || void 0,
			restorePassword: sensitive.restorePassword || void 0
		};
	} catch (err) {
		electron_log_main.default.error("[backup] 读取配置失败:", err);
		return null;
	}
}
/** 获取配置摘要（不含密钥，用于渲染进程展示） */
function getConfigSummary() {
	const config = loadCosConfig();
	if (!config) return {
		configured: false,
		config: {},
		credentialConfigured: false
	};
	return {
		configured: true,
		config: {
			region: config.region,
			bucket: config.bucket,
			prefix: config.prefix,
			autoBackup: config.autoBackup,
			retentionCount: config.retentionCount
		},
		credentialConfigured: !!(config.secretId && config.secretKey)
	};
}
//#endregion
//#region src/main/domains/backup/backup-crypto.ts
/**
* 备份加密/解密工具。
* 使用 scrypt 派生密钥，AES-256-GCM 加解密。
*/
/** 用恢复密码通过 scrypt 派生 AES-256 密钥 */
function deriveKey(password, salt) {
	return (0, node_crypto.scryptSync)(password, salt, 32);
}
/** AES-256-GCM 加密 */
function encryptData(data, password) {
	const salt = (0, node_crypto.randomBytes)(16);
	const iv = (0, node_crypto.randomBytes)(12);
	const cipher = (0, node_crypto.createCipheriv)("aes-256-gcm", deriveKey(password, salt), iv);
	return {
		encrypted: Buffer.concat([cipher.update(data), cipher.final()]),
		salt,
		iv,
		tag: cipher.getAuthTag()
	};
}
/** AES-256-GCM 解密 */
function decryptData(encrypted, salt, iv, tag, password) {
	const decipher = (0, node_crypto.createDecipheriv)("aes-256-gcm", deriveKey(password, salt), iv);
	decipher.setAuthTag(tag);
	return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
//#endregion
//#region src/main/domains/backup/backup-snapshot.ts
/**
* 数据库快照和恢复服务。
* 使用 SQLite Online Backup API 创建一致性快照，AES-256-GCM 加解密。
*/
/** 使用 SQLite Online Backup API 创建一致性快照 */
function createDbSnapshot() {
	const raw = getRawDb();
	const snapshotPath = getDbPath() + ".backup-tmp";
	raw.backup(snapshotPath);
	const buf = (0, node_fs.readFileSync)(snapshotPath);
	(0, node_fs.unlinkSync)(snapshotPath);
	return buf;
}
/** 创建备份 payload（加密后的 Buffer + manifest） */
function createBackupPayload(backupType, password) {
	const dbBuf = createDbSnapshot();
	const dbSha256 = (0, node_crypto.createHash)("sha256").update(dbBuf).digest("hex");
	const raw = getRawDb();
	const integrity = raw.pragma("integrity_check");
	if (integrity.length !== 1 || integrity[0].integrity_check !== "ok") throw new Error("数据库完整性检查未通过");
	const manifest = {
		appVersion: electron.app.getVersion(),
		schemaVersion: "2.0",
		recordCounts: collectRecordCounts(raw),
		dbSha256,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		backupType
	};
	const manifestJson = JSON.stringify(manifest);
	const manifestLenBuf = Buffer.alloc(4);
	manifestLenBuf.writeUInt32BE(manifestJson.length, 0);
	const { encrypted, salt, iv, tag } = encryptData(Buffer.concat([
		manifestLenBuf,
		Buffer.from(manifestJson, "utf-8"),
		dbBuf
	]), password);
	return {
		buffer: Buffer.concat([
			salt,
			iv,
			tag,
			encrypted
		]),
		manifest
	};
}
/** 收集各表记录数 */
function collectRecordCounts(raw) {
	const tables = [
		"customers",
		"products",
		"outbound_batches",
		"outbound_lines",
		"inbound_batches",
		"inbound_lines",
		"inventory_ledger",
		"audit_events"
	];
	const counts = {};
	for (const table of tables) counts[table] = raw.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get().cnt;
	return counts;
}
/** 解密备份并返回 manifest 和数据库 Buffer */
function decryptBackup(buffer, password) {
	const salt = buffer.subarray(0, 16);
	const iv = buffer.subarray(16, 28);
	const tag = buffer.subarray(28, 44);
	const plainData = decryptData(buffer.subarray(44), salt, iv, tag, password);
	const manifestLen = plainData.readUInt32BE(0);
	const manifestJson = plainData.subarray(4, 4 + manifestLen).toString("utf-8");
	const manifest = JSON.parse(manifestJson);
	const dbBuffer = plainData.subarray(4 + manifestLen);
	if ((0, node_crypto.createHash)("sha256").update(dbBuffer).digest("hex") !== manifest.dbSha256) throw new Error("备份数据库哈希校验失败");
	return {
		manifest,
		dbBuffer
	};
}
/** 创建恢复前本地安全备份 */
function createPreRestoreBackup() {
	const dbPath = getDbPath();
	if (!(0, node_fs.existsSync)(dbPath)) return "";
	const backupPath = dbPath + ".prerestore";
	(0, node_fs.copyFileSync)(dbPath, backupPath);
	return backupPath;
}
/** 执行数据库恢复：替换数据库文件 */
function restoreDatabase(dbBuffer) {
	closeDatabase();
	const dbPath = getDbPath();
	const preRestoreBackup = createPreRestoreBackup();
	electron_log_main.default.info(`[backup] 恢复前备份: ${preRestoreBackup}`);
	try {
		const tempPath = dbPath + ".restore-tmp";
		(0, node_fs.writeFileSync)(tempPath, dbBuffer);
		for (const ext of ["-wal", "-shm"]) if ((0, node_fs.existsSync)(dbPath + ext)) (0, node_fs.unlinkSync)(dbPath + ext);
		(0, node_fs.renameSync)(tempPath, dbPath);
		electron_log_main.default.info("[backup] 数据库已替换");
	} catch (err) {
		electron_log_main.default.error("[backup] 恢复失败，回滚到恢复前备份:", err);
		if (preRestoreBackup && (0, node_fs.existsSync)(preRestoreBackup)) (0, node_fs.copyFileSync)(preRestoreBackup, dbPath);
		throw err;
	}
}
//#endregion
//#region src/main/domains/backup/cos-client.ts
/**
* 腾讯云 COS 客户端封装。
*/
/** 创建 COS 客户端。 */
function createCosClient(config) {
	return new cos_nodejs_sdk_v5.default({
		SecretId: config.secretId,
		SecretKey: config.secretKey,
		SecurityToken: config.securityToken
	});
}
/** 测试 COS 存储桶连接。 */
async function testCosConnection(config) {
	try {
		await createCosClient(config).headBucket({
			Bucket: config.bucket,
			Region: config.region
		});
		return {
			success: true,
			message: "COS Bucket 连接成功"
		};
	} catch (err) {
		const message = getErrorMessage(err);
		electron_log_main.default.warn("[cos] 连接测试失败:", sanitizeErrorMessage(message));
		return {
			success: false,
			message: sanitizeErrorMessage(message)
		};
	}
}
/** 从 COS SDK 异常中提取不含请求明细的可读信息。 */
function getErrorMessage(error) {
	if (error instanceof Error) return error.message;
	if (!error || typeof error !== "object") return String(error);
	const detail = error;
	return [
		detail.code,
		detail.message,
		detail.statusCode
	].filter((value) => typeof value === "string" || typeof value === "number").map(String).join(" · ") || "COS 请求失败";
}
/** 清理错误消息中的敏感信息。 */
function sanitizeErrorMessage(message) {
	return message.replace(/AKID[A-Za-z0-9]+/g, "***").replace(/secret[_-]?id[^,}]*/gi, "***").replace(/secret[_-]?key[^,}]*/gi, "***");
}
/** 构造备份对象键。 */
function buildObjectKey(prefix, installId) {
	const now = /* @__PURE__ */ new Date();
	const yyyy = now.getUTCFullYear();
	const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
	const ts = `${yyyy}${mm}${String(now.getUTCDate()).padStart(2, "0")}-${String(now.getUTCHours()).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}${String(now.getUTCSeconds()).padStart(2, "0")}Z`;
	return [
		prefix ? prefix.replace(/^\/+|\/+$/g, "") : "",
		installId,
		yyyy,
		mm,
		`invoice-backup-${ts}.cdbak`
	].filter(Boolean).join("/");
}
/** 上传备份文件到 COS。 */
async function uploadBackup(config, objectKey, data, manifest) {
	await createCosClient(config).putObject({
		Bucket: config.bucket,
		Region: config.region,
		Key: objectKey,
		Body: data,
		ContentLength: data.length,
		ContentType: "application/octet-stream",
		"x-cos-meta-app-version": manifest.appVersion,
		"x-cos-meta-schema-version": manifest.schemaVersion,
		"x-cos-meta-backup-type": manifest.backupType,
		"x-cos-meta-created-at": manifest.createdAt
	});
}
/** 列出 COS 中的备份对象。 */
async function listBackupObjects(config, prefix) {
	const prefixPart = prefix ? prefix.replace(/^\/+|\/+$/g, "") + "/" : "";
	const client = createCosClient(config);
	const contents = [];
	let marker;
	do {
		const response = await client.getBucket({
			Bucket: config.bucket,
			Region: config.region,
			Prefix: prefixPart,
			Marker: marker,
			MaxKeys: 1e3
		});
		contents.push(...response.Contents || []);
		marker = response.IsTruncated === "true" ? response.NextMarker : void 0;
	} while (marker);
	return contents.filter((object) => object.Key.endsWith(".cdbak")).map((obj) => ({
		key: obj.Key,
		size: Number(obj.Size) || 0,
		lastModified: obj.LastModified ? new Date(obj.LastModified) : void 0
	}));
}
/** 从 COS 下载备份对象。 */
async function downloadBackupObject(config, objectKey) {
	return (await createCosClient(config).getObject({
		Bucket: config.bucket,
		Region: config.region,
		Key: objectKey
	})).Body;
}
/** 批量删除 COS 中的过期备份。 */
async function deleteOldBackups(config, keysToDelete) {
	if (keysToDelete.length === 0) return;
	await createCosClient(config).deleteMultipleObject({
		Bucket: config.bucket,
		Region: config.region,
		Objects: keysToDelete.map((key) => ({ Key: key })),
		Quiet: true
	});
}
//#endregion
//#region src/main/ipc/backup-ipc.ts
/**
* 备份 IPC 处理器 - 配置、测试、备份、列表、恢复。
*/
/** 备份任务状态 */
var currentTask = null;
function registerBackupIpc() {
	registerHandler(IPC_CHANNELS.backup.getStatus, null, () => {
		const config = loadCosConfig();
		const lastBackupTime = getSetting("last_backup_time");
		const lastBackupSize = getSetting("last_backup_size");
		const lastError = getSetting("last_backup_error");
		return {
			status: currentTask?.type === "backup" ? "backing_up" : currentTask?.type === "restore" ? "restoring" : !config ? "unconfigured" : "idle",
			lastBackupTime,
			lastBackupSize: lastBackupSize ? parseInt(lastBackupSize, 10) : null,
			dirty: isDirty(),
			lastError,
			credentialConfigured: !!(config?.secretId && config?.secretKey)
		};
	});
	registerHandler(IPC_CHANNELS.backup.getConfig, null, () => {
		return getConfigSummary();
	});
	registerHandler(IPC_CHANNELS.backup.saveConfig, cosConfigSchema, (input) => {
		const existing = loadCosConfig();
		const replacingCredentials = !!(input.secretId || input.secretKey);
		saveCosConfig({
			...input,
			secretId: input.secretId || existing?.secretId,
			secretKey: input.secretKey || existing?.secretKey,
			securityToken: replacingCredentials ? input.securityToken || void 0 : input.securityToken || existing?.securityToken,
			restorePassword: input.restorePassword || existing?.restorePassword
		});
		return { saved: true };
	});
	registerHandler(IPC_CHANNELS.backup.testConnection, cosConfigSchema, async (input) => {
		const existing = loadCosConfig();
		const replacingCredentials = !!(input.secretId || input.secretKey);
		return testCosConnection({
			...input,
			secretId: input.secretId || existing?.secretId,
			secretKey: input.secretKey || existing?.secretKey,
			securityToken: replacingCredentials ? input.securityToken || void 0 : input.securityToken || existing?.securityToken
		});
	});
	registerHandler(IPC_CHANNELS.backup.create, null, async () => {
		const config = loadCosConfig();
		if (!config) throw new Error("未配置腾讯云 COS 连接");
		if (!config.secretId || !config.secretKey) throw new Error("未配置腾讯云 COS 凭据");
		if (!config.restorePassword) throw new Error("未设置恢复密码");
		const taskId = `backup-${Date.now()}`;
		currentTask = {
			taskId,
			type: "backup",
			phase: "创建快照",
			progress: 0,
			processedBytes: 0
		};
		try {
			currentTask.phase = "创建数据库快照";
			const payload = createBackupPayload("manual", config.restorePassword);
			currentTask.phase = "上传中";
			currentTask.progress = 50;
			const installId = getOrCreateInstallId();
			const objectKey = buildObjectKey(config.prefix, installId);
			await uploadBackup(config, objectKey, payload.buffer, {
				appVersion: payload.manifest.appVersion,
				schemaVersion: payload.manifest.schemaVersion,
				backupType: payload.manifest.backupType,
				createdAt: payload.manifest.createdAt
			});
			currentTask.progress = 80;
			currentTask.phase = "清理过期备份";
			const objects = await listBackupObjects(config, config.prefix || "");
			const installPrefix = config.prefix ? `${config.prefix.replace(/^\/+|\/+$/g, "")}/${installId}/` : `${installId}/`;
			const ownBackups = objects.filter((o) => o.key.startsWith(installPrefix));
			const retention = config.retentionCount ?? 30;
			if (ownBackups.length > retention) await deleteOldBackups(config, ownBackups.slice(0, ownBackups.length - retention).map((o) => o.key));
			currentTask.progress = 100;
			currentTask.phase = "完成";
			setSetting("last_backup_time", payload.manifest.createdAt);
			setSetting("last_backup_size", String(payload.buffer.length));
			clearDirty();
			setSetting("last_backup_error", "");
			return {
				taskId,
				objectKey,
				size: payload.buffer.length,
				createdAt: payload.manifest.createdAt
			};
		} catch (err) {
			setSetting("last_backup_error", err instanceof Error ? err.message : String(err));
			currentTask = null;
			throw err;
		} finally {
			setTimeout(() => {
				currentTask = null;
			}, 5e3);
		}
	});
	registerHandler(IPC_CHANNELS.backup.list, null, async () => {
		const config = loadCosConfig();
		if (!config) return {
			rows: [],
			total: 0
		};
		const objects = await listBackupObjects(config, config.prefix || "");
		const installId = getOrCreateInstallId();
		const installPrefix = config.prefix ? `${config.prefix.replace(/^\/+|\/+$/g, "")}/${installId}/` : `${installId}/`;
		const rows = objects.filter((o) => o.key.startsWith(installPrefix)).map((o) => {
			const match = o.key.match(/invoice-backup-(\d{8})-(\d{6})Z\.cdbak$/);
			let backupTime = o.lastModified?.toISOString() || "";
			if (match) {
				const dateStr = match[1];
				const timeStr = match[2];
				backupTime = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}Z`;
			}
			return {
				objectKey: o.key,
				backupTime,
				size: o.size,
				appVersion: "unknown",
				schemaVersion: "unknown",
				backupType: "manual",
				checksumStatus: "verified"
			};
		});
		rows.sort((a, b) => b.backupTime.localeCompare(a.backupTime));
		return {
			rows,
			total: rows.length
		};
	});
	registerHandler(IPC_CHANNELS.backup.restore, restoreRequestSchema, async (input) => {
		const config = loadCosConfig();
		if (!config) throw new Error("未配置腾讯云 COS 连接");
		const taskId = `restore-${Date.now()}`;
		currentTask = {
			taskId,
			type: "restore",
			phase: "下载备份",
			progress: 0,
			processedBytes: 0
		};
		try {
			currentTask.phase = "下载备份文件";
			const backupBuffer = await downloadBackupObject(config, input.objectKey);
			currentTask.phase = "解密和校验";
			currentTask.progress = 30;
			const { manifest, dbBuffer } = decryptBackup(backupBuffer, input.restorePassword);
			currentTask.phase = "替换数据库";
			currentTask.progress = 70;
			restoreDatabase(dbBuffer);
			currentTask.phase = "重新初始化";
			currentTask.progress = 90;
			closeDatabase();
			initDatabase();
			currentTask.phase = "完成";
			currentTask.progress = 100;
			return {
				taskId,
				restored: true,
				manifest
			};
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			electron_log_main.default.error("[backup] 恢复失败:", msg);
			currentTask = null;
			throw new Error(`恢复失败: ${msg}`);
		} finally {
			setTimeout(() => {
				currentTask = null;
			}, 5e3);
		}
	});
	registerHandler(IPC_CHANNELS.backup.getTaskStatus, null, () => {
		return currentTask || null;
	});
}
//#endregion
//#region src/main/bootstrap/index.ts
/**
* 主进程引导 - 创建窗口、初始化数据库、注册 IPC、配置安全基线。
*/
electron_log_main.default.initialize();
electron_log_main.default.info("[main] 应用启动");
var mainWindow = null;
/** 注册所有 IPC 处理器 */
function registerAllIpc() {
	registerSystemIpc();
	registerCustomersIpc();
	registerCatalogIpc();
	registerOutboundIpc();
	registerReplenishmentIpc();
	registerInboundIpc();
	registerInventoryIpc();
	registerBackupIpc();
	electron_log_main.default.info("[main] IPC 处理器注册完成");
}
/** 创建主窗口 */
function createWindow() {
	mainWindow = new electron.BrowserWindow({
		width: 1440,
		height: 900,
		minWidth: 1024,
		minHeight: 720,
		show: false,
		title: "成都莱盛发票库存管理工具",
		webPreferences: {
			preload: (0, node_path.resolve)(__dirname, "../preload/index.js"),
			contextIsolation: true,
			sandbox: true,
			nodeIntegration: false,
			webSecurity: true,
			allowRunningInsecureContent: false
		}
	});
	registerAllowedWindow(mainWindow);
	const isDev = !electron.app.isPackaged && process.env["CDLASER_E2E_PRODUCTION"] !== "1";
	const cspHeader = isDev ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'" : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'";
	mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
		callback({ responseHeaders: {
			...details.responseHeaders,
			"Content-Security-Policy": [cspHeader]
		} });
	});
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("http://") || url.startsWith("https://")) electron.shell.openExternal(url);
		return { action: "deny" };
	});
	mainWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
		callback(false);
	});
	mainWindow.on("ready-to-show", () => {
		mainWindow?.show();
	});
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
	if (isDev) {
		const devUrl = process.env["VITE_DEV_SERVER_URL"] || "http://localhost:5173";
		mainWindow.loadURL(devUrl);
		mainWindow.webContents.openDevTools({ mode: "detach" });
	} else {
		const rendererPath = (0, node_path.resolve)(__dirname, "../renderer/index.html");
		mainWindow.loadFile(rendererPath);
	}
}
/** 应用就绪 */
electron.app.whenReady().then(() => {
	try {
		initDatabase();
		electron_log_main.default.info("[main] 数据库初始化完成");
	} catch (err) {
		electron_log_main.default.error("[main] 数据库初始化失败:", err);
		electron.dialog.showErrorBox("数据库初始化失败", `应用无法启动：\n${err.message}`);
		electron.app.quit();
		return;
	}
	registerAllIpc();
	createWindow();
	electron.app.on("activate", () => {
		if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
/** 所有窗口关闭时退出（Windows 行为） */
electron.app.on("window-all-closed", () => {
	closeDatabase();
	electron.app.quit();
});
/** 应用退出前关闭数据库 */
electron.app.on("before-quit", () => {
	closeDatabase();
});
/** 异常退出处理 */
process.on("uncaughtException", (err) => {
	electron_log_main.default.error("[main] 未捕获异常:", err);
});
process.on("unhandledRejection", (reason) => {
	electron_log_main.default.error("[main] 未处理的 Promise 拒绝:", reason);
});
//#endregion
