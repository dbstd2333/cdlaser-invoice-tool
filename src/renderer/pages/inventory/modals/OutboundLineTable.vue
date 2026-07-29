<template>
  <div class="line-table-container">
    <ElTable :data="lines" border stripe size="small" max-height="400">
      <ElTableColumn prop="name" label="项目名称" min-width="150" />
      <ElTableColumn prop="model" label="型号" width="100" />
      <ElTableColumn prop="unit" label="单位" width="70" />
      <ElTableColumn prop="unitPriceDecimal" label="含税单价" width="120" />
      <ElTableColumn label="当前库存" width="100">
        <template #default="{ row }">
          <ElTag :type="stockTagType(row.stockBalance)" size="small">{{ row.stockBalance }}</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="数量" width="140">
        <template #default="{ row }">
          <ElInputNumber v-model="row.quantity" :min="1" :step="1" :precision="0" size="small" @change="$emit('change')" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="金额" width="120">
        <template #default="{ row }">{{ centToDisplay(lineAmount(row)) }}</template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="80" fixed="right">
        <template #default="{ $index }">
          <ElButton link type="danger" size="small" @click="$emit('remove', $index)">移除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <!-- 汇总栏 -->
    <div class="summary-bar">
      <span>行数：{{ lines.length }}</span>
      <span>数量合计：{{ totalQuantity }}</span>
      <span class="total">金额：{{ centToDisplay(totalAmountCent) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { calcOutboundAmountCent, centToDisplay } from '@shared/money';

/** 销项开票明细行 */
interface OutboundLine {
  priceVersionId: string;
  name: string;
  model: string;
  unit: string;
  unitPriceDecimal: string;
  stockBalance: number;
  quantity: number;
}

const props = defineProps<{ lines: OutboundLine[]; factor: string }>();
defineEmits<{ change: []; remove: [index: number] }>();

/** 单行金额（分）= 含税单价 × 数量 × 系数 */
function lineAmount(row: OutboundLine): number {
  return calcOutboundAmountCent(row.quantity, row.unitPriceDecimal, props.factor);
}

const totalQuantity = computed(() => props.lines.reduce((sum, l) => sum + l.quantity, 0));
const totalAmountCent = computed(() => props.lines.reduce((sum, l) => sum + lineAmount(l), 0));

function stockTagType(balance: number): string {
  if (balance > 0) return 'success';
  if (balance < 0) return 'danger';
  return 'info';
}
</script>

<style scoped>
.summary-bar {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: var(--app-bg);
  border-radius: 4px;
  font-size: 14px;
  margin-top: 12px;
}

.summary-bar .total {
  font-weight: 600;
  color: var(--el-color-primary);
}
</style>
