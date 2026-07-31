import * as XLSX from 'xlsx';
import * as fs from 'node:fs';
import { resolve } from 'node:path';

// SheetJS ESM 构建不会自动加载 fs，需显式注入；CJS 构建中此调用无害。
XLSX.set_fs(fs);

/**
 * 生成税务模板占位文件。
 * 实际项目中应使用官方「发票开具项目信息导入模板.xlsx」替换此文件。
 * 此脚本生成结构兼容的占位模板用于开发测试。
 *
 * 注意：基于 SheetJS 社区版，不写入单元格样式（加粗、字号、填充、隐藏工作表）。
 */
async function generateTemplate(): Promise<void> {
  const dir = resolve(process.cwd(), 'resources/templates');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = resolve(dir, '发票开具项目信息导入模板.xlsx');

  const detailHeaders = ['项目名称', '税收分类编码', '规格型号', '单位', '数量', '单价', '金额', '税率'];
  const colWidths = [30, 20, 20, 10, 12, 15, 15, 10];

  // 第 1 行标题、第 2 行版本、第 3 行表头
  const detailWs = XLSX.utils.aoa_to_sheet([
    ['发票开具项目信息导入模板'],
    ['excelVersion: 1.0'],
    detailHeaders,
  ]);
  detailWs['!cols'] = colWidths.map((w) => ({ wch: w }));

  // 其他 3 个工作表（隐藏数据/版本信息/说明）
  const hiddenWs = XLSX.utils.aoa_to_sheet([['hidden config data']]);
  const versionWs = XLSX.utils.aoa_to_sheet([['excelVersion', '1.0']]);
  const instructionWs = XLSX.utils.aoa_to_sheet([
    ['从第 4 行开始写入明细数据'],
    ['税率固定为 0.13'],
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, detailWs, '1-明细模板');
  XLSX.utils.book_append_sheet(wb, hiddenWs, '隐藏数据');
  XLSX.utils.book_append_sheet(wb, versionWs, '版本信息');
  XLSX.utils.book_append_sheet(wb, instructionWs, '说明');

  XLSX.writeFile(wb, filePath);
  console.log(`税务模板已生成: ${filePath}`);
}

generateTemplate().catch(console.error);
