import { createHash } from 'node:crypto';
import { app } from 'electron';
import { existsSync, readFileSync, writeFileSync, renameSync, copyFileSync, unlinkSync } from 'node:fs';
import { getRawDb, closeDatabase, getDbPath } from '../../db/connection';
import { encryptData, decryptData } from './backup-crypto';
import type { BackupPayload } from './backup-types';
import log from 'electron-log/main';

/**
 * 数据库快照和恢复服务。
 * 使用 SQLite Online Backup API 创建一致性快照，AES-256-GCM 加解密。
 */

/** 使用 SQLite Online Backup API 创建一致性快照 */
export function createDbSnapshot(): Buffer {
  const raw = getRawDb();
  const snapshotPath = getDbPath() + '.backup-tmp';
  raw.backup(snapshotPath);
  const buf = readFileSync(snapshotPath);
  unlinkSync(snapshotPath);
  return buf;
}

/** 创建备份 payload（加密后的 Buffer + manifest） */
export function createBackupPayload(backupType: 'auto' | 'manual', password: string): BackupPayload {
  const dbBuf = createDbSnapshot();
  const dbSha256 = createHash('sha256').update(dbBuf).digest('hex');

  const raw = getRawDb();
  // 完整性检查
  const integrity = raw.pragma('integrity_check') as Array<{ integrity_check: string }>;
  if (integrity.length !== 1 || integrity[0].integrity_check !== 'ok') {
    throw new Error('数据库完整性检查未通过');
  }

  const manifest: BackupPayload['manifest'] = {
    appVersion: app.getVersion(),
    schemaVersion: '1.0',
    recordCounts: collectRecordCounts(raw),
    dbSha256,
    createdAt: new Date().toISOString(),
    backupType,
  };

  // 将 manifest + db 数据合并后加密
  const manifestJson = JSON.stringify(manifest);
  const manifestLenBuf = Buffer.alloc(4);
  manifestLenBuf.writeUInt32BE(manifestJson.length, 0);
  const plainData = Buffer.concat([manifestLenBuf, Buffer.from(manifestJson, 'utf-8'), dbBuf]);

  const { encrypted, salt, iv, tag } = encryptData(plainData, password);
  const buffer = Buffer.concat([salt, iv, tag, encrypted]);

  return { buffer, manifest };
}

/** 收集各表记录数 */
function collectRecordCounts(raw: ReturnType<typeof getRawDb>): Record<string, number> {
  const tables = ['customers', 'products', 'price_versions', 'outbound_batches', 'outbound_lines',
    'inbound_batches', 'inbound_lines', 'inventory_ledger', 'audit_events'];
  const counts: Record<string, number> = {};
  for (const table of tables) {
    const row = raw.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get() as { cnt: number };
    counts[table] = row.cnt;
  }
  return counts;
}

/** 解密备份并返回 manifest 和数据库 Buffer */
export function decryptBackup(buffer: Buffer, password: string): { manifest: BackupPayload['manifest']; dbBuffer: Buffer } {
  const salt = buffer.subarray(0, 16);
  const iv = buffer.subarray(16, 28);
  const tag = buffer.subarray(28, 44);
  const encrypted = buffer.subarray(44);

  const plainData = decryptData(encrypted, salt, iv, tag, password);
  const manifestLen = plainData.readUInt32BE(0);
  const manifestJson = plainData.subarray(4, 4 + manifestLen).toString('utf-8');
  const manifest = JSON.parse(manifestJson) as BackupPayload['manifest'];
  const dbBuffer = plainData.subarray(4 + manifestLen);

  // 校验 SHA-256
  const dbSha256 = createHash('sha256').update(dbBuffer).digest('hex');
  if (dbSha256 !== manifest.dbSha256) {
    throw new Error('备份数据库哈希校验失败');
  }

  return { manifest, dbBuffer };
}

/** 创建恢复前本地安全备份 */
export function createPreRestoreBackup(): string {
  const dbPath = getDbPath();
  if (!existsSync(dbPath)) return '';
  const backupPath = dbPath + '.prerestore';
  copyFileSync(dbPath, backupPath);
  return backupPath;
}

/** 执行数据库恢复：替换数据库文件 */
export function restoreDatabase(dbBuffer: Buffer): void {
  closeDatabase();
  const dbPath = getDbPath();
  const preRestoreBackup = createPreRestoreBackup();
  log.info(`[backup] 恢复前备份: ${preRestoreBackup}`);

  try {
    const tempPath = dbPath + '.restore-tmp';
    writeFileSync(tempPath, dbBuffer);
    // 删除 WAL 和 SHM 文件
    for (const ext of ['-wal', '-shm']) {
      if (existsSync(dbPath + ext)) unlinkSync(dbPath + ext);
    }
    renameSync(tempPath, dbPath);
    log.info('[backup] 数据库已替换');
  } catch (err) {
    log.error('[backup] 恢复失败，回滚到恢复前备份:', err);
    if (preRestoreBackup && existsSync(preRestoreBackup)) {
      copyFileSync(preRestoreBackup, dbPath);
    }
    throw err;
  }
}
