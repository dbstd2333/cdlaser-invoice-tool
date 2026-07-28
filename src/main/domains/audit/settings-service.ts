import { getDb, getRawDb } from '../../db/connection';
import { appSettings } from '../../db/schema/index';
import type { InitStatus } from '@shared/contracts/types';

/**
 * 应用设置服务 - 管理 app_settings 表中的非密钥配置。
 * 客户首次导入、商品首次导入、模板版本、备份策略等。
 */

export const SETTING_KEYS = {
  customerInitialImportDone: 'customer_initial_import_done',
  productInitialImportDone: 'product_initial_import_done',
  templateVersion: 'template_version',
  templateSha256: 'template_sha256',
  backupAutoBackup: 'backup_auto_backup',
  backupRetention: 'backup_retention',
  backupDirty: 'backup_dirty',
  installId: 'install_id',
} as const;

/** 读取设置值 */
export function getSetting(key: string): string | null {
  const raw = getRawDb();
  const row = raw.prepare('SELECT value FROM app_settings WHERE key = ?').get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? null;
}

/** 写入设置值 */
export function setSetting(key: string, value: string): void {
  const db = getDb();
  db.insert(appSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: appSettings.key, set: { value } })
    .run();
}

/** 读取布尔型设置 */
export function getBoolSetting(key: string): boolean {
  return getSetting(key) === 'true';
}

/** 写入布尔型设置 */
export function setBoolSetting(key: string, value: boolean): void {
  setSetting(key, value ? 'true' : 'false');
}

/** 读取初始化状态 */
export function getInitStatus(): InitStatus {
  return {
    customerInitialImportDone: getBoolSetting(SETTING_KEYS.customerInitialImportDone),
    productInitialImportDone: getBoolSetting(SETTING_KEYS.productInitialImportDone),
    templateVersion: getSetting(SETTING_KEYS.templateVersion),
  };
}

/** 标记客户首次导入完成 */
export function markCustomerInitialImportDone(): void {
  setBoolSetting(SETTING_KEYS.customerInitialImportDone, true);
}

/** 标记商品首次导入完成 */
export function markProductInitialImportDone(): void {
  setBoolSetting(SETTING_KEYS.productInitialImportDone, true);
}

/** 获取或生成安装 ID */
export function getOrCreateInstallId(): string {
  let id = getSetting(SETTING_KEYS.installId);
  if (!id) {
    id = crypto.randomUUID();
    setSetting(SETTING_KEYS.installId, id);
  }
  return id;
}

/** 标记数据已变更（待备份） */
export function markDirty(): void {
  setBoolSetting(SETTING_KEYS.backupDirty, true);
}

/** 清除待备份标记 */
export function clearDirty(): void {
  setBoolSetting(SETTING_KEYS.backupDirty, false);
}

/** 读取待备份标记 */
export function isDirty(): boolean {
  return getBoolSetting(SETTING_KEYS.backupDirty);
}
