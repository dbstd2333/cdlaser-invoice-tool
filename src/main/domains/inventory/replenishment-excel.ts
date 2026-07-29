import ExcelJS from 'exceljs';
import { centToYuan, TAX_RATE_DECIMAL } from '@shared/money/index';
import { escapeFormulaInjection } from '@shared/contracts/normalize';
import type { ReplenishmentPreviewLine } from './replenishment-types';

/**
 * 月底负库存导出 Excel 生成。
 */

/** 生成月底负库存导出 Excel Buffer */
export async function generateReplenishmentExcel(lines: ReplenishmentPreviewLine[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('月底负库存导出');

  sheet.columns = [
    { header: '项目名称', key: 'name', width: 30 },
    { header: '型号', key: 'model', width: 20 },
    { header: '单位', key: 'unit', width: 10 },
    { header: '待补数量', key: 'quantity', width: 12 },
    { header: '含税单价', key: 'unitPrice', width: 15 },
    { header: '不含税金额', key: 'amount', width: 15 },
    { header: '税率', key: 'taxRate', width: 8 },
    { header: '税额', key: 'tax', width: 15 },
    { header: '价税合计', key: 'total', width: 15 },
  ];

  // 表头样式
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

  const totals = { qty: 0, amount: 0, tax: 0, total: 0 };
  for (const line of lines) {
    addReplenishmentRow(sheet, line);
    totals.qty += line.replenishmentQuantity;
    totals.amount += line.amountCent;
    totals.tax += line.taxCent;
    totals.total += line.totalCent;
  }

  // 页尾总计
  sheet.addRow({
    name: '总计', quantity: totals.qty,
    amount: centToYuan(totals.amount), tax: centToYuan(totals.tax), total: centToYuan(totals.total),
  });
  sheet.getRow(sheet.rowCount).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/** 添加一行明细数据 */
function addReplenishmentRow(sheet: ExcelJS.Worksheet, line: ReplenishmentPreviewLine): void {
  sheet.addRow({
    name: escapeFormulaInjection(line.name),
    model: escapeFormulaInjection(line.model),
    unit: escapeFormulaInjection(line.unit),
    quantity: line.replenishmentQuantity,
    unitPrice: line.unitPriceDecimal,
    amount: centToYuan(line.amountCent),
    taxRate: TAX_RATE_DECIMAL,
    tax: centToYuan(line.taxCent),
    total: centToYuan(line.totalCent),
  });
}
