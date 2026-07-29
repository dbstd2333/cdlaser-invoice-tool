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
        <ElFormItem label="金额系数">
          <ElInput
            v-model="amountFactor"
            style="width: 120px"
            placeholder="1.09"
            @change="handleFactorChange"
          />
        </ElFormItem>
      </ElForm>

      <!-- 商品明细和汇总 -->
      <OutboundLineTable :lines="lines" :factor="amountFactor" @change="recalculate" @remove="removeLine" />
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
import type { SelectedPriceVersion } from '../../../stores/selection';
import type { Customer } from '@shared/contracts/types';
import type { DraftValidationResult } from '@shared/contracts/preview-types';
import type { OutboundExportInput } from '@shared/schemas';
import { calcOutboundAmountCent, centToYuan, yuanToCent } from '@shared/money';
import OutboundLineTable from './OutboundLineTable.vue';

const props = defineProps<{ visible: boolean; initialLines: SelectedPriceVersion[] }>();
const emit = defineEmits<{ close: []; success: [] }>();

const dialogVisible = computed({ get: () => props.visible, set: () => emit('close') });
const selectionStore = useSelectionStore();
const selectedCustomerId = ref('');
const customerOptions = ref<Customer[]>([]);
const customerLoading = ref(false);
const exporting = ref(false);
const amountFactor = ref('1.09');

interface OutboundLine {
  priceVersionId: string; name: string; model: string; unit: string;
  unitPriceDecimal: string; stockBalance: number; quantity: number; amountYuan: string;
}
const lines = reactive<OutboundLine[]>([]);

watch(() => props.visible, (val) => {
  if (val) {
    lines.length = 0;
    for (const item of props.initialLines) {
      const pv = item.row;
      lines.push({
        priceVersionId: pv.priceVersionId, name: pv.name, model: pv.model, unit: pv.unit,
        unitPriceDecimal: pv.unitPriceDecimal, stockBalance: pv.stockBalance, quantity: item.quantity,
        amountYuan: centToYuan(calcOutboundAmountCent(item.quantity, pv.unitPriceDecimal, amountFactor.value)),
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

/** 统一系数变化时重新计算弹窗内全部行金额。 */
function handleFactorChange(): void {
  try {
    for (const line of lines) {
      line.amountYuan = centToYuan(
        calcOutboundAmountCent(line.quantity, line.unitPriceDecimal, amountFactor.value),
      );
    }
  } catch {
    amountFactor.value = '1.09';
    for (const line of lines) {
      line.amountYuan = centToYuan(calcOutboundAmountCent(line.quantity, line.unitPriceDecimal, '1.09'));
    }
    ElMessage.warning('金额系数无效，已恢复为 1.09');
  }
}

/** 将弹窗中的金额字符串转换为后端使用的整数分。 */
function parseLineAmountCent(line: OutboundLine): number {
  const amountCent = yuanToCent(line.amountYuan);
  if (amountCent <= 0) throw new Error(`“${line.name}”的金额必须大于 0`);
  return amountCent;
}

async function handleExport(): Promise<void> {
  if (lines.length > 2000) {
    ElMessage.error('单次最多 2000 条明细');
    return;
  }
  try {
    exporting.value = true;
    const input: OutboundExportInput = {
      customerId: selectedCustomerId.value,
      lines: lines.map((l) => ({
        priceVersionId: l.priceVersionId,
        quantity: l.quantity,
        amountCent: parseLineAmountCent(l),
      })),
      amountFactor: amountFactor.value,
    };

    const draft: DraftValidationResult = await api.outbound.validateDraft(input);
    if (draft.invalidPriceVersionIds.length > 0) {
      selectionStore.removeInvalid(draft.invalidPriceVersionIds);
      ElMessage.warning(`部分价格版本已失效并从已选中移除：${draft.errors.join('; ')}`);
      if (draft.validLines.length === 0) { exporting.value = false; return; }
      input.lines = draft.validLines.map((l) => ({
        priceVersionId: l.priceVersionId,
        quantity: l.quantity,
        amountCent: l.amountCent,
      }));
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
