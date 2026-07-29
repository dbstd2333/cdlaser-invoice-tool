<template>
  <div class="content-card">
    <InventoryToolbar
      v-model:name="query.name"
      v-model:model="query.model"
      v-model:stock-status="query.stockStatus"
      @search="handleSearch"
      @reset="handleReset"
      @refresh="loadData"
      @outbound="handleOutbound"
      @add-product="handleAddProduct"
      @initial-import="handleInitialImport"
      @daily-import="handleDailyImport"
      @month-end-export="handleMonthEndExport"
      @month-beginning-import="handleMonthBeginningImport"
      @import-records="handleImportRecords"
      @view-history="handleViewHistoryGlobal"
    />
    <div class="selection-bar">
      <div class="selection-metric">
        <span class="metric-label">已选</span>
        <strong>{{ selectionStore.selectedCount() }}</strong>
        <span>项</span>
      </div>
      <div class="selection-metric">
        <span class="metric-label">已选总金额</span>
        <strong>¥{{ centToDisplay(selectionStore.selectedAmountCent()) }}</strong>
      </div>
      <div class="selection-metric profit">
        <span class="metric-label">加利润总金额（×1.09）</span>
        <strong>¥{{ centToDisplay(selectionStore.selectedProfitAmountCent()) }}</strong>
      </div>
      <ElButton link type="danger" size="small" :disabled="selectionStore.selectedCount() === 0" @click="handleClearSelection">
        清空
      </ElButton>
    </div>
    <InventoryTable
      :rows="rows"
      :loading="loading"
      :page="query.page"
      :page-size="query.pageSize"
      :total="total"
      @view-history="handleViewHistory"
      @edit-product="handleEditProduct"
      @adjust-stock="handleAdjustStock"
      @delete-product="handleDeleteProduct"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @quantity-change="handleQuantityChange"
    />
    <InventoryModalHost
      v-model:modal-type="modalType"
      :editing-product-id="editingProductId"
      :history-price-version-id="historyPriceVersionId"
      :adjust-price-version-id="adjustPriceVersionId"
      :outbound-lines="outboundLines"
      @saved="loadData"
    />
    <CatalogInitialImportDialog
      v-model:visible="initialImportVisible"
      @success="handleImportSuccess"
    />
    <CatalogDailyImportDialog
      v-model:visible="dailyImportVisible"
      @success="handleImportSuccess"
    />
    <ReplenishmentExportDialog
      v-model:visible="replenishmentVisible"
      @success="loadData"
    />
    <InboundImportDialog
      v-model:visible="inboundVisible"
      @success="loadData"
    />
    <ImportRecordsDialog
      v-model:visible="importRecordsVisible"
    />
  </div>
</template>

<script setup lang="ts">
import InventoryToolbar from './components/InventoryToolbar.vue';
import InventoryTable from './components/InventoryTable.vue';
import InventoryModalHost from './modals/InventoryModalHost.vue';
import CatalogInitialImportDialog from './modals/CatalogInitialImportDialog.vue';
import CatalogDailyImportDialog from './modals/CatalogDailyImportDialog.vue';
import ReplenishmentExportDialog from './modals/ReplenishmentExportDialog.vue';
import InboundImportDialog from './modals/InboundImportDialog.vue';
import ImportRecordsDialog from './modals/ImportRecordsDialog.vue';
import { useInventoryPage } from './useInventoryPage';
import { centToDisplay } from '@shared/money';

const {
  selectionStore, loading, rows, total,
  query, modalType, editingProductId, historyPriceVersionId, adjustPriceVersionId, outboundLines,
  initialImportVisible, dailyImportVisible, replenishmentVisible, inboundVisible, importRecordsVisible,
  loadData, handleSearch, handleReset, handlePageChange, handleSizeChange,
  handleQuantityChange, handleOutbound, handleAddProduct, handleEditProduct,
  handleViewHistory, handleAdjustStock, handleViewHistoryGlobal,
  handleDeleteProduct, handleClearSelection, handleImportSuccess,
  handleInitialImport, handleDailyImport, handleMonthEndExport, handleMonthBeginningImport, handleImportRecords,
} = useInventoryPage();
</script>

<style scoped>
.selection-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 50px;
  margin: 0 0 10px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-regular);
  background: #f7f9fc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid var(--el-color-primary);
  border-radius: 6px;
}

.selection-metric {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 4px 12px;
  border-right: 1px solid #dfe5ec;
}

.selection-metric strong {
  color: #17233d;
  font-size: 17px;
  font-variant-numeric: tabular-nums;
}

.selection-metric.profit strong {
  color: #b45309;
}

.metric-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.selection-bar .el-button {
  margin-left: auto;
}
</style>
