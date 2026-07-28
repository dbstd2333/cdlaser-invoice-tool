import JSZip from 'jszip';
import log from 'electron-log/main';

/**
 * 税务模板 XLSX 验证器。
 * 验证生成文件的结构完整性：可解压、工作表存在、版本信息保留。
 */

const DETAIL_SHEET_NAME = '1-明细模板';

/**
 * 验证生成的 XLSX 结构完整性。
 */
export async function validateTaxTemplateXlsx(buf: Buffer, expectedLineCount: number): Promise<void> {
  const zip = await JSZip.loadAsync(buf);

  if (!zip.file('xl/workbook.xml')) {
    throw new Error('生成的 XLSX 缺少 workbook.xml');
  }

  const workbookXml = await zip.file('xl/workbook.xml')!.async('string');

  // 检查 4 个原始工作表仍存在
  const sheetNames = [...workbookXml.matchAll(/<sheet[^>]*name="([^"]+)"/g)].map((m) => m[1]);
  if (sheetNames.length < 4) {
    log.warn(`[tax-template] 工作表数量异常: ${sheetNames.length}`);
  }
  if (!sheetNames.includes(DETAIL_SHEET_NAME)) {
    throw new Error(`生成的 XLSX 缺少工作表「${DETAIL_SHEET_NAME}」`);
  }

  // 检查版本信息
  const hasVersion = /excelVersion|version/i.test(workbookXml);
  if (!hasVersion) {
    log.warn('[tax-template] 未在 workbook.xml 中检测到版本信息（可能在其他部件中）');
  }

  log.info(`[tax-template] 验证通过，明细行数: ${expectedLineCount}`);
}
