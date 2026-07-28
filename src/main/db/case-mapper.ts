/**
 * 行映射工具 - 将 raw SQL `SELECT *` 返回的 snake_case 键转换为 camelCase。
 * better-sqlite3 按数据库物理列名返回（snake_case），而 Drizzle 的 $inferSelect
 * 类型与业务代码使用 camelCase，直接断言会导致带下划线的字段为 undefined。
 */

/** 将单个对象的键从 snake_case 转为 camelCase */
export function toCamel<T>(row: Record<string, unknown> | null | undefined): T | null {
  if (row == null) return null;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    result[camelKey] = row[key];
  }
  return result as T;
}

/** 批量转换行数组的键 */
export function toCamelList<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((row) => toCamel<T>(row) as T);
}
