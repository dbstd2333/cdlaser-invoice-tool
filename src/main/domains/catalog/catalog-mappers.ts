import { products, priceVersions } from '../../db/schema/index';
import type { Product, PriceVersion, PriceVersionRow } from '@shared/contracts/types';

/**
 * 商品与价格版本的数据库行映射。
 */

/** 将商品行映射为业务实体 */
export function mapProduct(row: typeof products.$inferSelect): Product {
  return {
    id: row.id, name: row.name, nameNormalized: row.nameNormalized,
    model: row.model, modelNormalized: row.modelNormalized, unit: row.unit,
    taxClassificationCode: row.taxClassificationCode, dataStatus: row.dataStatus,
    status: row.status, remark: row.remark, createdAt: row.createdAt, updatedAt: row.updatedAt,
  };
}

/** 将价格版本行映射为业务实体 */
export function mapPriceVersion(row: typeof priceVersions.$inferSelect): PriceVersion {
  return {
    id: row.id, productId: row.productId, unitPriceDecimal: row.unitPriceDecimal,
    taxRate: row.taxRate, stockBalance: row.stockBalance, status: row.status,
    createdAt: row.createdAt, updatedAt: row.updatedAt,
  };
}

/** 联合查询映射为页面二表格行 */
export function mapPriceVersionRow(row: Record<string, unknown>): PriceVersionRow {
  return {
    priceVersionId: row.price_version_id as string,
    productId: row.product_id as string,
    name: row.name as string,
    model: row.model as string,
    unit: row.unit as string,
    taxClassificationCode: row.tax_classification_code as string,
    unitPriceDecimal: row.unit_price_decimal as string,
    taxRate: row.tax_rate as number,
    stockBalance: row.stock_balance as number,
    dataStatus: row.data_status as 'complete' | 'incomplete',
    productStatus: row.product_status as 'active' | 'inactive',
    priceVersionStatus: row.price_version_status as 'active' | 'inactive',
    remark: row.remark as string | null,
    updatedAt: row.updated_at as string,
  };
}
