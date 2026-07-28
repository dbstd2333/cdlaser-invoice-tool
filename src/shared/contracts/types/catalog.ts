import type { EntityId, IsoTimestamp } from './common';

/** 商品领域类型。 */

export type ProductDataStatus = 'complete' | 'incomplete';
export type ProductStatus = 'active' | 'inactive';
export type PriceVersionStatus = 'active' | 'inactive';

export interface Product {
  id: EntityId;
  name: string;
  nameNormalized: string;
  model: string;
  modelNormalized: string;
  unit: string;
  taxClassificationCode: string;
  dataStatus: ProductDataStatus;
  status: ProductStatus;
  remark: string | null;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

export interface PriceVersion {
  id: EntityId;
  productId: EntityId;
  unitPriceDecimal: string;
  taxRate: number;
  stockBalance: number;
  status: PriceVersionStatus;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

export interface PriceVersionRow {
  priceVersionId: EntityId;
  productId: EntityId;
  name: string;
  model: string;
  unit: string;
  taxClassificationCode: string;
  unitPriceDecimal: string;
  taxRate: number;
  stockBalance: number;
  dataStatus: ProductDataStatus;
  productStatus: ProductStatus;
  priceVersionStatus: PriceVersionStatus;
  remark: string | null;
  updatedAt: IsoTimestamp;
}
