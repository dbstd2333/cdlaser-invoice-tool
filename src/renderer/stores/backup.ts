import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { api } from '../api';
import type { BackupStatus, BackupHistoryItem, S3Config } from '@shared/contracts/preview-types';

/**
 * 备份 Store - 管理 S3 配置、备份状态和备份历史。
 * Secret Access Key、Session Token 和恢复密码不写入持久化状态。
 */
export const useBackupStore = defineStore('backup', () => {
  const status = ref<BackupStatus>({
    status: 'unconfigured',
    lastBackupTime: null,
    lastBackupSize: null,
    dirty: false,
    lastError: null,
    credentialConfigured: false,
  });

  const config = reactive<S3Config>({
    serviceType: 'aws',
    endpoint: '',
    region: '',
    bucket: '',
    prefix: '',
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
    pathStyle: false,
    autoBackup: true,
    retentionCount: 30,
    restorePassword: '',
  });

  const history = ref<BackupHistoryItem[]>([]);
  const credentialConfigured = ref(false);

  async function loadStatus(): Promise<void> {
    status.value = await api.backup.getStatus();
  }

  async function loadConfig(): Promise<void> {
    const result = await api.backup.getConfig();
    credentialConfigured.value = result.credentialConfigured;
    if (result.config) {
      Object.assign(config, result.config);
    }
  }

  async function saveConfig(): Promise<void> {
    await api.backup.saveConfig(config);
    credentialConfigured.value = !!(config.accessKeyId && config.secretAccessKey);
  }

  async function testConnection(): Promise<{ success: boolean; message: string }> {
    return api.backup.testConnection(config);
  }

  async function loadHistory(): Promise<void> {
    const result = await api.backup.list();
    history.value = result.rows;
  }

  return {
    status,
    config,
    history,
    credentialConfigured,
    loadStatus,
    loadConfig,
    saveConfig,
    testConnection,
    loadHistory,
  };
});
