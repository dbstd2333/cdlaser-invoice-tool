<template>
  <div class="content-card">
    <OutboundRecordsToolbar
      v-model:batch-no="query.batchNo"
      v-model:customer-name="query.customerName"
      v-model:product-keyword="query.productKeyword"
      v-model:date-from="query.dateFrom"
      v-model:date-to="query.dateTo"
      v-model:status="query.status"
      @search="handleSearch"
      @reset="handleReset"
      @refresh="loadData"
    />
    <OutboundRecordsTable
      :rows="rows"
      :loading="loading"
      :page="query.page"
      :page-size="query.pageSize"
      :total="total"
      @view-detail="handleViewDetail"
      @download="handleDownload"
      @void="handleVoid"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />
    <OutboundRecordDetailDialog
      v-model:visible="detailVisible"
      :batch-id="detailBatchId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import OutboundRecordsToolbar from './components/OutboundRecordsToolbar.vue';
import OutboundRecordsTable from './components/OutboundRecordsTable.vue';
import OutboundRecordDetailDialog from './modals/OutboundRecordDetailDialog.vue';
import { api } from '../../api';
import type { OutboundBatch } from '@shared/contracts/types';

const loading = ref(false);
const rows = ref<OutboundBatch[]>([]);
const total = ref(0);
const detailVisible = ref(false);
const detailBatchId = ref('');

const query = reactive({
  batchNo: '',
  customerName: '',
  productKeyword: '',
  dateFrom: '',
  dateTo: '',
  status: 'all' as 'all' | 'valid' | 'voided',
  page: 1,
  pageSize: 50,
});

onMounted(() => {
  loadData();
});

async function loadData(): Promise<void> {
  loading.value = true;
  try {
    const result = await api.outbound.list(query);
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
  query.batchNo = '';
  query.customerName = '';
  query.productKeyword = '';
  query.dateFrom = '';
  query.dateTo = '';
  query.status = 'all';
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

function handleViewDetail(row: OutboundBatch): void {
  detailBatchId.value = row.id;
  detailVisible.value = true;
}

async function handleDownload(row: OutboundBatch): Promise<void> {
  try {
    const result = await api.outbound.download(row.id);
    if (result.saved) ElMessage.success('文件已保存');
  } catch (err) {
    ElMessage.error(`下载失败: ${(err as Error).message}`);
  }
}

async function handleVoid(row: OutboundBatch): Promise<void> {
  try {
    const { value } = await ElMessageBox.prompt('请输入作废原因', '作废开票记录', {
      type: 'warning',
      inputValidator: (val) => !!val?.trim() || '作废原因必填',
    });
    await ElMessageBox.confirm('作废后将恢复库存，且不可撤销。确认作废？', '最终确认', { type: 'warning' });
    await api.outbound.void(row.id, value);
    ElMessage.success('作废成功');
    loadData();
  } catch (err) {
    if (err !== 'cancel') ElMessage.error(`作废失败: ${(err as Error).message}`);
  }
}
</script>
