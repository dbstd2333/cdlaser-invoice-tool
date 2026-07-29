<template>
  <div class="table-container">
    <ElTable
      :data="rows"
      v-loading="loading"
      border
      stripe
      size="large"
      row-key="priceVersionId"
      :max-height="tableMaxHeight"
      class="invoice-table"
    >
      <ElTableColumn
        label="开票数量"
        width="128"
        fixed="left"
        align="center"
        class-name="quantity-column"
      >
        <template #default="{ row }">
          <ElInputNumber
            :model-value="selectionStore.getQuantity(row.priceVersionId)"
            :min="0"
            :step="1"
            :precision="0"
            size="small"
            class="quantity-stepper"
            @change="handleQuantityChange(row, $event)"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="name" label="商品 / 项目名称" min-width="220" show-overflow-tooltip />
      <ElTableColumn prop="model" label="规格型号" min-width="140" show-overflow-tooltip />
      <ElTableColumn prop="unit" label="单位" width="80" />
      <ElTableColumn prop="unitPriceDecimal" label="含税单价（元）" width="140" align="right">
        <template #default="{ row }">¥{{ row.unitPriceDecimal }}</template>
      </ElTableColumn>
      <ElTableColumn label="本行已选金额" width="150" align="right">
        <template #default="{ row }">
          <strong v-if="selectionStore.getQuantity(row.priceVersionId) > 0" class="line-amount">
            ¥{{ selectedLineAmount(row) }}
          </strong>
          <span v-else class="empty-amount">—</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="当前库存" width="120">
        <template #default="{ row }">
          <ElTag :type="stockTagType(row.stockBalance)" size="small">
            {{ stockStatusText(row.stockBalance) }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="updatedAt" label="最近变更" width="160">
        <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
      </ElTableColumn>
      <ElTableColumn label="商品操作" width="270" fixed="right">
        <template #default="{ row }">
          <ElButton link type="info" size="small" @click="$emit('viewHistory', row)">历史记录</ElButton>
          <ElButton link type="primary" size="small" @click="$emit('editProduct', row)">编辑</ElButton>
          <ElButton link type="primary" size="small" @click="$emit('adjustStock', row)">库存调整</ElButton>
          <ElButton link type="danger" size="small" @click="$emit('deleteProduct', row)">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="pagination-container">
      <ElPagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="$emit('pageChange', $event)"
        @size-change="$emit('sizeChange', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PriceVersionRow } from '@shared/contracts/types';
import { getStockStatusText } from '@shared/contracts/types';
import { calcOutboundAmountCent, centToDisplay } from '@shared/money';
import { useSelectionStore } from '../../../stores/selection';

const props = defineProps<{
  rows: PriceVersionRow[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  viewHistory: [row: PriceVersionRow];
  editProduct: [row: PriceVersionRow];
  adjustStock: [row: PriceVersionRow];
  deleteProduct: [row: PriceVersionRow];
  pageChange: [page: number];
  sizeChange: [size: number];
  quantityChange: [row: PriceVersionRow, quantity: number];
}>();

const selectionStore = useSelectionStore();
const currentPage = computed({
  get: () => props.page,
  set: () => {},
});
const currentPageSize = computed({
  get: () => props.pageSize,
  set: () => {},
});

const tableMaxHeight = 'calc(100vh - 360px)';

/** 将数量步进器的空值安全归零后通知页面。 */
function handleQuantityChange(row: PriceVersionRow, quantity: number | undefined): void {
  emit('quantityChange', row, quantity ?? 0);
}

/** 计算主表中当前行未加利润的已选金额。 */
function selectedLineAmount(row: PriceVersionRow): string {
  const amountCent = calcOutboundAmountCent(
    selectionStore.getQuantity(row.priceVersionId),
    row.unitPriceDecimal,
    '1',
  );
  return centToDisplay(amountCent);
}

function stockTagType(balance: number): string {
  if (balance > 0) return 'success';
  if (balance < 0) return 'danger';
  return 'info';
}

function stockStatusText(balance: number): string {
  return getStockStatusText(balance);
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
.invoice-table {
  width: 100%;
  --el-table-header-bg-color: #f2f5f9;
  --el-table-header-text-color: #354052;
}

.quantity-stepper {
  width: 104px;
}

.invoice-table :deep(.quantity-column .cell) {
  padding: 0 8px;
  overflow: visible;
  text-overflow: clip;
}

.line-amount {
  color: var(--el-color-primary);
  font-variant-numeric: tabular-nums;
}

.empty-amount {
  color: var(--text-secondary);
}
</style>
