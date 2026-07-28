<template>
  <div class="line-table-container">
    <ElTable :data="lines" border stripe size="small" max-height="400">
      <ElTableColumn prop="name" label="项目名称" min-width="150" />
      <ElTableColumn prop="model" label="型号" width="100" />
      <ElTableColumn prop="unit" label="单位" width="70" />
      <ElTableColumn prop="unitPriceDecimal" label="单价" width="120" />
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
      <ElTableColumn label="金额" width="110">
        <template #default="{ row }">{{ centToDisplay(calcAmountCent(row.quantity, row.unitPriceDecimal)) }}</template>
      </ElTableColumn>
      <ElTableColumn label="税额" width="110">
        <template #default="{ row }">{{ centToDisplay(calcTaxCent(calcAmountCent(row.quantity, row.unitPriceDecimal))) }}</template>
      </ElTableColumn>
      <ElTableColumn label="价税合计" width="120">
        <template #default="{ row }">
          {{ centToDisplay(calcTotalCent(calcAmountCent(row.quantity, row.unitPriceDecimal), calcTaxCent(calcAmountCent(row.quantity, row.unitPriceDecimal)))) }}
        </template>
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
      <span>金额：{{ centToDisplay(totalAmountCent) }}</span>
      <span>税额：{{ centToDisplay(totalTaxCent) }}</span>
      <span class="total">价税合计：{{ centToDisplay(totalCent) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { calcAmountCent, calcTaxCent, calcTotalCent, centToDisplay } from '@shared/money';

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

const props = defineProps<{ lines: OutboundLine[] }>();
defineEmits<{ change: []; remove: [index: number] }>();

const totalQuantity = computed(() => props.lines.reduce((sum, l) => sum + l.quantity, 0));
const totalAmountCent = computed(() => props.lines.reduce((sum, l) => sum + calcAmountCent(l.quantity, l.unitPriceDecimal), 0));
const totalTaxCent = computed(() => props.lines.reduce((sum, l) => sum + calcTaxCent(calcAmountCent(l.quantity, l.unitPriceDecimal)), 0));
const totalCent = computed(() => totalAmountCent.value + totalTaxCent.value);

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
