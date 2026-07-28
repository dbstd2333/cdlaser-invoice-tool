/**
 * 商品与价格版本服务入口 - 重新导出各子模块。
 *
 * 模块拆分：
 * - catalog-mappers: 数据库行映射
 * - catalog-query: 分页查询和单条查询
 * - catalog-crud: 新增、编辑、状态切换
 */

export { mapProduct, mapPriceVersion } from './catalog-mappers';

export {
  listPriceVersions,
  getProductById,
  getPriceVersionsByProduct,
  getPriceVersionById,
  getPriceVersionsByIds,
} from './catalog-query';

export {
  createProduct,
  updateProduct,
  toggleProductStatus,
  createPriceVersion,
  togglePriceVersionStatus,
} from './catalog-crud';
