import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { resolve } from 'node:path';
import { existsSync, mkdirSync, copyFileSync, renameSync, unlinkSync } from 'node:fs';
import { app } from 'electron';
import * as schema from './schema/index';
import { runMigrations } from './migrations/initial-schema';
import log from 'electron-log/main';

/**
 * 数据库连接管理器。
 * 负责初始化 SQLite 连接、启用 PRAGMA、执行建表迁移和数据库一致性校验。
 */

export type DB = BetterSQLite3Database<typeof schema> & { $raw: Database.Database };

let dbInstance: Database.Database | null = null;
let drizzleInstance: DB | null = null;

/** 获取数据库文件路径（Electron userData 下专用目录） */
export function getDbPath(): string {
  const dataDir = resolve(app.getPath('userData'), 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  return resolve(dataDir, 'invoice-tool.db');
}

/** 获取数据库临时快照路径（用于迁移前备份） */
export function getDbSnapshotPath(): string {
  return getDbPath() + '.snapshot';
}

/** 创建数据库文件快照（迁移前调用） */
export function createDbSnapshot(): void {
  const dbPath = getDbPath();
  if (existsSync(dbPath)) copyFileSync(dbPath, getDbSnapshotPath());
}

/** 回滚到迁移前快照 */
export function rollbackDbSnapshot(): void {
  const snapshotPath = getDbSnapshotPath();
  if (existsSync(snapshotPath)) {
    const dbPath = getDbPath();
    if (existsSync(dbPath)) unlinkSync(dbPath);
    renameSync(snapshotPath, dbPath);
  }
}

/** 清理快照文件 */
export function cleanupSnapshot(): void {
  const snapshotPath = getDbSnapshotPath();
  if (existsSync(snapshotPath)) unlinkSync(snapshotPath);
}

/**
 * 初始化数据库连接并执行建表。
 * 启用外键约束、WAL 模式、busy_timeout。
 */
export function initDatabase(): DB {
  if (drizzleInstance) return drizzleInstance;

  const dbPath = getDbPath();
  log.info(`[db] 初始化数据库: ${dbPath}`);

  dbInstance = new Database(dbPath);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');
  dbInstance.pragma('busy_timeout = 5000');
  dbInstance.pragma('synchronous = NORMAL');

  createDbSnapshot();
  try {
    runMigrations(dbInstance);
    cleanupSnapshot();
    log.info('[db] 建表迁移完成');
  } catch (err) {
    log.error('[db] 迁移失败，回滚到快照:', err);
    rollbackDbSnapshot();
    throw err;
  }

  drizzleInstance = drizzle(dbInstance, { schema }) as unknown as DB;
  (drizzleInstance as DB).$raw = dbInstance;
  return drizzleInstance;
}

/** 数据库完整性检查 */
export function checkIntegrity(db: Database.Database): boolean {
  const result = db.pragma('integrity_check') as Array<{ integrity_check: string }>;
  return result.length === 1 && result[0].integrity_check === 'ok';
}

/** 关闭数据库连接 */
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    drizzleInstance = null;
  }
}

/** 获取原始 better-sqlite3 实例 */
export function getRawDb(): Database.Database {
  if (!dbInstance) throw new Error('数据库未初始化');
  return dbInstance;
}

/** 获取 Drizzle 实例 */
export function getDb(): DB {
  if (!drizzleInstance) throw new Error('数据库未初始化');
  return drizzleInstance;
}
