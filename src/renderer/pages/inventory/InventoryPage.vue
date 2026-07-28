<template>
  <div class="content-card">
    <InventoryToolbar
      v-model:keyword="query.keyword"
      v-model:stock-status="query.stockStatus"
      v-model:product-status="query.productStatus"
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
      <span>已选 {{ selectionStore.selectedCount() }} 项</span>
      <ElButton link type="primary" size="small" @click="showSelected = true">查看已选</ElButton>
      <ElButton link type="danger" size="small" @click="handleClearSelection">清空已选</ElButton>
    </div>
    <InventoryTable
      :rows="rows"
      :loading="loading"
      :page="query.page"
      :page-size="query.pageSize"
      :total="total"
      @view-history="handleViewHistory"
      @edit-product="handleEditProduct"
      @toggle-product-status="handleToggleProductStatus"
      @toggle-price-version-status="handleTogglePriceVersionStatus"
      @adjust-stock="handleAdjustStock"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @selection-change="handleSelectionChange"
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

    <SelectedItemsDialog v-model="showSelected" @clear="handleClearSelection" />
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
import SelectedItemsDialog from './modals/SelectedItemsDialog.vue';
import { useInventoryPage } from './useInventoryPage';

const {
  selectionStore, loading, rows, total, showSelected,
  query, modalType, editingProductId, historyPriceVersionId, adjustPriceVersionId, outboundLines,
  initialImportVisible, dailyImportVisible, replenishmentVisible, inboundVisible, importRecordsVisible,
  loadData, handleSearch, handleReset, handlePageChange, handleSizeChange,
  handleSelectionChange, handleOutbound, handleAddProduct, handleEditProduct,
  handleViewHistory, handleAdjustStock, handleViewHistoryGlobal,
  handleToggleProductStatus, handleTogglePriceVersionStatus, handleClearSelection, handleImportSuccess,
  handleInitialImport, handleDailyImport, handleMonthEndExport, handleMonthBeginningImport, handleImportRecords,
} = useInventoryPage();
</script>

<style scoped>
.selection-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-regular);
}
</style>
