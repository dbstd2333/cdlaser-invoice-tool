<template>
  <ElDialog
    v-model="dialogVisible"
    title="恢复备份"
    width="520px"
    :close-on-click-modal="false"
  >
    <ElAlert type="error" :closable="false" show-icon class="warning-alert">
      <template #title>高风险操作</template>
      恢复会替换当前所有数据，且不可撤销。
    </ElAlert>
    <div v-if="backupItem" class="backup-info">
      <p><strong>备份时间：</strong>{{ formatTime(backupItem.backupTime) }}</p>
      <p><strong>应用版本：</strong>{{ backupItem.appVersion }}</p>
      <p><strong>文件大小：</strong>{{ (backupItem.size / 1024).toFixed(1) }} KB</p>
    </div>
    <ElForm>
      <ElFormItem label="恢复密码" required>
        <ElInput v-model="restorePassword" type="password" show-password placeholder="请输入恢复密码" />
      </ElFormItem>
    </ElForm>
    <ElCheckbox v-model="confirmed">我确认了解恢复将替换当前数据</ElCheckbox>
    <template #footer>
      <ElButton @click="dialogVisible = false">取消</ElButton>
      <ElButton type="danger" :loading="restoring" :disabled="!confirmed || !restorePassword" @click="handleRestore">
        确认恢复
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from '../../api';
import type { BackupHistoryItem } from '@shared/contracts/preview-types';

const props = defineProps<{
  visible: boolean;
  backupItem: BackupHistoryItem | null;
}>();

const emit = defineEmits<{
  'update:visible': [val: boolean];
  success: [];
}>();

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

const restorePassword = ref('');
const confirmed = ref(false);
const restoring = ref(false);

watch(dialogVisible, (val) => {
  if (val) {
    restorePassword.value = '';
    confirmed.value = false;
  }
});

async function handleRestore(): Promise<void> {
  if (!props.backupItem) return;
  try {
    await ElMessageBox.confirm('再次确认：恢复将替换当前所有数据，应用将自动重启。', '最终确认', {
      type: 'warning',
      confirmButtonText: '确认恢复',
      cancelButtonText: '取消',
    });
    restoring.value = true;
    await api.backup.restore(props.backupItem.objectKey, restorePassword.value);
    emit('success');
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(`恢复失败: ${(err as Error).message}`);
    }
  } finally {
    restoring.value = false;
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}
</script>

<style scoped>
.warning-alert {
  margin-bottom: 16px;
}

.backup-info {
  margin-bottom: 16px;
  padding: 12px;
  background: var(--app-bg);
  border-radius: 4px;
}

.backup-info p {
  margin: 4px 0;
}
</style>
