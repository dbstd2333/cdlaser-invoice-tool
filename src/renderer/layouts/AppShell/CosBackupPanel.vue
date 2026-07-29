<template>
  <div class="cos-panel">
    <BackupStatusCard />
    <CosConnectionForm />
    <BackupPolicyForm />
    <div class="action-buttons">
      <ElButton @click="handleSaveConfig">保存配置</ElButton>
      <ElButton type="primary" :loading="backupLoading" @click="handleBackup">立即备份</ElButton>
      <ElButton @click="handleRefreshList">刷新列表</ElButton>
    </div>
    <BackupHistoryTable @restore="handleRestore" />
    <RestoreBackupDialog
      v-model:visible="restoreVisible"
      :backup-item="restoreTarget"
      @success="handleRestoreSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import BackupStatusCard from './BackupStatusCard.vue';
import CosConnectionForm from './CosConnectionForm.vue';
import BackupPolicyForm from './BackupPolicyForm.vue';
import BackupHistoryTable from './BackupHistoryTable.vue';
import RestoreBackupDialog from './RestoreBackupDialog.vue';
import { api } from '../../api';
import { useBackupStore } from '../../stores/backup';
import type { BackupHistoryItem } from '@shared/contracts/preview-types';

const backupStore = useBackupStore();
const backupLoading = ref(false);
const restoreVisible = ref(false);
const restoreTarget = ref<BackupHistoryItem | null>(null);

onMounted(async () => {
  await backupStore.loadStatus();
  await backupStore.loadConfig();
  await backupStore.loadHistory();
});

async function handleSaveConfig(): Promise<void> {
  try {
    await backupStore.saveConfig();
    ElMessage.success('配置已保存');
  } catch (err) {
    ElMessage.error(`保存失败: ${(err as Error).message}`);
  }
}

async function handleBackup(): Promise<void> {
  try {
    await ElMessageBox.confirm('确认立即创建备份并上传到云端？', '立即备份', { type: 'info' });
    backupLoading.value = true;
    const result = await api.backup.create();
    ElMessage.success(`备份成功，大小: ${(result.size / 1024).toFixed(1)} KB`);
    await backupStore.loadStatus();
    await backupStore.loadHistory();
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(`备份失败: ${(err as Error).message}`);
    }
  } finally {
    backupLoading.value = false;
  }
}

async function handleRefreshList(): Promise<void> {
  await backupStore.loadHistory();
  ElMessage.success('列表已刷新');
}

function handleRestore(item: BackupHistoryItem): void {
  restoreTarget.value = item;
  restoreVisible.value = true;
}

function handleRestoreSuccess(): void {
  restoreVisible.value = false;
  ElMessage.success('恢复完成，应用即将重启');
}
</script>

<style scoped>
.cos-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}
</style>
