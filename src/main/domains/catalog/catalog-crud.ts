import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { products, priceVersions } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import type { Product, PriceVersion } from '@shared/contracts/types';
import type { ProductUpsertInput, PriceVersionCreateInput } from '@shared/schemas/index';
import { normalizeKey, trimInvisible } from '@shared/contracts/normalize';
import { normalizeUnitPrice } from '@shared/money/index';
import { recordAudit, diffField, type AuditFieldDelta } from '../audit/audit-service';
import { markDirty } from '../audit/settings-service';
import { getProductById, getPriceVersionById } from './catalog-query';

/**
 * 商品与价格版本 CRUD 服务。
 */

/** 新增商品 */
export function createProduct(input: ProductUpsertInput): Product {
  const db = getDb();
  const { nameNorm, modelNorm } = normalizeProductKeys(input.name, input.model);

  ensureProductUnique(nameNorm, modelNorm);

  const id = uuidv7();
  const now = new Date().toISOString();
  const taxCode = trimInvisible(input.taxClassificationCode);
  const dataStatus: 'complete' | 'incomplete' = taxCode ? 'complete' : 'incomplete';

  db.insert(products).values({
    id: id, name: trimInvisible(input.name), nameNormalized: nameNorm,
    model: trimInvisible(input.model), modelNormalized: modelNorm, unit: trimInvisible(input.unit),
    taxClassificationCode: taxCode, dataStatus, status: input.status ?? 'active',
    remark: input.remark ? trimInvisible(input.remark) : null, createdAt: now, updatedAt: now,
  }).run();

  recordAudit({ action: 'product.create', entityType: 'product', entityId: id, summary: `新增商品: ${trimInvisible(input.name)}` });
  markDirty();
  return getProductById(id)!;
}

/** 编辑商品资料 */
export function updateProduct(input: ProductUpsertInput): Product {
  if (!input.id) throw new Error('商品 ID 必填');
  const db = getDb();
  const old = getProductById(input.id);
  if (!old) throw new Error('商品不存在');

  const { nameNorm, modelNorm } = normalizeProductKeys(input.name, input.model);
  ensureProductUnique(nameNorm, modelNorm, input.id);

  const now = new Date().toISOString();
  const taxCode = trimInvisible(input.taxClassificationCode);
  const dataStatus: 'complete' | 'incomplete' = taxCode ? 'complete' : 'incomplete';

  const updates = {
    name: trimInvisible(input.name), nameNormalized: nameNorm, model: trimInvisible(input.model),
    modelNormalized: modelNorm, unit: trimInvisible(input.unit), taxClassificationCode: taxCode,
    dataStatus, status: (input.status ?? 'active') as 'active' | 'inactive',
    remark: input.remark ? trimInvisible(input.remark) : null, updatedAt: now,
  };

  db.update(products).set(updates).where(eq(products.id, input.id)).run();

  const deltas = buildProductDeltas(old, updates);
  recordAudit({ action: 'product.update', entityType: 'product', entityId: input.id, summary: `编辑商品: ${updates.name}`, fieldChanges: deltas });
  markDirty();
  return getProductById(input.id)!;
}

