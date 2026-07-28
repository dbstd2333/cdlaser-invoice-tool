import Decimal from 'decimal.js';

/**
 * 金额计算工具模块。
 * 所有业务金额计算统一使用 decimal.js，禁止使用 JS Number 浮点直接计算。
 * 金额、税额、价税合计均以「人民币分」整数存储；单价以规范化十进制字符串存储。
 */

Decimal.set({
  rounding: Decimal.ROUND_HALF_UP,
  precision: 40,
});

/** 税率：固定 13%，导出时格式化为 0.13 */
export const TAX_RATE_INT = 13;
export const TAX_RATE_DECIMAL = '0.13';
export const TAX_RATE_FACTOR = new Decimal('0.13');

/** 单价最大小数位数 */
export const UNIT_PRICE_MAX_DECIMALS = 13;

/**
 * 规范化单价字符串：去除首尾空白，去除科学计数法，校验小数位数不超过 13 位。
 * 返回不含前导零的最简十进制字符串（保留有效小数）。
 */
export function normalizeUnitPrice(input: string | number | Decimal): string {
  const d = new Decimal(String(input).trim());
  if (!d.isFinite()) {
    throw new Error('单价不是有效数字');
  }
  if (d.lte(0)) {
    throw new Error('单价必须大于 0');
  }
  const str = d.toString();
  const dotIndex = str.indexOf('.');
  if (dotIndex >= 0 && str.length - dotIndex - 1 > UNIT_PRICE_MAX_DECIMALS) {
    throw new Error(`单价小数位数不能超过 ${UNIT_PRICE_MAX_DECIMALS} 位`);
  }
  return str;
}

/**
 * 计算金额（分）= 数量 × 不含税单价，四舍五入到 2 位。
 */
export function calcAmountCent(quantity: number, unitPriceDecimal: string): number {
  const amount = new Decimal(quantity).times(new Decimal(unitPriceDecimal));
  const rounded = amount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  return rounded.times(100).round().toNumber();
}

/**
 * 计算税额（分）= 金额（分）× 13%，四舍五入到 2 位。
 */
export function calcTaxCent(amountCent: number): number {
  const tax = new Decimal(amountCent).times(TAX_RATE_FACTOR);
  // 税额以分存储，四舍五入到整数分（等价于元保留 2 位）
  return tax.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
}

/** 价税合计（分）= 金额 + 税额 */
export function calcTotalCent(amountCent: number, taxCent: number): number {
  return amountCent + taxCent;
}

/** 将分转换为元字符串，保留 2 位小数 */
export function centToYuan(cent: number): string {
  return new Decimal(cent).div(100).toFixed(2);
}

/** 将元字符串转换为分整数 */
export function yuanToCent(yuan: string | number): number {
  return new Decimal(yuan).times(100).round().toNumber();
}

/** 格式化税率为显示字符串 0.13 */
export function formatTaxRate(): string {
  return TAX_RATE_DECIMAL;
}

/**
 * 金额分 -> 千分位显示字符串（元），如 1234567 -> "12,345.67"
 */
export function centToDisplay(cent: number): string {
  const yuan = centToYuan(cent);
  const [intPart, decPart] = yuan.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart ? `${formattedInt}.${decPart}` : `${formattedInt}.00`;
}
