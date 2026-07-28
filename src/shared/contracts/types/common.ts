/** 通用类型和工具函数。 */

/** 实体主键：UUIDv7 文本 */
export type EntityId = string;

/** 时间戳：UTC ISO 8601 文本 */
export type IsoTimestamp = string;

/** 库存状态标签 */
export type StockStatus = 'positive' | 'zero' | 'negative';

/** 通用分页请求 */
export interface PageRequest {
  page: number;
  pageSize: number;
}

/** 通用分页响应 */
export interface PageResponse<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 初始化状态 */
export interface InitStatus {
  customerInitialImportDone: boolean;
  productInitialImportDone: boolean;
  templateVersion: string | null;
}

/** 库存状态判定 */
export function getStockStatus(balance: number): StockStatus {
  if (balance > 0) return 'positive';
  if (balance < 0) return 'negative';
  return 'zero';
}

/** 库存状态显示文本 */
export function getStockStatusText(balance: number): string {
  const status = getStockStatus(balance);
  switch (status) {
    case 'positive':
      return `有余量 ${balance}`;
    case 'negative':
      return `待补 ${Math.abs(balance)}`;
    case 'zero':
      return '已平衡';
  }
}
