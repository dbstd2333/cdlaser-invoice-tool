import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PriceVersionRow } from '@shared/contracts/types';

/**
 * 页面二跨分页选择 Store。
 * 以 priceVersionId 为键保存跨页选择；翻页、改变每页数量和改变筛选条件只更新当前页数据，不清空 Store。
 * 离开 /inventory 或开票成功后清空，取消开票 Dialog 时保留。
 */
export const useSelectionStore = defineStore('selection', () => {
  const selectedPriceVersions = ref<Map<string, PriceVersionRow>>(new Map());

  /** 获取已选数量 */
  function selectedCount(): number {
    return selectedPriceVersions.value.size;
  }

  /** 切换勾选 */
  function toggleSelection(row: PriceVersionRow, selected: boolean): void {
    if (selected) {
      selectedPriceVersions.value.set(row.priceVersionId, row);
    } else {
      selectedPriceVersions.value.delete(row.priceVersionId);
    }
    // 触发响应式
    selectedPriceVersions.value = new Map(selectedPriceVersions.value);
  }

  /** 批量设置勾选 */
  function setSelection(rows: PriceVersionRow[], selected: boolean): void {
    if (selected) {
      for (const row of rows) {
        selectedPriceVersions.value.set(row.priceVersionId, row);
      }
    } else {
      for (const row of rows) {
        selectedPriceVersions.value.delete(row.priceVersionId);
      }
    }
    selectedPriceVersions.value = new Map(selectedPriceVersions.value);
  }

  /** 检查是否已选 */
  function isSelected(priceVersionId: string): boolean {
    return selectedPriceVersions.value.has(priceVersionId);
  }

  /** 获取全部已选 */
  function getSelected(): PriceVersionRow[] {
    return Array.from(selectedPriceVersions.value.values());
  }

  /** 获取全部已选 ID */
  function getSelectedIds(): string[] {
    return Array.from(selectedPriceVersions.value.keys());
  }

  /** 从已选中移除失效项 */
  function removeInvalid(ids: string[]): void {
    for (const id of ids) {
      selectedPriceVersions.value.delete(id);
    }
    selectedPriceVersions.value = new Map(selectedPriceVersions.value);
  }

  /** 清空已选 */
  function clearSelection(): void {
    selectedPriceVersions.value = new Map();
  }

  return {
    selectedPriceVersions,
    selectedCount,
    toggleSelection,
    setSelection,
    isSelected,
    getSelected,
    getSelectedIds,
    removeInvalid,
    clearSelection,
  };
});
