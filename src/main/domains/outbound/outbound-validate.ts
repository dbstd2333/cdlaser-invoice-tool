import { getRawDb } from '../../db/connection';
import type { OutboundExportInput } from '@shared/schemas/index';
import { getCustomerById } from '../customers/customer-service';
import type { DraftValidationResult } from './outbound-types';

/** 重新读取商品当前状态和含税单价，校验开票草稿。 */
export function validateDraft(input: OutboundExportInput): DraftValidationResult {
  const result: DraftValidationResult = { validLines: [], invalidProductIds: [], errors: [] };
  const customer = getCustomerById(input.customerId);
  if (!customer) {
    result.errors.push('客户不存在');
    return result;
  }
  if (customer.status !== 'active') {
    result.errors.push('客户已停用，不能开票');
    return result;
  }

  for (const line of input.lines) {
    const row = getRawDb().prepare(`
      SELECT id, name, model, unit, unit_price_decimal, tax_rate, stock_balance, data_status, status
      FROM products WHERE id = ?
    `).get(line.productId) as ProductQueryRow | undefined;
    if (!row) {
      result.invalidProductIds.push(line.productId);
      result.errors.push(`商品 ${line.productId} 不存在`);
      continue;
    }
    const error = validateProduct(row);
    if (error) {
      result.invalidProductIds.push(line.productId);
      result.errors.push(error);
      continue;
    }
    result.validLines.push({
      productId: row.id,
      name: row.name,
      model: row.model,
      unit: row.unit,
      unitPriceDecimal: row.unit_price_decimal,
      taxRate: row.tax_rate,
      stockBalance: row.stock_balance,
      quantity: line.quantity,
      amountCent: line.amountCent,
    });
  }
  return result;
}

interface ProductQueryRow {
  id: string;
  name: string;
  model: string;
  unit: string;
  unit_price_decimal: string;
  tax_rate: number;
  stock_balance: number;
  data_status: string;
  status: string;
}

/** 校验商品是否可以开票。 */
function validateProduct(row: ProductQueryRow): string | null {
  if (row.status !== 'active') return `商品「${row.name}」已停用`;
  if (row.data_status !== 'complete') return `商品「${row.name}」资料不完整`;
  return null;
}
