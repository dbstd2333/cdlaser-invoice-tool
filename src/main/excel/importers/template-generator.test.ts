import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { generateCustomerTemplate, generateInboundTemplate } from './template-generator';

describe('进项导入模板生成器', () => {
  let tempDirectory = '';

  /** 为模板文件测试创建独立临时目录。 */
  beforeAll(async () => {
    tempDirectory = await mkdtemp(join(tmpdir(), 'cdlaser-inbound-template-'));
  });

  /** 清理模板文件测试产生的临时目录。 */
  afterAll(async () => {
    await rm(tempDirectory, { recursive: true, force: true });
  });

  it('应生成与进项解析器兼容的表头', async () => {
    const filePath = join(tempDirectory, '月初总部进项导入模板.xlsx');
    await generateInboundTemplate(filePath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet('进项明细');
    const headers = sheet?.getRow(1).values;

    expect(headers).toEqual([
      undefined,
      '开票日期',
      '发票号码',
      '销售方名称',
      '品名',
      '规格型号',
      '单位',
      '数量',
      '含税单价',
      '不含税金额',
      '税额',
      '价税合计',
    ]);
  });
});

describe('客户导入模板生成器', () => {
  let tempDirectory = '';

  /** 为客户模板测试创建独立临时目录。 */
  beforeAll(async () => {
    tempDirectory = await mkdtemp(join(tmpdir(), 'cdlaser-customer-template-'));
  });

  /** 清理客户模板测试产生的临时目录。 */
  afterAll(async () => {
    await rm(tempDirectory, { recursive: true, force: true });
  });

  it('应将税号、电话和银行账号列设置为文本格式', async () => {
    const filePath = join(tempDirectory, '客户导入模板.xlsx');
    await generateCustomerTemplate(filePath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet('客户信息');

    expect(sheet?.getColumn(2).numFmt).toBe('@');
    expect(sheet?.getColumn(5).numFmt).toBe('@');
    expect(sheet?.getColumn(7).numFmt).toBe('@');
  });
});
