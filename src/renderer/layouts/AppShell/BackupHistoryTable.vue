<template>
  <ElCard shadow="never">
    <template #header>云端备份历史</template>
    <ElTable :data="backupStore.history" border stripe size="small">
      <ElTableColumn prop="backupTime" label="备份时间" min-width="180">
        <template #default="{ row }">{{ formatTime(row.backupTime) }}</template>
      </ElTableColumn>
      <ElTableColumn prop="size" label="文件大小" width="120">
        <template #default="{ row }">{{ (row.size / 1024).toFixed(1) }} KB</template>
      </ElTableColumn>
      <ElTableColumn prop="appVersion" label="应用版本" width="100" />
      <ElTableColumn prop="backupType" label="备份类型" width="100">
        <template #default="{ row }">{{ row.backupType === 'auto' ? '自动' : '手动' }}</template>
      </ElTableColumn>
      <ElTableColumn prop="checksumStatus" label="校验状态" width="100">
        <template #default="{ row }">
          <ElTag :type="row.checksumStatus === 'verified' ? 'success' : 'info'" size="small">
            {{ row.checksumStatus === 'verified' ? '已校验' : '未知' }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <ElButton type="primary" link size="small" @click="$emit('restore', row)">恢复</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
  </ElCard>
</template>

<script setup lang="ts">
import { useBackupStore } from '../../stores/backup';
import type { BackupHistoryItem } from '@shared/contracts/preview-types';

defineEmits<{ restore: [item: BackupHistoryItem] }>();

const backupStore = useBackupStore();

function formatTime(iso: string): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}
</script>
