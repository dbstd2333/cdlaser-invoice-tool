import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import XlsxPopulate from 'xlsx-populate';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parseCustomerExcel } from './customer-parser';

describe('客户导入解析器', () => {
  let tempDirectory = '';

  /** 为客户解析测试创建独立临时目录。 */
  beforeAll(async () => {
    tempDirectory = await mkdtemp(join(tmpdir(), 'cdlaser-customer-parser-'));
  });

  /** 清理客户解析测试产生的临时目录。 */
  afterAll(async () => {
    await rm(tempDirectory, { recursive: true, force: true });
  });

  it('应接受长文本标识符并识别超精度数值单元格', async () => {
    const filePath = join(tempDirectory, '客户导入.xlsx');
    const wb = await XlsxPopulate.fromBlankAsync();
    const sheet = wb.addSheet('客户信息');
    wb.deleteSheet('Sheet1');

    const headers = ['客户名称', '纳税人识别号', '银行账号', '是否默认地址'];
    headers.forEach((h, i) => sheet.cell(1, i + 1).value(h));
    // 文本标识符（应识别为文本，不触发精度告警）
    sheet.cell(2, 1).value('文本客户');
    sheet.cell(2, 2).value('123456789012345678');
    sheet.cell(2, 3).value('12345678901234567890');
    sheet.cell(2, 4).value('Y');
    // 数值标识符（应触发超精度告警）
    sheet.cell(3, 1).value('数值客户');
    sheet.cell(3, 2).value(1234567890123456);
    sheet.cell(3, 3).value(1234567890123456);
    sheet.cell(3, 4).value('N');
    await wb.toFileAsync(filePath);

    const rows = await parseCustomerExcel(filePath);

    expect(rows[0]).toMatchObject({
      taxIdUnsafeNumericPrecision: false,
      bankAccountUnsafeNumericPrecision: false,
      isDefaultAddress: true,
    });
    expect(rows[1]).toMatchObject({
      taxIdUnsafeNumericPrecision: true,
      bankAccountUnsafeNumericPrecision: true,
      isDefaultAddress: false,
    });
  });
});
