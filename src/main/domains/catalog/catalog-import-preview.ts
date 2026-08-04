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
export function buildInitialImportPreview(rawRows: Omit<CatalogImportRow, 'errors' | 'deduped'>[]): CatalogImportPreviewResult {
  return buildPreview(rawRows, true);
}

/** 构建日常导入预览 */
export function buildDailyImportPreview(rawRows: Omit<CatalogImportRow, 'errors' | 'deduped'>[]): CatalogImportPreviewResult {
  return buildPreview(rawRows, false);
}

/** 构建预览的通用逻辑 */
function buildPreview(rawRows: Omit<CatalogImportRow, 'errors' | 'deduped'>[], isInitial: boolean): CatalogImportPreviewResult {
  const rows: CatalogImportRow[] = [];
  const errors: Array<{ rowIndex: number; field: string; reason: string }> = [];
  const seenPriceKeys = new Map<string, number>();
  const acceptedProductKeys = new Set<string>();
  const productMetadata = new Map<string, { unit: string; taxCode: string }>();
  let newProductCount = 0;
  let newPriceVariantCount = 0;
  let totalStockSum = 0;
  let dedupedRowCount = 0;

  for (const raw of rawRows) {
    const row: CatalogImportRow = { ...raw, initialStock: isInitial ? raw.initialStock : null, errors: [], deduped: false };
    const rowErrors = validateRow(row, isInitial);
    row.errors = rowErrors;
    rowErrors.forEach((e) => errors.push({ rowIndex: raw.rowIndex, field: '', reason: e }));

    const nameNorm = normalizeKey(row.name);
    const modelNorm = normalizeKey(row.model);
    const unitPriceNormalized = row.unitPriceDecimal ? normalizeUnitPriceSafe(row.unitPriceDecimal) : '';
    const productKey = `${nameNorm}|${modelNorm}`;
    const priceKey = `${productKey}|${unitPriceNormalized}`;

    // 文件内相同名称、型号和规范化价格仅保留首行。
    if (rowErrors.length === 0 && seenPriceKeys.has(priceKey)) {
      row.deduped = true;
      row.errors = [`与第 ${seenPriceKeys.get(priceKey)} 行商品和价格重复，已自动去重`];
      dedupedRowCount++;
    } else if (rowErrors.length === 0) {
      seenPriceKeys.set(priceKey, raw.rowIndex);
    }

    // 数据库重复和冲突检测（已去重行跳过）
    if (rowErrors.length === 0 && !row.deduped) {
      const metadata = { unit: trimInvisible(row.unit), taxCode: trimInvisible(row.taxClassificationCode) };
      const knownMetadata = productMetadata.get(productKey);
      if (knownMetadata && knownMetadata.unit !== metadata.unit) {
        const error = `单位与同文件商品不一致（已有: ${knownMetadata.unit}）`;
        row.errors.push(error);
        errors.push({ rowIndex: raw.rowIndex, field: '', reason: error });
      }
      if (knownMetadata && knownMetadata.taxCode !== metadata.taxCode) {
        const error = '税收分类编码与同文件商品不一致';
        row.errors.push(error);
        errors.push({ rowIndex: raw.rowIndex, field: '', reason: error });
      }
      const dbCheck = checkDatabaseConflict(row, nameNorm, modelNorm, unitPriceNormalized, isInitial);
      dbCheck.errors.forEach((e) => {
        row.errors.push(e);
        errors.push({ rowIndex: raw.rowIndex, field: '', reason: e });
      });
      if (dbCheck.errors.length === 0 && row.errors.length === 0) {
        if (dbCheck.hasExistingNameModel || acceptedProductKeys.has(productKey)) newPriceVariantCount++;
        else newProductCount++;
        acceptedProductKeys.add(productKey);
        productMetadata.set(productKey, metadata);
        if (isInitial && row.initialStock != null) totalStockSum += row.initialStock;
      }
    }

    rows.push(row);
  }

  // 去重行不算错误，不计入 errorCount / hasErrors
  const errorCount = rows.filter((r) => r.errors.length > 0 && !r.deduped).length;
  return {
    rows, newProductCount, newPriceVariantCount,
    totalStockSum: isInitial ? totalStockSum : 0,
    errorCount, dedupedRowCount, hasErrors: errorCount > 0, errors, isInitial,
  };
}

/** 检查与数据库已有商品的冲突 */
function checkDatabaseConflict(
  row: CatalogImportRow,
  nameNorm: string,
  modelNorm: string,
  unitPriceNormalized: string,
  isInitial: boolean,
): { errors: string[]; hasExistingNameModel: boolean } {
  const errors: string[] = [];

  const existingProducts = getRawDb()
    .prepare('SELECT id, unit, tax_classification_code, unit_price_decimal FROM products WHERE name_normalized = ? AND model_normalized = ?')
    .all(nameNorm, modelNorm) as Array<{ id: string; unit: string; tax_classification_code: string; unit_price_decimal: string }>;

  if (existingProducts.length > 0) {
    const metadataProduct = existingProducts[0];
    if (metadataProduct.unit !== trimInvisible(row.unit)) {
      errors.push(`单位与已有商品不一致（已有: ${metadataProduct.unit}）`);
    }
    if (metadataProduct.tax_classification_code !== trimInvisible(row.taxClassificationCode)) {
      errors.push('税收分类编码与已有商品不一致');
    }
    if (existingProducts.some((product) => product.unit_price_decimal === unitPriceNormalized)) {
      errors.push(isInitial ? '该商品和含税单价已存在' : '该商品和含税单价已存在，日常导入不允许重复');
    }
  }

  return { errors, hasExistingNameModel: existingProducts.length > 0 };
}
