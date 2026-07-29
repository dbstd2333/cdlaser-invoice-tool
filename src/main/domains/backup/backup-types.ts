/**
 * 备份服务类型定义。
 */

export interface CosConfig {
  region: string;
  bucket: string;
  prefix?: string;
  secretId?: string;
  secretKey?: string;
  securityToken?: string;
  autoBackup?: boolean;
  retentionCount?: number;
  restorePassword?: string;
}

export interface BackupStatus {
  status: 'unconfigured' | 'idle' | 'testing' | 'backing_up' | 'restoring' | 'error';
  lastBackupTime: string | null;
  lastBackupSize: number | null;
  dirty: boolean;
  lastError: string | null;
  credentialConfigured: boolean;
}

export interface BackupHistoryItem {
  objectKey: string;
  backupTime: string;
  size: number;
  appVersion: string;
  schemaVersion: string;
  backupType: 'auto' | 'manual';
  checksumStatus: 'verified' | 'unknown';
}

/** 备份文件格式：[salt(16)][iv(12)][tag(16)][encryptedData...] */
export interface BackupPayload {
  buffer: Buffer;
  manifest: {
    appVersion: string;
    schemaVersion: string;
    recordCounts: Record<string, number>;
    dbSha256: string;
    createdAt: string;
    backupType: 'auto' | 'manual';
  };
}
