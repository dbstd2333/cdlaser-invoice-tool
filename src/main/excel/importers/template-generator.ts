import XlsxPopulate, { type Sheet, type Workbook } from 'xlsx-populate';
import type { WriteFileOptions } from 'node:fs';
import { writeFile } from 'node:fs/promises';

/**
 * 导入模板生成器 - 生成客户、商品和进项的下载模板。
 * 基于 xlsx-populate（纯 JS，对 Node 32 友好）。
 */

const TEXT_FORMAT = '@';

/** 创建空白工作簿并移除默认 Sheet1，返回指定名称的工作表 */
async function withSheet(name: string): Promise<{ wb: Workbook; sheet: Sheet }> {
  const wb = await XlsxPopulate.fromBlankAsync();
  const sheet = wb.addSheet(name);
  wb.deleteSheet('Sheet1');
  return { wb, sheet };
}

/** 写入表头：加粗，可选居中，并设置列宽 */
function writeHeaders(
  sheet: Sheet,
  headers: string[],
  widths: number[],
  align = false,
): void {
  headers.forEach((h, i) => {
    const col = i + 1;
    sheet.column(col).width(widths[i]);
    const cell = sheet.cell(1, col);
    cell.value(h);
    cell.style('bold', true);
    if (align) {
      cell.style('verticalAlignment', 'middle');
      cell.style('horizontalAlignment', 'center');
    }
  });
}

/** 生成客户导入模板并保存到指定路径 */
export async function generateCustomerTemplate(savePath: string): Promise<void> {
  const { wb, sheet } = await withSheet('客户信息');

  const headers = ['客户名称', '纳税人识别号', '简码', '地址', '电话', '开户行名称', '银行账号', '联系邮箱', '是否默认地址'];
  const widths = [30, 25, 15, 40, 15, 25, 25, 25, 15];
  writeHeaders(sheet, headers, widths);

  // 税号、电话和银行账号必须按文本保存
  for (const col of [2, 5, 7]) {
    sheet.column(col).style('numberFormat', TEXT_FORMAT);
  }
  await wb.toFileAsync(savePath);
}

/** 生成商品导入模板并保存到指定路径 */
export async function generateCatalogTemplate(savePath: string, isInitial: boolean): Promise<void> {
  const { wb, sheet } = await withSheet('商品信息');

  const headers = ['项目名称', '规格型号', '单位', '税收分类编码', '含税单价'];
  const widths = [30, 20, 10, 20, 15];
  if (isInitial) {
    headers.push('初始库存');
    widths.push(12);
  }
  headers.push('备注');
  widths.push(30);
  writeHeaders(sheet, headers, widths);

  // 型号和税收编码列设为文本格式
  sheet.column(2).style('numberFormat', TEXT_FORMAT);
  sheet.column(4).style('numberFormat', TEXT_FORMAT);
  await wb.toFileAsync(savePath);
}

/** 生成月初总部进项导入模板并保存到指定路径 */
export async function generateInboundTemplate(savePath: string): Promise<void> {
  const { wb, sheet } = await withSheet('进项明细');

  const headers = ['开票日期', '发票号码', '销售方名称', '品名', '规格型号', '单位', '数量', '含税单价', '不含税金额', '税额', '价税合计'];
  const widths = [14, 22, 30, 30, 20, 10, 12, 16, 16, 14, 16];
  writeHeaders(sheet, headers, widths, true);

  sheet.column(1).style('numberFormat', 'yyyy-mm-dd');
  sheet.column(2).style('numberFormat', TEXT_FORMAT);
  sheet.column(5).style('numberFormat', TEXT_FORMAT);
  sheet.column(7).style('numberFormat', '0');
  for (let col = 8; col <= 11; col += 1) {
    sheet.column(col).style('numberFormat', '0.00');
  }
  sheet.freezePanes('A2');
  sheet.autoFilter = 'A1:K1';
  await wb.toFileAsync(savePath);
}

/** 保存 Buffer 到文件 */
export async function saveBufferToFile(filePath: string, buffer: Buffer): Promise<void> {
  const options: WriteFileOptions = {};
  await writeFile(filePath, buffer, options);
}
