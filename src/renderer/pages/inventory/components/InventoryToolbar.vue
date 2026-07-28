<template>
  <div class="inventory-toolbar">
    <!-- 筛选行 -->
    <div class="toolbar-filters">
      <ElInput
        :model-value="keyword"
        placeholder="项目名称、型号、税收分类编码"
        clearable
        style="width: 260px"
        @update:model-value="$emit('update:keyword', $event)"
        @keyup.enter="$emit('search')"
      />
      <ElSelect :model-value="stockStatus" placeholder="库存状态" style="width: 110px" @update:model-value="$emit('update:stockStatus', $event)">
        <ElOption label="全部" value="all" />
        <ElOption label="有余量" value="positive" />
        <ElOption label="已平衡" value="zero" />
        <ElOption label="待补票" value="negative" />
      </ElSelect>
      <ElSelect :model-value="productStatus" placeholder="启用状态" style="width: 110px" @update:model-value="$emit('update:productStatus', $event)">
        <ElOption label="全部" value="all" />
        <ElOption label="启用" value="active" />
        <ElOption label="停用" value="inactive" />
      </ElSelect>
      <ElButton type="primary" @click="$emit('search')">搜索</ElButton>
      <ElButton @click="$emit('reset')">重置</ElButton>
      <ElButton style="margin-left: auto" @click="$emit('refresh')">刷新</ElButton>
    </div>

    <!-- 操作按钮行 - 三列布局 -->
    <div class="toolbar-actions">
      <div class="action-col">
        <div class="action-col-title">商品管理</div>
        <div class="action-col-btns">
          <ElButton type="success" @click="$emit('add-product')">
            <ElIcon><Plus /></ElIcon>新增商品
          </ElButton>
          <ElButton @click="$emit('daily-import')">
            <ElIcon><Upload /></ElIcon>商品导入
          </ElButton>
        </div>
      </div>
      <div class="action-col">
        <div class="action-col-title">库存与开票</div>
        <div class="action-col-btns">
          <ElButton type="primary" @click="$emit('outbound')">
            <ElIcon><Ticket /></ElIcon>销项开票
          </ElButton>
          <ElButton type="warning" @click="$emit('month-end-export')">
            <ElIcon><Download /></ElIcon>月底导出
          </ElButton>
          <ElButton type="info" @click="$emit('month-beginning-import')">
            <ElIcon><Upload /></ElIcon>月初进项
          </ElButton>
        </div>
      </div>
      <div class="action-col">
        <div class="action-col-title">记录与工具</div>
        <div class="action-col-btns">
          <ElButton @click="$emit('import-records')">
            <ElIcon><List /></ElIcon>导入记录
          </ElButton>
          <ElButton @click="$emit('view-history')">
            <ElIcon><Notebook /></ElIcon>历史记录
          </ElButton>
          <ElButton
            v-if="!appStore.productImportDone"
            type="danger"
            @click="$emit('initial-import')"
          >
            <ElIcon><WarningFilled /></ElIcon>初始化导入
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../../stores/app';

defineProps<{
  keyword: string;
  stockStatus: string;
  productStatus: string;
}>();

defineEmits<{
  'update:keyword': [val: string];
  'update:stockStatus': [val: string];
  'update:productStatus': [val: string];
  search: [];
  reset: [];
  refresh: [];
  outbound: [];
  'add-product': [];
  'initial-import': [];
  'daily-import': [];
  'month-end-export': [];
  'month-beginning-import': [];
  'import-records': [];
  'view-history': [];
}>();

const appStore = useAppStore();
</script>

<style scoped>
.inventory-toolbar {
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
  gap: 16px;
  padding: 14px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
}

.action-col {
  flex: 1;
  min-width: 0;
}

.action-col-title {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.action-col-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
