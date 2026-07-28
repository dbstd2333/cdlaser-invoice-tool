<template>
  <ElDialog
    v-model="dialogVisible"
    title="商品日常导入"
    width="90vw"
    top="5vh"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <div class="import-content">
      <div v-if="step === 'select'" class="step-content">
        <ElAlert type="info" :closable="false" show-icon>
          日常导入只新增商品或价格版本，不修改库存。已有商品的单位或税收分类编码不一致时整批失败。
        </ElAlert>
        <div class="file-actions">
          <ElButton @click="handleDownloadTemplate">下载模板</ElButton>
          <ElButton type="primary" :loading="selecting" @click="handleSelectFile">选择文件</ElButton>
        </div>
      </div>

      <div v-else-if="step === 'preview'" class="step-content">
        <div class="preview-summary">
          <ElTag type="success">新增商品 {{ preview?.newProductCount }} 个</ElTag>
          <ElTag type="success">新增价格版本 {{ preview?.newPriceVersionCount }} 个</ElTag>
          <ElTag v-if="preview && preview.errorCount > 0" type="danger">错误 {{ preview.errorCount }} 条</ElTag>
        </div>
        <ElAlert v-if="preview?.hasErrors" type="error" :closable="false" show-icon>
          存在错误行，整批无法导入。请修正后重新选择文件。
        </ElAlert>
        <ElTable :data="preview?.rows || []" border stripe size="small" max-height="400">
          <ElTableColumn prop="rowIndex" label="行号" width="70" />
          <ElTableColumn prop="name" label="项目名称" min-width="150" />
          <ElTableColumn prop="model" label="型号" width="100" />
          <ElTableColumn prop="unit" label="单位" width="70" />
          <ElTableColumn prop="taxClassificationCode" label="税收编码" min-width="130" />
          <ElTableColumn prop="unitPriceDecimal" label="单价" width="110" />
          <ElTableColumn label="状态" width="80">
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
    </div>
    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton v-if="step === 'preview'" @click="step = 'select'">重新选择</ElButton>
      <ElButton v-if="step === 'preview'" type="primary" :disabled="preview?.hasErrors" :loading="importing" @click="handleConfirm">
        确认导入
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../../api';
import type { CatalogImportPreviewResult } from '@shared/contracts/preview-types';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ 'update:visible': [val: boolean]; success: [] }>();

const dialogVisible = computed({ get: () => props.visible, set: (val) => emit('update:visible', val) });
const step = ref<'select' | 'preview'>('select');
const preview = ref<CatalogImportPreviewResult | null>(null);
const previewToken = ref('');
const importing = ref(false);
const selecting = ref(false);

async function handleDownloadTemplate(): Promise<void> {
  try {
    const result = await api.catalog.downloadTemplate(false);
    if (result.saved) ElMessage.success('模板已保存');
  } catch (err) {
    ElMessage.error(`下载失败: ${(err as Error).message}`);
  }
}

async function handleSelectFile(): Promise<void> {
  selecting.value = true;
  try {
    const result = await api.system.selectFile({ extensions: ['xlsx'], title: '选择商品导入文件' });
    if (result.canceled || !result.filePath) return;
    const previewResult = await api.catalog.dailyImportPreview(result.filePath);
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
  try {
    const result = await api.catalog.dailyImportConfirm(previewToken.value);
    ElMessage.success(`成功导入 ${result.products} 个商品，${result.priceVersions} 个价格版本`);
    emit('success');
  } catch (err) {
    ElMessage.error(`导入失败: ${(err as Error).message}`);
  } finally {
    importing.value = false;
  }
}

function handleClose(): void {
  dialogVisible.value = false;
  setTimeout(() => { step.value = 'select'; preview.value = null; previewToken.value = ''; }, 300);
}
</script>

<style scoped>
.step-content { display: flex; flex-direction: column; gap: 16px; }
.file-actions { display: flex; gap: 12px; justify-content: center; padding: 40px 0; }
.preview-summary { display: flex; gap: 8px; }
.error-text { color: var(--color-negative); font-size: 12px; }
</style>
