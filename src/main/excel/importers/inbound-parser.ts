import type { InboundRawRow } from '../../domains/inbound/inbound-types';
import { readWorkbook, cellToText, findColumnIndex } from './parser-utils';
import { trimInvisible } from '@shared/contracts/normalize';
import log from 'electron-log/main';

/**
 * 总部进项票 Excel 解析器。
 * 按表头定位列，合并相同业务键的行。
 */

/** 解析总部进项票 Excel */
export async function parseInboundExcel(filePath: string): Promise<{ rows: InboundRawRow[]; fileName: string }> {
  const workbook = await readWorkbook(filePath);
  const allRows: InboundRawRow[] = [];

  for (const sheet of workbook.worksheets) {
    const sheetName = sheet.name;
    const headerRow = sheet.getRow(1);
    const colMap = buildInboundColMap(headerRow);
    if (colMap.name === -1) {
      log.info(`[inbound-parse] 工作表「${sheetName}」未找到品名列，跳过`);
      continue;
    }
    parseInboundSheet(sheet, sheetName, colMap, allRows);
  }

  return { rows: allRows, fileName: filePath.split('/').pop() || 'unknown.xlsx' };
}

/** 构建进项票列映射 */
function buildInboundColMap(headerRow: import('exceljs').Row): Record<string, number> {
  return {
    invoiceDate: findColumnIndex(headerRow, ['开票日期', '发票日期', '日期']),
    invoiceNo: findColumnIndex(headerRow, ['发票号', '发票号码', '发票编号']),
    sellerName: findColumnIndex(headerRow, ['销售方名称', '销方名称', '销售方']),
    name: findColumnIndex(headerRow, ['品名', '货物名称', '项目名称', '商品名称']),
    model: findColumnIndex(headerRow, ['规格型号', '型号', '规格']),
    unit: findColumnIndex(headerRow, ['单位']),
    quantity: findColumnIndex(headerRow, ['数量']),
    price: findColumnIndex(headerRow, ['单价', '不含税单价']),
    amount: findColumnIndex(headerRow, ['金额', '不含税金额']),
    tax: findColumnIndex(headerRow, ['税额', '税']),
    total: findColumnIndex(headerRow, ['合计', '价税合计']),
  };
}

/** 解析单个工作表 */
function parseInboundSheet(sheet: import('exceljs').Worksheet, sheetName: string, colMap: Record<string, number>, allRows: InboundRawRow[]): void {
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const name = trimInvisible(cellToText(row.getCell(colMap.name)));
    const model = colMap.model > 0 ? trimInvisible(cellToText(row.getCell(colMap.model))) : '';
    const unit = colMap.unit > 0 ? trimInvisible(cellToText(row.getCell(colMap.unit))) : '';
    if (!name && !model && !unit) continue;

    const quantityStr = colMap.quantity > 0 ? cellToText(row.getCell(colMap.quantity)) : '';
    let quantity: number | null = null;
    if (quantityStr?.trim()) {
      const n = Number(quantityStr.trim());
      if (Number.isFinite(n)) quantity = n;
    }

    allRows.push({
      sourceSheet: sheetName, sourceRow: r,
      invoiceDate: colMap.invoiceDate > 0 ? trimInvisible(cellToText(row.getCell(colMap.invoiceDate))) || null : null,
      invoiceNo: colMap.invoiceNo > 0 ? trimInvisible(cellToText(row.getCell(colMap.invoiceNo))) || null : null,
      sellerName: colMap.sellerName > 0 ? trimInvisible(cellToText(row.getCell(colMap.sellerName))) || null : null,
      name, model, unit, quantity,
      unitPriceDecimal: colMap.price > 0 ? trimInvisible(cellToText(row.getCell(colMap.price))) : '',
      amountYuan: colMap.amount > 0 ? trimInvisible(cellToText(row.getCell(colMap.amount))) || null : null,
      taxYuan: colMap.tax > 0 ? trimInvisible(cellToText(row.getCell(colMap.tax))) || null : null,
      totalYuan: colMap.total > 0 ? trimInvisible(cellToText(row.getCell(colMap.total))) || null : null,
    });
  }
}
