/**
 * S3 云备份服务入口 - 重新导出各子模块。
 *
 * 模块拆分：
 * - backup-types: 类型定义
 * - backup-crypto: AES-256-GCM 加解密
 * - backup-config: 配置加密存储（safeStorage/DPAPI）
 * - backup-snapshot: 数据库快照、备份创建和恢复
 */

export type { S3Config, BackupStatus, BackupHistoryItem, BackupPayload } from './backup-types';

export { saveS3Config, loadS3Config, getConfigSummary } from './backup-config';
export { createDbSnapshot, createBackupPayload, decryptBackup, createPreRestoreBackup, restoreDatabase } from './backup-snapshot';
