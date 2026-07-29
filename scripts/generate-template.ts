import XlsxPopulate from 'xlsx-populate';
import { resolve } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';

/**
 * 生成税务模板占位文件。
 * 实际项目中应使用官方「发票开具项目信息导入模板.xlsx」替换此文件。
 * 此脚本生成结构兼容的占位模板用于开发测试。
 */
async function generateTemplate(): Promise<void> {
  const dir = resolve(process.cwd(), 'resources/templates');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const filePath = resolve(dir, '发票开具项目信息导入模板.xlsx');

  const wb = await XlsxPopulate.fromBlankAsync();
  const detailSheet = wb.addSheet('1-明细模板');
  wb.deleteSheet('Sheet1');

  // 第 1 行：标题
  detailSheet.cell('A1').value('发票开具项目信息导入模板');
  detailSheet.cell('A1').style('bold', true);
  detailSheet.cell('A1').style('fontSize', 14);
  // 第 2 行：版本信息
  detailSheet.cell('A2').value('excelVersion: 1.0');
  // 第 3 行：表头
  const headers = ['项目名称', '税收分类编码', '规格型号', '单位', '数量', '单价', '金额', '税率'];
  const colWidths = [30, 20, 20, 10, 12, 15, 15, 10];
  headers.forEach((h, i) => {
    const col = i + 1;
    detailSheet.column(col).width(colWidths[i]);
    const cell = detailSheet.cell(3, col);
    cell.value(h);
    cell.style('bold', true);
    cell.style('fill', 'E0E0E0');
  });

  // 其他 3 个工作表（隐藏数据/版本信息/说明）
  const hiddenSheet = wb.addSheet('隐藏数据');
  hiddenSheet.cell('A1').value('hidden config data');
  hiddenSheet.hidden(true);

  const versionSheet = wb.addSheet('版本信息');
  versionSheet.cell('A1').value('excelVersion');
  versionSheet.cell('B1').value('1.0');

  const instructionSheet = wb.addSheet('说明');
  instructionSheet.cell('A1').value('从第 4 行开始写入明细数据');
  instructionSheet.cell('A2').value('税率固定为 0.13');

  await wb.toFileAsync(filePath);
  console.log(`税务模板已生成: ${filePath}`);
}

generateTemplate().catch(console.error);
