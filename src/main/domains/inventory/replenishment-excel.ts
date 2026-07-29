import XlsxPopulate from 'xlsx-populate';
import { centToYuan, TAX_RATE_DECIMAL } from '@shared/money/index';
import { escapeFormulaInjection } from '@shared/contracts/normalize';
import type { ReplenishmentPreviewLine } from './replenishment-types';

/**
 * 月底负库存导出 Excel 生成（基于 xlsx-populate）。
 */

/** 生成月底负库存导出 Excel Buffer */
export async function generateReplenishmentExcel(lines: ReplenishmentPreviewLine[]): Promise<Buffer> {
  const wb = await XlsxPopulate.fromBlankAsync();
  const sheet = wb.addSheet('月底负库存导出');
  wb.deleteSheet('Sheet1');

  const headers = ['项目名称', '型号', '单位', '待补数量', '含税单价', '不含税金额', '税率', '税额', '价税合计'];
  const widths = [30, 20, 10, 12, 15, 15, 8, 15, 15];

  headers.forEach((h, i) => {
    const col = i + 1;
    sheet.column(col).width(widths[i]);
    const cell = sheet.cell(1, col);
    cell.value(h);
    cell.style('bold', true);
    cell.style('fill', 'E0E0E0');
  });

  let row = 2;
  const totals = { qty: 0, amount: 0, tax: 0, total: 0 };
  for (const line of lines) {
    sheet.cell(row, 1).value(escapeFormulaInjection(line.name));
    sheet.cell(row, 2).value(escapeFormulaInjection(line.model));
    sheet.cell(row, 3).value(escapeFormulaInjection(line.unit));
    sheet.cell(row, 4).value(line.replenishmentQuantity);
    sheet.cell(row, 5).value(line.unitPriceDecimal);
    sheet.cell(row, 6).value(centToYuan(line.amountCent));
    sheet.cell(row, 7).value(TAX_RATE_DECIMAL);
    sheet.cell(row, 8).value(centToYuan(line.taxCent));
    sheet.cell(row, 9).value(centToYuan(line.totalCent));
    totals.qty += line.replenishmentQuantity;
    totals.amount += line.amountCent;
    totals.tax += line.taxCent;
    totals.total += line.totalCent;
    row += 1;
  }

  // 页尾总计
  const totalRow = row;
  sheet.cell(totalRow, 1).value('总计');
  sheet.cell(totalRow, 4).value(totals.qty);
  sheet.cell(totalRow, 6).value(centToYuan(totals.amount));
  sheet.cell(totalRow, 8).value(centToYuan(totals.tax));
  sheet.cell(totalRow, 9).value(centToYuan(totals.total));
  for (let col = 1; col <= 9; col += 1) {
    sheet.cell(totalRow, col).style('bold', true);
  }

  return wb.outputAsync();
}
