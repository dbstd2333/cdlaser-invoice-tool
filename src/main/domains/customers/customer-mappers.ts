import { customers } from '../../db/schema/index';
import type { Customer } from '@shared/contracts/types';

/**
 * 客户数据库行映射。
 */

/** 将数据库行映射为业务实体 */
export function mapCustomerRow(row: typeof customers.$inferSelect): Customer {
  return {
    id: row.id, name: row.name, taxId: row.taxId,
    taxIdNormalized: row.taxIdNormalized, shortCode: row.shortCode, address: row.address,
    phone: row.phone, bankName: row.bankName, bankAccount: row.bankAccount, email: row.email,
    isDefaultAddress: row.isDefaultAddress, status: row.status,
    createdAt: row.createdAt, updatedAt: row.updatedAt,
  };
}
