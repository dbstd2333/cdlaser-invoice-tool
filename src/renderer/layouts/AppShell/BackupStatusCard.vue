<template>
  <ElCard shadow="never">
    <template #header>备份状态</template>
    <div class="status-grid">
      <div class="status-item">
        <span class="label">当前状态：</span>
        <ElTag :type="statusType">{{ statusText }}</ElTag>
      </div>
      <div class="status-item">
        <span class="label">最近备份时间：</span>
        <span>{{ backupStore.status.lastBackupTime || '—' }}</span>
      </div>
      <div class="status-item">
        <span class="label">最近备份大小：</span>
        <span>{{ backupStore.status.lastBackupSize ? `${(backupStore.status.lastBackupSize / 1024).toFixed(1)} KB` : '—' }}</span>
      </div>
      <div class="status-item">
        <span class="label">待备份变更：</span>
        <ElTag :type="backupStore.status.dirty ? 'warning' : 'info'">
          {{ backupStore.status.dirty ? '有未备份变更' : '无' }}
        </ElTag>
      </div>
      <div v-if="backupStore.status.lastError" class="status-item error-item">
        <span class="label">最近失败原因：</span>
        <span class="error-text">{{ backupStore.status.lastError }}</span>
      </div>
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBackupStore } from '../../stores/backup';

const backupStore = useBackupStore();

const statusText = computed(() => {
  const map: Record<string, string> = {
    unconfigured: '未配置',
    idle: '连接正常',
    testing: '测试中',
    backing_up: '正在备份',
    restoring: '正在恢复',
    error: '连接异常',
  };
  return map[backupStore.status.status] || backupStore.status.status;
});

const statusType = computed(() => {
  const map: Record<string, string> = {
    unconfigured: 'info',
    idle: 'success',
    testing: 'warning',
    backing_up: 'warning',
    restoring: 'warning',
    error: 'danger',
  };
  return map[backupStore.status.status] || 'info';
});
</script>

<style scoped>
.status-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: var(--text-secondary);
  min-width: 120px;
}

.error-item {
  align-items: flex-start;
}

.error-text {
  color: var(--color-negative);
}
</style>
