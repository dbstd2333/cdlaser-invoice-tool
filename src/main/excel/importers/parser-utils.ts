import * as XLSX from 'xlsx';
import * as fs from 'node:fs';
import { isOverPrecisionNumeric, trimInvisible } from '@shared/contracts/normalize';

// SheetJS ESM 构建（vitest 等 ESM 环境）不会自动加载 fs，需显式注入；
// CJS 构建（生产环境）中此调用无害。
XLSX.set_fs(fs);

/**
 * Excel 解析共享工具（基于 SheetJS 社区版）。
 * 读取层用轻量适配器包装 SheetJS，使上层 parser 无需感知底层库差异。
 *
 * 说明：SheetJS 社区版读取时可正确区分文本/数值/日期/布尔类型，
 * 足以支撑导入解析与超精度数值识别。
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

  constructor(
    public readonly name: string,
    ws: XLSX.WorkSheet,
  ) {
    // 将工作表转为二维数组：文本保留为字符串、数值为 number、日期为 Date。
    this.matrix =
      (XLSX.utils.sheet_to_json(ws, {
        header: 1,
        blankrows: true,
        defval: null,
        raw: true,
      }) as CellValue[][]) ?? [];
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
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  return {
    worksheets: workbook.SheetNames.map((name) => new XpSheet(name, workbook.Sheets[name])),
  };
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
    const obj = val as Record<string, unknown>;
    if ('text' in obj && typeof obj.text === 'string') return obj.text;
    if ('richText' in obj && Array.isArray(obj.richText)) {
      return (obj.richText as { text: string }[]).map((r) => r.text).join('');
    }
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
