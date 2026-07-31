import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { auditEvents, auditFieldChanges } from '../../db/schema/index';
import type { FieldHistoryEntry } from '@shared/contracts/types';
import { fieldHistoryQuerySchema } from '@shared/schemas/index';

/**
 * 审计服务 - 记录业务动作和字段级变更。
 * 所有导入、导出、作废、调整、备份恢复及系统迁移都通过此服务记录操作事件。
 */
const OPERATOR = '本机财务';

export interface AuditFieldDelta {
  fieldPath: string;
  oldValue: string | null;
  newValue: string | null;
}

/**
 * 记录一条审计事件，可选附带字段级变更。
 * 必须在数据库事务内调用，确保审计与业务数据一致性。
 */
export function recordAudit(params: {
  action: string;
  entityType: string;
  entityId: string;
  sourceBatchId?: string | null;
  summary?: string | null;
  fieldChanges?: AuditFieldDelta[];
}): string {
  const db = getDb();
  const eventId = uuidv7();
  const now = new Date().toISOString();

  db.insert(auditEvents).values({
    id: eventId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    sourceBatchId: params.sourceBatchId ?? null,
    operator: OPERATOR,
    createdAt: now,
    summary: params.summary ?? null,
  }).run();

  if (params.fieldChanges && params.fieldChanges.length > 0) {
    const rows = params.fieldChanges
      .filter((c) => c.oldValue !== c.newValue)
      .map((c) => ({
        id: uuidv7(),
        eventId,
        fieldPath: c.fieldPath,
        oldValue: c.oldValue,
        newValue: c.newValue,
      }));
    if (rows.length > 0) {
      db.insert(auditFieldChanges).values(rows).run();
    }
  }

  return eventId;
}

/** 比较两个值，生成字段变更记录（仅当值不同时） */
export function diffField(fieldPath: string, oldValue: unknown, newValue: unknown): AuditFieldDelta | null {
  const oldStr = oldValue == null ? null : String(oldValue);
  const newStr = newValue == null ? null : String(newValue);
  if (oldStr === newStr) return null;
  return { fieldPath, oldValue: oldStr, newValue: newStr };
}

/** 查询某实体的字段历史 */
export function queryFieldHistory(
  entityType: string,
  entityId: string,
  page: number,
  pageSize: number,
): { rows: FieldHistoryEntry[]; total: number } {
  const parsed = fieldHistoryQuerySchema.parse({ entityType, entityId, page, pageSize });
  const raw = getRawDb();

  const countRow = raw.prepare(`
    SELECT COUNT(*) as cnt FROM audit_events
    WHERE entity_type = ? AND entity_id = ?
  `).get(parsed.entityType, parsed.entityId) as { cnt: number };

  const total = countRow.cnt;
  const offset = (parsed.page - 1) * parsed.pageSize;

  const events = raw.prepare(`
    SELECT id, action, source_batch_id, operator, created_at, summary
    FROM audit_events
    WHERE entity_type = ? AND entity_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(parsed.entityType, parsed.entityId, parsed.pageSize, offset) as Array<{
    id: string; action: string; source_batch_id: string | null;
    operator: string; created_at: string; summary: string | null;
  }>;

  const eventIds = events.map((e: { id: string }) => e.id);
  const changesMap = new Map<string, Array<{ id: string; fieldPath: string; oldValue: string | null; newValue: string | null }>>();

  if (eventIds.length > 0) {
    const placeholders = eventIds.map(() => '?').join(',');
    // raw SQL 返回 snake_case 列名，这里映射为 camelCase
    const changesRows = raw.prepare(`
      SELECT id, event_id, field_path, old_value, new_value FROM audit_field_changes WHERE event_id IN (${placeholders})
    `).all(...eventIds) as Array<{
      id: string; event_id: string; field_path: string; old_value: string | null; new_value: string | null;
    }>;
    for (const c of changesRows) {
      const list = changesMap.get(c.event_id) ?? [];
      list.push({ id: c.id, fieldPath: c.field_path, oldValue: c.old_value, newValue: c.new_value });
      changesMap.set(c.event_id, list);
    }
  }

  const rows: FieldHistoryEntry[] = [];
  for (const e of events) {
    const changes = changesMap.get(e.id) ?? [];
    if (changes.length === 0) {
      rows.push({
        id: e.id,
        createdAt: e.created_at,
        action: e.action,
        fieldPath: '*',
        oldValue: null,
        newValue: null,
        sourceBatchId: e.source_batch_id,
        operator: e.operator,
        summary: e.summary,
      });
    } else {
      for (const c of changes) {
        rows.push({
          id: c.id,
          createdAt: e.created_at,
          action: e.action,
          fieldPath: c.fieldPath,
          oldValue: c.oldValue,
          newValue: c.newValue,
          sourceBatchId: e.source_batch_id,
          operator: e.operator,
          summary: e.summary,
        });
      }
    }
  }

  return { rows, total };
}