/** 删除商品：校验库存为 0 且无销项/进项/补票记录后，连带删除其价格版本与库存流水 */
export function deleteProduct(id: string): void {
  const product = getProductById(id);
  if (!product) throw new Error('商品不存在');
  const raw = getRawDb();

  const pvs = raw.prepare('SELECT id, stock_balance FROM price_versions WHERE product_id = ?').all(id) as { id: string; stock_balance: number }[];
  if (pvs.some((pv) => pv.stock_balance !== 0)) {
    throw new Error('存在库存不为 0 的价格版本，请先清空库存再删除');
  }
  const pvIds = pvs.map((pv) => pv.id);
  if (pvIds.length > 0) {
    const placeholders = pvIds.map(() => '?').join(',');
    const refCheck = (table: string, label: string): void => {
      const row = raw.prepare(`SELECT COUNT(*) as c FROM ${table} WHERE price_version_id IN (${placeholders})`).get(...pvIds) as { c: number };
      if (row.c > 0) throw new Error(`存在${label}记录，不能删除`);
    };
    refCheck('outbound_lines', '销项开票');
    refCheck('inbound_lines', '进项');
    refCheck('replenishment_export_lines', '月底补票');
  }

  const db = getDb();
  const tx = raw.transaction(() => {
    if (pvIds.length > 0) {
      const placeholders = pvIds.map(() => '?').join(',');
      raw.prepare(`DELETE FROM inventory_ledger WHERE price_version_id IN (${placeholders})`).run(...pvIds);
      raw.prepare(`DELETE FROM price_versions WHERE id IN (${placeholders})`).run(...pvIds);
    }
    db.delete(products).where(eq(products.id, id)).run();
    recordAudit({ action: 'product.delete', entityType: 'product', entityId: id, summary: `删除商品: ${product.name}` });
    markDirty();
  });
  tx();
}

/** 新增价格版本 */
export function createPriceVersion(input: PriceVersionCreateInput): PriceVersion {
  const db = getDb();
  const product = getProductById(input.productId);
  if (!product) throw new Error('商品不存在');
  if (product.dataStatus === 'incomplete') throw new Error('商品资料不完整，不能创建价格版本');

  const unitPriceDecimal = normalizeUnitPrice(input.unitPriceDecimal);
  ensurePriceVersionUnique(input.productId, unitPriceDecimal);

  const id = uuidv7();
  const now = new Date().toISOString();
  db.insert(priceVersions).values({
    id, productId: input.productId, unitPriceDecimal, taxRate: 13,
    stockBalance: 0, status: 'active', createdAt: now, updatedAt: now,
  }).run();

  recordAudit({ action: 'price_version.create', entityType: 'price_version', entityId: id, summary: `新增价格版本: ${product.name} @ ${unitPriceDecimal}` });
  markDirty();
  return getPriceVersionById(id)!;
}

/** 规范化商品名称和型号键 */
function normalizeProductKeys(name: string, model: string): { nameNorm: string; modelNorm: string } {
  return { nameNorm: normalizeKey(name), modelNorm: normalizeKey(model) };
}

/** 校验商品唯一性 */
function ensureProductUnique(nameNorm: string, modelNorm: string, excludeId?: string): void {
  const existing = excludeId
    ? getRawDb().prepare('SELECT id FROM products WHERE name_normalized = ? AND model_normalized = ? AND id != ?').get(nameNorm, modelNorm, excludeId)
    : getRawDb().prepare('SELECT id FROM products WHERE name_normalized = ? AND model_normalized = ?').get(nameNorm, modelNorm);
  if (existing) throw new Error('该项目名称和规格型号已存在');
}

/** 校验价格版本唯一性 */
function ensurePriceVersionUnique(productId: string, unitPriceDecimal: string): void {
  const existing = getRawDb().prepare('SELECT id FROM price_versions WHERE product_id = ? AND unit_price_decimal = ?').get(productId, unitPriceDecimal);
  if (existing) throw new Error('该商品已有相同单价的价格版本');
}

/** 构建商品字段变更记录 */
function buildProductDeltas(old: Product, updates: Record<string, unknown>): AuditFieldDelta[] {
  return [
    diffField('name', old.name, updates.name),
    diffField('model', old.model, updates.model),
    diffField('unit', old.unit, updates.unit),
    diffField('taxClassificationCode', old.taxClassificationCode, updates.taxClassificationCode),
    diffField('dataStatus', old.dataStatus, updates.dataStatus),
    diffField('status', old.status, updates.status),
    diffField('remark', old.remark, updates.remark),
  ].filter((d): d is AuditFieldDelta => d !== null);
}
