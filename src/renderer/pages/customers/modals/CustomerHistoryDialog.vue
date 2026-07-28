<template>
  <ElDialog
    v-model="dialogVisible"
    title="字段历史"
    width="90vw"
    top="5vh"
    destroy-on-close
    @close="$emit('close')"
  >
    <ElTable :data="rows" border stripe size="small" v-loading="loading" max-height="500">
      <ElTableColumn prop="createdAt" label="变更时间" width="180">
        <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
      </ElTableColumn>
      <ElTableColumn label="操作摘要" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">{{ row.summary || '-' }}</template>
      </ElTableColumn>
      <ElTableColumn label="字段" width="130">
        <template #default="{ row }">{{ fieldLabel(row.fieldPath) }}</template>
      </ElTableColumn>
      <ElTableColumn label="变更前" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">{{ row.oldValue ?? '-' }}</template>
      </ElTableColumn>
      <ElTableColumn label="变更后" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">{{ row.newValue ?? '-' }}</template>
      </ElTableColumn>
    </ElTable>
    <div class="pagination-container">
      <ElPagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @current-change="loadData"
        @size-change="loadData"
      />
    </div>
    <template #footer>
      <ElButton @click="$emit('close')">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../../api';
import type { FieldHistoryEntry } from '@shared/contracts/types';

const props = defineProps<{
  visible: boolean;
  entityId: string;
}>();

const emit = defineEmits<{ close: [] }>();

const dialogVisible = computed({
  get: () => props.visible,
  set: () => emit('close'),
});

const loading = ref(false);
const rows = ref<FieldHistoryEntry[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(50);

/** 字段路径中文映射 */
const FIELD_LABELS: Record<string, string> = {
  status: '启用状态',
  name: '客户名称',
  taxId: '纳税人识别号',
  shortCode: '简码',
  address: '地址',
  phone: '电话',
  bankName: '开户行',
  bankAccount: '银行账号',
  email: '邮箱',
  isDefaultAddress: '是否默认地址',
};

function fieldLabel(path: string): string {
  if (path === '*') return '-';
  return FIELD_LABELS[path] ?? path;
}

watch(
  () => props.visible,
  (val) => {
    if (val && props.entityId) {
      page.value = 1;
      loadData();
    }
  },
  { immediate: true },
);

async function loadData(): Promise<void> {
  loading.value = true;
  try {
    const result = await api.customers.history({
      entityType: 'customer',
      entityId: props.entityId,
      page: page.value,
      pageSize: pageSize.value,
    });
    rows.value = result.rows;
    total.value = result.total;
  } catch (err) {
    ElMessage.error(`加载失败: ${(err as Error).message}`);
  } finally {
    loading.value = false;
  }
}

function formatTime(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString('zh-CN');
}
</script>
