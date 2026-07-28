<template>
  <div class="table-container">
    <ElTable
      :data="rows"
      v-loading="loading"
      border
      stripe
      size="default"
      style="width: 100%"
      :max-height="tableMaxHeight"
    >
      <ElTableColumn prop="name" label="客户名称" min-width="150" show-overflow-tooltip />
      <ElTableColumn prop="taxId" label="纳税人识别号" min-width="180" show-overflow-tooltip />
      <ElTableColumn prop="shortCode" label="简码" width="100" />
      <ElTableColumn prop="address" label="地址" min-width="200" show-overflow-tooltip />
      <ElTableColumn prop="phone" label="电话" width="130" show-overflow-tooltip />
      <ElTableColumn prop="bankName" label="开户行" min-width="150" show-overflow-tooltip />
      <ElTableColumn prop="bankAccount" label="银行账号" min-width="160" show-overflow-tooltip />
      <ElTableColumn prop="email" label="邮箱" min-width="150" show-overflow-tooltip />
      <ElTableColumn prop="isDefaultAddress" label="默认地址" width="90" align="center">
        <template #default="{ row }">
          <ElTag v-if="row.isDefaultAddress" type="success" size="small">是</ElTag>
          <span v-else>否</span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="status" label="状态" width="80" align="center">
        <template #default="{ row }">
          <ElTag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="updatedAt" label="最近更新" width="160">
        <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <ElButton link type="primary" size="small" @click="$emit('view', row)">查看</ElButton>
          <ElButton link type="primary" size="small" @click="$emit('edit', row)">编辑</ElButton>
          <ElButton link :type="row.status === 'active' ? 'warning' : 'success'" size="small" @click="$emit('toggle-status', row)">
            {{ row.status === 'active' ? '停用' : '恢复' }}
          </ElButton>
          <ElButton link type="info" size="small" @click="$emit('history', row)">历史</ElButton>
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
        @current-change="$emit('page-change', $event)"
        @size-change="$emit('size-change', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Customer } from '@shared/contracts/types';

const props = defineProps<{
  rows: Customer[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  view: [row: Customer];
  edit: [row: Customer];
  'toggle-status': [row: Customer];
  history: [row: Customer];
  'page-change': [page: number];
  'size-change': [size: number];
}>();

const currentPage = computed({
  get: () => props.page,
  set: (val) => {},
});
const currentPageSize = computed({
  get: () => props.pageSize,
  set: (val) => {},
});

const tableMaxHeight = ref(600);

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}
</script>
