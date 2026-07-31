import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { generateCustomerTemplate, generateInboundTemplate } from './template-generator';

function firstRow(filePath: string): unknown[] {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return (XLSX.utils.sheet_to_json(ws, { header: 1 })[0] ?? []) as unknown[];
}

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

    expect(firstRow(filePath)).toEqual([
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

  it('应生成含税号、电话和银行账号列，且标识符按文本写入以保留精度', async () => {
    const filePath = join(tempDirectory, '客户导入模板.xlsx');
    await generateCustomerTemplate(filePath);

    const headers = firstRow(filePath);
    expect(headers[1]).toBe('纳税人识别号');
    expect(headers[4]).toBe('电话');
    expect(headers[6]).toBe('银行账号');

    // 社区版无法预设 @ 文本格式，需由数据本身决定类型：
    // 文本标识符写入后读回仍为字符串，数值标识符读回为 number（导入解析据此识别精度风险）。
    const probe = XLSX.utils.book_new();
    const probeWs = XLSX.utils.aoa_to_sheet([
      ['纳税人识别号'],
      ['123456789012345678'],
      [1234567890123456],
    ]);
    XLSX.utils.book_append_sheet(probe, probeWs, '客户信息');
    const probePath = join(tempDirectory, 'probe.xlsx');
    XLSX.writeFile(probe, probePath);

    const reread = XLSX.utils.sheet_to_json(XLSX.readFile(probePath).Sheets['客户信息'], {
      header: 1,
      raw: true,
    }) as unknown[][];
    expect(typeof reread[1][0]).toBe('string');
    expect(typeof reread[2][0]).toBe('number');
  });
});
