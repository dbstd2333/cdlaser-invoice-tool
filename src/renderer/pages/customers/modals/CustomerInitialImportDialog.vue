<template>
  <ElDialog
    v-model="dialogVisible"
    title="客户首次批量导入"
    width="90vw"
    top="5vh"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <div class="import-content">
      <!-- 步骤 1: 选择文件 -->
      <div v-if="step === 'select'" class="step-content">
        <ElAlert type="info" :closable="false" show-icon>
          请下载系统模板，填写客户信息后上传。税号、电话和银行账号按文本格式填写。
        </ElAlert>
        <div class="file-actions">
          <ElButton @click="handleDownloadTemplate">下载模板</ElButton>
          <ElButton type="primary" :loading="selecting" @click="handleSelectFile">选择文件</ElButton>
        </div>
      </div>

      <!-- 步骤 2: 预览 -->
      <div v-else-if="step === 'preview'" class="step-content">
        <div class="preview-summary">
          <ElTag type="success">新增 {{ preview?.newCount }} 条</ElTag>
          <ElTag v-if="preview && preview.duplicateTaxIdCount > 0" type="danger">重复税号 {{ preview.duplicateTaxIdCount }} 条</ElTag>
          <ElTag v-if="preview && preview.errorCount > 0" type="danger">错误 {{ preview.errorCount }} 条</ElTag>
        </div>
        <ElAlert v-if="preview?.hasErrors" type="error" :closable="false" show-icon class="error-alert">
          存在错误行，整批无法导入。请修正后重新选择文件。
        </ElAlert>
        <ElTable :data="preview?.rows || []" border stripe size="small" max-height="400">
          <ElTableColumn prop="rowIndex" label="行号" width="70" />
          <ElTableColumn prop="name" label="客户名称" min-width="150" />
          <ElTableColumn prop="taxId" label="纳税人识别号" min-width="180" />
          <ElTableColumn prop="phone" label="电话" width="130" />
          <ElTableColumn prop="bankAccount" label="银行账号" min-width="160" />
          <ElTableColumn label="状态" width="100">
            <template #default="{ row }">
              <ElTag :type="row.errors.length > 0 ? 'danger' : 'success'" size="small">
                {{ row.errors.length > 0 ? '错误' : '正常' }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="错误信息" min-width="200">
            <template #default="{ row }">
              <span class="error-text">{{ row.errors.join('; ') }}</span>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>

      <!-- 步骤 3: 导入中 -->
      <div v-else-if="step === 'importing'" class="step-content">
        <ElAlert type="info" :closable="false" show-icon>正在导入，请稍候...</ElAlert>
      </div>
    </div>
    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton v-if="step === 'preview'" @click="step = 'select'">重新选择</ElButton>
      <ElButton
        v-if="step === 'preview'"
        type="primary"
        :disabled="preview?.hasErrors"
        :loading="importing"
        @click="handleConfirm"
      >
        确认导入
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../../api';
import type { CustomerImportPreviewResult } from '@shared/contracts/preview-types';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{
  'update:visible': [val: boolean];
  success: [];
}>();

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

const step = ref<'select' | 'preview' | 'importing'>('select');
const preview = ref<CustomerImportPreviewResult | null>(null);
const previewToken = ref('');
const importing = ref(false);
const selecting = ref(false);

async function handleDownloadTemplate(): Promise<void> {
  try {
    const result = await api.customers.downloadTemplate();
    if (result.saved) {
      ElMessage.success('模板已保存');
    }
  } catch (err) {
    ElMessage.error(`下载失败: ${(err as Error).message}`);
  }
}

async function handleSelectFile(): Promise<void> {
  selecting.value = true;
  try {
    const result = await api.system.selectFile({ extensions: ['xlsx'], title: '选择客户导入文件' });
    if (result.canceled || !result.filePath) return;

    const previewResult = await api.customers.initialImportPreview(result.filePath);
    preview.value = previewResult.preview;
    previewToken.value = previewResult.token;
    step.value = 'preview';
  } catch (err) {
    ElMessage.error(`解析失败: ${(err as Error).message}`);
  } finally {
    selecting.value = false;
  }
}

async function handleConfirm(): Promise<void> {
  importing.value = true;
  step.value = 'importing';
  try {
    const result = await api.customers.initialImportConfirm(previewToken.value);
    ElMessage.success(`成功导入 ${result.imported} 条客户`);
    emit('success');
  } catch (err) {
    ElMessage.error(`导入失败: ${(err as Error).message}`);
    step.value = 'preview';
  } finally {
    importing.value = false;
  }
}

function handleClose(): void {
  dialogVisible.value = false;
  setTimeout(() => {
    step.value = 'select';
    preview.value = null;
    previewToken.value = '';
  }, 300);
}
</script>

<style scoped>
.import-content {
  min-height: 400px;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 40px 0;
}

.preview-summary {
  display: flex;
  gap: 8px;
}

.error-alert {
  margin-bottom: 12px;
}

.error-text {
  color: var(--color-negative);
  font-size: 12px;
}
</style>
