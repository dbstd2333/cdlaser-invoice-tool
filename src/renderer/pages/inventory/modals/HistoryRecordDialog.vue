<template>
  <ElDialog
    v-model="dialogVisible"
    title="历史记录"
    width="90vw"
    top="5vh"
    destroy-on-close
    @close="$emit('close')"
  >
    <div v-if="priceVersion" class="history-header">
      <ElDescriptions :column="3" border size="small">
        <ElDescriptionsItem label="商品">{{ productName || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="型号">{{ productModel || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="当前库存">
          <ElTag :type="stockTagType(priceVersion.stockBalance)" size="small">
            {{ priceVersion.stockBalance }}
          </ElTag>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>

    <ElTabs v-model="activeTab" class="history-tabs">
      <!-- Tab 1: 库存流水 -->
      <ElTabPane label="库存流水" name="ledger">
        <ElTable :data="ledgerRows" border stripe size="small" v-loading="ledgerLoading" max-height="400">
          <ElTableColumn prop="createdAt" label="变更时间" width="180">
            <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
          </ElTableColumn>
          <ElTableColumn label="变更类型" width="120">
            <template #default="{ row }">
              <ElTag :type="sourceTypeTag(row.sourceType)" size="small">
                {{ sourceTypeText(row.sourceType) }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="changeQuantity" label="变更数量" width="100" align="center">
            <template #default="{ row }">
              <span :class="row.changeQuantity > 0 ? 'stock-tag-positive' : 'stock-tag-negative'">
                {{ row.changeQuantity > 0 ? '+' : '' }}{{ row.changeQuantity }}
              </span>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="balanceBefore" label="变更前余额" width="110" align="center" />
          <ElTableColumn prop="balanceAfter" label="变更后余额" width="110" align="center" />
          <ElTableColumn prop="reason" label="原因" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">{{ row.reason || '-' }}</template>
          </ElTableColumn>
        </ElTable>
        <div class="pagination-container">
          <ElPagination
            v-model:current-page="ledgerPage"
            v-model:page-size="ledgerPageSize"
            :total="ledgerTotal"
            :page-sizes="[20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @current-change="loadLedger"
            @size-change="loadLedger"
          />
        </div>
      </ElTabPane>

      <!-- Tab 2: 字段变更 -->
      <ElTabPane label="字段变更" name="fields">
        <ElTable :data="fieldRows" border stripe size="small" v-loading="fieldLoading" max-height="400">
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
            v-model:current-page="fieldPage"
            v-model:page-size="fieldPageSize"
            :total="fieldTotal"
            :page-sizes="[20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @current-change="loadFields"
            @size-change="loadFields"
          />
        </div>
      </ElTabPane>
    </ElTabs>

    <template #footer>
      <ElButton @click="$emit('close')">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../../api';
import type { InventoryLedger, PriceVersion, LedgerSourceType, FieldHistoryEntry } from '@shared/contracts/types';

const props = defineProps<{
  visible: boolean;
  priceVersionId: string;
}>();

const emit = defineEmits<{ close: [] }>();

const dialogVisible = computed({
  get: () => props.visible,
  set: () => emit('close'),
});

// 商品信息
const priceVersion = ref<PriceVersion | null>(null);
const productName = ref('');
const productModel = ref('');
const activeTab = ref('ledger');

// 库存流水
const ledgerLoading = ref(false);
const ledgerRows = ref<InventoryLedger[]>([]);
const ledgerTotal = ref(0);
const ledgerPage = ref(1);
const ledgerPageSize = ref(50);

// 字段变更
const fieldLoading = ref(false);
const fieldRows = ref<FieldHistoryEntry[]>([]);
const fieldTotal = ref(0);
const fieldPage = ref(1);
const fieldPageSize = ref(50);
const fieldLoaded = ref(false);

/** 字段路径中文映射 */
const FIELD_LABELS: Record<string, string> = {
  status: '启用状态',
  stockBalance: '库存余额',
  unitPriceDecimal: '不含税单价',
  name: '项目名称',
  model: '规格型号',
  unit: '单位',
  taxClassificationCode: '税收分类编码',
  dataStatus: '资料状态',
  remark: '备注',
};

function fieldLabel(path: string): string {
  if (path === '*') return '—';
  return FIELD_LABELS[path] ?? path;
}

watch(
  () => props.visible,
  async (val) => {
    if (val && props.priceVersionId) {
      activeTab.value = 'ledger';
      fieldLoaded.value = false;
      ledgerPage.value = 1;
      fieldPage.value = 1;
      // 加载商品信息
      try {
        const pvs = await api.catalog.getPriceVersionsByIds([props.priceVersionId]);
        const pv = pvs[0] || null;
        priceVersion.value = pv;
        if (pv) {
          const product = await api.catalog.getProductById(pv.productId);
          productName.value = product?.name ?? '';
          productModel.value = product?.model ?? '';
        } else {
          productName.value = '';
          productModel.value = '';
        }
      } catch {
        priceVersion.value = null;
        productName.value = '';
        productModel.value = '';
      }
      await loadLedger();
    }
  },
  { immediate: true },
);

// 切换到字段变更 Tab 时懒加载
watch(activeTab, (tab) => {
  if (tab === 'fields' && !fieldLoaded.value && props.priceVersionId) {
    loadFields();
  }
});

async function loadLedger(): Promise<void> {
  ledgerLoading.value = true;
  try {
    const result = await api.inventory.ledger(props.priceVersionId, ledgerPage.value, ledgerPageSize.value);
    ledgerRows.value = result.rows;
    ledgerTotal.value = result.total;
  } catch (err) {
    ElMessage.error(`加载失败: ${(err as Error).message}`);
  } finally {
    ledgerLoading.value = false;
  }
}

async function loadFields(): Promise<void> {
  fieldLoading.value = true;
  try {
    const result = await api.catalog.fieldHistory({
      entityType: 'price_version',
      entityId: props.priceVersionId,
      page: fieldPage.value,
      pageSize: fieldPageSize.value,
    });
    fieldRows.value = result.rows;
    fieldTotal.value = result.total;
    fieldLoaded.value = true;
  } catch (err) {
    ElMessage.error(`加载失败: ${(err as Error).message}`);
  } finally {
    fieldLoading.value = false;
  }
}

function sourceTypeText(type: LedgerSourceType): string {
  const map: Record<LedgerSourceType, string> = {
    initialization: '初始化',
    outbound: '销项开票',
    outbound_void: '销项作废',
    inbound: '进项导入',
    inbound_void: '进项作废',
    adjustment: '人工调整',
  };
  return map[type] || type;
}

function sourceTypeTag(type: LedgerSourceType): string {
  const positive: LedgerSourceType[] = ['initialization', 'outbound_void', 'inbound', 'adjustment'];
  return positive.includes(type) ? 'success' : 'danger';
}

function stockTagType(balance: number): string {
  if (balance > 0) return 'success';
  if (balance < 0) return 'danger';
  return 'info';
}

function formatTime(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString('zh-CN');
}
</script>

<style scoped>
.history-header {
  margin-bottom: 8px;
}
.history-tabs {
  margin-top: 4px;
}
</style>
