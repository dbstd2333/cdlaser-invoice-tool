import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
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

    const data = [
      ['客户名称', '纳税人识别号', '银行账号', '是否默认地址'],
      ['文本客户', '123456789012345678', '12345678901234567890', 'Y'],
      ['数值客户', 1234567890123456, 1234567890123456, 'N'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '客户信息');
    XLSX.writeFile(wb, filePath);

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
