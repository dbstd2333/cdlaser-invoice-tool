import { getRawDb } from '../../db/connection';
import { replenishmentExports, replenishmentExportLines } from '../../db/schema/index';
import { toCamel, toCamelList } from '../../db/case-mapper';
import type { ReplenishmentExport, ReplenishmentExportLine, PageResponse } from '@shared/contracts/types';

/**
 * 月底负库存导出查询服务。
 * 分页列表、详情和原始 XLSX 下载。
 */

/** 将导出记录映射为业务实体 */
function mapExport(row: typeof replenishmentExports.$inferSelect): ReplenishmentExport {
  return {
    id: row.id, exportNo: row.exportNo, exportedAt: row.exportedAt,
    negativeStockSnapshotAt: row.negativeStockSnapshotAt, totalQuantity: row.totalQuantity,
    totalAmountCent: row.totalAmountCent, totalTaxCent: row.totalTaxCent,
    totalCent: row.totalCent, lineCount: row.lineCount,
  };
}

/** 将明细行映射为业务实体 */
function mapExportLine(row: typeof replenishmentExportLines.$inferSelect): ReplenishmentExportLine {
  return {
    id: row.id, exportId: row.exportId, productId: row.productId,
    name: row.name, model: row.model, unit: row.unit, unitPriceDecimal: row.unitPriceDecimal,
    stockBalanceSnapshot: row.stockBalanceSnapshot, replenishmentQuantity: row.replenishmentQuantity,
    amountCent: row.amountCent, taxCent: row.taxCent, totalCent: row.totalCent,
  };
}

/** 分页查询月底导出历史 */
export function listReplenishmentExports(page: number, pageSize: number): PageResponse<ReplenishmentExport> {
  const raw = getRawDb();
  const countRow = raw.prepare('SELECT COUNT(*) as cnt FROM replenishment_exports').get() as { cnt: number };
  const offset = (page - 1) * pageSize;
  const rows = toCamelList<typeof replenishmentExports.$inferSelect>(
    raw.prepare('SELECT * FROM replenishment_exports ORDER BY exported_at DESC, id DESC LIMIT ? OFFSET ?')
      .all(pageSize, offset) as Record<string, unknown>[],
  );
  return { rows: rows.map(mapExport), total: countRow.cnt, page, pageSize };
}

/** 获取月底导出详情 */
export function getReplenishmentDetail(id: string): { exportRecord: ReplenishmentExport; lines: ReplenishmentExportLine[] } | null {
  const raw = getRawDb();
  const exportRow = toCamel<typeof replenishmentExports.$inferSelect>(
    raw.prepare('SELECT * FROM replenishment_exports WHERE id = ?').get(id) as Record<string, unknown> | undefined,
  );
  if (!exportRow) return null;

  const lineRows = toCamelList<typeof replenishmentExportLines.$inferSelect>(
    raw.prepare('SELECT * FROM replenishment_export_lines WHERE export_id = ? ORDER BY id').all(id) as Record<string, unknown>[],
  );
  return { exportRecord: mapExport(exportRow), lines: lineRows.map(mapExportLine) };
}

/** 获取月底导出原始 XLSX */
export function getReplenishmentXlsx(id: string): { buffer: Buffer; exportNo: string } | null {
  const raw = getRawDb();
  const row = raw.prepare('SELECT xlsx_blob, export_no FROM replenishment_exports WHERE id = ?').get(id) as { xlsx_blob: string; export_no: string } | undefined;
  if (!row) return null;
  return { buffer: Buffer.from(row.xlsx_blob, 'base64'), exportNo: row.export_no };
}
