import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PriceVersionRow } from '@shared/contracts/types';
import { calcOutboundAmountCent, scaleAmountCent } from '@shared/money';

/** 主表传入销项开票弹窗的选品行。 */
export interface SelectedPriceVersion {
  row: PriceVersionRow;
  quantity: number;
}

/**
 * 页面二跨分页选择 Store。
 * 以 priceVersionId 为键保存跨页选择；翻页、改变每页数量和改变筛选条件只更新当前页数据，不清空 Store。
 * 离开 /inventory 或开票成功后清空，取消开票 Dialog 时保留。
 */
export const useSelectionStore = defineStore('selection', () => {
  const selectedPriceVersions = ref<Map<string, PriceVersionRow>>(new Map());
  const selectedQuantities = ref<Map<string, number>>(new Map());

  /** 获取已选数量 */
  function selectedCount(): number {
    return selectedPriceVersions.value.size;
  }

  /** 切换勾选 */
  function toggleSelection(row: PriceVersionRow, selected: boolean): void {
    if (selected) {
      selectedPriceVersions.value.set(row.priceVersionId, row);
      selectedQuantities.value.set(row.priceVersionId, selectedQuantities.value.get(row.priceVersionId) ?? 1);
    } else {
      selectedPriceVersions.value.delete(row.priceVersionId);
      selectedQuantities.value.delete(row.priceVersionId);
    }
    selectedPriceVersions.value = new Map(selectedPriceVersions.value);
    selectedQuantities.value = new Map(selectedQuantities.value);
  }

  /** 批量设置勾选 */
  function setSelection(rows: PriceVersionRow[], selected: boolean): void {
    if (selected) {
      for (const row of rows) {
        selectedPriceVersions.value.set(row.priceVersionId, row);
        selectedQuantities.value.set(row.priceVersionId, selectedQuantities.value.get(row.priceVersionId) ?? 1);
      }
    } else {
      for (const row of rows) {
        selectedPriceVersions.value.delete(row.priceVersionId);
        selectedQuantities.value.delete(row.priceVersionId);
      }
    }
    selectedPriceVersions.value = new Map(selectedPriceVersions.value);
    selectedQuantities.value = new Map(selectedQuantities.value);
  }

  /** 设置选品数量；0 表示从开票选择中移除。 */
  function setQuantity(row: PriceVersionRow, quantity: number): void {
    const normalized = Math.max(0, Math.trunc(quantity));
    if (normalized === 0) {
      selectedPriceVersions.value.delete(row.priceVersionId);
      selectedQuantities.value.delete(row.priceVersionId);
    } else {
      selectedPriceVersions.value.set(row.priceVersionId, row);
      selectedQuantities.value.set(row.priceVersionId, normalized);
    }
    selectedPriceVersions.value = new Map(selectedPriceVersions.value);
    selectedQuantities.value = new Map(selectedQuantities.value);
  }

  /** 获取指定价格版本的开票数量。 */
  function getQuantity(priceVersionId: string): number {
    return selectedQuantities.value.get(priceVersionId) ?? 0;
  }

  /** 检查是否已选 */
  function isSelected(priceVersionId: string): boolean {
    return selectedPriceVersions.value.has(priceVersionId);
  }

  /** 获取全部已选 */
  function getSelected(): PriceVersionRow[] {
    return Array.from(selectedPriceVersions.value.values());
  }

  /** 获取带数量的全部已选行。 */
  function getSelectedEntries(): SelectedPriceVersion[] {
    return getSelected().map((row) => ({
      row,
      quantity: getQuantity(row.priceVersionId),
    }));
  }

  /** 获取未加利润的已选商品总金额（分）。 */
  function selectedAmountCent(): number {
    return getSelectedEntries().reduce(
      (sum, item) => sum + calcOutboundAmountCent(item.quantity, item.row.unitPriceDecimal, '1'),
      0,
    );
  }

  /** 获取已选总金额乘 1.09 后的加利润金额（分）。 */
  function selectedProfitAmountCent(): number {
    return scaleAmountCent(selectedAmountCent(), '1.09');
  }

  /** 获取全部已选 ID */
  function getSelectedIds(): string[] {
    return Array.from(selectedPriceVersions.value.keys());
  }

  /** 从已选中移除失效项 */
  function removeInvalid(ids: string[]): void {
    for (const id of ids) {
      selectedPriceVersions.value.delete(id);
      selectedQuantities.value.delete(id);
    }
    selectedPriceVersions.value = new Map(selectedPriceVersions.value);
    selectedQuantities.value = new Map(selectedQuantities.value);
  }

  /** 清空已选 */
  function clearSelection(): void {
    selectedPriceVersions.value = new Map();
    selectedQuantities.value = new Map();
  }

  return {
    selectedPriceVersions,
    selectedQuantities,
    selectedCount,
    toggleSelection,
    setSelection,
    setQuantity,
    getQuantity,
    isSelected,
    getSelected,
    getSelectedEntries,
    selectedAmountCent,
    selectedProfitAmountCent,
    getSelectedIds,
    removeInvalid,
    clearSelection,
  };
});
