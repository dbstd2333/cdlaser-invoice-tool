import { v7 as uuidv7 } from 'uuid';
import { getRawDb } from '../../db/connection';
import { normalizeKey, trimInvisible } from '@shared/contracts/normalize';
import { normalizeUnitPrice } from '@shared/money/index';
import type { CatalogImportRow, CatalogImportPreviewResult } from './catalog-import-types';

/**
 * 商品导入预览服务。
 * 首次导入和日常导入的预览构建，包含校验和重复检测。
 */

/** 预览令牌缓存 */
const previewCache = new Map<string, CatalogImportPreviewResult>();

/** 缓存预览，返回令牌 */
export function cacheCatalogPreview(result: CatalogImportPreviewResult): string {
  const token = uuidv7();
  previewCache.set(token, result);
  setTimeout(() => previewCache.delete(token), 30 * 60 * 1000);
  return token;
}

/** 获取缓存的预览 */
export function getCachedPreview(token: string): CatalogImportPreviewResult | undefined {
  return previewCache.get(token);
}

/** 删除缓存的预览 */
export function deleteCachedPreview(token: string): void {
  previewCache.delete(token);
}

/** 校验单行 */
function validateRow(row: CatalogImportRow, isInitial: boolean): string[] {
  const errors: string[] = [];
  if (!row.name) errors.push('项目名称必填');
  if (!row.model) errors.push('规格型号必填');
  if (!row.unit) errors.push('单位必填');
  if (!row.taxClassificationCode) errors.push('税收分类编码必填');
  if (!row.unitPriceDecimal) errors.push('单价必填');

  try {
    if (row.unitPriceDecimal) normalizeUnitPrice(row.unitPriceDecimal);
  } catch (e) {
    errors.push(`单价错误: ${(e as Error).message}`);
  }

  if (isInitial && row.initialStock != null && !Number.isInteger(row.initialStock)) {
    errors.push('初始库存必须为整数');
  }
  return errors;
}

/** 安全规范化单价（出错返回原值） */
function normalizeUnitPriceSafe(input: string): string {
  try {
    return normalizeUnitPrice(input);
  } catch {
    return trimInvisible(input);
  }
}

/** 构建首次导入预览 */
export function buildInitialImportPreview(rawRows: Omit<CatalogImportRow, 'errors'>[]): CatalogImportPreviewResult {
  return buildPreview(rawRows, true);
}

/** 构建日常导入预览 */
export function buildDailyImportPreview(rawRows: Omit<CatalogImportRow, 'errors'>[]): CatalogImportPreviewResult {
  return buildPreview(rawRows, false);
}

/** 构建预览的通用逻辑 */
function buildPreview(rawRows: Omit<CatalogImportRow, 'errors'>[], isInitial: boolean): CatalogImportPreviewResult {
  const rows: CatalogImportRow[] = [];
  const errors: Array<{ rowIndex: number; field: string; reason: string }> = [];
  const seenPriceKeys = new Map<string, number>();
  let newProductCount = 0;
  let newPriceVersionCount = 0;
  let totalStockSum = 0;

  for (const raw of rawRows) {
    const row: CatalogImportRow = { ...raw, initialStock: isInitial ? raw.initialStock : null, errors: [] };
    const rowErrors = validateRow(row, isInitial);
    row.errors = rowErrors;
    rowErrors.forEach((e) => errors.push({ rowIndex: raw.rowIndex, field: '', reason: e }));

    const nameNorm = normalizeKey(row.name);
    const modelNorm = normalizeKey(row.model);
    const unitPriceNormalized = row.unitPriceDecimal ? normalizeUnitPriceSafe(row.unitPriceDecimal) : '';
    const priceKey = `${nameNorm}|${modelNorm}|${unitPriceNormalized}`;

    // 文件内重复检测
    if (seenPriceKeys.has(priceKey)) {
      const errMsg = `相同商品相同单价与第 ${seenPriceKeys.get(priceKey)} 行重复`;
      row.errors.push(errMsg);
      errors.push({ rowIndex: raw.rowIndex, field: 'unitPriceDecimal', reason: errMsg });
    } else if (rowErrors.length === 0) {
      seenPriceKeys.set(priceKey, raw.rowIndex);
    }

    // 数据库重复和冲突检测
    if (rowErrors.length === 0) {
      const dbCheck = checkDatabaseConflict(row, nameNorm, modelNorm, unitPriceNormalized, isInitial);
      dbCheck.errors.forEach((e) => {
        row.errors.push(e);
        errors.push({ rowIndex: raw.rowIndex, field: '', reason: e });
      });
      if (dbCheck.isNewProduct) newProductCount++;
      if (dbCheck.isNewPriceVersion) newPriceVersionCount++;
      if (isInitial && row.initialStock != null) totalStockSum += row.initialStock;
    }

    rows.push(row);
  }

  const errorCount = rows.filter((r) => r.errors.length > 0).length;
  return {
    rows, newProductCount, newPriceVersionCount,
    totalStockSum: isInitial ? totalStockSum : 0,
    errorCount, hasErrors: errorCount > 0, errors, isInitial,
  };
}

/** 检查与数据库已有商品的冲突 */
function checkDatabaseConflict(
  row: CatalogImportRow,
  nameNorm: string,
  modelNorm: string,
  unitPriceNormalized: string,
  isInitial: boolean,
): { errors: string[]; isNewProduct: boolean; isNewPriceVersion: boolean } {
  const errors: string[] = [];
  let isNewProduct = false;
  let isNewPriceVersion = false;

  const existingProduct = getRawDb()
    .prepare('SELECT id, unit, tax_classification_code FROM products WHERE name_normalized = ? AND model_normalized = ?')
    .get(nameNorm, modelNorm) as { id: string; unit: string; tax_classification_code: string } | undefined;

  if (existingProduct) {
    if (!isInitial && existingProduct.unit !== trimInvisible(row.unit)) {
      errors.push(`单位与已有商品不一致（已有: ${existingProduct.unit}）`);
    }
    if (!isInitial && existingProduct.tax_classification_code !== trimInvisible(row.taxClassificationCode)) {
      errors.push('税收分类编码与已有商品不一致');
    }
    const existingPv = getRawDb()
      .prepare('SELECT id FROM price_versions WHERE product_id = ? AND unit_price_decimal = ?')
      .get(existingProduct.id, unitPriceNormalized) as { id: string } | undefined;
    if (existingPv) {
      errors.push(isInitial ? '该商品和单价已存在' : '该商品和单价已存在，日常导入不允许覆盖');
    } else {
      isNewPriceVersion = true;
    }
  } else {
    isNewProduct = true;
    isNewPriceVersion = true;
  }

  return { errors, isNewProduct, isNewPriceVersion };
}
