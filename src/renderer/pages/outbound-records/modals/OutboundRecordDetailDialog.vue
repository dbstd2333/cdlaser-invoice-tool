<template>
  <ElDialog
    v-model="dialogVisible"
    title="开票明细"
    width="90vw"
    top="5vh"
    destroy-on-close
    @close="$emit('update:visible', false)"
  >
    <div v-loading="loading">
      <div v-if="detail" class="detail-content">
        <!-- 汇总区 -->
        <ElCard shadow="never" class="summary-card">
          <ElDescriptions :column="3" border size="small">
            <ElDescriptionsItem label="批次号">{{ detail.batch.batchNo }}</ElDescriptionsItem>
            <ElDescriptionsItem label="客户">{{ detail.batch.customerSnapshot?.name }}</ElDescriptionsItem>
            <ElDescriptionsItem label="导出时间">{{ formatTime(detail.batch.exportedAt) }}</ElDescriptionsItem>
            <ElDescriptionsItem label="状态">
              <ElTag :type="detail.batch.status === 'valid' ? 'success' : 'danger'" size="small">
                {{ detail.batch.status === 'valid' ? '有效' : '已作废' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="数量合计">{{ detail.batch.totalQuantity }}</ElDescriptionsItem>
            <ElDescriptionsItem label="明细行数">{{ detail.batch.lineCount }}</ElDescriptionsItem>
            <ElDescriptionsItem label="金额">{{ centToDisplay(detail.batch.totalAmountCent) }}</ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>

        <!-- 作废信息 -->
        <ElCard v-if="detail.batch.status === 'voided'" shadow="never" class="void-card">
          <ElDescriptions :column="2" border size="small">
            <ElDescriptionsItem label="作废时间">{{ formatTime(detail.batch.voidedAt) }}</ElDescriptionsItem>
            <ElDescriptionsItem label="作废原因">{{ detail.batch.voidReason }}</ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>

        <!-- 商品明细表 -->
        <ElCard shadow="never">
          <template #header>商品明细</template>
          <ElTable :data="detail.lines" border stripe size="small" max-height="400">
            <ElTableColumn type="index" label="#" width="50" />
            <ElTableColumn prop="name" label="项目名称" min-width="150" />
            <ElTableColumn prop="model" label="型号" width="100" />
            <ElTableColumn prop="unit" label="单位" width="70" />
            <ElTableColumn prop="unitPriceDecimal" label="含税单价" width="120" />
            <ElTableColumn prop="taxRate" label="税率" width="80">
              <template #default>0.13</template>
            </ElTableColumn>
            <ElTableColumn prop="quantity" label="数量" width="80" />
            <ElTableColumn label="金额" width="110">
              <template #default="{ row }">{{ centToDisplay(row.amountCent) }}</template>
            </ElTableColumn>
            <ElTableColumn label="扣减前库存 -> 扣减后库存" width="200" align="center">
              <template #default="{ row }">
                <span :class="stockClass(row.stockBefore)">{{ row.stockBefore }}</span>
                <span class="arrow"> -> </span>
                <span :class="stockClass(row.stockAfter)">{{ row.stockAfter }}</span>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElCard>
      </div>
    </div>
    <template #footer>
      <ElButton @click="dialogVisible = false">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../../api';
import { centToDisplay } from '@shared/money';
import type { OutboundBatch, OutboundLine } from '@shared/contracts/types';

const props = defineProps<{
  visible: boolean;
  batchId: string;
}>();

const emit = defineEmits<{ 'update:visible': [val: boolean] }>();

const dialogVisible = computed({ get: () => props.visible, set: (val) => emit('update:visible', val) });
const loading = ref(false);
const detail = ref<{ batch: OutboundBatch; lines: OutboundLine[] } | null>(null);

watch(
  () => props.visible,
  async (val) => {
    if (val && props.batchId) {
      loading.value = true;
      try {
        detail.value = await api.outbound.getDetail(props.batchId);
      } catch (err) {
        ElMessage.error(`加载失败: ${(err as Error).message}`);
      } finally {
        loading.value = false;
      }
    }
  },
);

function stockClass(balance: number): string {
  if (balance > 0) return 'stock-tag-positive';
  if (balance < 0) return 'stock-tag-negative';
  return 'stock-tag-zero';
}

function formatTime(iso: string | null): string {
  if (!iso) return '-';
  try { return new Date(iso).toLocaleString('zh-CN'); } catch { return iso; }
}
</script>

<style scoped>
.detail-content { display: flex; flex-direction: column; gap: 16px; }
.summary-card { margin-bottom: 0; }
.void-card { border-color: var(--color-negative); }
.arrow { color: var(--text-secondary); margin: 0 4px; }
</style>
