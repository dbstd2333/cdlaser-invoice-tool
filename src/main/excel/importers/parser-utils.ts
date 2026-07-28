import ExcelJS from 'exceljs';
import { isOverPrecisionNumeric, trimInvisible } from '@shared/contracts/normalize';

/**
 * Excel 解析共享工具。
 * 按表头定位列，文本字段去首尾空白，禁止自动转数字。
 */

/** 读取工作簿 */
export async function readWorkbook(filePath: string): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
}

/** 将单元格值转为文本，避免数字精度丢失 */
export function cellToText(cell: ExcelJS.Cell | undefined): string {
  if (!cell) return '';
  const val = cell.result ?? cell.value;
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'object') {
    if ('richText' in val) {
      return (val as { richText: { text: string }[] }).richText.map((r) => r.text).join('');
    }
    if ('text' in val) return String((val as { text: string }).text);
  }
  return String(val);
}

/** 将标识符单元格转为文本，并保留原始数值精度风险 */
export function cellToIdentifierText(
  cell: ExcelJS.Cell | undefined,
): { text: string; unsafeNumericPrecision: boolean } {
  if (!cell) return { text: '', unsafeNumericPrecision: false };
  const value = cell.result ?? cell.value;
  return {
    text: cellToText(cell),
    unsafeNumericPrecision: isOverPrecisionNumeric(value),
  };
}

/** 将单元格值转为数字（整数） */
export function cellToInt(cell: ExcelJS.Cell | undefined): number | null {
  if (!cell) return null;
  const val = cell.result ?? cell.value;
  if (val == null || val === '') return null;
  if (typeof val === 'number') return Number.isInteger(val) ? val : null;
  const str = String(val).trim();
  if (!str) return null;
  const n = Number(str);
  return Number.isFinite(n) && Number.isInteger(n) ? n : null;
}

/** 按表头名称查找列索引 */
export function findColumnIndex(headerRow: ExcelJS.Row, names: string[]): number {
  let foundCol = -1;
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    if (foundCol > 0) return;
    const headerText = trimInvisible(cellToText(cell)).toLowerCase();
    for (const name of names) {
      if (headerText === name.toLowerCase() || headerText.includes(name.toLowerCase())) {
        foundCol = Number(cell.col);
        return;
      }
    }
  });
  return foundCol;
}

/** 解析后的客户行 */
export interface ParsedCustomerRow {
  rowIndex: number;
  name: string;
  taxId: string;
  taxIdUnsafeNumericPrecision: boolean;
  shortCode: string | null;
  address: string | null;
  phone: string | null;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountUnsafeNumericPrecision: boolean;
  email: string | null;
  isDefaultAddress: boolean;
}

/** 解析后的商品行 */
export interface ParsedCatalogRow {
  rowIndex: number;
  name: string;
  model: string;
  unit: string;
  taxClassificationCode: string;
  unitPriceDecimal: string;
  initialStock: number | null;
  remark: string | null;
}
