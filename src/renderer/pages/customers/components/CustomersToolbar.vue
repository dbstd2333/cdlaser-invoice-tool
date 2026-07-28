<template>
  <div class="customers-toolbar">
    <!-- 筛选行 -->
    <div class="toolbar-filters">
      <ElInput
        :model-value="keyword"
        placeholder="客户名称、简码、税号、电话、银行账号"
        clearable
        style="width: 300px"
        @update:model-value="$emit('update:keyword', $event)"
        @keyup.enter="$emit('search')"
      />
      <ElSelect :model-value="status" placeholder="客户状态" style="width: 120px" @update:model-value="$emit('update:status', $event)">
        <ElOption label="全部" value="all" />
        <ElOption label="启用" value="active" />
        <ElOption label="停用" value="inactive" />
      </ElSelect>
      <ElSelect :model-value="dataCompleteness" placeholder="资料完整度" style="width: 140px" @update:model-value="$emit('update:dataCompleteness', $event)">
        <ElOption label="全部" value="all" />
        <ElOption label="完整" value="complete" />
        <ElOption label="待补" value="incomplete" />
      </ElSelect>
      <ElButton type="primary" @click="$emit('search')">搜索</ElButton>
      <ElButton @click="$emit('reset')">重置</ElButton>
      <ElButton style="margin-left: auto" @click="$emit('refresh')">刷新</ElButton>
    </div>

    <!-- 操作按钮行 -->
    <div class="toolbar-actions">
      <ElButton type="success" @click="$emit('add')">
        <ElIcon><Plus /></ElIcon>新增客户
      </ElButton>
      <ElButton
        v-if="!appStore.customerImportDone"
        type="warning"
        @click="$emit('initial-import')"
      >
        <ElIcon><Upload /></ElIcon>客户首次导入
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../../stores/app';

defineProps<{
  keyword: string;
  status: string;
  dataCompleteness: string;
}>();

defineEmits<{
  'update:keyword': [val: string];
  'update:status': [val: string];
  'update:dataCompleteness': [val: string];
  search: [];
  reset: [];
  refresh: [];
  add: [];
  'initial-import': [];
}>();

const appStore = useAppStore();
</script>

<style scoped>
.customers-toolbar {
  margin-bottom: 12px;
}

.toolbar-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  padding: 12px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
}
</style>
