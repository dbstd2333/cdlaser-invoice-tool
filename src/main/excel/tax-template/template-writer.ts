import JSZip from 'jszip';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { app } from 'electron';
import { escapeXml } from '@shared/contracts/normalize';
import { createHash } from 'node:crypto';
import { TAX_RATE_DECIMAL } from '@shared/money/index';
import log from 'electron-log/main';

/**
 * 税务模板 OOXML 定点修改器。
 * 基准文件为「发票开具项目信息导入模板.xlsx」，数据工作表为「1-明细模板」。
 * 采用 ZIP/OOXML 定点修改，仅修改明细工作表 XML 的第 4 行及以后数据，
 * 其他 XML、关系、样式、隐藏工作表和版本单元保持字节级不变。
 */

const TEMPLATE_FILE_NAME = '发票开具项目信息导入模板.xlsx';
const DETAIL_SHEET_NAME = '1-明细模板';
const DATA_START_ROW = 4;
// 模板第 4 行示例数据使用的样式索引：numFmt=49（「@」文本格式）、font=0、fill=0、border=0。
// 税收分类编码为 19 位数字，若以数值类型存储会丢失精度，故模板统一以文本形式存放明细数据。
const DATA_STYLE_INDEX = 1;

export interface TaxTemplateLine {
  name: string;
  taxClassificationCode: string;
  model: string;
  unit: string;
  quantity: number;
  unitPriceDecimal: string;
  amountYuan: string; // 2 位小数
  taxRate: string; // '0.13'
}

/** 查找模板文件路径 */
export function findTemplatePath(): string {
  // 候选路径：开发环境 resources/templates、生产环境 app/resources/templates、
  // 打包后 extraResources。process.resourcesPath 仅在 Electron 运行时存在，需判空，
  // 否则在非 Electron 环境（如单元测试）下 resolve(undefined, ...) 会直接抛错。
  const candidates: string[] = [
    resolve(process.cwd(), 'resources/templates', TEMPLATE_FILE_NAME),
    resolve(app.getAppPath(), '..', 'resources', 'templates', TEMPLATE_FILE_NAME),
  ];
  if (process.resourcesPath) {
    candidates.push(resolve(process.resourcesPath, 'templates', TEMPLATE_FILE_NAME));
  }
  for (const p of candidates) {
    try {
      readFileSync(p);
      return p;
    } catch {
      // continue
    }
  }
  return candidates[candidates.length - 1];
}

/** 计算模板文件 SHA-256 */
export function computeTemplateSha256(): string {
  const buf = readFileSync(findTemplatePath());
  return createHash('sha256').update(buf).digest('hex');
}

/**
 * 将 Excel 列号转换为字母（1 -> A, 27 -> AA）
 */
function colToLetter(col: number): string {
  let result = '';
  while (col > 0) {
    const mod = (col - 1) % 26;
    result = String.fromCharCode(65 + mod) + result;
    col = Math.floor((col - 1) / 26);
  }
  return result;
}

/**
 * 构造一个 OOXML 行的 XML 字符串。
 * 列顺序：A 项目名称、B 商品和服务税收分类编码、C 规格型号、D 单位、
 *         E 商品数量、F 商品单价、G 金额、H 税率。
 * 全部以 inlineStr 文本写入并套用 DATA_STYLE_INDEX（文本格式）样式，
 * 与模板第 4 行示例数据一致，避免 19 位税收分类编码以数值存储时丢失精度。
 */
function buildRowXml(rowIndex: number, line: TaxTemplateLine): string {
  const r = String(rowIndex);
  const cells: string[] = [];
  const values = [
    line.name,
    line.taxClassificationCode,
    line.model,
    line.unit,
    String(line.quantity),
    line.unitPriceDecimal,
    line.amountYuan,
    line.taxRate,
  ];
  for (let col = 0; col < values.length; col++) {
    const colLetter = colToLetter(col + 1);
    const cellRef = `${colLetter}${rowIndex}`;
    const val = values[col];
    cells.push(
      `<c r="${cellRef}" t="inlineStr" s="${DATA_STYLE_INDEX}"><is><t xml:space="preserve">${escapeXml(val)}</t></is></c>`,
    );
  }
  return `<row r="${r}">${cells.join('')}</row>`;
}

