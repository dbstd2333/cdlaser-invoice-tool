import type { EntityId, IsoTimestamp } from './common';

/** 商品领域类型。 */

export type ProductDataStatus = 'complete' | 'incomplete';
export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: EntityId;
  name: string;
  nameNormalized: string;
  model: string;
  modelNormalized: string;
  unit: string;
  taxClassificationCode: string;
  unitPriceDecimal: string;
  taxRate: number;
  stockBalance: number;
  dataStatus: ProductDataStatus;
  status: ProductStatus;
  remark: string | null;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}
