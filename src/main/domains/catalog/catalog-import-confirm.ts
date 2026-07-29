import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { products, priceVersions } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { normalizeKey, trimInvisible } from '@shared/contracts/normalize';
import { normalizeUnitPrice } from '@shared/money/index';
import { recordAudit } from '../audit/audit-service';
import { appendLedger } from '../inventory/ledger-service';
import { markProductInitialImportDone, markDirty, getInitStatus } from '../audit/settings-service';
import { getCachedPreview, deleteCachedPreview } from './catalog-import-preview';
import type { CatalogImportRow } from './catalog-import-types';

/**
 * 商品导入确认服务。
 * 首次导入和日常导入的事务性写入。
 */

/** 确认首次导入：事务性写入商品、价格版本、初始库存流水 */
export function confirmInitialImport(token: string): { products: number; priceVersions: number } {
  if (getInitStatus().productInitialImportDone) {
    throw new Error('商品首次导入已完成，不能重复执行');
  }
  const preview = getCachedPreview(token);
  if (!preview) throw new Error('预览已过期，请重新选择文件');
  if (preview.hasErrors) throw new Error('存在错误行，无法导入');

  const db = getDb();
  const raw = getRawDb();
  const validRows = preview.rows.filter((r) => r.errors.length === 0 && !r.deduped);
  const batchId = uuidv7();
  let productCount = 0;
  let pvCount = 0;

  const tx = raw.transaction(() => {
    for (const row of validRows) {
      const { productId, isNewProduct } = findOrCreateProduct(db, row);
      if (isNewProduct) productCount++;

      const pvId = createPriceVersion(db, productId, normalizeUnitPrice(row.unitPriceDecimal), row.initialStock ?? 0);
      pvCount++;

      // 写入初始库存流水
      const initialStock = row.initialStock ?? 0;
      if (initialStock !== 0) {
        const { balanceAfter } = appendLedger({
          priceVersionId: pvId, changeQuantity: initialStock, balanceBefore: 0,
          sourceType: 'initialization', sourceId: batchId, reason: '首次导入初始库存',
        });
        if (balanceAfter !== initialStock) {
          db.update(priceVersions).set({ stockBalance: balanceAfter, updatedAt: new Date().toISOString() }).where(eq(priceVersions.id, pvId)).run();
        }
      }

      recordAudit({
        action: 'catalog.initial_import', entityType: 'price_version', entityId: pvId, sourceBatchId: batchId,
        summary: `首次导入: ${trimInvisible(row.name)} ${trimInvisible(row.model)} @ ${row.unitPriceDecimal}`,
      });
    }
    markProductInitialImportDone();
    markDirty();
  });

  tx();
  deleteCachedPreview(token);
  return { products: productCount, priceVersions: pvCount };
}

/** 确认日常导入：事务性写入新商品和新价格版本，不修改库存 */
export function confirmDailyImport(token: string): { products: number; priceVersions: number } {
  if (!getInitStatus().productInitialImportDone) {
    throw new Error('商品首次导入尚未完成，不能执行日常导入');
  }
  const preview = getCachedPreview(token);
  if (!preview) throw new Error('预览已过期，请重新选择文件');
  if (preview.hasErrors) throw new Error('存在错误行，无法导入');

  const db = getDb();
  const raw = getRawDb();
  const validRows = preview.rows.filter((r) => r.errors.length === 0 && !r.deduped);
  let productCount = 0;
  let pvCount = 0;

  const tx = raw.transaction(() => {
    for (const row of validRows) {
      const { productId, isNewProduct } = findOrCreateProduct(db, row);
      if (isNewProduct) productCount++;

      const pvId = createPriceVersion(db, productId, normalizeUnitPrice(row.unitPriceDecimal), 0);
      pvCount++;

      recordAudit({
        action: 'catalog.daily_import', entityType: 'price_version', entityId: pvId,
        summary: `日常导入新增价格版本: ${trimInvisible(row.name)} @ ${row.unitPriceDecimal}`,
      });
    }
    markDirty();
  });

  tx();
  deleteCachedPreview(token);
  return { products: productCount, priceVersions: pvCount };
}

/** 查找或创建商品，返回商品 ID 和是否新建 */
function findOrCreateProduct(db: ReturnType<typeof getDb>, row: CatalogImportRow): { productId: string; isNewProduct: boolean } {
  const nameNorm = normalizeKey(row.name);
  const modelNorm = normalizeKey(row.model);
  const existing = getRawDb()
    .prepare('SELECT id FROM products WHERE name_normalized = ? AND model_normalized = ?')
    .get(nameNorm, modelNorm) as { id: string } | undefined;
  if (existing) return { productId: existing.id, isNewProduct: false };

  const productId = uuidv7();
  const now = new Date().toISOString();
  db.insert(products).values({
    id: productId, name: trimInvisible(row.name), nameNormalized: nameNorm,
    model: trimInvisible(row.model), modelNormalized: modelNorm, unit: trimInvisible(row.unit),
    taxClassificationCode: trimInvisible(row.taxClassificationCode), dataStatus: 'complete',
    status: 'active', remark: row.remark ? trimInvisible(row.remark) : null, createdAt: now, updatedAt: now,
  }).run();
  return { productId, isNewProduct: true };
}

/** 创建价格版本 */
function createPriceVersion(db: ReturnType<typeof getDb>, productId: string, unitPriceDecimal: string, stockBalance: number): string {
  const pvId = uuidv7();
  const now = new Date().toISOString();
  db.insert(priceVersions).values({
    id: pvId, productId, unitPriceDecimal, taxRate: 13, stockBalance,
    status: 'active', createdAt: now, updatedAt: now,
  }).run();
  return pvId;
}
