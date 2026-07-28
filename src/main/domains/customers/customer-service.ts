/**
 * 客户服务入口 - 重新导出各子模块。
 *
 * 模块拆分：
 * - customer-mappers: 数据库行映射
 * - customer-query: 分页查询和单条查询
 * - customer-crud: 新增、编辑、状态切换
 * - customer-import-service: 首次导入预览和确认
 */

export { mapCustomerRow as mapRow } from './customer-mappers';
export type { CustomerImportPreviewRow, CustomerImportPreviewResult } from './customer-import-service';

export { listCustomers, getCustomerById } from './customer-query';
export { createCustomer, updateCustomer, toggleCustomerStatus } from './customer-crud';
