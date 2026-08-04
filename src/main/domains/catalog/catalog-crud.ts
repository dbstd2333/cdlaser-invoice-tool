import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { products } from '../../db/schema/index';
import type { Product } from '@shared/contracts/types';
import type { ProductUpsertInput } from '@shared/schemas/index';
import { normalizeKey, trimInvisible } from '@shared/contracts/normalize';
import { normalizeUnitPrice } from '@shared/money/index';
import { diffField, recordAudit, type AuditFieldDelta } from '../audit/audit-service';
import { markDirty } from '../audit/settings-service';
import { getProductById } from './catalog-query';

/** 新增商品，同名同型号可按不同含税单价分别建档。 */
export function createProduct(input: ProductUpsertInput): Product {
  const { nameNorm, modelNorm } = normalizeProductKeys(input.name, input.model);
  const unitPriceDecimal = normalizeUnitPrice(input.unitPriceDecimal);
  ensureProductUnique(nameNorm, modelNorm, unitPriceDecimal);
  const id = uuidv7();
  const now = new Date().toISOString();
  const taxCode = trimInvisible(input.taxClassificationCode);
  getDb().insert(products).values({
    id,
    name: trimInvisible(input.name),
    nameNormalized: nameNorm,
    model: trimInvisible(input.model),
    modelNormalized: modelNorm,
    unit: trimInvisible(input.unit),
    taxClassificationCode: taxCode,
    unitPriceDecimal,
    taxRate: input.taxRate ?? 13,
    stockBalance: 0,
    dataStatus: taxCode ? 'complete' : 'incomplete',
    status: input.status ?? 'active',
    remark: input.remark ? trimInvisible(input.remark) : null,
    createdAt: now,
    updatedAt: now,
  }).run();
  recordAudit({ action: 'product.create', entityType: 'product', entityId: id, summary: `新增商品: ${input.name}` });
  markDirty();
  return getProductById(id)!;
}

/** 编辑商品资料及其独立含税单价。 */
export function updateProduct(input: ProductUpsertInput): Product {
  if (!input.id) throw new Error('商品 ID 必填');
  const old = getProductById(input.id);
  if (!old) throw new Error('商品不存在');
  const { nameNorm, modelNorm } = normalizeProductKeys(input.name, input.model);
  const unitPriceDecimal = normalizeUnitPrice(input.unitPriceDecimal);
  ensureProductUnique(nameNorm, modelNorm, unitPriceDecimal, input.id);
  const taxCode = trimInvisible(input.taxClassificationCode);
  const updates = {
    name: trimInvisible(input.name),
    nameNormalized: nameNorm,
    model: trimInvisible(input.model),
    modelNormalized: modelNorm,
    unit: trimInvisible(input.unit),
    taxClassificationCode: taxCode,
    unitPriceDecimal,
    taxRate: input.taxRate ?? 13,
    dataStatus: (taxCode ? 'complete' : 'incomplete') as 'complete' | 'incomplete',
    status: input.status ?? 'active',
    remark: input.remark ? trimInvisible(input.remark) : null,
    updatedAt: new Date().toISOString(),
  };
  getDb().update(products).set(updates).where(eq(products.id, input.id)).run();
  recordAudit({
    action: 'product.update',
    entityType: 'product',
    entityId: input.id,
    summary: `编辑商品: ${updates.name}`,
    fieldChanges: buildProductDeltas(old, updates),
  });
  markDirty();
  return getProductById(input.id)!;
}

/** 删除没有库存和业务记录的商品。 */
export function deleteProduct(id: string): void {
  const product = getProductById(id);
  if (!product) throw new Error('商品不存在');
  if (product.stockBalance !== 0) throw new Error('商品库存不为 0，请先清空库存再删除');
  const raw = getRawDb();
  for (const [table, label] of [
    ['outbound_lines', '销项开票'],
    ['inbound_lines', '进项'],
    ['replenishment_export_lines', '月底补票'],
  ] as const) {
    const row = raw.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE product_id = ?`).get(id) as { count: number };
    if (row.count) throw new Error(`存在${label}记录，不能删除`);
  }
  raw.transaction(() => {
    raw.prepare('DELETE FROM inventory_ledger WHERE product_id = ?').run(id);
    getDb().delete(products).where(eq(products.id, id)).run();
    recordAudit({ action: 'product.delete', entityType: 'product', entityId: id, summary: `删除商品: ${product.name}` });
    markDirty();
  })();
}

/** 规范化商品唯一键。 */
function normalizeProductKeys(name: string, model: string): { nameNorm: string; modelNorm: string } {
  return { nameNorm: normalizeKey(name), modelNorm: normalizeKey(model) };
}

/** 校验规范化名称、型号和含税单价组合唯一。 */
function ensureProductUnique(nameNorm: string, modelNorm: string, unitPriceDecimal: string, excludeId?: string): void {
  const existing = excludeId
    ? getRawDb().prepare(`
        SELECT id FROM products
        WHERE name_normalized = ? AND model_normalized = ? AND unit_price_decimal = ? AND id != ?
      `).get(nameNorm, modelNorm, unitPriceDecimal, excludeId)
    : getRawDb().prepare(`
        SELECT id FROM products
        WHERE name_normalized = ? AND model_normalized = ? AND unit_price_decimal = ?
      `).get(nameNorm, modelNorm, unitPriceDecimal);
  if (existing) throw new Error('该项目名称、规格型号和含税单价组合已存在');
}

/** 生成商品字段审计差异。 */
function buildProductDeltas(old: Product, updates: Record<string, unknown>): AuditFieldDelta[] {
  return [
    diffField('name', old.name, updates.name),
    diffField('model', old.model, updates.model),
    diffField('unit', old.unit, updates.unit),
    diffField('taxClassificationCode', old.taxClassificationCode, updates.taxClassificationCode),
    diffField('unitPriceDecimal', old.unitPriceDecimal, updates.unitPriceDecimal),
    diffField('taxRate', old.taxRate, updates.taxRate),
    diffField('dataStatus', old.dataStatus, updates.dataStatus),
    diffField('status', old.status, updates.status),
    diffField('remark', old.remark, updates.remark),
  ].filter((delta): delta is AuditFieldDelta => delta !== null);
}
