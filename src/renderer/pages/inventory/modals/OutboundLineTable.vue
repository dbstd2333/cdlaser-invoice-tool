<template>
  <div class="line-table-container">
    <div class="line-table-tools">
      <div>
        <strong>开票明细</strong>
        <span>金额可直接编辑，修改数量后会按当前系数重新计算</span>
      </div>
      <ElButton type="warning" plain :disabled="fractionalLineCount === 0" @click="roundAllFractionalAmounts">
        一键四舍五入金额
        <span v-if="fractionalLineCount > 0">（{{ fractionalLineCount }} 行）</span>
      </ElButton>
    </div>
    <ElTable :data="lines" border stripe size="default" max-height="440">
      <ElTableColumn prop="name" label="项目名称" min-width="170" />
      <ElTableColumn prop="model" label="型号" width="100" />
      <ElTableColumn prop="unit" label="单位" width="70" />
      <ElTableColumn prop="unitPriceDecimal" label="含税单价" width="120" />
      <ElTableColumn label="当前库存" width="100">
        <template #default="{ row }">
          <ElTag :type="stockTagType(row.stockBalance)" size="small">{{ row.stockBalance }}</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="数量" width="140">
        <template #default="{ row }">
          <ElInputNumber
            v-model="row.quantity"
            :min="1"
            :step="1"
            :precision="0"
            size="small"
            @change="handleQuantityChange(row)"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn label="开票金额（元）" width="180">
        <template #default="{ row }">
          <ElInput
            v-model="row.amountYuan"
            inputmode="decimal"
            class="amount-input"
            @blur="normalizeLineAmount(row)"
            @change="$emit('change')"
          >
            <template #prefix>¥</template>
          </ElInput>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="80" fixed="right">
        <template #default="{ $index }">
          <ElButton link type="danger" size="small" @click="$emit('remove', $index)">移除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <!-- 汇总栏 -->
    <div class="summary-bar">
      <span>行数：{{ lines.length }}</span>
      <span>数量合计：{{ totalQuantity }}</span>
      <span class="total">金额：{{ centToDisplay(totalAmountCent) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import {
  calcOutboundAmountCent,
  centToDisplay,
  centToYuan,
  roundCentToWholeYuan,
  yuanToCent,
} from '@shared/money';

/** 销项开票明细行 */
interface OutboundLine {
  priceVersionId: string;
  name: string;
  model: string;
  unit: string;
  unitPriceDecimal: string;
  stockBalance: number;
  quantity: number;
  amountYuan: string;
}

const props = defineProps<{ lines: OutboundLine[]; factor: string }>();
const emit = defineEmits<{ change: []; remove: [index: number] }>();

/** 读取用户输入的单行最终金额，非法输入按 0 参与临时汇总。 */
function lineAmount(row: OutboundLine): number {
  try {
    return yuanToCent(row.amountYuan);
  } catch {
    return 0;
  }
}

const totalQuantity = computed(() => props.lines.reduce((sum, l) => sum + l.quantity, 0));
const totalAmountCent = computed(() => props.lines.reduce((sum, l) => sum + lineAmount(l), 0));
const fractionalLineCount = computed(
  () => props.lines.filter((line) => lineAmount(line) % 100 !== 0).length,
);

/** 数量变化后按当前金额系数重新生成该行金额。 */
function handleQuantityChange(row: OutboundLine): void {
  row.amountYuan = centToYuan(calcOutboundAmountCent(row.quantity, row.unitPriceDecimal, props.factor));
  emit('change');
}

/** 失焦时校验并规范化金额为两位小数。 */
function normalizeLineAmount(row: OutboundLine): void {
  try {
    const amountCent = yuanToCent(row.amountYuan);
    if (amountCent <= 0) throw new Error('金额必须大于 0');
    row.amountYuan = centToYuan(amountCent);
  } catch {
    row.amountYuan = centToYuan(calcOutboundAmountCent(row.quantity, row.unitPriceDecimal, props.factor));
    ElMessage.warning(`“${row.name}”金额无效，已恢复为自动计算金额`);
  }
  emit('change');
}

/** 将当前弹窗内所有带角分的行金额四舍五入到整数元。 */
function roundAllFractionalAmounts(): void {
  let roundedCount = 0;
  for (const line of props.lines) {
    const amountCent = lineAmount(line);
    if (amountCent % 100 === 0) continue;
    line.amountYuan = centToYuan(roundCentToWholeYuan(amountCent));
    roundedCount += 1;
  }
  emit('change');
  ElMessage.success(`已四舍五入 ${roundedCount} 行金额`);
}

function stockTagType(balance: number): string {
  if (balance > 0) return 'success';
  if (balance < 0) return 'danger';
  return 'info';
}
</script>

<style scoped>
.line-table-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}

.line-table-tools strong {
  margin-right: 10px;
  font-size: 15px;
}

.line-table-tools span {
  color: var(--text-secondary);
  font-size: 12px;
}

.amount-input :deep(.el-input__inner) {
  text-align: right;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.summary-bar {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: var(--app-bg);
  border-radius: 4px;
  font-size: 14px;
  margin-top: 12px;
}

.summary-bar .total {
  font-weight: 600;
  color: var(--el-color-primary);
}
</style>
