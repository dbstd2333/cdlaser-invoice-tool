import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { replenishmentExports, replenishmentExportLines } from '../../db/schema/index';
import { generateBatchNo } from '@shared/contracts/normalize';
import { computeSha256, xlsxToBase64 } from '../../excel/tax-template/template-writer';
import { recordAudit } from '../audit/audit-service';
import { markDirty } from '../audit/settings-service';
import { previewReplenishment } from './replenishment-preview';
import { generateReplenishmentExcel } from './replenishment-excel';
import type { ReplenishmentPreviewLine } from './replenishment-types';
import log from 'electron-log/main';

/**
 * 月底负库存导出事务。
 * 生成 Excel 并保存快照和记录，导出本身不改变库存。
 */

/** 执行月底导出：生成 Excel 并保存快照和记录 */
export async function executeReplenishmentExport(): Promise<{
  exportId: string; exportNo: string; xlsxBuffer: Buffer; lineCount: number;
} | null> {
  const { lines, snapshotAt } = previewReplenishment();
  if (lines.length === 0) {
    log.info('[replenishment] 当前无需向总部补票');
    return null;
  }

  const xlsxBuffer = await generateReplenishmentExcel(lines);
  const xlsxSha256 = computeSha256(xlsxBuffer);
  const xlsxBase64 = xlsxToBase64(xlsxBuffer);

  const exportId = uuidv7();
  const exportNo = generateBatchNo('REP');
  const exportedAt = new Date().toISOString();
  const totals = calculateTotals(lines);

  const db = getDb();
  const raw = getRawDb();

  const tx = raw.transaction(() => {
    db.insert(replenishmentExports).values({
      id: exportId, exportNo, exportedAt, negativeStockSnapshotAt: snapshotAt,
      xlsxBlob: xlsxBase64, xlsxSha256, lineCount: lines.length, ...totals,
    }).run();

    for (const line of lines) {
      insertExportLine(db, exportId, line);
    }

    recordAudit({
      action: 'replenishment.export', entityType: 'replenishment_export',
      entityId: exportId, sourceBatchId: exportId,
      summary: `月底负库存导出 ${exportNo}，共 ${lines.length} 行`,
    });
    markDirty();
  });

  tx();
  return { exportId, exportNo, xlsxBuffer, lineCount: lines.length };
}

/** 计算汇总金额 */
function calculateTotals(lines: ReplenishmentPreviewLine[]): {
  totalQuantity: number; totalAmountCent: number; totalTaxCent: number; totalCent: number;
} {
  let totalQuantity = 0, totalAmountCent = 0, totalTaxCent = 0, totalCent = 0;
  for (const line of lines) {
    totalQuantity += line.replenishmentQuantity;
    totalAmountCent += line.amountCent;
    totalTaxCent += line.taxCent;
    totalCent += line.totalCent;
  }
  return { totalQuantity, totalAmountCent, totalTaxCent, totalCent };
}

/** 插入导出明细行 */
function insertExportLine(db: ReturnType<typeof getDb>, exportId: string, line: ReplenishmentPreviewLine): void {
  db.insert(replenishmentExportLines).values({
    id: uuidv7(), exportId, productId: line.productId,
    name: line.name, model: line.model, unit: line.unit,
    unitPriceDecimal: line.unitPriceDecimal, stockBalanceSnapshot: line.stockBalanceSnapshot,
    replenishmentQuantity: line.replenishmentQuantity, amountCent: line.amountCent,
    taxCent: line.taxCent, totalCent: line.totalCent,
  }).run();
}
