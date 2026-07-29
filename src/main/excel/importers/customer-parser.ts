import type { ParsedCustomerRow } from './parser-utils';
import {
  readWorkbook,
  cellToIdentifierText,
  cellToText,
  findColumnIndex,
} from './parser-utils';
import { trimInvisible } from '@shared/contracts/normalize';

/**
 * 客户导入 Excel 解析器。
 */

/** 解析客户首次导入 Excel */
export async function parseCustomerExcel(filePath: string): Promise<ParsedCustomerRow[]> {
  const workbook = await readWorkbook(filePath);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error('Excel 文件没有工作表');

  const headerRow = sheet.getRow(1);
  const colMap = {
    name: findColumnIndex(headerRow, ['客户名称', '名称', 'name']),
    taxId: findColumnIndex(headerRow, ['纳税人识别号', '税号', 'tax_id']),
    shortCode: findColumnIndex(headerRow, ['简码', 'short_code']),
    address: findColumnIndex(headerRow, ['地址', 'address']),
    phone: findColumnIndex(headerRow, ['电话', 'phone']),
    bankName: findColumnIndex(headerRow, ['开户行', '开户行名称', 'bank_name']),
    bankAccount: findColumnIndex(headerRow, ['银行账号', '账号', 'bank_account']),
    email: findColumnIndex(headerRow, ['邮箱', 'email']),
    isDefaultAddress: findColumnIndex(headerRow, ['是否默认地址', '默认地址']),
  };

  if (colMap.name === -1 || colMap.taxId === -1) {
    throw new Error('未找到「客户名称」或「纳税人识别号」列，请使用系统模板');
  }

  const rows: ParsedCustomerRow[] = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const name = trimInvisible(cellToText(row.getCell(colMap.name)));
    const taxIdCell = cellToIdentifierText(row.getCell(colMap.taxId));
    const taxId = trimInvisible(taxIdCell.text);
    if (!name && !taxId) continue;
    const bankAccountCell = colMap.bankAccount > 0
      ? cellToIdentifierText(row.getCell(colMap.bankAccount))
      : { text: '', unsafeNumericPrecision: false };
    const phoneCell = colMap.phone > 0
      ? cellToIdentifierText(row.getCell(colMap.phone))
      : { text: '', unsafeNumericPrecision: false };

    rows.push({
      rowIndex: r, name, taxId,
      taxIdUnsafeNumericPrecision: taxIdCell.unsafeNumericPrecision,
      shortCode: colMap.shortCode > 0 ? trimInvisible(cellToText(row.getCell(colMap.shortCode))) || null : null,
      address: colMap.address > 0 ? trimInvisible(cellToText(row.getCell(colMap.address))) || null : null,
      phone: trimInvisible(phoneCell.text) || null,
      phoneUnsafeNumericPrecision: phoneCell.unsafeNumericPrecision,
      bankName: colMap.bankName > 0 ? trimInvisible(cellToText(row.getCell(colMap.bankName))) || null : null,
      bankAccount: trimInvisible(bankAccountCell.text) || null,
      bankAccountUnsafeNumericPrecision: bankAccountCell.unsafeNumericPrecision,
      email: colMap.email > 0 ? trimInvisible(cellToText(row.getCell(colMap.email))) || null : null,
      isDefaultAddress: colMap.isDefaultAddress > 0
        ? ['是', 'true', '1', 'yes', 'y'].includes(trimInvisible(cellToText(row.getCell(colMap.isDefaultAddress))).toLowerCase())
        : false,
    });
  }

  return rows;
}
