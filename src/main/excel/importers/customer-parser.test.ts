import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
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
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('客户信息');
    sheet.addRow(['客户名称', '纳税人识别号', '银行账号', '是否默认地址']);
    sheet.addRow(['文本客户', '123456789012345678', '12345678901234567890', 'Y']);
    sheet.addRow(['数值客户', 1234567890123456, 1234567890123456, 'N']);
    await workbook.xlsx.writeFile(filePath);

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
