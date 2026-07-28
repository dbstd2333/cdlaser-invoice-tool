import type { EntityId, IsoTimestamp } from './common';

/** 客户领域类型。 */

/** 客户状态 */
export type CustomerStatus = 'active' | 'inactive';

/** 客户实体 */
export interface Customer {
  id: EntityId;
  name: string;
  taxId: string;
  taxIdNormalized: string;
  shortCode: string | null;
  address: string | null;
  phone: string | null;
  bankName: string | null;
  bankAccount: string | null;
  email: string | null;
  isDefaultAddress: boolean;
  status: CustomerStatus;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

/** 客户快照（开票时保存） */
export interface CustomerSnapshot {
  name: string;
  taxId: string;
  address: string | null;
  phone: string | null;
  bankName: string | null;
  bankAccount: string | null;
}
