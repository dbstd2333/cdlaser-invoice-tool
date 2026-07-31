import { products } from '../../db/schema/index';
import type { Product } from '@shared/contracts/types';

/** 将商品数据库行映射为业务实体。 */
export function mapProduct(row: typeof products.$inferSelect): Product {
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
    updatedAt: row.updatedAt,
  };
}
