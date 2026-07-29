import { safeStorage, app } from 'electron';
import { resolve } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import log from 'electron-log/main';
import type { CosConfig } from './backup-types';

/**
 * 腾讯云 COS 配置管理。
 * 敏感字段使用 Electron safeStorage 加密存储。
 */

const CONFIG_FILE = 'cos-config.enc';

/** 获取配置文件路径 */
function getConfigPath(): string {
  const dataDir = resolve(app.getPath('userData'), 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  return resolve(dataDir, CONFIG_FILE);
}

/** 加密保存 COS 配置（敏感字段用 safeStorage 加密） */
export function saveCosConfig(config: CosConfig): void {
  const nonSensitive = {
    region: config.region, bucket: config.bucket, prefix: config.prefix,
    autoBackup: config.autoBackup, retentionCount: config.retentionCount,
  };
  const sensitive = {
    secretId: config.secretId || '', secretKey: config.secretKey || '',
    securityToken: config.securityToken || '', restorePassword: config.restorePassword || '',
  };

  const encryptedSensitive = safeStorage.encryptString(JSON.stringify(sensitive));
  writeFileSync(getConfigPath(), JSON.stringify({ nonSensitive, sensitive: encryptedSensitive.toString('base64') }), 'utf-8');
}

/** 读取 COS 配置（敏感字段在主进程内解密） */
export function loadCosConfig(): CosConfig | null {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) return null;

  try {
    const payload = JSON.parse(readFileSync(configPath, 'utf-8'));
    const sensitiveBuf = Buffer.from(payload.sensitive, 'base64');
    let sensitive = { secretId: '', secretKey: '', securityToken: '', restorePassword: '' };
    if (safeStorage.isEncryptionAvailable() && sensitiveBuf.length > 0) {
      try {
        sensitive = JSON.parse(safeStorage.decryptString(sensitiveBuf));
      } catch {
        log.warn('[backup] 解密敏感配置失败');
      }
    }
    return {
      ...payload.nonSensitive,
      secretId: sensitive.secretId || undefined,
      secretKey: sensitive.secretKey || undefined,
      securityToken: sensitive.securityToken || undefined,
      restorePassword: sensitive.restorePassword || undefined,
    };
  } catch (err) {
    log.error('[backup] 读取配置失败:', err);
    return null;
  }
}

/** 获取配置摘要（不含密钥，用于渲染进程展示） */
export function getConfigSummary(): { configured: boolean; config: Partial<CosConfig>; credentialConfigured: boolean } {
  const config = loadCosConfig();
  if (!config) return { configured: false, config: {}, credentialConfigured: false };
  return {
    configured: true,
    config: {
      region: config.region, bucket: config.bucket, prefix: config.prefix,
      autoBackup: config.autoBackup, retentionCount: config.retentionCount,
    },
    credentialConfigured: !!(config.secretId && config.secretKey),
  };
}
