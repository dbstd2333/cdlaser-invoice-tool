<template>
  <ElDialog
    v-model="dialogVisible"
    title="月初总部进项导入"
    width="90vw"
    top="5vh"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <div class="import-content">
      <div v-if="step === 'select'" class="step-content">
        <ElAlert type="info" :closable="false" show-icon>
          请下载系统模板，填写总部进项明细后上传。系统会计算文件哈希和标准化内容哈希，重复导入将被阻止。
        </ElAlert>
        <div class="file-actions">
          <ElButton :loading="downloading" @click="handleDownloadTemplate">下载模板</ElButton>
          <ElButton type="primary" :loading="selecting" @click="handleSelectFile">选择文件</ElButton>
        </div>
      </div>

      <div v-else-if="step === 'preview'" class="step-content">
        <div class="preview-summary">
          <ElTag type="success">有效行 {{ validLineCount }}</ElTag>
          <ElTag v-if="preview && preview.newProductCount > 0" type="warning">新商品 {{ preview.newProductCount }} 个</ElTag>
          <ElTag v-if="preview && preview.ignoredRows.length > 0" type="info">忽略费用行 {{ preview.ignoredRows.length }} 行</ElTag>
          <ElTag v-if="preview && preview.hasErrors" type="danger">错误 {{ preview.errors.length }} 条</ElTag>
        </div>
        <ElAlert v-if="preview?.hasErrors" type="error" :closable="false" show-icon>
          存在错误，整批无法导入。请修正后重新选择文件。
        </ElAlert>

        <ElTabs v-model="activeTab">
          <ElTabPane label="有效明细" name="lines">
            <ElTable :data="preview?.lines || []" border stripe size="small" max-height="350">
              <ElTableColumn prop="sourceRow" label="行号" width="70" />
              <ElTableColumn prop="invoiceNo" label="发票号" width="130" />
              <ElTableColumn prop="sellerName" label="销售方" min-width="150" show-overflow-tooltip />
              <ElTableColumn prop="name" label="品名" min-width="130" />
              <ElTableColumn prop="model" label="型号" width="100" />
              <ElTableColumn prop="unit" label="单位" width="70" />
              <ElTableColumn prop="unitPriceDecimal" label="单价" width="110" />
              <ElTableColumn prop="quantity" label="数量" width="80" />
              <ElTableColumn label="金额" width="100">
                <template #default="{ row }">{{ centToDisplay(row.amountCent) }}</template>
              </ElTableColumn>
              <ElTableColumn label="匹配" width="100">
                <template #default="{ row }">
                  <ElTag v-if="row.isNewProduct" type="warning" size="small">新商品</ElTag>
                  <ElTag v-else-if="row.matched" type="success" size="small">已匹配</ElTag>
                  <ElTag v-else type="danger" size="small">错误</ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn label="错误信息" min-width="200">
                <template #default="{ row }">
                  <span class="error-text">{{ row.errors.join('; ') }}</span>
                </template>
              </ElTableColumn>
            </ElTable>
          </ElTabPane>
          <ElTabPane v-if="preview && preview.ignoredRows.length > 0" :label="`忽略行 (${preview.ignoredRows.length})`" name="ignored">
            <ElTable :data="preview.ignoredRows" border size="small" max-height="350">
              <ElTableColumn prop="sourceRow" label="行号" width="70" />
              <ElTableColumn prop="sourceSheet" label="工作表" width="120" />
              <ElTableColumn prop="reason" label="原因" width="120" />
              <ElTableColumn prop="description" label="描述" min-width="200" />
            </ElTable>
          </ElTabPane>
        </ElTabs>
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
import { centToDisplay } from '@shared/money';
import type { InboundPreviewResult } from '@shared/contracts/preview-types';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ 'update:visible': [val: boolean]; success: [] }>();

const dialogVisible = computed({ get: () => props.visible, set: (val) => emit('update:visible', val) });
const step = ref<'select' | 'preview'>('select');
const preview = ref<InboundPreviewResult | null>(null);
const previewToken = ref('');
const importing = ref(false);
const selecting = ref(false);
const downloading = ref(false);
const activeTab = ref('lines');

const validLineCount = computed(() => preview.value?.lines.filter((l) => l.errors.length === 0).length || 0);

/** 下载月初总部进项导入模板。 */
async function handleDownloadTemplate(): Promise<void> {
  downloading.value = true;
  try {
    const result = await api.inbound.downloadTemplate();
    if (result.saved) ElMessage.success('模板已保存');
  } catch (err) {
    ElMessage.error(`下载失败: ${(err as Error).message}`);
  } finally {
    downloading.value = false;
  }
}

/** 选择并解析进项导入文件。 */
async function handleSelectFile(): Promise<void> {
  selecting.value = true;
  try {
    const result = await api.system.selectFile({ extensions: ['xlsx'], title: '选择进项 Excel 文件' });
    if (result.canceled || !result.filePath) return;
    const previewResult = await api.inbound.preview(result.filePath);
    preview.value = previewResult.preview;
    previewToken.value = previewResult.token;
    step.value = 'preview';
  } catch (err) {
    ElMessage.error(`解析失败: ${(err as Error).message}`);
  } finally {
    selecting.value = false;
  }
}

/** 确认写入当前进项导入批次。 */
async function handleConfirm(): Promise<void> {
  importing.value = true;
  try {
    const result = await api.inbound.confirm(previewToken.value);
    ElMessage.success(`导入成功，批次号: ${result.batchNo}，共 ${result.lineCount} 行`);
    emit('success');
  } catch (err) {
    ElMessage.error(`导入失败: ${(err as Error).message}`);
  } finally {
    importing.value = false;
  }
}

/** 关闭弹窗并重置导入状态。 */
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
