import XlsxPopulate from 'xlsx-populate';
import { isOverPrecisionNumeric, trimInvisible } from '@shared/contracts/normalize';

/**
 * Excel 解析共享工具（基于 xlsx-populate，纯 JS、对 Node 32 友好）。
 * 读取层用轻量适配器包装 xlsx-populate，使上层 parser 无需感知底层库差异。
 */

export type CellValue = string | number | boolean | Date | null;

/** 单元格（只读） */
export interface ReadCell {
  readonly value: CellValue;
  readonly result: CellValue;
  readonly col: number;
}

/** 行（1-based） */
export interface ReadRow {
  readonly rowNumber: number;
  getCell(col: number): ReadCell;
  eachCell(callback: (cell: ReadCell, col: number) => void, includeEmpty?: boolean): void;
}

/** 工作表 */
export interface ReadSheet {
  readonly name: string;
  readonly rowCount: number;
  getRow(row: number): ReadRow;
}

/** 工作簿 */
export interface ReadWorkbook {
  readonly worksheets: ReadSheet[];
}

class XpCell implements ReadCell {
  constructor(
    public readonly value: CellValue,
    public readonly col: number,
  ) {}
  get result(): CellValue {
    return this.value;
  }
}

class XpRow implements ReadRow {
  constructor(
    private readonly values: CellValue[],
    public readonly rowNumber: number,
  ) {}

  getCell(col: number): ReadCell {
    const v = col >= 1 && col <= this.values.length ? this.values[col - 1] : null;
    return new XpCell(v ?? null, col);
  }

  eachCell(callback: (cell: ReadCell, col: number) => void, includeEmpty = false): void {
    for (let c = 1; c <= this.values.length; c++) {
      const v = this.values[c - 1];
      if (!includeEmpty && (v == null || v === '')) continue;
      callback(new XpCell(v ?? null, c), c);
    }
  }
}

class XpSheet implements ReadSheet {
  private readonly matrix: CellValue[][];

  constructor(private readonly sheet: import('xlsx-populate').Sheet) {
    const used = this.sheet.usedRange ? this.sheet.usedRange() : null;
    this.matrix = used ? (used.value() as CellValue[][]) : [];
  }

  get name(): string {
    return this.sheet.name();
  }

  get rowCount(): number {
    return this.matrix.length;
  }

  getRow(row: number): ReadRow {
    const values = row >= 1 && row <= this.matrix.length ? this.matrix[row - 1] : [];
    return new XpRow(values, row);
  }
}

/** 读取工作簿 */
export async function readWorkbook(filePath: string): Promise<ReadWorkbook> {
  const workbook = await XlsxPopulate.fromFileAsync(filePath);
  return { worksheets: workbook.sheets().map((s) => new XpSheet(s)) };
}

/** 将单元格值转为文本，避免数字精度丢失 */
export function cellToText(cell: ReadCell | undefined): string {
  if (!cell) return '';
  const val = cell.result ?? cell.value;
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
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
  cell: ReadCell | undefined,
): { text: string; unsafeNumericPrecision: boolean } {
  if (!cell) return { text: '', unsafeNumericPrecision: false };
  const value = cell.result ?? cell.value;
  return {
    text: cellToText(cell),
    unsafeNumericPrecision: isOverPrecisionNumeric(value),
  };
}

/** 将单元格值转为数字（整数） */
export function cellToInt(cell: ReadCell | undefined): number | null {
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
export function findColumnIndex(headerRow: ReadRow, names: string[]): number {
  let foundCol = -1;
  headerRow.eachCell((cell, col) => {
    if (foundCol > 0) return;
    const headerText = trimInvisible(cellToText(cell)).toLowerCase();
    for (const name of names) {
      if (headerText === name.toLowerCase() || headerText.includes(name.toLowerCase())) {
        foundCol = col;
        return;
      }
    }
  }, true);
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
  phoneUnsafeNumericPrecision: boolean;
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
