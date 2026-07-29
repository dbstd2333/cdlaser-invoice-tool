import { describe, it, expect } from 'vitest';
import {
  normalizeUnitPrice,
  calcAmountCent,
  calcTaxCent,
  calcTotalCent,
  centToYuan,
  yuanToCent,
  centToDisplay,
  formatTaxRate,
  TAX_RATE_INT,
} from './index';

/**
 * 金额计算单元测试 - 验证 decimal.js 精度计算。
 */
describe('金额计算', () => {
  describe('normalizeUnitPrice', () => {
    it('应规范化单价字符串', () => {
      expect(normalizeUnitPrice('100')).toBe('100');
      expect(normalizeUnitPrice('100.5')).toBe('100.5');
      expect(normalizeUnitPrice(' 100.50 ')).toBe('100.5');
    });

    it('应支持 13 位小数', () => {
      expect(normalizeUnitPrice('0.1234567890123')).toBe('0.1234567890123');
    });

    it('超过 13 位小数应自动四舍五入到 13 位', () => {
      expect(normalizeUnitPrice('0.12345678901234')).toBe('0.1234567890123'); // 第 14 位 4 舍去
      expect(normalizeUnitPrice('0.12345678901235')).toBe('0.1234567890124'); // 第 14 位 5 进 1
    });

    it('应拒绝小于等于 0 的单价', () => {
      expect(() => normalizeUnitPrice('0')).toThrow('大于 0');
      expect(() => normalizeUnitPrice('-1')).toThrow('大于 0');
    });
  });

  describe('calcAmountCent', () => {
    it('应正确计算金额（分）= 数量 × 单价', () => {
      // 10 × 100.5 = 1005.00 -> 100500 分
      expect(calcAmountCent(10, '100.5')).toBe(100500);
    });

    it('应四舍五入到 2 位', () => {
      // 3 × 0.333 = 0.999 -> 1.00 -> 100 分
      expect(calcAmountCent(3, '0.333')).toBe(100);
      // 2 × 0.125 = 0.25 -> 25 分
      expect(calcAmountCent(2, '0.125')).toBe(25);
    });

    it('应处理高精度单价', () => {
      // 1 × 0.1234567890123 = 0.1234567890123 -> 0.12 -> 12 分
      expect(calcAmountCent(1, '0.1234567890123')).toBe(12);
    });
  });

  describe('calcTaxCent', () => {
    it('应正确计算税额 = 金额 × 13%', () => {
      // 10000 分 × 0.13 = 1300 分
      expect(calcTaxCent(10000)).toBe(1300);
    });

    it('应四舍五入到 2 位', () => {
      // 1 分 × 0.13 = 0.13 -> 0 分（四舍五入到整数分）
      expect(calcTaxCent(1)).toBe(0);
      // 4 分 × 0.13 = 0.52 -> 1 分
      expect(calcTaxCent(4)).toBe(1);
    });
  });

  describe('calcTotalCent', () => {
    it('价税合计 = 金额 + 税额', () => {
      expect(calcTotalCent(10000, 1300)).toBe(11300);
    });
  });

  describe('centToYuan / yuanToCent', () => {
    it('分转元', () => {
      expect(centToYuan(100500)).toBe('1005.00');
      expect(centToYuan(0)).toBe('0.00');
    });

    it('元转分', () => {
      expect(yuanToCent('100.50')).toBe(10050);
      expect(yuanToCent(0)).toBe(0);
    });
  });

  describe('centToDisplay', () => {
    it('应显示千分位', () => {
      expect(centToDisplay(1234567)).toBe('12,345.67');
    });
  });

  describe('税率', () => {
    it('固定税率 13', () => {
      expect(TAX_RATE_INT).toBe(13);
      expect(formatTaxRate()).toBe('0.13');
    });
  });

  describe('销项开票金额全链路', () => {
    it('应正确计算完整开票金额', () => {
      // 数量 100，单价 99.99
      const quantity = 100;
      const unitPrice = '99.99';
      const amountCent = calcAmountCent(quantity, unitPrice); // 9999.00 -> 999900
      const taxCent = calcTaxCent(amountCent); // 999900 × 0.13 = 129987
      const totalCent = calcTotalCent(amountCent, taxCent); // 1129887

      expect(amountCent).toBe(999900);
      expect(taxCent).toBe(129987);
      expect(totalCent).toBe(1129887);
      expect(centToYuan(totalCent)).toBe('11298.87');
    });
  });
});
