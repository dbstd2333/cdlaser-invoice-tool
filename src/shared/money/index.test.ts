import { describe, it, expect } from 'vitest';
import {
  normalizeUnitPrice,
  taxExclusiveUnitPrice,
  calcAmountCent,
  calcOutboundAmountCent,
  scaleUnitPrice,
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
 * 单价均为含税单价，不含税金额由含税单价 ÷ 1.13 反推。
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

  describe('taxExclusiveUnitPrice', () => {
    it('应将含税单价反推为不含税单价', () => {
      // 113 ÷ 1.13 = 100
      expect(taxExclusiveUnitPrice('113')).toBe('100');
      // 1.13 ÷ 1.13 = 1
      expect(taxExclusiveUnitPrice('1.13')).toBe('1');
    });

    it('应四舍五入到 13 位小数', () => {
      // 100.5 ÷ 1.13 = 88.93805309734513... -> 88.9380530973451
      expect(taxExclusiveUnitPrice('100.5')).toBe('88.9380530973451');
    });
  });

  describe('calcAmountCent', () => {
    it('应正确计算不含税金额（分）= 数量 ×（含税单价 ÷ 1.13）', () => {
      // 含税 113 ÷ 1.13 = 100，10 × 100 = 1000.00 -> 100000 分
      expect(calcAmountCent(10, '113')).toBe(100000);
    });

    it('应四舍五入到 2 位', () => {
      // 含税 1.13 ÷ 1.13 = 1，3 × 1 = 3.00 -> 300 分
      expect(calcAmountCent(3, '1.13')).toBe(300);
      // 含税 1.13 ÷ 1.13 = 1，2 × 1 = 2.00 -> 200 分
      expect(calcAmountCent(2, '1.13')).toBe(200);
    });

    it('应处理高精度含税单价', () => {
      // 含税 100.5 ÷ 1.13 = 88.9380530973451，10 × 88.9380530973451 = 889.38 -> 88938 分
      expect(calcAmountCent(10, '100.5')).toBe(88938);
    });
  });

  describe('calcOutboundAmountCent', () => {
    it('应按系数计算金额 = 含税单价 × 数量 × 系数', () => {
      // 含税 100 × 10 × 1.09 = 1090.00 -> 109000 分
      expect(calcOutboundAmountCent(10, '100', '1.09')).toBe(109000);
    });

    it('默认系数 1.09', () => {
      expect(calcOutboundAmountCent(10, '100')).toBe(109000);
    });

    it('应四舍五入到 2 位', () => {
      // 含税 1.13 × 3 × 1.09 = 3.6951 -> 3.70 -> 370 分
      expect(calcOutboundAmountCent(3, '1.13', '1.09')).toBe(370);
    });
  });

  describe('scaleUnitPrice', () => {
    it('应将单价乘以系数', () => {
      // 100 × 1.09 = 109
      expect(scaleUnitPrice('100', '1.09')).toBe('109');
    });

    it('应保留 13 位小数', () => {
      // 1.13 × 1.09 = 1.2317
      expect(scaleUnitPrice('1.13', '1.09')).toBe('1.2317');
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
    it('应正确计算完整开票金额（含税单价倒推不含税）', () => {
      // 数量 100，含税单价 99.99（价税合计 9999.00）
      const quantity = 100;
      const unitPrice = '99.99';
      const amountCent = calcAmountCent(quantity, unitPrice); // 99.99÷1.13=88.4867… ×100 = 8848.67 -> 884867
      const taxCent = calcTaxCent(amountCent); // 884867 × 0.13 = 115032.71 -> 115033
      const totalCent = calcTotalCent(amountCent, taxCent); // 884867 + 115033 = 999900

      expect(amountCent).toBe(884867);
      expect(taxCent).toBe(115033);
      expect(totalCent).toBe(999900);
      expect(centToYuan(totalCent)).toBe('9999.00');
    });
  });
});
