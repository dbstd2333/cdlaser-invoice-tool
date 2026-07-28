import ExcelJS from 'exceljs';
import type { WriteFileOptions } from 'node:fs';
import { writeFile } from 'node:fs/promises';

/**
 * 导入模板生成器 - 生成客户、商品和进项的下载模板。
 */

/** 生成客户导入模板并保存到指定路径 */
export async function generateCustomerTemplate(savePath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('客户信息');
  sheet.columns = [
    { header: '客户名称', key: 'name', width: 30 },
    { header: '纳税人识别号', key: 'taxId', width: 25 },
    { header: '简码', key: 'shortCode', width: 15 },
    { header: '地址', key: 'address', width: 40 },
    { header: '电话', key: 'phone', width: 15 },
    { header: '开户行名称', key: 'bankName', width: 25 },
    { header: '银行账号', key: 'bankAccount', width: 25 },
    { header: '联系邮箱', key: 'email', width: 25 },
    { header: '是否默认地址', key: 'isDefaultAddress', width: 15 },
  ];
  sheet.getRow(1).font = { bold: true };
  // 税号、电话和银行账号必须按文本保存
  for (const column of [2, 5, 7]) {
    sheet.getColumn(column).numFmt = '@';
  }
  await workbook.xlsx.writeFile(savePath);
}

/** 生成商品导入模板并保存到指定路径 */
export async function generateCatalogTemplate(savePath: string, isInitial: boolean): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('商品信息');
  const columns: Partial<ExcelJS.Column>[] = [
    { header: '项目名称', key: 'name', width: 30 },
    { header: '规格型号', key: 'model', width: 20 },
    { header: '单位', key: 'unit', width: 10 },
    { header: '税收分类编码', key: 'taxCode', width: 20 },
    { header: '不含税单价', key: 'price', width: 15 },
  ];
  if (isInitial) {
    columns.push({ header: '初始库存', key: 'stock', width: 12 });
  }
  columns.push({ header: '备注', key: 'remark', width: 30 });
  sheet.columns = columns;
  sheet.getRow(1).font = { bold: true };
  // 型号和税收编码列设为文本格式
  sheet.getColumn(2).numFmt = '@';
  sheet.getColumn(4).numFmt = '@';
  await workbook.xlsx.writeFile(savePath);
}

/** 生成月初总部进项导入模板并保存到指定路径 */
export async function generateInboundTemplate(savePath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('进项明细');
  sheet.columns = [
    { header: '开票日期', key: 'invoiceDate', width: 14 },
    { header: '发票号码', key: 'invoiceNo', width: 22 },
    { header: '销售方名称', key: 'sellerName', width: 30 },
    { header: '品名', key: 'name', width: 30 },
    { header: '规格型号', key: 'model', width: 20 },
    { header: '单位', key: 'unit', width: 10 },
    { header: '数量', key: 'quantity', width: 12 },
    { header: '不含税单价', key: 'unitPrice', width: 16 },
    { header: '不含税金额', key: 'amount', width: 16 },
    { header: '税额', key: 'tax', width: 14 },
    { header: '价税合计', key: 'total', width: 16 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getColumn(1).numFmt = 'yyyy-mm-dd';
  sheet.getColumn(2).numFmt = '@';
  sheet.getColumn(5).numFmt = '@';
  sheet.getColumn(7).numFmt = '0';
  for (let column = 8; column <= 11; column += 1) {
    sheet.getColumn(column).numFmt = '0.00';
  }
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.autoFilter = { from: 'A1', to: 'K1' };
  await workbook.xlsx.writeFile(savePath);
}

/** 保存 Buffer 到文件 */
export async function saveBufferToFile(filePath: string, buffer: Buffer): Promise<void> {
  const options: WriteFileOptions = {};
  await writeFile(filePath, buffer, options);
}
