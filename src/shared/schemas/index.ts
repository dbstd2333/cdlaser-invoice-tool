import { z } from 'zod';

/**
 * Zod 校验 Schema 集合 - 所有 IPC 入参和出参均经此校验。
 * 注意：不使用 .default() 以避免 Zod input/output 类型推断不一致。
 * 默认值在各领域服务中处理。
 */

/** 通用分页请求 */
export const pageRequestSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().refine((v) => [20, 50, 100].includes(v)),
});

/** 文件选择对话框请求 */
export const selectFileSchema = z.object({
  title: z.string().optional(),
  extensions: z.array(z.string().min(1)).min(1),
});

/** 客户新增/编辑 */
export const customerUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '客户名称必填').max(100),
  taxId: z.string().min(1, '纳税人识别号必填'),
  shortCode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  bankName: z.string().nullable().optional(),
  bankAccount: z.string().nullable().optional(),
  email: z
    .union([z.string().email('邮箱格式不正确'), z.literal(''), z.null()])
    .optional(),
  isDefaultAddress: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

/** 客户搜索/筛选 */
export const customerQuerySchema = z.object({
  keyword: z.string().optional(),
  status: z.enum(['active', 'inactive', 'all']).optional(),
  isDefaultAddress: z.boolean().nullable().optional(),
  dataCompleteness: z.enum(['complete', 'incomplete', 'all']).optional(),
  ...pageRequestSchema.shape,
});

/** 商品新增/编辑 */
export const productUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '项目名称必填'),
  model: z.string().min(1, '规格型号必填'),
  unit: z.string().min(1, '单位必填').max(20),
  taxClassificationCode: z.string().min(1, '税收分类编码必填').max(19),
  unitPriceDecimal: z.string().min(1, '含税单价必填'),
  taxRate: z.number().int().min(0).max(100).optional(),
  remark: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

/** 商品库存查询 */
export const productQuerySchema = z.object({
  keyword: z.string().optional(),
  name: z.string().optional(),
  model: z.string().optional(),
  stockStatus: z.enum(['positive', 'zero', 'negative', 'all']).optional(),
  dataStatus: z.enum(['complete', 'incomplete', 'all']).optional(),
  productStatus: z.enum(['active', 'inactive', 'all']).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  ...pageRequestSchema.shape,
});

/** 销项开票行 */
export const outboundLineInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive('数量必须为正整数'),
  amountCent: z.number().int().positive('金额必须大于 0').optional(),
});

/** 销项导出请求 */
export const outboundExportSchema = z.object({
  customerId: z.string().min(1),
  lines: z.array(outboundLineInputSchema).min(1, '至少选择一行').max(2000, '单次最多 2000 条明细'),
  amountFactor: z.string().optional(),
});

/** 开票记录查询 */
export const outboundQuerySchema = z.object({
  batchNo: z.string().optional(),
  customerName: z.string().optional(),
  productKeyword: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: z.enum(['valid', 'voided', 'all']).optional(),
  ...pageRequestSchema.shape,
});

/** 进项导入预览请求 */
export const inboundPreviewSchema = z.object({
  filePath: z.string().min(1),
});

/** 进项导入确认请求 */
export const inboundConfirmSchema = z.object({
  previewToken: z.string().min(1),
});

/** 库存调整 */
export const inventoryAdjustSchema = z.object({
  productId: z.string().min(1),
  changeQuantity: z.number().int().refine((v) => v !== 0, '调整量必须为非零整数'),
  reason: z.string().min(1, '调整原因必填'),
});

/** 库存流水查询 */
export const ledgerQuerySchema = z.object({
  productId: z.string().min(1),
  ...pageRequestSchema.shape,
});

/** 库存汇总（按 stock_balance 符号聚合） */
export const stockSummarySchema = z.object({});

export interface StockSummary {
  positiveStock: number;
  negativeStock: number;
  totalStock: number;
}

/** 字段历史查询 */
export const fieldHistoryQuerySchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  ...pageRequestSchema.shape,
});

/** 重新下载请求 */
export const downloadRequestSchema = z.object({
  id: z.string().min(1),
});

/** 作废请求 */
export const voidRequestSchema = z.object({
  id: z.string().min(1),
  reason: z.string().min(1, '作废原因必填'),
});

/** 腾讯云 COS 配置 */
export const cosConfigSchema = z.object({
  region: z.string().trim().min(1, 'Region 必填'),
  bucket: z.string().trim().regex(/^[a-z0-9][a-z0-9.-]*-\d+$/, 'Bucket 格式应为 BucketName-APPID'),
  prefix: z.string().optional(),
  secretId: z.string().optional(),
  secretKey: z.string().optional(),
  securityToken: z.string().optional(),
  autoBackup: z.boolean().optional(),
  retentionCount: z.number().int().min(1).max(100).optional(),
  restorePassword: z.string().optional(),
});

/** 备份恢复请求 */
export const restoreRequestSchema = z.object({
  objectKey: z.string().min(1),
  restorePassword: z.string().min(1),
});

export type CustomerUpsertInput = z.infer<typeof customerUpsertSchema>;
export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;
export type ProductUpsertInput = z.infer<typeof productUpsertSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type OutboundExportInput = z.infer<typeof outboundExportSchema>;
export type OutboundQueryInput = z.infer<typeof outboundQuerySchema>;
export type InboundPreviewInput = z.infer<typeof inboundPreviewSchema>;
export type InboundConfirmInput = z.infer<typeof inboundConfirmSchema>;
export type InventoryAdjustInput = z.infer<typeof inventoryAdjustSchema>;
export type LedgerQueryInput = z.infer<typeof ledgerQuerySchema>;
export type FieldHistoryQueryInput = z.infer<typeof fieldHistoryQuerySchema>;
export type CosConfigInput = z.infer<typeof cosConfigSchema>;
export type RestoreInput = z.infer<typeof restoreRequestSchema>;
export type SelectFileInput = z.infer<typeof selectFileSchema>;
