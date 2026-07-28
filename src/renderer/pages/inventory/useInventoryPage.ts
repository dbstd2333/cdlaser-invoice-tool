import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from '../../api';
import { useAppStore } from '../../stores/app';
import { useSelectionStore } from '../../stores/selection';
import type { PriceVersionRow } from '@shared/contracts/types';

/**
 * InventoryPage 状态和逻辑 composable。
 * 从 .vue 中提取以控制文件行数。
 */
export function useInventoryPage() {
  const appStore = useAppStore();
  const selectionStore = useSelectionStore();
  const loading = ref(false);
  const rows = ref<PriceVersionRow[]>([]);
  const total = ref(0);
  const showSelected = ref(false);

  const query = reactive({
    keyword: '',
    stockStatus: 'all' as 'all' | 'positive' | 'zero' | 'negative',
    productStatus: 'all' as 'all' | 'active' | 'inactive',
    page: 1,
    pageSize: 50,
  });

  const modalType = ref<'none' | 'product-form' | 'history' | 'adjust' | 'outbound'>('none');
  const editingProductId = ref('');
  const historyPriceVersionId = ref('');
  const adjustPriceVersionId = ref('');
  const outboundLines = ref<PriceVersionRow[]>([]);

  const initialImportVisible = ref(false);
  const dailyImportVisible = ref(false);
  const replenishmentVisible = ref(false);
  const inboundVisible = ref(false);
  const importRecordsVisible = ref(false);

  onMounted(() => { loadData(); });
  onUnmounted(() => { selectionStore.clearSelection(); });

  async function loadData(): Promise<void> {
    loading.value = true;
    try {
      const result = await api.catalog.listPriceVersions(query);
      rows.value = result.rows; total.value = result.total;
    } catch (err) {
      ElMessage.error(`加载失败: ${(err as Error).message}`);
    } finally { loading.value = false; }
  }

  function handleSearch(): void { query.page = 1; loadData(); }
  function handleReset(): void { query.keyword = ''; query.stockStatus = 'all'; query.productStatus = 'all'; query.page = 1; loadData(); }
  function handlePageChange(page: number): void { query.page = page; loadData(); }
  function handleSizeChange(size: number): void { query.pageSize = size; query.page = 1; loadData(); }

  function handleSelectionChange(row: PriceVersionRow, selected: boolean): void {
    selectionStore.toggleSelection(row, selected);
  }

  function handleOutbound(): void {
    const selected = selectionStore.getSelected();
    if (selected.length === 0) { ElMessage.warning('请先勾选价格版本'); return; }
    outboundLines.value = selected; modalType.value = 'outbound';
  }

  function handleAddProduct(): void { editingProductId.value = ''; modalType.value = 'product-form'; }
  function handleEditProduct(row: PriceVersionRow): void { editingProductId.value = row.productId; modalType.value = 'product-form'; }
  function handleViewHistory(row: PriceVersionRow): void { historyPriceVersionId.value = row.priceVersionId; modalType.value = 'history'; }
  function handleAdjustStock(row: PriceVersionRow): void { adjustPriceVersionId.value = row.priceVersionId; modalType.value = 'adjust'; }

  function handleViewHistoryGlobal(): void {
    const selected = selectionStore.getSelected();
    if (selected.length > 0) { historyPriceVersionId.value = selected[0].priceVersionId; }
    else { ElMessage.info('请先勾选价格版本，或在行操作中点击"历史记录"'); return; }
    modalType.value = 'history';
  }

  async function handleToggleProductStatus(row: PriceVersionRow): Promise<void> {
    try {
      await ElMessageBox.confirm(`确认${row.productStatus === 'active' ? '停用' : '启用'}商品「${row.name}」？`, '确认操作', { type: 'warning' });
      await api.catalog.toggleProductStatus(row.productId); ElMessage.success('操作成功'); loadData();
    } catch (err) { if (err !== 'cancel') ElMessage.error(`操作失败: ${(err as Error).message}`); }
  }

  async function handleTogglePriceVersionStatus(row: PriceVersionRow): Promise<void> {
    try {
      await ElMessageBox.confirm('确认切换价格版本状态？', '确认操作', { type: 'warning' });
      await api.catalog.togglePriceVersionStatus(row.priceVersionId); ElMessage.success('操作成功'); loadData();
    } catch (err) { if (err !== 'cancel') ElMessage.error(`操作失败: ${(err as Error).message}`); }
  }

  function handleClearSelection(): void { selectionStore.clearSelection(); showSelected.value = false; }

  function handleImportSuccess(): void {
    initialImportVisible.value = false; dailyImportVisible.value = false;
    appStore.loadInitStatus(); loadData(); ElMessage.success('导入成功');
  }

  return {
    appStore, selectionStore, loading, rows, total, showSelected,
    query, modalType, editingProductId, historyPriceVersionId, adjustPriceVersionId, outboundLines,
    initialImportVisible, dailyImportVisible, replenishmentVisible, inboundVisible, importRecordsVisible,
    loadData, handleSearch, handleReset, handlePageChange, handleSizeChange,
    handleSelectionChange, handleOutbound, handleAddProduct, handleEditProduct,
    handleViewHistory, handleAdjustStock, handleViewHistoryGlobal,
    handleToggleProductStatus, handleTogglePriceVersionStatus, handleClearSelection, handleImportSuccess,
    handleInitialImport: () => { initialImportVisible.value = true; },
    handleDailyImport: () => { dailyImportVisible.value = true; },
    handleMonthEndExport: () => { replenishmentVisible.value = true; },
    handleMonthBeginningImport: () => { inboundVisible.value = true; },
    handleImportRecords: () => { importRecordsVisible.value = true; },
  };
}
