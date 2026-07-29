import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import XlsxPopulate from 'xlsx-populate';
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

    const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const sheet = workbook.sheet('进项明细');
    const headers: unknown[] = [];
    for (let col = 1; col <= 11; col += 1) {
      headers.push(sheet.cell(1, col).value());
    }

    expect(headers).toEqual([
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

    const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const sheet = workbook.sheet('客户信息');

    expect(sheet.column(2).style('numberFormat')).toBe('@');
    expect(sheet.column(5).style('numberFormat')).toBe('@');
    expect(sheet.column(7).style('numberFormat')).toBe('@');
  });
});
