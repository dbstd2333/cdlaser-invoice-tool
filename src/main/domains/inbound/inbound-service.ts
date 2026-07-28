/**
 * 进项导入服务入口 - 重新导出各子模块。
 *
 * 模块拆分：
 * - inbound-types: 类型定义
 * - inbound-preview: 预览解析、哈希、聚合、校验
 * - inbound-confirm: 预览缓存和事务性确认写入
 * - inbound-query: 分页列表、详情和作废
 */

export type {
  InboundRawRow,
  InboundPreviewLine,
  InboundIgnoredRow,
  InboundPreviewResult,
  InboundBatch,
  InboundLine,
} from './inbound-types';

export {
  computeFileSha256,
  computeContentSha256,
  buildInboundPreview,
} from './inbound-preview';

export {
  cacheInboundPreview,
  confirmInboundImport,
} from './inbound-confirm';

export {
  listInboundBatches,
  getInboundDetail,
  voidInboundBatch,
} from './inbound-query';
