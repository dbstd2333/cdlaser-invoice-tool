/**
 * 文本规范化工具 - 用于唯一键计算和搜索。
 * 去除首尾空白、全角空格、不可见字符，统一大小写用于规范化键。
 */

/** 去除首尾空白和不可见空格（含全角空格、零宽字符等） */
export function trimInvisible(input: string | null | undefined): string {
  if (input == null) return '';
  return String(input)
    .replace(/[​-‍﻿]/g, '')
    .replace(/　/g, ' ')
    .trim();
}

/** 规范化名称/型号键：去空白 + 全角转半角 + 小写 */
export function normalizeKey(input: string | null | undefined): string {
  const trimmed = trimInvisible(input);
  return fullWidthToHalf(trimmed).toLowerCase();
}

/** 全角字符转半角 */
export function fullWidthToHalf(input: string): string {
  return input.replace(/[！-～]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  ).replace(/　/g, ' ');
}

/** 规范化税号：去除空白、横线等分隔符，转大写 */
export function normalizeTaxId(input: string | null | undefined): string {
  return trimInvisible(input).replace(/[\s-]/g, '').toUpperCase();
}

/** 规范化银行账号：去除空白和横线 */
export function normalizeBankAccount(input: string | null | undefined): string {
  return trimInvisible(input).replace(/[\s-]/g, '');
}

/** 检测字符串是否为科学计数法（可能丢失精度的数值化标识） */
export function isScientificNotation(input: string): boolean {
  return /^[+-]?\d+\.?\d*[eE][+-]?\d+$/.test(trimInvisible(input));
}

/** 检测 Excel 数值单元格是否超过 15 位整数精度 */
export function isOverPrecisionNumeric(input: unknown): boolean {
  if (typeof input !== 'number' || !Number.isFinite(input) || !Number.isInteger(input)) {
    return false;
  }
  return Math.abs(input) >= 1_000_000_000_000_000;
}

/** XML 文本实体转义 */
export function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** CSV/Excel 公式注入转义：以 = + - @ 开头的文本前置单引号 */
export function escapeFormulaInjection(input: string): string {
  const trimmed = input;
  if (/^[=+\-@]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

/** 生成批次号：年月日时分秒 + 随机后缀 */
export function generateBatchNo(prefix: string): string {
  const now = new Date();
  const ymd =
    `${now.getFullYear()}` +
    `${String(now.getMonth() + 1).padStart(2, '0')}` +
    `${String(now.getDate()).padStart(2, '0')}`;
  const hms =
    `${String(now.getHours()).padStart(2, '0')}` +
    `${String(now.getMinutes()).padStart(2, '0')}` +
    `${String(now.getSeconds()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}${ymd}${hms}${rand}`;
}
