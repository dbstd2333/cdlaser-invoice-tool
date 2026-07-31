/** 分 -> 展示用「元」字符串，三位逗号 + 2 位小数。 */
export function centToDisplay(cents: number | null | undefined): string {
  if (cents == null || Number.isNaN(cents)) return '-';
  const yuan = cents / 100;
  return yuan.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** 分 -> 数值元（用于表单输入）。 */
export function centToYuan(cents: number | null | undefined): number {
  if (cents == null || Number.isNaN(cents)) return 0;
  return cents / 100;
}

/** 元字符串/数字 -> 分。 */
export function yuanToCent(yuan: number | string): number {
  const n = typeof yuan === 'string' ? Number(yuan) : yuan;
  if (!n || Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}
