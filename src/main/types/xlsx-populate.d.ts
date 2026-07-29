/**
 * xlsx-populate 本地类型声明（该库未随包发布 .d.ts）。
 * 仅覆盖本项目用到的 API 子集。
 */
declare module 'xlsx-populate' {
  export interface Cell {
    value(): unknown;
    value(v: unknown): Cell;
    style(name: string): unknown;
    style(name: string, value: unknown): Cell;
    formula(): unknown;
  }

  export interface Column {
    width(): number;
    width(w: number): Column;
    style(name: string): unknown;
    style(name: string, value: unknown): Column;
    hidden(): boolean;
    hidden(h: boolean): Column;
  }

  export interface Row {
    cell(address: string): Cell;
    cell(col: number): Cell;
    height(): number;
    height(h: number): Row;
  }

  export interface Range {
    value(): unknown[][];
    value(v: unknown): Range;
    style(name: string, value: unknown): Range;
    autoFilter(): Range;
  }

  export interface Sheet {
    name(): string;
    cell(address: string): Cell;
    cell(row: number, col: number): Cell;
    column(col: number | string): Column;
    row(row: number): Row;
    usedRange(): Range;
    freezePanes(ref: string): Sheet;
    autoFilter: string | null;
    hidden(): boolean;
    hidden(h: boolean): Sheet;
  }

  export interface Workbook {
    sheet(name: string): Sheet;
    sheet(index: number): Sheet;
    sheets(): Sheet[];
    addSheet(name: string): Sheet;
    deleteSheet(name: string): void;
    toFileAsync(path: string): Promise<void>;
    outputAsync(): Promise<Buffer>;
  }

  export interface XlsxPopulate {
    fromBlankAsync(): Promise<Workbook>;
    fromFileAsync(path: string): Promise<Workbook>;
    fromDataAsync(data: ArrayBuffer | Uint8Array | Buffer): Promise<Workbook>;
  }

  const XlsxPopulate: XlsxPopulate;
  export default XlsxPopulate;
}
