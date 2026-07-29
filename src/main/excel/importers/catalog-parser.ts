import type { ParsedCatalogRow } from './parser-utils';
import { readWorkbook, cellToText, cellToInt, findColumnIndex } from './parser-utils';
import { trimInvisible } from '@shared/contracts/normalize';

/**
 * 商品导入 Excel 解析器。
 * 支持首次导入（含初始库存）和日常导入。
 */

/** 解析商品首次/日常导入 Excel */
export async function parseCatalogExcel(filePath: string, isInitial: boolean): Promise<ParsedCatalogRow[]> {
  const workbook = await readWorkbook(filePath);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error('Excel 文件没有工作表');

  const headerRow = sheet.getRow(1);
  const colMap = {
    name: findColumnIndex(headerRow, ['项目名称', '商品名称', '名称', 'name']),
    model: findColumnIndex(headerRow, ['规格型号', '型号', 'model']),
    unit: findColumnIndex(headerRow, ['单位', 'unit']),
    taxCode: findColumnIndex(headerRow, ['税收分类编码', '税收编码', 'tax_code']),
    price: findColumnIndex(headerRow, ['含税单价', '单价', 'unit_price']),
    stock: findColumnIndex(headerRow, ['初始库存', '库存', 'stock']),
    remark: findColumnIndex(headerRow, ['备注', 'remark']),
  };

  if (colMap.name === -1 || colMap.model === -1 || colMap.price === -1) {
    throw new Error('未找到必要列（项目名称、规格型号、单价），请使用系统模板');
  }

  const rows: ParsedCatalogRow[] = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const name = trimInvisible(cellToText(row.getCell(colMap.name)));
    const model = trimInvisible(cellToText(row.getCell(colMap.model)));
    if (!name && !model) continue;

    rows.push({
      rowIndex: r, name, model,
      unit: colMap.unit > 0 ? trimInvisible(cellToText(row.getCell(colMap.unit))) : '',
      taxClassificationCode: colMap.taxCode > 0 ? trimInvisible(cellToText(row.getCell(colMap.taxCode))) : '',
      unitPriceDecimal: trimInvisible(cellToText(row.getCell(colMap.price))),
      initialStock: isInitial && colMap.stock > 0 ? cellToInt(row.getCell(colMap.stock)) : null,
      remark: colMap.remark > 0 ? trimInvisible(cellToText(row.getCell(colMap.remark))) || null : null,
    });
  }

  return rows;
}
