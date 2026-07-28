import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { customers } from '../../db/schema/index';

import {
  normalizeTaxId,
  normalizeBankAccount,
  trimInvisible,
  isScientificNotation,
} from '@shared/contracts/normalize';
import { recordAudit } from '../audit/audit-service';
import { markCustomerInitialImportDone, markDirty } from '../audit/settings-service';
import { getInitStatus } from '../audit/settings-service';

/**
 * 客户首次导入服务 - 预览解析和事务性确认。
 * 采用「先预览、后确认、全量成功或全量失败」。
 */

export interface CustomerImportPreviewRow {
  rowIndex: number;
  name: string;
  taxId: string;
  shortCode: string | null;
  address: string | null;
  phone: string | null;
  bankName: string | null;
  bankAccount: string | null;
  email: string | null;
  isDefaultAddress: boolean;
  errors: string[];
}

export interface CustomerImportPreviewResult {
  rows: CustomerImportPreviewRow[];
  newCount: number;
  duplicateTaxIdCount: number;
  errorCount: number;
  hasErrors: boolean;
  errors: Array<{ rowIndex: number; field: string; reason: string }>;
}

/** 客户导入解析后的内部行，包含 Excel 原始数值精度风险 */
export interface CustomerImportRawRow extends Omit<CustomerImportPreviewRow, 'errors'> {
  taxIdUnsafeNumericPrecision: boolean;
  bankAccountUnsafeNumericPrecision: boolean;
}

/** 预览令牌 -> 预览数据缓存 */
const previewCache = new Map<string, CustomerImportPreviewResult>();

/** 校验单行客户数据，返回错误列表 */
function validateRow(row: CustomerImportPreviewRow, raw: CustomerImportRawRow): string[] {
  const errors: string[] = [];
  if (!row.name) errors.push('客户名称必填');
  if (!row.taxId) errors.push('纳税人识别号必填');

  if (row.taxId && raw.taxIdUnsafeNumericPrecision) {
    errors.push('纳税人识别号疑似数值化且超过 15 位精度');
  }
  if (row.phone && isScientificNotation(row.phone)) {
    errors.push('电话疑似科学计数法');
  }
  if (row.bankAccount && isScientificNotation(row.bankAccount)) {
    errors.push('银行账号疑似科学计数法，已丢失精度');
  }
  if (row.bankAccount && raw.bankAccountUnsafeNumericPrecision) {
    errors.push('银行账号疑似数值化且超过 15 位精度');
  }
  if (row.email && row.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push('邮箱格式不正确');
  }
  return errors;
}

/** 构建预览结果：解析行数据并校验重复 */
export function buildCustomerPreview(
  rawRows: CustomerImportRawRow[],
): CustomerImportPreviewResult {
  const seenTaxIds = new Map<string, number>();
  const rows: CustomerImportPreviewRow[] = [];
  const errors: Array<{ rowIndex: number; field: string; reason: string }> = [];

  for (const raw of rawRows) {
    const taxIdNormalized = raw.taxId ? normalizeTaxId(raw.taxId) : '';
    const row: CustomerImportPreviewRow = {
      rowIndex: raw.rowIndex,
      name: raw.name,
      taxId: raw.taxId ? trimInvisible(raw.taxId) : '',
      shortCode: raw.shortCode,
      address: raw.address,
      phone: raw.phone,
      bankName: raw.bankName,
      bankAccount: raw.bankAccount,
      email: raw.email,
      isDefaultAddress: raw.isDefaultAddress,
      errors: [],
    };

    const rowErrors = validateRow(row, raw);
    row.errors = rowErrors;
    rowErrors.forEach((e) => errors.push({ rowIndex: raw.rowIndex, field: '', reason: e }));

    // 检查文件内重复税号
    if (taxIdNormalized) {
      if (seenTaxIds.has(taxIdNormalized)) {
        const errMsg = `纳税人识别号与第 ${seenTaxIds.get(taxIdNormalized)} 行重复`;
        row.errors.push(errMsg);
        errors.push({ rowIndex: raw.rowIndex, field: 'taxId', reason: errMsg });
      } else {
        seenTaxIds.set(taxIdNormalized, raw.rowIndex);
      }
    }

    // 检查与数据库已有客户重复
    if (taxIdNormalized) {
      const existing = getRawDb()
        .prepare('SELECT id FROM customers WHERE tax_id_normalized = ?')
        .get(taxIdNormalized);
      if (existing) {
        const errMsg = '纳税人识别号已存在于系统中';
        row.errors.push(errMsg);
        errors.push({ rowIndex: raw.rowIndex, field: 'taxId', reason: errMsg });
      }
    }

    rows.push(row);
  }

  const errorCount = rows.filter((r) => r.errors.length > 0).length;
  const newCount = rows.filter((r) => r.errors.length === 0).length;

  return {
    rows,
    newCount,
    duplicateTaxIdCount: rows.filter((r) =>
      r.errors.some((e) => e.includes('识别号与第') || e === '纳税人识别号已存在于系统中'),
    ).length,
    errorCount,
    hasErrors: errorCount > 0,
    errors,
  };
}

/** 生成预览令牌并缓存 */
export function cacheCustomerPreview(result: CustomerImportPreviewResult): string {
  const token = uuidv7();
  previewCache.set(token, result);
  // 30 分钟过期
  setTimeout(() => previewCache.delete(token), 30 * 60 * 1000);
  return token;
}

/** 确认客户首次导入：事务性批量写入 */
export function confirmCustomerInitialImport(token: string): { imported: number } {
  const initStatus = getInitStatus();
  if (initStatus.customerInitialImportDone) {
    throw new Error('客户首次导入已完成，不能重复执行');
  }

  const preview = previewCache.get(token);
  if (!preview) {
    throw new Error('预览已过期，请重新选择文件');
  }
  if (preview.hasErrors) {
    throw new Error('存在错误行，无法导入');
  }

  const db = getDb();
  const raw = getRawDb();
  const validRows = preview.rows.filter((r) => r.errors.length === 0);

  // 整批事务
  const tx = raw.transaction(() => {
    for (const row of validRows) {
      const id = uuidv7();
      const now = new Date().toISOString();
      const taxIdNormalized = normalizeTaxId(row.taxId);
      const bankAccount = row.bankAccount ? normalizeBankAccount(row.bankAccount) : null;
      const email = row.email === '' ? null : row.email ?? null;

      db.insert(customers).values({
        id,
        category: '',
        name: trimInvisible(row.name),
        taxId: trimInvisible(row.taxId),
        taxIdNormalized,
        shortCode: row.shortCode ? trimInvisible(row.shortCode) : null,
        address: row.address ? trimInvisible(row.address) : null,
        phone: row.phone ? trimInvisible(row.phone) : null,
        bankName: row.bankName ? trimInvisible(row.bankName) : null,
        bankAccount,
        email,
        isDefaultAddress: row.isDefaultAddress,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      }).run();

      recordAudit({
        action: 'customer.initial_import',
        entityType: 'customer',
        entityId: id,
        summary: `首次导入客户: ${trimInvisible(row.name)}`,
      });
    }
    markCustomerInitialImportDone();
    markDirty();
  });

  tx();
  previewCache.delete(token);
  return { imported: validRows.length };
}
