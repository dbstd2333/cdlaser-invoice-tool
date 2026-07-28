import { safeStorage, app } from 'electron';
import { resolve } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import log from 'electron-log/main';
import type { S3Config } from './backup-types';

/**
 * S3 配置管理。
 * 敏感字段使用 Electron safeStorage (DPAPI) 加密存储。
 */

const CONFIG_FILE = 's3-config.enc';

/** 获取配置文件路径 */
function getConfigPath(): string {
  const dataDir = resolve(app.getPath('userData'), 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  return resolve(dataDir, CONFIG_FILE);
}

/** 加密保存 S3 配置（敏感字段用 safeStorage 加密） */
export function saveS3Config(config: S3Config): void {
  const nonSensitive = {
    serviceType: config.serviceType, endpoint: config.endpoint, region: config.region,
    bucket: config.bucket, prefix: config.prefix, pathStyle: config.pathStyle,
    autoBackup: config.autoBackup, retentionCount: config.retentionCount,
  };
  const sensitive = {
    accessKeyId: config.accessKeyId || '', secretAccessKey: config.secretAccessKey || '',
    sessionToken: config.sessionToken || '', restorePassword: config.restorePassword || '',
  };

  const encryptedSensitive = safeStorage.encryptString(JSON.stringify(sensitive));
  writeFileSync(getConfigPath(), JSON.stringify({ nonSensitive, sensitive: encryptedSensitive.toString('base64') }), 'utf-8');
}

/** 读取 S3 配置（敏感字段在主进程内解密） */
export function loadS3Config(): S3Config | null {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) return null;

  try {
    const payload = JSON.parse(readFileSync(configPath, 'utf-8'));
    const sensitiveBuf = Buffer.from(payload.sensitive, 'base64');
    let sensitive = { accessKeyId: '', secretAccessKey: '', sessionToken: '', restorePassword: '' };
    if (safeStorage.isEncryptionAvailable() && sensitiveBuf.length > 0) {
      try {
        sensitive = JSON.parse(safeStorage.decryptString(sensitiveBuf));
      } catch {
        log.warn('[backup] 解密敏感配置失败');
      }
    }
    return {
      ...payload.nonSensitive,
      accessKeyId: sensitive.accessKeyId || undefined,
      secretAccessKey: sensitive.secretAccessKey || undefined,
      sessionToken: sensitive.sessionToken || undefined,
      restorePassword: sensitive.restorePassword || undefined,
    };
  } catch (err) {
    log.error('[backup] 读取配置失败:', err);
    return null;
  }
}

/** 获取配置摘要（不含密钥，用于渲染进程展示） */
export function getConfigSummary(): { configured: boolean; config: Partial<S3Config>; credentialConfigured: boolean } {
  const config = loadS3Config();
  if (!config) return { configured: false, config: {}, credentialConfigured: false };
  return {
    configured: true,
    config: {
      serviceType: config.serviceType, endpoint: config.endpoint, region: config.region,
      bucket: config.bucket, prefix: config.prefix, pathStyle: config.pathStyle,
      autoBackup: config.autoBackup, retentionCount: config.retentionCount,
    },
    credentialConfigured: !!(config.accessKeyId && config.secretAccessKey),
  };
}
