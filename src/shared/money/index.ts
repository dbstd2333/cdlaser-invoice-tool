import Decimal from 'decimal.js';

/**
 * 金额计算工具模块。
 * 所有业务金额计算统一使用 decimal.js，禁止使用 JS Number 浮点直接计算。
 * 金额、税额、价税合计均以「人民币分」整数存储；单价以「含税单价」规范化十进制字符串存储，
 * 计算不含税金额时由 taxExclusiveUnitPrice 反推（含税单价 ÷ 1.13）。
 */

Decimal.set({
  rounding: Decimal.ROUND_HALF_UP,
  precision: 40,
});

/** 税率：固定 13%，导出时格式化为 0.13 */
export const TAX_RATE_INT = 13;
export const TAX_RATE_DECIMAL = '0.13';
export const TAX_RATE_FACTOR = new Decimal('0.13');
/** 价税合计系数 = 1 + 税率 = 1.13，含税单价 ÷ 该值得不含税单价 */
export const TAX_INCLUSIVE_FACTOR = new Decimal(1).plus(TAX_RATE_FACTOR);

/** 单价最大小数位数 */
export const UNIT_PRICE_MAX_DECIMALS = 13;

/**
 * 规范化含税单价字符串：去除首尾空白，去除科学计数法，校验为正数。
 * 小数位数超过 UNIT_PRICE_MAX_DECIMALS（13）位时自动四舍五入到 13 位（而非报错），
 * 避免导入文件因单价精度被整批阻断；单价以十进制字符串存储，无浮点损失。
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
  const rounded = d.toDecimalPlaces(UNIT_PRICE_MAX_DECIMALS, Decimal.ROUND_HALF_UP);
  return rounded.toString();
}

/**
 * 含税单价 -> 不含税单价（含税单价 ÷ 1.13），四舍五入到 13 位小数。
 * 用于销项导出填入金税模板的「商品单价」列（国税标准为不含税单价），
 * 以及由含税单价计算不含税金额。
 */
export function taxExclusiveUnitPrice(taxInclusive: string | number | Decimal): string {
  const d = new Decimal(String(taxInclusive).trim());
  const exclusive = d.div(TAX_INCLUSIVE_FACTOR);
  return exclusive.toDecimalPlaces(UNIT_PRICE_MAX_DECIMALS, Decimal.ROUND_HALF_UP).toString();
}

/**
 * 计算不含税金额（分）= 数量 ×（含税单价 ÷ 1.13），四舍五入到 2 位。
 * unitPriceDecimal 为含税单价，内部先经 taxExclusiveUnitPrice 反推不含税单价，
 * 保证「不含税单价 × 数量 = 不含税金额」与金税模板一致。
 */
export function calcAmountCent(quantity: number, unitPriceDecimal: string): number {
  const exclusive = new Decimal(taxExclusiveUnitPrice(unitPriceDecimal));
  const amount = new Decimal(quantity).times(exclusive);
  const rounded = amount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  return rounded.times(100).round().toNumber();
}

/** 销项开票默认金额系数（金额 = 含税单价 × 系数） */
export const OUTBOUND_AMOUNT_FACTOR = '1.09';

/**
 * 销项开票金额（分）= 含税单价 × 数量 × 系数，四舍五入到 2 位。
 * 直接按含税单价乘固定系数，不另算税额/价税合计/不含税金额。
 */
export function calcOutboundAmountCent(
  quantity: number,
  taxInclusiveUnitPrice: string,
  factor: string | number = OUTBOUND_AMOUNT_FACTOR,
): number {
  const amount = new Decimal(quantity).times(new Decimal(taxInclusiveUnitPrice)).times(new Decimal(factor));
  const rounded = amount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  return rounded.times(100).round().toNumber();
}

/** 金额（分）乘系数并四舍五入到整数分。 */
export function scaleAmountCent(amountCent: number, factor: string | number): number {
  return new Decimal(amountCent).times(new Decimal(factor)).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
}

/** 最终金额（分）按数量反推每件开票单价，保留 13 位小数。 */
export function amountCentToUnitPrice(amountCent: number, quantity: number): string {
  if (!Number.isInteger(amountCent) || amountCent <= 0) throw new Error('金额必须为正整数分');
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('数量必须为正整数');
  return new Decimal(amountCent).div(100).div(quantity)
    .toDecimalPlaces(UNIT_PRICE_MAX_DECIMALS, Decimal.ROUND_HALF_UP)
    .toString();
}

/** 将带角分的金额四舍五入到整数元，返回整数分。 */
export function roundCentToWholeYuan(amountCent: number): number {
  return new Decimal(amountCent).div(100)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .times(100)
    .toNumber();
}

/** 将含税单价四舍五入到整数元。 */
export function roundUnitPriceToWholeYuan(unitPrice: string | number): string {
  return new Decimal(String(unitPrice))
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toString();
}

/** 单价 × 系数（保留 13 位小数），用于销项导出「商品单价」列 = 含税单价 × 系数 */
export function scaleUnitPrice(unitPrice: string | number | Decimal, factor: string | number): string {
  return new Decimal(String(unitPrice)).times(new Decimal(factor)).toDecimalPlaces(UNIT_PRICE_MAX_DECIMALS, Decimal.ROUND_HALF_UP).toString();
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
