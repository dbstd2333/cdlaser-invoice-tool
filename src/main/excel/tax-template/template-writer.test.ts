import { describe, it, expect, vi } from 'vitest';
import JSZip from 'jszip';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Mock Electron 运行时（findTemplatePath 在开发环境优先用 process.cwd/resources/templates，
// 不会真正调用 app，但 import { app } from 'electron' 仍需可导入）
vi.mock('electron', () => ({
  app: {
    getAppPath: () => process.cwd(),
    getPath: () => '/tmp',
    isPackaged: false,
  },
}));

vi.mock('electron-log/main', () => ({
  default: { info: () => {}, warn: () => {}, error: () => {} },
}));

import { generateTaxTemplateXlsx, type TaxTemplateLine } from './template-writer';

const TEMPLATE_PATH = resolve(
  process.cwd(),
  'resources/templates/发票开具项目信息导入模板.xlsx',
);

const sampleLine: TaxTemplateLine = {
  name: '激光器',
  taxClassificationCode: '1090127010100000000', // 19 位税收分类编码
  model: 'CD-100',
  unit: '个',
  quantity: 2,
  unitPriceDecimal: '188.00',
  amountYuan: '376.00',
  taxRate: '0.13',
};

async function readSheet1(buf: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buf);
  return zip.file('xl/worksheets/sheet1.xml')!.async('string');
}

describe('generateTaxTemplateXlsx - 严格按照税务模板导出', () => {
  it('保留第 1-3 行表头，第 4 行起写入数据', async () => {
    const buf = await generateTaxTemplateXlsx([sampleLine]);
    const s1 = await readSheet1(buf);

    // 第 1-3 行保留（表头文本以 sharedString 形式引用，存于 sharedStrings.xml，
    // 其内容不变由「其他部件不变」用例覆盖，这里验证行结构未被破坏）
    expect(s1).toContain('<row r="1"');
    expect(s1).toContain('<row r="2"');
    expect(s1).toContain('<row r="3"');
    expect(s1).toContain('<c r="A3" s="10" t="s">');
    expect(s1).toContain('<c r="H3" s="10" t="s">');

    // 第 4 行写入新数据
    expect(s1).toContain('<row r="4"');
    expect(s1).toContain('激光器');
  });

  it('数据行以文本格式（s=1, inlineStr）存储，19 位编码不丢精度', async () => {
    const buf = await generateTaxTemplateXlsx([sampleLine]);
    const s1 = await readSheet1(buf);

    const row4 = s1.match(/<row r="4">[\s\S]*?<\/row>/);
    expect(row4).toBeTruthy();

    // 全部单元格使用文本样式 s=1，类型为 inlineStr
    expect(row4![0]).toContain('s="1"');
    expect(row4![0]).toContain('t="inlineStr"');
    // 不应以数值 <v> 形式存储
    expect(row4![0]).not.toMatch(/<v>/);

    // 19 位税收分类编码完整保留（若以数值存储会被截断为 15 位）
    expect(row4![0]).toContain('1090127010100000000');
    // 金额、税率、数量均以文本存储
    expect(row4![0]).toContain('376.00');
    expect(row4![0]).toContain('0.13');
    expect(row4![0]).toContain('>2<');
  });

  it('A-H 列顺序正确', async () => {
    const buf = await generateTaxTemplateXlsx([sampleLine]);
    const s1 = await readSheet1(buf);
    const row4 = s1.match(/<row r="4">[\s\S]*?<\/row>/)![0];

    // 提取各列单元格引用，确认 A-H 全部存在
    for (const col of ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4']) {
      expect(row4).toContain(`r="${col}"`);
    }
  });

  it('多行数据：替换示例行，dimension 更新行号但保留列范围', async () => {
    const buf = await generateTaxTemplateXlsx([sampleLine, { ...sampleLine, name: '第二批' }]);
    const s1 = await readSheet1(buf);

    // 第 4、5 行有数据，原示例行被替换
    expect(s1).toContain('<row r="4"');
    expect(s1).toContain('<row r="5"');
    expect(s1).toContain('第二批');

    // dimension：列范围保留模板的 V，结束行更新为 5
    const dim = s1.match(/<dimension[^>]*ref="([^"]+)"/);
    expect(dim![1]).toBe('A1:V5');
  });

  it('保留 dataValidations 与 mergeCells', async () => {
    const buf = await generateTaxTemplateXlsx([sampleLine]);
    const s1 = await readSheet1(buf);

    // 优惠政策类型、煤炭种类下拉验证保留
    expect(s1).toContain('<dataValidations');
    expect(s1).toContain('J4:J1001');
    expect(s1).toContain('K4:K1001');
    // 第 1 行说明合并单元格保留
    expect(s1).toContain('A1:K1');
  });

  it('其他部件内容不变（styles/sharedStrings/其他工作表/关系等）', async () => {
    const buf = await generateTaxTemplateXlsx([sampleLine]);
    const outZip = await JSZip.loadAsync(buf);
    const tplZip = await JSZip.loadAsync(readFileSync(TEMPLATE_PATH));

    const unchanged = [
      '[Content_Types].xml',
      '_rels/.rels',
      'docProps/app.xml',
      'docProps/core.xml',
      'docProps/custom.xml',
      'xl/_rels/workbook.xml.rels',
      'xl/sharedStrings.xml',
      'xl/styles.xml',
      'xl/theme/theme1.xml',
      'xl/workbook.xml',
      'xl/worksheets/sheet2.xml',
      'xl/worksheets/sheet3.xml',
      'xl/worksheets/sheet4.xml',
    ];
    for (const f of unchanged) {
      const a = await tplZip.file(f)!.async('string');
      const b = await outZip.file(f)!.async('string');
      expect(b, `部件 ${f} 内容应不变`).toBe(a);
    }
  });

  it('生成的 XLSX 可通过结构验证', async () => {
    const { validateTaxTemplateXlsx } = await import('./template-writer');
    const buf = await generateTaxTemplateXlsx([sampleLine]);
    await expect(validateTaxTemplateXlsx(buf, 1)).resolves.toBeUndefined();
  });
});