/**
 * 定点修改税务模板，生成包含明细数据的 XLSX Buffer。
 * 仅修改「1-明细模板」工作表的第 4 行及以后，其他部件保持不变。
 */
export async function generateTaxTemplateXlsx(lines: TaxTemplateLine[]): Promise<Buffer> {
  if (lines.length > 2000) {
    throw new Error('明细行数超过 2000 行上限');
  }

  const templatePath = findTemplatePath();
  const templateBuf = readFileSync(templatePath);

  const zip = await JSZip.loadAsync(templateBuf);

  // 查找「1-明细模板」对应的工作表 XML
  // 先读取 workbook.xml 获取 sheet 名称 -> rId 映射
  const workbookXml = await zip.file('xl/workbook.xml')!.async('string');
  const sheetMatch = workbookXml.match(
    new RegExp(`<sheet[^>]*name="${DETAIL_SHEET_NAME.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}"[^>]*r:id="([^"]+)"`),
  );
  if (!sheetMatch) {
    throw new Error(`模板中未找到工作表「${DETAIL_SHEET_NAME}」`);
  }
  const sheetRId = sheetMatch[1];

  // 读取 rels 获取 sheet XML 路径
  const relsXml = await zip.file('xl/_rels/workbook.xml.rels')!.async('string');
  const relMatch = relsXml.match(new RegExp(`Id="${sheetRId}"[^>]*Target="([^"]+)"`));
  if (!relMatch) {
    throw new Error('未找到工作表关系目标');
  }
  const sheetTarget = relMatch[1].startsWith('/') ? relMatch[1].slice(1) : `xl/${relMatch[1]}`;
  const sheetPath = sheetTarget;

  const sheetXml = await zip.file(sheetPath)!.async('string');

  // 构造新数据行
  const newRows: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    newRows.push(buildRowXml(DATA_START_ROW + i, lines[i]));
  }
  const newRowsXml = newRows.join('');

  // 更新 sheetData：保留第 1-3 行（填表说明、字段要求、表头），替换第 4 行及以后的示例数据
  const sheetDataMatch = sheetXml.match(/<sheetData[^>]*>([\s\S]*?)<\/sheetData>/);
  if (!sheetDataMatch) {
    throw new Error('工作表 XML 中未找到 sheetData');
  }

  const fullSheetData = sheetDataMatch[1];
  // 提取第 1-3 行
  const rowsBefore = fullSheetData.match(/<row[^>]*>[\s\S]*?<\/row>/g) || [];
  const headerRows = rowsBefore.slice(0, DATA_START_ROW - 1).join('');
  const newSheetData = `<sheetData>${headerRows}${newRowsXml}</sheetData>`;

  let newSheetXml = sheetXml.replace(/<sheetData[^>]*>[\s\S]*?<\/sheetData>/, newSheetData);

  // 更新 dimension：保留模板原始列范围（如 A1:V4 中的 V），仅更新结束行号
  const endRow = DATA_START_ROW + lines.length - 1;
  newSheetXml = newSheetXml.replace(
    /<dimension[^>]*ref="([A-Z]+\d+):([A-Z]+)\d+"/,
    (_match, start: string, col: string) => `<dimension ref="${start}:${col}${endRow}"`,
  );

  zip.file(sheetPath, newSheetXml);

  const result = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return result as Buffer;
}

/** 将 XLSX Buffer 转为 Base64 字符串存储 */
export function xlsxToBase64(buf: Buffer): string {
  return buf.toString('base64');
}

/** 将 Base64 字符串还原为 XLSX Buffer */
export function base64ToXlsx(b64: string): Buffer {
  return Buffer.from(b64, 'base64');
}

/** 计算 Buffer 的 SHA-256 */
export function computeSha256(buf: Buffer): string {
  return createHash('sha256').update(buf).digest('hex');
}

// 验证逻辑已拆分到 template-validator.ts
export { validateTaxTemplateXlsx } from './template-validator';
