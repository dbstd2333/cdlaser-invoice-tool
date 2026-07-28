<template>
  <ElDialog
    v-model="dialogVisible"
    title="导入记录"
    width="90vw"
    top="5vh"
    destroy-on-close
    @close="$emit('update:visible', false)"
  >
    <ElTabs v-model="activeTab">
      <ElTabPane label="进项导入记录" name="inbound">
        <ElTable :data="inboundBatches" border stripe size="small" v-loading="loading" max-height="450">
          <ElTableColumn prop="batchNo" label="批次号" width="220" />
          <ElTableColumn prop="originalFileName" label="文件名" min-width="180" show-overflow-tooltip />
          <ElTableColumn prop="importedAt" label="导入时间" width="170">
            <template #default="{ row }">{{ formatTime(row.importedAt) }}</template>
          </ElTableColumn>
          <ElTableColumn prop="status" label="状态" width="90">
            <template #default="{ row }">
              <ElTag :type="row.status === 'imported' ? 'success' : 'danger'" size="small">
                {{ row.status === 'imported' ? '有效' : '已作废' }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="totalQuantity" label="数量合计" width="100" />
          <ElTableColumn label="金额" width="110">
            <template #default="{ row }">{{ centToDisplay(row.totalAmountCent) }}</template>
          </ElTableColumn>
          <ElTableColumn label="价税合计" width="120">
            <template #default="{ row }">{{ centToDisplay(row.totalCent) }}</template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" size="small" @click="viewInboundDetail(row.id)">详情</ElButton>
              <ElButton v-if="row.status === 'imported'" link type="danger" size="small" @click="voidInbound(row)">作废</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </ElTabPane>
      <ElTabPane label="月底导出记录" name="replenishment">
        <ElTable :data="replenishmentExports" border stripe size="small" v-loading="loading" max-height="450">
          <ElTableColumn prop="exportNo" label="导出号" width="220" />
          <ElTableColumn prop="exportedAt" label="导出时间" width="170">
            <template #default="{ row }">{{ formatTime(row.exportedAt) }}</template>
          </ElTableColumn>
          <ElTableColumn prop="lineCount" label="行数" width="80" />
          <ElTableColumn prop="totalQuantity" label="数量合计" width="100" />
          <ElTableColumn label="金额" width="110">
            <template #default="{ row }">{{ centToDisplay(row.totalAmountCent) }}</template>
          </ElTableColumn>
          <ElTableColumn label="价税合计" width="120">
            <template #default="{ row }">{{ centToDisplay(row.totalCent) }}</template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" size="small" @click="downloadReplenishment(row.id)">下载</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </ElTabPane>
    </ElTabs>
    <template #footer>
      <ElButton @click="dialogVisible = false">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from '../../../api';
import { centToDisplay } from '@shared/money';
import type { InboundBatch, ReplenishmentExport } from '@shared/contracts/types';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ 'update:visible': [val: boolean] }>();

const dialogVisible = computed({ get: () => props.visible, set: (val) => emit('update:visible', val) });
const activeTab = ref('inbound');
const loading = ref(false);
const inboundBatches = ref<InboundBatch[]>([]);
const replenishmentExports = ref<ReplenishmentExport[]>([]);

watch(dialogVisible, (val) => {
  if (val) {
    loadInbound();
    loadReplenishment();
  }
});

async function loadInbound(): Promise<void> {
  loading.value = true;
  try {
    const result = await api.inbound.list(1, 100);
    inboundBatches.value = result.rows;
  } catch (err) {
    ElMessage.error(`加载失败: ${(err as Error).message}`);
  } finally {
    loading.value = false;
  }
}

async function loadReplenishment(): Promise<void> {
  try {
    const result = await api.replenishment.list(1, 100);
    replenishmentExports.value = result.rows;
  } catch {
    // ignore
  }
}

async function viewInboundDetail(id: string): Promise<void> {
  try {
    const detail = await api.inbound.getDetail(id);
    if (detail) {
      ElMessage.info(`批次 ${detail.batch.batchNo}，共 ${detail.lines.length} 行明细`);
    }
  } catch (err) {
    ElMessage.error(`加载失败: ${(err as Error).message}`);
  }
}

async function voidInbound(row: InboundBatch): Promise<void> {
  try {
    const { value } = await ElMessageBox.prompt('请输入作废原因', '作废进项批次', { type: 'warning' });
    await api.inbound.void(row.id, value);
    ElMessage.success('作废成功');
    loadInbound();
  } catch (err) {
    if (err !== 'cancel') ElMessage.error(`作废失败: ${(err as Error).message}`);
  }
}

async function downloadReplenishment(id: string): Promise<void> {
  try {
    const result = await api.replenishment.download(id);
    if (result.saved) ElMessage.success('文件已保存');
  } catch (err) {
    ElMessage.error(`下载失败: ${(err as Error).message}`);
  }
}

function formatTime(iso: string): string {
  try { return new Date(iso).toLocaleString('zh-CN'); } catch { return iso; }
}
</script>
