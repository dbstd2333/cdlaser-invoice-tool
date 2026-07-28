import { describe, it, expect } from 'vitest';
import { escapeFormulaInjection, generateBatchNo, normalizeKey, normalizeTaxId } from './normalize';

/**
 * 导入防护和公式注入转义测试。
 * 对应技术 PRD 第 9.3 节导入防护。
 */
describe('导入防护', () => {
  describe('公式注入转义', () => {
    it('应以 = 开头的文本前置单引号', () => {
      expect(escapeFormulaInjection('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)");
    });

    it('应以 + 开头的文本前置单引号', () => {
      expect(escapeFormulaInjection('+1234567')).toBe("'+1234567");
    });

    it('应以 - 开头的文本前置单引号', () => {
      expect(escapeFormulaInjection('-1+1')).toBe("'-1+1");
    });

    it('应以 @ 开头的文本前置单引号', () => {
      expect(escapeFormulaInjection('@cmd')).toBe("'@cmd");
    });

    it('不应转义正常文本', () => {
      expect(escapeFormulaInjection('正常商品名称')).toBe('正常商品名称');
      expect(escapeFormulaInjection('100.50')).toBe('100.50');
    });
  });

  describe('批次号生成', () => {
    it('销项批次号应以 OUT 开头', () => {
      const no = generateBatchNo('OUT');
      expect(no.startsWith('OUT')).toBe(true);
      expect(no.length).toBe(3 + 14 + 4); // 前缀 + yyyyMMddHHmmss + 4位随机
    });

    it('进项批次号应以 INB 开头', () => {
      const no = generateBatchNo('INB');
      expect(no.startsWith('INB')).toBe(true);
    });

    it('月底导出号应以 REP 开头', () => {
      const no = generateBatchNo('REP');
      expect(no.startsWith('REP')).toBe(true);
    });

    it('同一毫秒内生成的批次号应不同', () => {
      const no1 = generateBatchNo('OUT');
      const no2 = generateBatchNo('OUT');
      // 随机后缀使它们不同
      expect(no1).not.toBe(no2);
    });
  });

  describe('规范化键', () => {
    it('应统一大小写用于唯一键', () => {
      expect(normalizeKey('ABC')).toBe(normalizeKey('abc'));
      expect(normalizeKey('ABC')).toBe('abc');
    });

    it('应全角转半角', () => {
      expect(normalizeKey('ＡＢＣ')).toBe('abc');
      expect(normalizeKey('１２３')).toBe('123');
    });

    it('应去除首尾空白和全角空格', () => {
      expect(normalizeKey('  hello  ')).toBe('hello');
      expect(normalizeKey('　hello　')).toBe('hello');
    });

    it('相同商品名不同大小写应产生相同键', () => {
      const key1 = normalizeKey('激光器');
      const key2 = normalizeKey('激光器');
      expect(key1).toBe(key2);
    });
  });

  describe('税号规范化', () => {
    it('应去除横线和空白', () => {
      expect(normalizeTaxId('91-11000-000')).toBe('9111000000');
      expect(normalizeTaxId(' 91 11000 000 ')).toBe('9111000000');
    });

    it('应转大写', () => {
      expect(normalizeTaxId('abc123')).toBe('ABC123');
    });

    it('相同税号不同格式应产生相同规范化值', () => {
      expect(normalizeTaxId('91-1100-000')).toBe(normalizeTaxId('9111000 00'));
    });
  });
});
