import { create } from 'zustand';
import { api } from '@renderer/api';

export const THEME_KEY = 'cdlaser-theme-mode';

export type ThemeMode = 'light' | 'dark';

export interface AppState {
  themeMode: ThemeMode;
  appVersion: string;
  schemaVersion: number;
  productImportDone: boolean;
  isCssReady: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
  loadSystemInfo: () => Promise<void>;
  setCssReady: (ready: boolean) => void;
}

function readInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return 'light';
}

function applyThemeClass(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export const useAppStore = create<AppState>((set, get) => ({
  themeMode: readInitialTheme(),
  appVersion: '1.0.0',
  schemaVersion: 1,
  productImportDone: false,
  isCssReady: false,

  async toggleTheme() {
    const next: ThemeMode = get().themeMode === 'light' ? 'dark' : 'light';
    await get().setTheme(next);
  },

  async setTheme(mode) {
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch {
      /* ignore */
    }
    applyThemeClass(mode);
    set({ themeMode: mode });
  },

  async loadSystemInfo() {
    try {
      const info = await api.system.getVersion();
      set({ appVersion: info.version });
    } catch {
      /* ignore */
    }
  },

  setCssReady(ready) {
    set({ isCssReady: ready });
  },
}));
