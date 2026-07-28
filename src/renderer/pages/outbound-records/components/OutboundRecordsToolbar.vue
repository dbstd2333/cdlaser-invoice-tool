<template>
  <div class="outbound-toolbar">
    <!-- 筛选行 -->
    <div class="toolbar-filters">
      <ElInput v-model="localBatchNo" placeholder="批次号" clearable style="width: 160px" @update:model-value="$emit('update:batchNo', $event)" />
      <ElInput v-model="localCustomerName" placeholder="客户名称" clearable style="width: 150px" @update:model-value="$emit('update:customerName', $event)" />
      <ElInput v-model="localProductKeyword" placeholder="商品名称/型号" clearable style="width: 150px" @update:model-value="$emit('update:productKeyword', $event)" />
      <ElDatePicker
        :model-value="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        style="width: 240px"
        @update:model-value="handleDateChange"
      />
      <ElSelect :model-value="status" placeholder="状态" style="width: 100px" @update:model-value="$emit('update:status', $event)">
        <ElOption label="全部" value="all" />
        <ElOption label="有效" value="valid" />
        <ElOption label="已作废" value="voided" />
      </ElSelect>
      <ElButton type="primary" @click="$emit('search')">搜索</ElButton>
      <ElButton @click="$emit('reset')">重置</ElButton>
      <ElButton style="margin-left: auto" @click="$emit('refresh')">刷新</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  batchNo: string;
  customerName: string;
  productKeyword: string;
  dateFrom: string;
  dateTo: string;
  status: string;
}>();

const emit = defineEmits<{
  'update:batchNo': [val: string];
  'update:customerName': [val: string];
  'update:productKeyword': [val: string];
  'update:dateFrom': [val: string];
  'update:dateTo': [val: string];
  'update:status': [val: string];
  search: [];
  reset: [];
  refresh: [];
}>();

const localBatchNo = ref(props.batchNo);
const localCustomerName = ref(props.customerName);
const localProductKeyword = ref(props.productKeyword);

const dateRange = computed(() => {
  if (props.dateFrom && props.dateTo) return [props.dateFrom, props.dateTo];
  return null;
});

function handleDateChange(val: [string, string] | null): void {
  if (val) {
    emit('update:dateFrom', val[0]);
    emit('update:dateTo', val[1]);
  } else {
    emit('update:dateFrom', '');
    emit('update:dateTo', '');
  }
}
</script>

<style scoped>
.outbound-toolbar {
  margin-bottom: 12px;
}

.toolbar-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
}
</style>
