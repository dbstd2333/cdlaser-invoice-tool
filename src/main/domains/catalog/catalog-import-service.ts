/**
 * 商品导入服务入口 - 重新导出各子模块。
 *
 * 模块拆分：
 * - catalog-import-types: 类型定义
 * - catalog-import-preview: 预览构建、校验和缓存
 * - catalog-import-confirm: 首次和日常导入的事务性确认
 */

export type { CatalogImportRow, CatalogImportPreviewResult } from './catalog-import-types';

export {
  buildInitialImportPreview,
  buildDailyImportPreview,
  cacheCatalogPreview,
} from './catalog-import-preview';

export {
  confirmInitialImport,
  confirmDailyImport,
} from './catalog-import-confirm';
