import { describe, it, expect } from 'vitest';
import {
  trimInvisible,
  normalizeKey,
  fullWidthToHalf,
  normalizeTaxId,
  normalizeBankAccount,
  isScientificNotation,
  isOverPrecisionNumeric,
  escapeXml,
  escapeFormulaInjection,
  generateBatchNo,
} from './normalize';
import { getStockStatus, getStockStatusText } from './types';

/**
 * 规范化工具和库存状态单元测试。
 */
describe('文本规范化', () => {
  it('trimInvisible 去除首尾空白和不可见字符', () => {
    expect(trimInvisible('  hello  ')).toBe('hello');
    expect(trimInvisible('　全角空格　')).toBe('全角空格');
    expect(trimInvisible(null)).toBe('');
  });

  it('normalizeKey 规范化为小写键', () => {
    expect(normalizeKey('ABC')).toBe('abc');
    expect(normalizeKey('１２３')).toBe('123');
  });

  it('fullWidthToHalf 全角转半角', () => {
    expect(fullWidthToHalf('１２３ＡＢＣ')).toBe('123ABC');
  });

  it('normalizeTaxId 规范化税号', () => {
    expect(normalizeTaxId(' 91-11000-000 ')).toBe('9111000000');
    expect(normalizeTaxId('abc')).toBe('ABC');
  });

  it('normalizeBankAccount 规范化银行账号', () => {
    expect(normalizeBankAccount(' 6228-4800-1234 ')).toBe('622848001234');
  });

  it('isScientificNotation 检测科学计数法', () => {
    expect(isScientificNotation('1.23E+10')).toBe(true);
    expect(isScientificNotation('1.23e-5')).toBe(true);
    expect(isScientificNotation('12345')).toBe(false);
  });

  it('isOverPrecisionNumeric 仅检测超精度数值单元格', () => {
    expect(isOverPrecisionNumeric(1234567890123456)).toBe(true);
    expect(isOverPrecisionNumeric(1e21)).toBe(true);
    expect(isOverPrecisionNumeric('1234567890123456')).toBe(false);
    expect(isOverPrecisionNumeric(12345)).toBe(false);
  });

  it('escapeXml XML 实体转义', () => {
    expect(escapeXml('<test>"value"</test>')).toBe('&lt;test&gt;&quot;value&quot;&lt;/test&gt;');
    expect(escapeXml("it's & that")).toBe("it&apos;s &amp; that");
  });

  it('escapeFormulaInjection 公式注入转义', () => {
    expect(escapeFormulaInjection('=SUM(A1)')).toBe("'=SUM(A1)");
    expect(escapeFormulaInjection('+123')).toBe("'+123");
    expect(escapeFormulaInjection('正常文本')).toBe('正常文本');
  });

  it('generateBatchNo 生成批次号', () => {
    const no = generateBatchNo('OUT');
    expect(no).toMatch(/^OUT\d{14}\d{4}$/);
  });
});

describe('库存状态', () => {
  it('getStockStatus 正确映射库存状态', () => {
    expect(getStockStatus(10)).toBe('positive');
    expect(getStockStatus(0)).toBe('zero');
    expect(getStockStatus(-5)).toBe('negative');
  });

  it('getStockStatusText 正确显示状态文本', () => {
    expect(getStockStatusText(10)).toBe('有余量 10');
    expect(getStockStatusText(0)).toBe('已平衡');
    expect(getStockStatusText(-5)).toBe('待补 5');
  });
});
