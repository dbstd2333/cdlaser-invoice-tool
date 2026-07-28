<template>
  <div class="content-card">
    <CustomersToolbar
      v-model:keyword="query.keyword"
      v-model:status="query.status"
      v-model:dataCompleteness="query.dataCompleteness"
      @search="handleSearch"
      @reset="handleReset"
      @refresh="loadData"
      @add="handleAdd"
      @initial-import="handleInitialImport"
    />
    <CustomersTable
      :rows="rows"
      :loading="loading"
      :page="query.page"
      :page-size="query.pageSize"
      :total="total"
      @view="handleView"
      @edit="handleEdit"
      @toggle-status="handleToggleStatus"
      @history="handleHistory"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />
    <CustomerModalHost
      v-model:modal-type="modalType"
      :editing-customer="editingCustomer"
      :viewing-customer="viewingCustomer"
      :history-entity-id="historyEntityId"
      @saved="loadData"
    />
    <CustomerInitialImportDialog
      v-model:visible="initialImportVisible"
      @success="handleInitialImportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import CustomersToolbar from './components/CustomersToolbar.vue';
import CustomersTable from './components/CustomersTable.vue';
import CustomerModalHost from './modals/CustomerModalHost.vue';
import CustomerInitialImportDialog from './modals/CustomerInitialImportDialog.vue';
import { api } from '../../api';
import { useAppStore } from '../../stores/app';
import type { Customer } from '@shared/contracts/types';

const appStore = useAppStore();
const loading = ref(false);
const rows = ref<Customer[]>([]);
const total = ref(0);

const query = reactive({
  keyword: '',
  status: 'all' as 'all' | 'active' | 'inactive',
  dataCompleteness: 'all' as 'all' | 'complete' | 'incomplete',
  page: 1,
  pageSize: 50,
});

const modalType = ref<'none' | 'form' | 'detail' | 'history'>('none');
const editingCustomer = ref<Customer | null>(null);
const viewingCustomer = ref<Customer | null>(null);
const historyEntityId = ref<string>('');
const initialImportVisible = ref(false);

onMounted(() => {
  loadData();
});

async function loadData(): Promise<void> {
  loading.value = true;
  try {
    const result = await api.customers.list(query);
    rows.value = result.rows;
    total.value = result.total;
  } catch (err) {
    ElMessage.error(`加载失败: ${(err as Error).message}`);
  } finally {
    loading.value = false;
  }
}

function handleSearch(): void {
  query.page = 1;
  loadData();
}

function handleReset(): void {
  query.keyword = '';
  query.status = 'all';
  query.dataCompleteness = 'all';
  query.page = 1;
  loadData();
}

function handlePageChange(page: number): void {
  query.page = page;
  loadData();
}

function handleSizeChange(size: number): void {
  query.pageSize = size;
  query.page = 1;
  loadData();
}

function handleAdd(): void {
  editingCustomer.value = null;
  modalType.value = 'form';
}

function handleEdit(row: Customer): void {
  editingCustomer.value = row;
  modalType.value = 'form';
}

function handleView(row: Customer): void {
  viewingCustomer.value = row;
  modalType.value = 'detail';
}

function handleHistory(row: Customer): void {
  historyEntityId.value = row.id;
  modalType.value = 'history';
}

async function handleToggleStatus(row: Customer): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `确认${row.status === 'active' ? '停用' : '恢复'}客户「${row.name}」？`,
      '确认操作',
      { type: 'warning' },
    );
    await api.customers.toggleStatus(row.id);
    ElMessage.success('操作成功');
    loadData();
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(`操作失败: ${(err as Error).message}`);
    }
  }
}

function handleInitialImport(): void {
  initialImportVisible.value = true;
}

function handleInitialImportSuccess(): void {
  initialImportVisible.value = false;
  appStore.loadInitStatus();
  loadData();
  ElMessage.success('客户首次导入成功');
}
</script>
