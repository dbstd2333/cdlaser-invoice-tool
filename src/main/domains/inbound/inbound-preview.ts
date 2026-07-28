import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { getRawDb } from '../../db/connection';
import {
  normalizeKey,
  trimInvisible,
} from '@shared/contracts/normalize';
import { normalizeUnitPrice, calcAmountCent, calcTaxCent, calcTotalCent } from '@shared/money/index';
import type { InboundRawRow, InboundPreviewLine, InboundPreviewResult, InboundIgnoredRow } from './inbound-types';

/**
 * 进项导入预览服务。
 * 解析、哈希计算、行聚合、已有商品匹配和全量校验。
 */

/** 计算文件 SHA-256 */
export function computeFileSha256(filePath: string): string {
  const buf = readFileSync(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

/** 计算标准化内容哈希（基于业务键） */
export function computeContentSha256(lines: InboundPreviewLine[]): string {
  const content = lines
    .map((l) => `${normalizeKey(l.name)}|${normalizeKey(l.model)}|${normalizeKey(l.unit)}|${l.unitPriceDecimal}|${l.quantity}`)
    .sort()
    .join('\n');
  return createHash('sha256').update(content).digest('hex');
}

/** 安全规范化单价（出错返回原值） */
function normalizeUnitPriceSafe(input: string): string {
  try {
    return normalizeUnitPrice(input);
  } catch {
    return trimInvisible(input);
  }
}

/** 校验非库存费用行：型号、单位和数量均为空 */
function isNonInventoryExpenseRow(model: string, unit: string, quantity: number | null): boolean {
  return !model && !unit && (quantity == null || quantity === 0);
}

/** 校验单行必填字段，返回错误列表 */
function validateRowFields(name: string, model: string, unit: string, price: string, quantity: number | null): string[] {
  const errors: string[] = [];
  if (!name) errors.push('品名必填');
  if (!model) errors.push('型号必填');
  if (!unit) errors.push('单位必填');
  if (!price) errors.push('单价必填');
  if (quantity == null) errors.push('数量必填');
  else if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.push('数量必须为正整数');
  }
  return errors;
}

/** 聚合相同业务键的行 */
function aggregateRows(rawRows: InboundRawRow[]): Map<string, { firstRow: InboundRawRow; totalQuantity: number; rows: InboundRawRow[] }> {
  const aggregatedMap = new Map<string, { firstRow: InboundRawRow; totalQuantity: number; rows: InboundRawRow[] }>();
  for (const raw of rawRows) {
    const name = trimInvisible(raw.name);
    const model = trimInvisible(raw.model);
    const unit = trimInvisible(raw.unit);
    const price = raw.unitPriceDecimal ? normalizeUnitPriceSafe(raw.unitPriceDecimal) : '';
    const key = `${normalizeKey(name)}|${normalizeKey(model)}|${normalizeKey(unit)}|${price}`;
    if (aggregatedMap.has(key)) {
      const entry = aggregatedMap.get(key)!;
      entry.totalQuantity += raw.quantity!;
      entry.rows.push(raw);
    } else {
      aggregatedMap.set(key, { firstRow: raw, totalQuantity: raw.quantity!, rows: [raw] });
    }
  }
  return aggregatedMap;
}

/** 匹配已有商品和价格版本，返回匹配结果和错误 */
function matchExistingProduct(name: string, model: string, unit: string, price: string, quantity: number): {
  isNewProduct: boolean;
  productId: string | null;
  priceVersionId: string | null;
  isNewPriceVersion: boolean;
  matched: boolean;
  errors: string[];
  newProductCount: number;
  newPriceVersionCount: number;
} {
  const raw = getRawDb();
  const nameNorm = normalizeKey(name);
  const modelNorm = normalizeKey(model);
  const result = { isNewProduct: false, productId: null as string | null, priceVersionId: null as string | null, isNewPriceVersion: false, matched: false, errors: [] as string[], newProductCount: 0, newPriceVersionCount: 0 };

  const existingProduct = raw
    .prepare('SELECT id, unit, tax_classification_code, data_status FROM products WHERE name_normalized = ? AND model_normalized = ?')
    .get(nameNorm, modelNorm) as { id: string; unit: string; tax_classification_code: string; data_status: string } | undefined;

  if (existingProduct) {
    result.productId = existingProduct.id;
    if (existingProduct.unit !== unit) {
      result.errors.push(`单位不一致（已有: ${existingProduct.unit}，导入: ${unit}）`);
    }
    const existingPv = raw
      .prepare('SELECT id, stock_balance FROM price_versions WHERE product_id = ? AND unit_price_decimal = ?')
      .get(existingProduct.id, price) as { id: string; stock_balance: number } | undefined;

    if (existingPv) {
      result.priceVersionId = existingPv.id;
      result.matched = true;
      if (existingPv.stock_balance < 0 && quantity > Math.abs(existingPv.stock_balance)) {
        result.errors.push(`当前库存 ${existingPv.stock_balance}，导入数量 ${quantity} 超过待补数量 ${Math.abs(existingPv.stock_balance)}`);
      }
    } else {
      result.errors.push('出现未建档的新单价，需人工确认');
      result.isNewPriceVersion = true;
    }
  } else {
    result.isNewProduct = true;
    result.newProductCount = 1;
    result.newPriceVersionCount = 1;
    result.matched = true;
  }
  return result;
}

/**
 * 构建进项导入预览。
 * @param rawRows 从 Excel 解析的原始行
 * @param fileSha256 文件 SHA-256
 */
export function buildInboundPreview(rawRows: InboundRawRow[], fileSha256: string): InboundPreviewResult {
  const lines: InboundPreviewLine[] = [];
  const ignoredRows: InboundIgnoredRow[] = [];
  const errors: Array<{ sourceSheet: string; sourceRow: number; field: string; reason: string }> = [];

  for (const raw of rawRows) {
    const name = trimInvisible(raw.name);
    const model = trimInvisible(raw.model);
    const unit = trimInvisible(raw.unit);
    const price = raw.unitPriceDecimal ? normalizeUnitPriceSafe(raw.unitPriceDecimal) : '';

    // 忽略完整的非库存费用行
    if (isNonInventoryExpenseRow(model, unit, raw.quantity)) {
      ignoredRows.push({ sourceSheet: raw.sourceSheet, sourceRow: raw.sourceRow, reason: '非库存费用行', description: name || '(空品名)' });
      continue;
    }

    // 部分填写行报错
    const partialErrors = validateRowFields(name, model, unit, price, raw.quantity);
    if (partialErrors.length > 0) {
      for (const e of partialErrors) errors.push({ sourceSheet: raw.sourceSheet, sourceRow: raw.sourceRow, field: '', reason: e });
      lines.push(buildErrorLine(raw, name, model, unit, price, partialErrors));
      continue;
    }
  }

  // 聚合并处理
  const aggregatedMap = aggregateRows(rawRows.filter((r) => {
    const model = trimInvisible(r.model);
    const unit = trimInvisible(r.unit);
    const price = r.unitPriceDecimal ? normalizeUnitPriceSafe(r.unitPriceDecimal) : '';
    return !isNonInventoryExpenseRow(model, unit, r.quantity) && validateRowFields(trimInvisible(r.name), model, unit, price, r.quantity).length === 0;
  }));

  let totalQuantity = 0;
  let totalAmountCent = 0;
  let totalTaxCent = 0;
  let totalCent = 0;
  let newProductCount = 0;
  let newPriceVersionCount = 0;

  for (const [, entry] of aggregatedMap) {
    const raw = entry.firstRow;
    const name = trimInvisible(raw.name);
    const model = trimInvisible(raw.model);
    const unit = trimInvisible(raw.unit);
    const price = normalizeUnitPrice(raw.unitPriceDecimal);
    const quantity = entry.totalQuantity;

    const amountCent = calcAmountCent(quantity, price);
    const taxCent = calcTaxCent(amountCent);
    const totalLine = calcTotalCent(amountCent, taxCent);
    totalQuantity += quantity;
    totalAmountCent += amountCent;
    totalTaxCent += taxCent;
    totalCent += totalLine;

    const match = matchExistingProduct(name, model, unit, price, quantity);
    newProductCount += match.newProductCount;
    newPriceVersionCount += match.newPriceVersionCount;

    if (match.errors.length > 0) {
      for (const e of match.errors) errors.push({ sourceSheet: raw.sourceSheet, sourceRow: raw.sourceRow, field: '', reason: e });
    }

    lines.push({
      sourceSheet: raw.sourceSheet, sourceRow: raw.sourceRow, invoiceDate: raw.invoiceDate, invoiceNo: raw.invoiceNo, sellerName: raw.sellerName,
      name, model, unit, unitPriceDecimal: price, quantity, amountCent, taxCent, totalCent: totalLine,
      isNewProduct: match.isNewProduct, productId: match.productId, priceVersionId: match.priceVersionId, isNewPriceVersion: match.isNewPriceVersion, matched: match.matched, errors: match.errors,
    });
  }

  const contentSha256 = computeContentSha256(lines.filter((l) => l.errors.length === 0));

  // 重复导入检查
  const existing = getRawDb()
    .prepare('SELECT id FROM inbound_batches WHERE file_sha256 = ? OR content_sha256 = ?')
    .get(fileSha256, contentSha256) as { id: string } | undefined;
  if (existing) {
    errors.push({ sourceSheet: '', sourceRow: 0, field: 'file', reason: '该文件已导入过，不允许重复导入' });
  }

  const hasErrors = errors.length > 0;
  return {
    lines, ignoredRows, fileSha256, contentSha256, hasErrors, errors,
    totalQuantity: hasErrors ? 0 : totalQuantity, totalAmountCent: hasErrors ? 0 : totalAmountCent,
    totalTaxCent: hasErrors ? 0 : totalTaxCent, totalCent: hasErrors ? 0 : totalCent,
    newProductCount, newPriceVersionCount,
  };
}

/** 构建错误行 */
function buildErrorLine(raw: InboundRawRow, name: string, model: string, unit: string, price: string, errors: string[]): InboundPreviewLine {
  return {
    sourceSheet: raw.sourceSheet, sourceRow: raw.sourceRow, invoiceDate: raw.invoiceDate, invoiceNo: raw.invoiceNo, sellerName: raw.sellerName,
    name, model, unit, unitPriceDecimal: price, quantity: raw.quantity ?? 0, amountCent: 0, taxCent: 0, totalCent: 0,
    isNewProduct: false, productId: null, priceVersionId: null, isNewPriceVersion: false, matched: false, errors,
  };
}
