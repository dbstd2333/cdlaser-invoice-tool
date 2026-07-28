<template>
  <ElDialog
    v-model="dialogVisible"
    title="销项开票"
    width="90vw"
    top="5vh"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <div class="outbound-content">
      <!-- 客户选择 -->
      <ElForm :inline="true" class="customer-form">
        <ElFormItem label="开票客户" required>
          <ElSelect
            v-model="selectedCustomerId"
            filterable
            remote
            :remote-method="searchCustomers"
            :loading="customerLoading"
            placeholder="选择启用客户"
            style="width: 300px"
          >
            <ElOption v-for="c in customerOptions" :key="c.id" :label="`${c.name} (${c.taxId})`" :value="c.id" />
          </ElSelect>
        </ElFormItem>
      </ElForm>

      <!-- 商品明细和汇总 -->
      <OutboundLineTable :lines="lines" @change="recalculate" @remove="removeLine" />
    </div>

    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton type="primary" :loading="exporting" :disabled="!selectedCustomerId || lines.length === 0" @click="handleExport">
        确认导出
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../../api';
import { useSelectionStore } from '../../../stores/selection';
import type { PriceVersionRow, Customer } from '@shared/contracts/types';
import type { DraftValidationResult } from '@shared/contracts/preview-types';
import OutboundLineTable from './OutboundLineTable.vue';

const props = defineProps<{ visible: boolean; initialLines: PriceVersionRow[] }>();
const emit = defineEmits<{ close: []; success: [] }>();

const dialogVisible = computed({ get: () => props.visible, set: () => emit('close') });
const selectionStore = useSelectionStore();
const selectedCustomerId = ref('');
const customerOptions = ref<Customer[]>([]);
const customerLoading = ref(false);
const exporting = ref(false);

interface OutboundLine {
  priceVersionId: string; name: string; model: string; unit: string;
  unitPriceDecimal: string; stockBalance: number; quantity: number;
}
const lines = reactive<OutboundLine[]>([]);

watch(() => props.visible, (val) => {
  if (val) {
    lines.length = 0;
    for (const pv of props.initialLines) {
      lines.push({
        priceVersionId: pv.priceVersionId, name: pv.name, model: pv.model, unit: pv.unit,
        unitPriceDecimal: pv.unitPriceDecimal, stockBalance: pv.stockBalance, quantity: 1,
      });
    }
    loadCustomers();
  }
}, { immediate: true });

async function loadCustomers(): Promise<void> {
  customerLoading.value = true;
  try {
    const result = await api.customers.list({ page: 1, pageSize: 100, status: 'active' });
    customerOptions.value = result.rows;
  } finally {
    customerLoading.value = false;
  }
}

async function searchCustomers(query: string): Promise<void> {
  customerLoading.value = true;
  try {
    const result = await api.customers.list({ page: 1, pageSize: 100, keyword: query, status: 'active' });
    customerOptions.value = result.rows;
  } finally {
    customerLoading.value = false;
  }
}

function removeLine(index: number): void {
  lines.splice(index, 1);
}

function recalculate(): void {
  // 触发响应式重算（子组件内 computed 自动更新）
}

async function handleExport(): Promise<void> {
  if (lines.length > 2000) {
    ElMessage.error('单次最多 2000 条明细');
    return;
  }
  try {
    exporting.value = true;
    const input = {
      customerId: selectedCustomerId.value,
      lines: lines.map((l) => ({ priceVersionId: l.priceVersionId, quantity: l.quantity })),
    };

    const draft: DraftValidationResult = await api.outbound.validateDraft(input);
    if (draft.invalidPriceVersionIds.length > 0) {
      selectionStore.removeInvalid(draft.invalidPriceVersionIds);
      ElMessage.warning(`部分价格版本已失效并从已选中移除：${draft.errors.join('; ')}`);
      if (draft.validLines.length === 0) { exporting.value = false; return; }
      input.lines = draft.validLines.map((l) => ({ priceVersionId: l.priceVersionId, quantity: l.quantity }));
    }

    const result = await api.outbound.export(input);
    if (result.saved) {
      ElMessage.success(`导出成功，批次号: ${result.batchNo}`);
      selectionStore.clearSelection();
      emit('success');
    } else {
      ElMessage.warning('导出已取消');
    }
  } catch (err) {
    ElMessage.error(`导出失败: ${(err as Error).message}`);
  } finally {
    exporting.value = false;
  }
}

function handleClose(): void {
  emit('close');
}
</script>

<style scoped>
.outbound-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
