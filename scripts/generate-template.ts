import ExcelJS from 'exceljs';
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

  const workbook = new ExcelJS.Workbook();
  workbook.creator = '发票库存管理系统';
  workbook.created = new Date();

  // 明细模板工作表
  const detailSheet = workbook.addWorksheet('1-明细模板');
  // 第 1 行：标题
  detailSheet.getCell('A1').value = '发票开具项目信息导入模板';
  detailSheet.getCell('A1').font = { bold: true, size: 14 };
  // 第 2 行：版本信息
  detailSheet.getCell('A2').value = 'excelVersion: 1.0';
  // 第 3 行：表头
  const headers = ['项目名称', '税收分类编码', '规格型号', '单位', '数量', '单价', '金额', '税率'];
  for (let i = 0; i < headers.length; i++) {
    detailSheet.getCell(3, i + 1).value = headers[i];
    detailSheet.getCell(3, i + 1).font = { bold: true };
    detailSheet.getCell(3, i + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
  }
  // 设置列宽
  detailSheet.columns = [
    { width: 30 }, { width: 20 }, { width: 20 }, { width: 10 },
    { width: 12 }, { width: 15 }, { width: 15 }, { width: 10 },
  ];

  // 其他 3 个工作表（隐藏数据/版本信息/说明）
  const hiddenSheet = workbook.addWorksheet('隐藏数据', { state: 'hidden' });
  hiddenSheet.getCell('A1').value = 'hidden config data';

  const versionSheet = workbook.addWorksheet('版本信息');
  versionSheet.getCell('A1').value = 'excelVersion';
  versionSheet.getCell('B1').value = '1.0';

  const instructionSheet = workbook.addWorksheet('说明');
  instructionSheet.getCell('A1').value = '从第 4 行开始写入明细数据';
  instructionSheet.getCell('A2').value = '税率固定为 0.13';

  await workbook.xlsx.writeFile(filePath);
  console.log(`税务模板已生成: ${filePath}`);
}

generateTemplate().catch(console.error);
