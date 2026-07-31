import { create } from 'zustand';
import { api } from '@renderer/api';
import type { BackupStatus, BackupHistoryItem, CosConfig } from '@shared/contracts/preview-types';

export interface CosConfigInput {
  region: string;
  bucket: string;
  prefix: string;
  secretId: string;
  secretKey: string;
  autoBackup: boolean;
  retentionCount: number;
  restorePassword: string;
}

export const DEFAULT_CONFIG: CosConfigInput = {
  region: '',
  bucket: '',
  prefix: '',
  secretId: '',
  secretKey: '',
  autoBackup: false,
  retentionCount: 10,
  restorePassword: '',
};

interface BackupStore {
  status: BackupStatus | null;
  config: CosConfigInput | null;
  history: BackupHistoryItem[];
  loading: boolean;
  testing: boolean;
  backingUp: boolean;
  restoring: boolean;
  setStatus: (status: BackupStatus | null) => void;
  setConfig: (config: CosConfigInput | null) => void;
  setHistory: (history: BackupHistoryItem[]) => void;
  setLoading: (v: boolean) => void;
  setTesting: (v: boolean) => void;
  setBackingUp: (v: boolean) => void;
  setRestoring: (v: boolean) => void;
  loadAll: () => Promise<void>;
  testConnection: (config: CosConfigInput) => Promise<boolean>;
  saveConfig: (config: CosConfigInput) => Promise<void>;
  triggerBackup: () => Promise<void>;
  loadHistory: () => Promise<void>;
  restore: (objectKey: string, password: string) => Promise<void>;
}

export const useBackupStore = create<BackupStore>((set, get) => ({
  status: null,
  config: null,
  history: [],
  loading: false,
  testing: false,
  backingUp: false,
  restoring: false,

  setStatus: (status) => set({ status }),
  setConfig: (config) => set({ config }),
  setHistory: (history) => set({ history }),
  setLoading: (v) => set({ loading: v }),
  setTesting: (v) => set({ testing: v }),
  setBackingUp: (v) => set({ backingUp: v }),
  setRestoring: (v) => set({ restoring: v }),

  async loadAll() {
    set({ loading: true });
    try {
      const [status, configRes] = await Promise.all([
        api.backup.getStatus(),
        api.backup.getConfig(),
      ]);
      const cfg = configRes as { configured: boolean; config: Partial<CosConfig>; credentialConfigured: boolean };
      set({
        status: status as BackupStatus,
        config: {
          ...DEFAULT_CONFIG,
          ...cfg.config,
        } as CosConfigInput,
      });
    } finally {
      set({ loading: false });
    }
  },

  async testConnection(config) {
    set({ testing: true });
    try {
      const res = (await api.backup.testConnection(config)) as { success: boolean; message?: string };
      return res.success;
    } finally {
      set({ testing: false });
    }
  },

  async saveConfig(config) {
    await api.backup.saveConfig(config);
    set({ config });
  },

  async triggerBackup() {
    set({ backingUp: true });
    try {
      await api.backup.create();
    } finally {
      set({ backingUp: false });
    }
    await get().loadAll();
  },

  async loadHistory() {
    const res = (await api.backup.list()) as { rows: BackupHistoryItem[] };
    set({ history: res.rows });
  },

  async restore(objectKey, password) {
    set({ restoring: true });
    try {
      await api.backup.restore(objectKey, password);
    } finally {
      set({ restoring: false });
    }
    await get().loadAll();
  },
}));
