/**
 * 销项开票服务入口 - 重新导出各子模块。
 *
 * 模块拆分：
 * - outbound-types: 类型定义
 * - outbound-validate: 草稿校验
 * - outbound-export: 导出事务
 * - outbound-query: 分页列表、详情和下载
 * - outbound-void: 作废和库存恢复
 */

export type { DraftValidationResult, OutboundExportResult } from './outbound-types';

export { validateDraft } from './outbound-validate';
export { executeOutboundExport } from './outbound-export';
export { listOutboundBatches, getOutboundDetail, getOutboundXlsx, mapOutboundBatch, getMonthlyTaxCent } from './outbound-query';
export { voidOutboundBatch } from './outbound-void';
