<template>
  <div class="app-sidebar-footer">
    <ElTooltip
      v-if="appStore.sidebarCollapsed"
      content="设置"
      placement="right"
    >
      <div class="settings-item-collapsed" @click="appStore.toggleSettingsDrawer(true)">
        <ElIcon><Setting /></ElIcon>
      </div>
    </ElTooltip>
    <div
      v-else
      class="settings-item"
      @click="appStore.toggleSettingsDrawer(true)"
    >
      <ElIcon><Setting /></ElIcon>
      <span>设置</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../stores/app';

const appStore = useAppStore();
</script>

<style scoped>
.settings-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 48px;
  color: var(--text-regular);
  cursor: pointer;
  transition: color 0.2s;
}

.settings-item:hover {
  color: var(--el-color-primary);
}

.settings-item-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  color: var(--text-regular);
  cursor: pointer;
}

.settings-item-collapsed:hover {
  color: var(--el-color-primary);
}
</style>
