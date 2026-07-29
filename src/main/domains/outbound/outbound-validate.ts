import { getRawDb } from '../../db/connection';
import type { OutboundExportInput } from '@shared/schemas/index';
import { getCustomerById } from '../customers/customer-service';
import type { DraftValidationResult } from './outbound-types';

/**
 * 销项开票草稿校验。
 * 打开开票 Modal 前由主进程重新读取并校验启用、资料完整度和价格版本状态。
 */

/** 校验开票草稿，返回有效行、失效价格版本 ID 和错误 */
export function validateDraft(input: OutboundExportInput): DraftValidationResult {
  const result: DraftValidationResult = {
    validLines: [],
    invalidPriceVersionIds: [],
    errors: [],
  };

  const customer = getCustomerById(input.customerId);
  if (!customer) {
    result.errors.push('客户不存在');
    return result;
  }
  if (customer.status !== 'active') {
    result.errors.push('客户已停用，不能开票');
    return result;
  }

  const raw = getRawDb();
  for (const line of input.lines) {
    const pvRow = raw
      .prepare(
        `SELECT pv.id, pv.unit_price_decimal, pv.tax_rate, pv.stock_balance, pv.status as pv_status,
                p.name, p.model, p.unit, p.data_status, p.status as p_status
         FROM price_versions pv
         JOIN products p ON p.id = pv.product_id
         WHERE pv.id = ?`,
      )
      .get(line.priceVersionId) as PvQueryRow | undefined;

    if (!pvRow) {
      result.invalidPriceVersionIds.push(line.priceVersionId);
      result.errors.push(`价格版本 ${line.priceVersionId} 不存在`);
      continue;
    }

    const validationError = validatePvRow(pvRow);
    if (validationError) {
      result.invalidPriceVersionIds.push(line.priceVersionId);
      result.errors.push(validationError);
      continue;
    }

    result.validLines.push({
      priceVersionId: pvRow.id,
      name: pvRow.name,
      model: pvRow.model,
      unit: pvRow.unit,
      unitPriceDecimal: pvRow.unit_price_decimal,
      taxRate: pvRow.tax_rate,
      stockBalance: pvRow.stock_balance,
      quantity: line.quantity,
      amountCent: line.amountCent,
    });
  }

  return result;
}

interface PvQueryRow {
  id: string;
  unit_price_decimal: string;
  tax_rate: number;
  stock_balance: number;
  pv_status: string;
  name: string;
  model: string;
  unit: string;
  data_status: string;
  p_status: string;
}

/** 校验价格版本行的状态，返回错误信息或 null */
function validatePvRow(row: PvQueryRow): string | null {
  if (row.pv_status !== 'active') return `${row.name} 价格版本已停用`;
  if (row.p_status !== 'active') return `商品「${row.name}」已停用`;
  if (row.data_status !== 'complete') return `商品「${row.name}」资料不完整`;
  return null;
}
