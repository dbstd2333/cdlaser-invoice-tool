import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { customers } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import type { Customer } from '@shared/contracts/types';
import type { CustomerUpsertInput } from '@shared/schemas/index';
import { normalizeTaxId, normalizeBankAccount, trimInvisible, isScientificNotation } from '@shared/contracts/normalize';
import { recordAudit, diffField, type AuditFieldDelta } from '../audit/audit-service';
import { markDirty } from '../audit/settings-service';
import { getCustomerById } from './customer-query';

/**
 * 客户 CRUD 服务。
 */

/** 新增客户 */
export function createCustomer(input: CustomerUpsertInput): Customer {
  const db = getDb();
  const taxIdNormalized = normalizeTaxId(input.taxId);
  validateScientificNotation(input);
  ensureTaxIdUnique(taxIdNormalized);

  const id = uuidv7();
  const now = new Date().toISOString();
  db.insert(customers).values(buildInsertValues(id, now, input, taxIdNormalized)).run();

  recordAudit({ action: 'customer.create', entityType: 'customer', entityId: id, summary: `新增客户: ${trimInvisible(input.name)}` });
  markDirty();
  return getCustomerById(id)!;
}

/** 编辑客户 */
export function updateCustomer(input: CustomerUpsertInput): Customer {
  if (!input.id) throw new Error('客户 ID 必填');
  const db = getDb();
  const old = getCustomerById(input.id);
  if (!old) throw new Error('客户不存在');

  const taxIdNormalized = normalizeTaxId(input.taxId);
  ensureTaxIdUnique(taxIdNormalized, input.id);

  const now = new Date().toISOString();
  const updates = buildInsertValues(input.id, now, input, taxIdNormalized);
  delete (updates as Record<string, unknown>).id;
  delete (updates as Record<string, unknown>).createdAt;
  db.update(customers).set(updates).where(eq(customers.id, input.id)).run();

  const deltas = buildCustomerDeltas(old, updates);
  recordAudit({ action: 'customer.update', entityType: 'customer', entityId: input.id, summary: `编辑客户: ${updates.name}`, fieldChanges: deltas });
  markDirty();
  return getCustomerById(input.id)!;
}

/** 切换客户状态（启用/停用） */
export function toggleCustomerStatus(id: string): Customer {
  const customer = getCustomerById(id);
  if (!customer) throw new Error('客户不存在');
  const db = getDb();
  const newStatus: 'active' | 'inactive' = customer.status === 'active' ? 'inactive' : 'active';
  db.update(customers).set({ status: newStatus, updatedAt: new Date().toISOString() }).where(eq(customers.id, id)).run();

  recordAudit({
    action: newStatus === 'active' ? 'customer.activate' : 'customer.deactivate',
    entityType: 'customer', entityId: id,
    summary: `${newStatus === 'active' ? '恢复' : '停用'}客户: ${customer.name}`,
    fieldChanges: [diffField('status', customer.status, newStatus)!],
  });
  markDirty();
  return getCustomerById(id)!;
}

/** 校验科学计数法 */
function validateScientificNotation(input: CustomerUpsertInput): void {
  if (input.bankAccount && isScientificNotation(input.bankAccount)) {
    throw new Error('银行账号疑似科学计数法，已丢失精度');
  }
  if (input.phone && isScientificNotation(input.phone)) {
    throw new Error('电话疑似科学计数法，已丢失精度');
  }
}

/** 校验税号唯一性 */
function ensureTaxIdUnique(taxIdNormalized: string, excludeId?: string): void {
  const existing = excludeId
    ? getRawDb().prepare('SELECT id FROM customers WHERE tax_id_normalized = ? AND id != ?').get(taxIdNormalized, excludeId)
    : getRawDb().prepare('SELECT id FROM customers WHERE tax_id_normalized = ?').get(taxIdNormalized);
  if (existing) throw new Error('纳税人识别号已存在');
}

/** 构建插入值对象 */
function buildInsertValues(id: string, now: string, input: CustomerUpsertInput, taxIdNormalized: string): typeof customers.$inferInsert {
  const bankAccount = input.bankAccount ? normalizeBankAccount(input.bankAccount) : input.bankAccount ?? null;
  const email = input.email === '' ? null : input.email ?? null;
  return {
    id, category: '', name: trimInvisible(input.name),
    taxId: trimInvisible(input.taxId), taxIdNormalized,
    shortCode: input.shortCode ? trimInvisible(input.shortCode) : null,
    address: input.address ? trimInvisible(input.address) : null,
    phone: input.phone ? trimInvisible(input.phone) : null,
    bankName: input.bankName ? trimInvisible(input.bankName) : null,
    bankAccount, email, isDefaultAddress: input.isDefaultAddress ?? false,
    status: input.status ?? 'active', createdAt: now, updatedAt: now,
  };
}

/** 构建客户字段变更记录 */
function buildCustomerDeltas(old: Customer, updates: Record<string, unknown>): AuditFieldDelta[] {
  return [
    diffField('name', old.name, updates.name),
    diffField('taxId', old.taxId, updates.taxId),
    diffField('shortCode', old.shortCode, updates.shortCode),
    diffField('address', old.address, updates.address),
    diffField('phone', old.phone, updates.phone),
    diffField('bankName', old.bankName, updates.bankName),
    diffField('bankAccount', old.bankAccount, updates.bankAccount),
    diffField('email', old.email, updates.email),
    diffField('isDefaultAddress', old.isDefaultAddress, updates.isDefaultAddress),
    diffField('status', old.status, updates.status),
  ].filter((d): d is AuditFieldDelta => d !== null);
}
