import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { products } from '../../db/schema/index';
import { normalizeKey, trimInvisible } from '@shared/contracts/normalize';
import { normalizeUnitPrice } from '@shared/money/index';
import { recordAudit } from '../audit/audit-service';
import { appendLedger } from '../inventory/ledger-service';
import { getInitStatus, markDirty, markProductInitialImportDone } from '../audit/settings-service';
import { deleteCachedPreview, getCachedPreview } from './catalog-import-preview';
import type { CatalogImportRow } from './catalog-import-types';

interface ImportResult {
  products: number;
  updatedProducts: number;
}

/** 首次导入商品、唯一含税单价和初始库存。 */
export function confirmInitialImport(token: string): ImportResult {
  if (getInitStatus().productInitialImportDone) throw new Error('商品首次导入已完成，不能重复执行');
  const preview = requirePreview(token);
  const batchId = uuidv7();
  const result = getRawDb().transaction(() => {
    const imported = writeRows(preview.rows, true, batchId);
    markProductInitialImportDone();
    markDirty();
    return imported;
  })();
  deleteCachedPreview(token);
  return result;
}

/** 日常导入新增商品，或更新已有商品的当前含税单价。 */
export function confirmDailyImport(token: string): ImportResult {
  if (!getInitStatus().productInitialImportDone) throw new Error('商品首次导入尚未完成，不能执行日常导入');
  const preview = requirePreview(token);
  const result = writeRows(preview.rows, false, uuidv7());
  deleteCachedPreview(token);
  return result;
}

/** 校验并读取缓存预览。 */
function requirePreview(token: string) {
  const preview = getCachedPreview(token);
  if (!preview) throw new Error('预览已过期，请重新选择文件');
  if (preview.hasErrors) throw new Error('存在错误行，无法导入');
  return preview;
}

/** 在单个事务中写入商品导入行。 */
function writeRows(rows: CatalogImportRow[], isInitial: boolean, batchId: string): ImportResult {
  let productCount = 0;
  let updatedProducts = 0;
  const validRows = rows.filter((row) => row.errors.length === 0 && !row.deduped);
  getRawDb().transaction(() => {
    for (const row of validRows) {
      const existing = findProduct(row);
      if (existing) {
        updateImportedProduct(existing.id, row);
        updatedProducts++;
      } else {
        const productId = insertProduct(row, isInitial ? row.initialStock ?? 0 : 0);
        productCount++;
        if (isInitial && (row.initialStock ?? 0) !== 0) {
          appendLedger({
            productId,
            changeQuantity: row.initialStock ?? 0,
            balanceBefore: 0,
            sourceType: 'initialization',
            sourceId: batchId,
            reason: '首次导入初始库存',
          });
        }
        recordAudit({
          action: isInitial ? 'catalog.initial_import' : 'catalog.daily_import',
          entityType: 'product',
          entityId: productId,
          sourceBatchId: batchId,
          summary: `${isInitial ? '首次' : '日常'}导入: ${row.name} ${row.model} @ ${row.unitPriceDecimal}`,
        });
      }
    }
    markDirty();
  })();
  return { products: productCount, updatedProducts };
}

/** 查找同名同型号商品。 */
function findProduct(row: CatalogImportRow): { id: string } | undefined {
  return getRawDb()
    .prepare('SELECT id FROM products WHERE name_normalized = ? AND model_normalized = ?')
    .get(normalizeKey(row.name), normalizeKey(row.model)) as { id: string } | undefined;
}

/** 新增导入商品。 */
function insertProduct(row: CatalogImportRow, stockBalance: number): string {
  const productId = uuidv7();
  const now = new Date().toISOString();
  getDb().insert(products).values({
    id: productId,
    name: trimInvisible(row.name),
    nameNormalized: normalizeKey(row.name),
    model: trimInvisible(row.model),
    modelNormalized: normalizeKey(row.model),
    unit: trimInvisible(row.unit),
    taxClassificationCode: trimInvisible(row.taxClassificationCode),
    unitPriceDecimal: normalizeUnitPrice(row.unitPriceDecimal),
    taxRate: 13,
    stockBalance,
    dataStatus: 'complete',
    status: 'active',
    remark: row.remark ? trimInvisible(row.remark) : null,
    createdAt: now,
    updatedAt: now,
  }).run();
  return productId;
}

/** 更新日常导入商品的资料和当前含税单价。 */
function updateImportedProduct(productId: string, row: CatalogImportRow): void {
  getDb().update(products).set({
    unit: trimInvisible(row.unit),
    taxClassificationCode: trimInvisible(row.taxClassificationCode),
    unitPriceDecimal: normalizeUnitPrice(row.unitPriceDecimal),
    remark: row.remark ? trimInvisible(row.remark) : null,
    updatedAt: new Date().toISOString(),
  }).where(eq(products.id, productId)).run();
  recordAudit({
    action: 'catalog.daily_import',
    entityType: 'product',
    entityId: productId,
    summary: `日常导入更新含税单价: ${row.name} @ ${row.unitPriceDecimal}`,
  });
}
