<template>
  <div class="table-container">
    <ElTable
      :data="rows"
      v-loading="loading"
      border
      stripe
      size="default"
      row-key="priceVersionId"
      :max-height="tableMaxHeight"
      @selection-change="handleSelectionChange"
    >
      <ElTableColumn type="selection" width="50" :reserve-selection="true" />
      <ElTableColumn prop="name" label="项目名称" min-width="180" show-overflow-tooltip />
      <ElTableColumn prop="model" label="型号" width="120" show-overflow-tooltip />
      <ElTableColumn prop="unit" label="单位" width="80" />
      <ElTableColumn prop="taxClassificationCode" label="税收分类编码" min-width="150" show-overflow-tooltip />
      <ElTableColumn prop="unitPriceDecimal" label="不含税单价" width="130" />
      <ElTableColumn label="当前库存" width="120">
        <template #default="{ row }">
          <ElTag :type="stockTagType(row.stockBalance)" size="small">
            {{ stockStatusText(row.stockBalance) }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="启用状态" width="90" align="center">
        <template #default="{ row }">
          <ElTag :type="row.productStatus === 'active' ? 'success' : 'danger'" size="small">
            {{ row.productStatus === 'active' ? '启用' : '停用' }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="updatedAt" label="最近变更" width="160">
        <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="270" fixed="right">
        <template #default="{ row }">
          <ElButton link type="info" size="small" @click="$emit('viewHistory', row)">历史记录</ElButton>
          <ElButton link type="primary" size="small" @click="$emit('editProduct', row)">编辑</ElButton>
          <ElButton link :type="row.productStatus === 'active' ? 'warning' : 'success'" size="small" @click="$emit('toggleProductStatus', row)">
            {{ row.productStatus === 'active' ? '停用' : '启用' }}
          </ElButton>
          <ElButton link type="primary" size="small" @click="$emit('adjustStock', row)">库存调整</ElButton>
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
import { ref, computed } from 'vue';
import type { PriceVersionRow } from '@shared/contracts/types';
import { getStockStatusText } from '@shared/contracts/types';

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
  toggleProductStatus: [row: PriceVersionRow];
  togglePriceVersionStatus: [row: PriceVersionRow];
  adjustStock: [row: PriceVersionRow];
  pageChange: [page: number];
  sizeChange: [size: number];
  selectionChange: [row: PriceVersionRow, selected: boolean];
}>();

const currentPage = computed({
  get: () => props.page,
  set: () => {},
});
const currentPageSize = computed({
  get: () => props.pageSize,
  set: () => {},
});

const tableMaxHeight = ref(550);

function handleSelectionChange(selectedRows: PriceVersionRow[]): void {
  // 计算当前页的勾选变化
  const selectedIds = new Set(selectedRows.map((r) => r.priceVersionId));
  for (const row of props.rows) {
    emit('selectionChange', row, selectedIds.has(row.priceVersionId));
  }
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
