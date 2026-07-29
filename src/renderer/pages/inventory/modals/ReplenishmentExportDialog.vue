<template>
  <ElDialog
    v-model="dialogVisible"
    title="月底负库存导出"
    width="90vw"
    top="5vh"
    destroy-on-close
    @close="handleClose"
  >
    <div class="export-content">
      <div class="toolbar">
        <ElButton type="primary" :loading="previewing" @click="loadPreview">刷新预览</ElButton>
        <ElAlert v-if="preview && preview.lines.length === 0" type="info" :closable="false" show-icon>
          当前无需向总部补票
        </ElAlert>
      </div>
      <ElTable :data="preview?.lines || []" border stripe size="small" max-height="450" v-loading="previewing">
        <ElTableColumn type="index" label="#" width="50" />
        <ElTableColumn prop="name" label="项目名称" min-width="150" />
        <ElTableColumn prop="model" label="型号" width="100" />
        <ElTableColumn prop="unit" label="单位" width="70" />
        <ElTableColumn prop="stockBalanceSnapshot" label="当前库存" width="100">
          <template #default="{ row }">
            <ElTag type="danger" size="small">{{ row.stockBalanceSnapshot }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="replenishmentQuantity" label="待补数量" width="100" />
        <ElTableColumn prop="unitPriceDecimal" label="含税单价" width="120" />
        <ElTableColumn label="不含税金额" width="120">
          <template #default="{ row }">{{ centToDisplay(row.amountCent) }}</template>
        </ElTableColumn>
        <ElTableColumn label="税额" width="110">
          <template #default="{ row }">{{ centToDisplay(row.taxCent) }}</template>
        </ElTableColumn>
        <ElTableColumn label="价税合计" width="120">
          <template #default="{ row }">{{ centToDisplay(row.totalCent) }}</template>
        </ElTableColumn>
      </ElTable>
      <div v-if="preview && preview.lines.length > 0" class="summary-bar">
        <span>待补行数：{{ preview.lines.length }}</span>
        <span>数量合计：{{ totalQuantity }}</span>
        <span>金额：{{ centToDisplay(totalAmountCent) }}</span>
        <span>税额：{{ centToDisplay(totalTaxCent) }}</span>
        <span class="total">价税合计：{{ centToDisplay(totalCent) }}</span>
      </div>
    </div>
    <template #footer>
      <ElButton @click="handleClose">关闭</ElButton>
      <ElButton type="primary" :disabled="!preview || preview.lines.length === 0" :loading="exporting" @click="handleExport">
        确认导出
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../../api';
import { centToDisplay } from '@shared/money';
import type { ReplenishmentPreviewLine } from '@shared/contracts/preview-types';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ 'update:visible': [val: boolean]; success: [] }>();

const dialogVisible = computed({ get: () => props.visible, set: (val) => emit('update:visible', val) });
const previewing = ref(false);
const exporting = ref(false);
const preview = ref<{ lines: ReplenishmentPreviewLine[]; snapshotAt: string } | null>(null);

const totalQuantity = computed(() => preview.value?.lines.reduce((s, l) => s + l.replenishmentQuantity, 0) || 0);
const totalAmountCent = computed(() => preview.value?.lines.reduce((s, l) => s + l.amountCent, 0) || 0);
const totalTaxCent = computed(() => preview.value?.lines.reduce((s, l) => s + l.taxCent, 0) || 0);
const totalCent = computed(() => totalAmountCent.value + totalTaxCent.value);

async function loadPreview(): Promise<void> {
  previewing.value = true;
  try {
    preview.value = await api.replenishment.preview();
  } catch (err) {
    ElMessage.error(`加载失败: ${(err as Error).message}`);
  } finally {
    previewing.value = false;
  }
}

async function handleExport(): Promise<void> {
  exporting.value = true;
  try {
    const result = await api.replenishment.export();
    if (!result.exported) {
      ElMessage.info(result.reason || '当前无需向总部补票');
    } else if (result.saved) {
      ElMessage.success(`导出成功，导出号: ${result.exportNo}`);
      emit('success');
    } else {
      ElMessage.warning('导出记录已保存，但文件未保存');
      emit('success');
    }
  } catch (err) {
    ElMessage.error(`导出失败: ${(err as Error).message}`);
  } finally {
    exporting.value = false;
  }
}

function handleClose(): void {
  dialogVisible.value = false;
}

// 打开时自动加载
import { watch } from 'vue';
watch(dialogVisible, (val) => {
  if (val) loadPreview();
});
</script>

<style scoped>
.export-content { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; align-items: center; gap: 12px; }
.summary-bar { display: flex; gap: 24px; padding: 12px 16px; background: var(--app-bg); border-radius: 4px; font-size: 14px; }
.summary-bar .total { font-weight: 600; color: var(--el-color-primary); }
</style>
