<template>
  <ElCard shadow="never">
    <template #header>备份策略</template>
    <ElForm :model="backupStore.config" label-width="140px" label-position="right">
      <ElFormItem label="自动备份">
        <ElSwitch v-model="backupStore.config.autoBackup" />
        <span class="hint">数据变化后每日自动备份一次</span>
      </ElFormItem>
      <ElFormItem label="保留版本数">
        <ElInputNumber v-model="backupStore.config.retentionCount" :min="1" :max="100" />
        <span class="hint">默认保留最近 30 个成功备份</span>
      </ElFormItem>
      <ElFormItem label="下次预计备份">
        <span class="hint">每日首次启动且存在未备份数据变更时自动执行</span>
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>

<script setup lang="ts">
import { useBackupStore } from '../../stores/backup';

const backupStore = useBackupStore();
</script>

<style scoped>
.hint {
  margin-left: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}
</style>
