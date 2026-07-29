<template>
  <ElDrawer
    v-model="visible"
    title="设置"
    direction="rtl"
    size="720px"
    :before-close="handleClose"
  >
    <CosBackupPanel v-if="visible" />
    <ElCard shadow="never" class="diagnostics-card">
      <template #header>系统诊断</template>
      <ElButton :loading="exporting" @click="handleExportDiagnostics">导出诊断包</ElButton>
      <span class="hint">包含脱敏日志、版本和数据库健康结果</span>
    </ElCard>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useAppStore } from '../../stores/app';
import CosBackupPanel from './CosBackupPanel.vue';
import { api } from '../../api';

const appStore = useAppStore();
const visible = computed({
  get: () => appStore.settingsDrawerVisible,
  set: (val) => appStore.toggleSettingsDrawer(val),
});
const exporting = ref(false);

function handleClose(done: () => void): void {
  appStore.toggleSettingsDrawer(false);
  done();
}

async function handleExportDiagnostics(): Promise<void> {
  exporting.value = true;
  try {
    const result = await api.system.exportDiagnostics();
    if (result.saved) {
      ElMessage.success('诊断包已导出');
    }
  } catch (err) {
    ElMessage.error(`导出失败: ${(err as Error).message}`);
  } finally {
    exporting.value = false;
  }
}
</script>

<style scoped>
.diagnostics-card {
  margin-top: 20px;
}

.hint {
  margin-left: 12px;
  color: var(--text-secondary);
  font-size: 12px;
}
</style>
