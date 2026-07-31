import * as XLSX from 'xlsx';
import * as fs from 'node:fs';
import { centToYuan, TAX_RATE_DECIMAL } from '@shared/money/index';

// SheetJS ESM 构建（vitest 等 ESM 环境）不会自动加载 fs，需显式注入；
// CJS 构建（生产环境）中此调用无害。
XLSX.set_fs(fs);
import { escapeFormulaInjection } from '@shared/contracts/normalize';
import type { ReplenishmentPreviewLine } from './replenishment-types';

/**
 * 月底负库存导出 Excel 生成（基于 SheetJS 社区版）。
 *
 * 注意：SheetJS 社区版不支持写入单元格样式（加粗、填充等），
 * 因此表头与总计行的加粗样式会丢失，仅保留数据与列宽。
 */

/** 生成月底负库存导出 Excel Buffer */
export async function generateReplenishmentExcel(lines: ReplenishmentPreviewLine[]): Promise<Buffer> {
  const headers = ['项目名称', '型号', '单位', '待补数量', '含税单价', '不含税金额', '税率', '税额', '价税合计'];
  const widths = [30, 20, 10, 12, 15, 15, 8, 15, 15];

  const aoa: unknown[][] = [headers];

  const totals = { qty: 0, amount: 0, tax: 0, total: 0 };
  for (const line of lines) {
    aoa.push([
      escapeFormulaInjection(line.name),
      escapeFormulaInjection(line.model),
      escapeFormulaInjection(line.unit),
      line.replenishmentQuantity,
      line.unitPriceDecimal,
      centToYuan(line.amountCent),
      TAX_RATE_DECIMAL,
      centToYuan(line.taxCent),
      centToYuan(line.totalCent),
    ]);
    totals.qty += line.replenishmentQuantity;
    totals.amount += line.amountCent;
    totals.tax += line.taxCent;
    totals.total += line.totalCent;
  }

  // 页尾总计
  aoa.push([
    '总计',
    null,
    null,
    totals.qty,
    null,
    centToYuan(totals.amount),
    null,
    centToYuan(totals.tax),
    centToYuan(totals.total),
  ]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = widths.map((w) => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '月底负库存导出');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
}
