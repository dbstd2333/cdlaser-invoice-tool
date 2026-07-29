import { registerHandler } from '../security/ipc-security';
import { IPC_CHANNELS } from '@shared/contracts/channels';
import { cosConfigSchema, restoreRequestSchema } from '@shared/schemas/index';
import {
  saveCosConfig,
  loadCosConfig,
  getConfigSummary,
  createBackupPayload,
  decryptBackup,
  restoreDatabase,
  type BackupHistoryItem,
  type BackupStatus,
} from '../domains/backup/backup-service';
import {
  testCosConnection,
  buildObjectKey,
  uploadBackup,
  listBackupObjects,
  downloadBackupObject,
  deleteOldBackups,
} from '../domains/backup/cos-client';
import { getOrCreateInstallId, isDirty, clearDirty, getSetting, setSetting } from '../domains/audit/settings-service';
import { initDatabase, closeDatabase } from '../db/connection';
import log from 'electron-log/main';

/**
 * 备份 IPC 处理器 - 配置、测试、备份、列表、恢复。
 */

/** 备份任务状态 */
let currentTask: { taskId: string; type: 'backup' | 'restore'; phase: string; progress: number; processedBytes: number } | null = null;

export function registerBackupIpc(): void {
  // 获取备份状态
  registerHandler(IPC_CHANNELS.backup.getStatus, null, (): BackupStatus => {
    const config = loadCosConfig();
    const lastBackupTime = getSetting('last_backup_time');
    const lastBackupSize = getSetting('last_backup_size');
    const lastError = getSetting('last_backup_error');
    return {
      status: currentTask?.type === 'backup' ? 'backing_up' : currentTask?.type === 'restore' ? 'restoring' : !config ? 'unconfigured' : 'idle',
      lastBackupTime,
      lastBackupSize: lastBackupSize ? parseInt(lastBackupSize, 10) : null,
      dirty: isDirty(),
      lastError: lastError,
      credentialConfigured: !!(config?.secretId && config?.secretKey),
    };
  });

  // 获取配置
  registerHandler(IPC_CHANNELS.backup.getConfig, null, () => {
    return getConfigSummary();
  });

  // 保存配置
  registerHandler(IPC_CHANNELS.backup.saveConfig, cosConfigSchema, (input) => {
    // 如果没有提供新密钥，保留旧密钥
    const existing = loadCosConfig();
    const replacingCredentials = !!(input.secretId || input.secretKey);
    const configToSave = {
      ...input,
      secretId: input.secretId || existing?.secretId,
      secretKey: input.secretKey || existing?.secretKey,
      securityToken: replacingCredentials
        ? input.securityToken || undefined
        : input.securityToken || existing?.securityToken,
      restorePassword: input.restorePassword || existing?.restorePassword,
    };
    saveCosConfig(configToSave);
    return { saved: true };
  });

  // 测试连接
  registerHandler(IPC_CHANNELS.backup.testConnection, cosConfigSchema, async (input) => {
    // 合并已有密钥
    const existing = loadCosConfig();
    const replacingCredentials = !!(input.secretId || input.secretKey);
    const configToTest = {
      ...input,
      secretId: input.secretId || existing?.secretId,
      secretKey: input.secretKey || existing?.secretKey,
      securityToken: replacingCredentials
        ? input.securityToken || undefined
        : input.securityToken || existing?.securityToken,
    };
    return testCosConnection(configToTest);
  });

  // 立即备份
  registerHandler(IPC_CHANNELS.backup.create, null, async () => {
    const config = loadCosConfig();
    if (!config) throw new Error('未配置腾讯云 COS 连接');
    if (!config.secretId || !config.secretKey) throw new Error('未配置腾讯云 COS 凭据');
    if (!config.restorePassword) throw new Error('未设置恢复密码');

    const taskId = `backup-${Date.now()}`;
    currentTask = { taskId, type: 'backup', phase: '创建快照', progress: 0, processedBytes: 0 };

    try {
      currentTask.phase = '创建数据库快照';
      const payload = createBackupPayload('manual', config.restorePassword);

      currentTask.phase = '上传中';
      currentTask.progress = 50;
      const installId = getOrCreateInstallId();
      const objectKey = buildObjectKey(config.prefix, installId);
      await uploadBackup(config, objectKey, payload.buffer, {
        appVersion: payload.manifest.appVersion,
        schemaVersion: payload.manifest.schemaVersion,
        backupType: payload.manifest.backupType,
        createdAt: payload.manifest.createdAt,
      });

      currentTask.progress = 80;
      currentTask.phase = '清理过期备份';
      // 保留策略：删除超出 retentionCount 的旧备份
      const objects = await listBackupObjects(config, config.prefix || '');
      const installPrefix = config.prefix ? `${config.prefix.replace(/^\/+|\/+$/g, '')}/${installId}/` : `${installId}/`;
      const ownBackups = objects.filter((o) => o.key.startsWith(installPrefix));
      const retention = config.retentionCount ?? 30;
      if (ownBackups.length > retention) {
        const toDelete = ownBackups
          .slice(0, ownBackups.length - retention)
          .map((o) => o.key);
        await deleteOldBackups(config, toDelete);
      }

      currentTask.progress = 100;
      currentTask.phase = '完成';
      setSetting('last_backup_time', payload.manifest.createdAt);
      setSetting('last_backup_size', String(payload.buffer.length));
      clearDirty();
      setSetting('last_backup_error', '');

      return { taskId, objectKey, size: payload.buffer.length, createdAt: payload.manifest.createdAt };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSetting('last_backup_error', msg);
      currentTask = null;
      throw err;
    } finally {
      setTimeout(() => { currentTask = null; }, 5000);
    }
  });

  // 列出备份
  registerHandler(IPC_CHANNELS.backup.list, null, async () => {
    const config = loadCosConfig();
    if (!config) return { rows: [], total: 0 };
    const objects = await listBackupObjects(config, config.prefix || '');
    const installId = getOrCreateInstallId();
    const installPrefix = config.prefix ? `${config.prefix.replace(/^\/+|\/+$/g, '')}/${installId}/` : `${installId}/`;
    const ownBackups = objects.filter((o) => o.key.startsWith(installPrefix));

    const rows: BackupHistoryItem[] = ownBackups.map((o) => {
      // 从对象键解析时间
      const match = o.key.match(/invoice-backup-(\d{8})-(\d{6})Z\.cdbak$/);
      let backupTime = o.lastModified?.toISOString() || '';
      if (match) {
        const dateStr = match[1];
        const timeStr = match[2];
        backupTime = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}Z`;
      }
      return {
        objectKey: o.key,
        backupTime,
        size: o.size,
        appVersion: 'unknown',
        schemaVersion: 'unknown',
        backupType: 'manual',
        checksumStatus: 'verified',
      };
    });

    rows.sort((a, b) => b.backupTime.localeCompare(a.backupTime));
    return { rows, total: rows.length };
  });

  // 恢复
  registerHandler(IPC_CHANNELS.backup.restore, restoreRequestSchema, async (input) => {
    const config = loadCosConfig();
    if (!config) throw new Error('未配置腾讯云 COS 连接');

    const taskId = `restore-${Date.now()}`;
    currentTask = { taskId, type: 'restore', phase: '下载备份', progress: 0, processedBytes: 0 };

    try {
      currentTask.phase = '下载备份文件';
      const backupBuffer = await downloadBackupObject(config, input.objectKey);

      currentTask.phase = '解密和校验';
      currentTask.progress = 30;
      const { manifest, dbBuffer } = decryptBackup(backupBuffer, input.restorePassword);

      currentTask.phase = '替换数据库';
      currentTask.progress = 70;
      restoreDatabase(dbBuffer);

      currentTask.phase = '重新初始化';
      currentTask.progress = 90;
      closeDatabase();
      initDatabase();

      currentTask.phase = '完成';
      currentTask.progress = 100;

      return { taskId, restored: true, manifest };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.error('[backup] 恢复失败:', msg);
      currentTask = null;
      throw new Error(`恢复失败: ${msg}`);
    } finally {
      setTimeout(() => { currentTask = null; }, 5000);
    }
  });

  // 获取任务状态
  registerHandler(IPC_CHANNELS.backup.getTaskStatus, null, () => {
    return currentTask || null;
  });
}
