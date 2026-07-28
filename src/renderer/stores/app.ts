import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../api';
import type { InitStatus } from '@shared/contracts/types';

/**
 * 应用全局 Store - 管理初始化状态、侧栏折叠和设置抽屉。
 */

export const useAppStore = defineStore('app', () => {
  const initStatus = ref<InitStatus>({
    customerInitialImportDone: false,
    productInitialImportDone: false,
    templateVersion: null,
  });

  const sidebarCollapsed = ref(false);
  const settingsDrawerVisible = ref(false);
  const loading = ref(false);

  const customerImportDone = computed(() => initStatus.value.customerInitialImportDone);
  const productImportDone = computed(() => initStatus.value.productInitialImportDone);

  /** 加载初始化状态 */
  async function loadInitStatus(): Promise<void> {
    initStatus.value = await api.system.getInitStatus();
  }

  /** 切换侧栏折叠 */
  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  /** 打开/关闭设置抽屉 */
  function toggleSettingsDrawer(visible?: boolean): void {
    settingsDrawerVisible.value = visible ?? !settingsDrawerVisible.value;
  }

  return {
    initStatus,
    sidebarCollapsed,
    settingsDrawerVisible,
    loading,
    customerImportDone,
    productImportDone,
    loadInitStatus,
    toggleSidebar,
    toggleSettingsDrawer,
  };
});
