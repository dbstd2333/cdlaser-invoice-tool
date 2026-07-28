<template>
  <div class="table-container">
    <ElTable :data="rows" v-loading="loading" border stripe size="default" :max-height="550" @row-click="handleRowClick">
      <ElTableColumn prop="batchNo" label="开票批次号" width="220" show-overflow-tooltip />
      <ElTableColumn label="客户名称" min-width="150">
        <template #default="{ row }">{{ row.customerSnapshot?.name || '-' }}</template>
      </ElTableColumn>
      <ElTableColumn prop="exportedAt" label="Excel 导出时间" width="170">
        <template #default="{ row }">{{ formatTime(row.exportedAt) }}</template>
      </ElTableColumn>
      <ElTableColumn prop="status" label="状态" width="90" align="center">
        <template #default="{ row }">
          <ElTag :type="row.status === 'valid' ? 'success' : 'danger'" size="small">
            {{ row.status === 'valid' ? '有效' : '已作废' }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="lineCount" label="明细行数" width="100" align="center" />
      <ElTableColumn prop="totalQuantity" label="数量合计" width="100" align="center" />
      <ElTableColumn label="金额" width="120">
        <template #default="{ row }">{{ centToDisplay(row.totalAmountCent) }}</template>
      </ElTableColumn>
      <ElTableColumn label="税额" width="120">
        <template #default="{ row }">{{ centToDisplay(row.totalTaxCent) }}</template>
      </ElTableColumn>
      <ElTableColumn label="价税合计" width="130">
        <template #default="{ row }">{{ centToDisplay(row.totalCent) }}</template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <ElButton link type="primary" size="small" @click.stop="$emit('viewDetail', row)">查看明细</ElButton>
          <ElButton link type="info" size="small" @click.stop="$emit('download', row)">下载</ElButton>
          <ElButton v-if="row.status === 'valid'" link type="danger" size="small" @click.stop="$emit('void', row)">作废</ElButton>
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
import { centToDisplay } from '@shared/money';
import type { OutboundBatch } from '@shared/contracts/types';

const props = defineProps<{
  rows: OutboundBatch[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  viewDetail: [row: OutboundBatch];
  download: [row: OutboundBatch];
  void: [row: OutboundBatch];
  pageChange: [page: number];
  sizeChange: [size: number];
}>();

const currentPage = computed({ get: () => props.page, set: () => {} });
const currentPageSize = computed({ get: () => props.pageSize, set: () => {} });

function handleRowClick(row: OutboundBatch): void {
  emit('viewDetail', row);
}

function formatTime(iso: string): string {
  try { return new Date(iso).toLocaleString('zh-CN'); } catch { return iso; }
}
</script>
