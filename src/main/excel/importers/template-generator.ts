import * as XLSX from 'xlsx';
import * as fs from 'node:fs';
import type { WriteFileOptions } from 'node:fs';
import { writeFile } from 'node:fs/promises';

// SheetJS ESM 构建（vitest 等 ESM 环境）不会自动加载 fs，需显式注入；
// CJS 构建（生产环境）中此调用无害。
XLSX.set_fs(fs);

/**
 * 导入模板生成器 - 生成客户、商品和进项的下载模板。
 * 基于 SheetJS 社区版（从官方 CDN 安装：https://cdn.sheetjs.com）。
 *
 * 注意：SheetJS 社区版不支持写入单元格样式（加粗、填充、数字格式 @、
 * 数据校验、冻结窗格、自动筛选）。因此模板仅保证数据正确性与列宽，
 * 原有视觉样式与“文本格式”保护需在后续用 SheetJS Pro 或 xlsx-js-style 增强。
 * 为保证导入解析时的标识符精度，生成模板时这些列请以文本方式填写数据。
 */

/** 由表头与列宽构建工作表（仅列宽，无样式） */
function buildSheet(headers: string[], widths: number[]): XLSX.WorkSheet {
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  ws['!cols'] = widths.map((w) => ({ wch: w }));
  return ws;
}

/** 创建只包含指定工作表的工作簿 */
function bookWithSheet(name: string, ws: XLSX.WorkSheet): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, name);
  return wb;
}

/** 生成客户导入模板并保存到指定路径 */
export async function generateCustomerTemplate(savePath: string): Promise<void> {
  const headers = ['客户名称', '纳税人识别号', '简码', '地址', '电话', '开户行名称', '银行账号', '联系邮箱', '是否默认地址'];
  const widths = [30, 25, 15, 40, 15, 25, 25, 25, 15];
  XLSX.writeFile(bookWithSheet('客户信息', buildSheet(headers, widths)), savePath);
}

/** 生成商品导入模板并保存到指定路径 */
export async function generateCatalogTemplate(savePath: string, isInitial: boolean): Promise<void> {
  const headers = ['项目名称', '规格型号', '单位', '税收分类编码', '含税单价'];
  const widths = [30, 20, 10, 20, 15];
  if (isInitial) {
    headers.push('初始库存');
    widths.push(12);
  }
  headers.push('备注');
  widths.push(30);
  XLSX.writeFile(bookWithSheet('商品信息', buildSheet(headers, widths)), savePath);
}

/** 生成月初总部进项导入模板并保存到指定路径 */
export async function generateInboundTemplate(savePath: string): Promise<void> {
  const headers = ['开票日期', '发票号码', '销售方名称', '品名', '规格型号', '单位', '数量', '含税单价', '不含税金额', '税额', '价税合计'];
  const widths = [14, 22, 30, 30, 20, 10, 12, 16, 16, 14, 16];
  XLSX.writeFile(bookWithSheet('进项明细', buildSheet(headers, widths)), savePath);
}

/** 保存 Buffer 到文件 */
export async function saveBufferToFile(filePath: string, buffer: Buffer): Promise<void> {
  const options: WriteFileOptions = {};
  await writeFile(filePath, buffer, options);
}
