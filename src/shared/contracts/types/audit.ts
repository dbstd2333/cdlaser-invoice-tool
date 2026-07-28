import type { EntityId, IsoTimestamp } from './common';

/** 审计领域类型。 */

export interface AuditEvent {
  id: EntityId;
  action: string;
  entityType: string;
  entityId: EntityId;
  sourceBatchId: EntityId | null;
  operator: string;
  createdAt: IsoTimestamp;
  summary: string | null;
}

export interface AuditFieldChange {
  id: EntityId;
  eventId: EntityId;
  fieldPath: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface FieldHistoryEntry {
  id: EntityId;
  createdAt: IsoTimestamp;
  action: string;
  fieldPath: string;
  oldValue: string | null;
  newValue: string | null;
  sourceBatchId: EntityId | null;
  operator: string;
  summary: string | null;
}
