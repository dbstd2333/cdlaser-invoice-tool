import { create } from 'zustand';

export interface SelectionState {
  key: string;
  label: string;
  count: number;
  meta: Record<string, unknown>;
  items: unknown[];
  valid: boolean;
}

interface SelectionStore {
  selections: SelectionState[];
  quantities: Record<string, number>;
  upsert: (sel: SelectionState) => void;
  remove: (key: string) => void;
  clear: () => void;
  getQuantity: (key: string) => number;
  setQuantity: (key: string, qty: number, meta?: Record<string, unknown>) => void;
  removeQuantity: (key: string) => void;
  clearByPrefix(prefix: string): void;
  /** 移除指定商品（开票草稿校验失效后清理已选）。 */
  removeInvalid(keys: string[]): void;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selections: [],
  quantities: {},

  upsert(sel) {
    set((state) => {
      const exists = state.selections.some((s) => s.key === sel.key);
      if (exists) {
        return {
          selections: state.selections.map((s) => (s.key === sel.key ? sel : s)),
        };
      }
      return { selections: [...state.selections, sel] };
    });
  },

  remove(key) {
    set((state) => ({
      selections: state.selections.filter((s) => s.key !== key),
    }));
  },

  clear() {
    set({ selections: [], quantities: {} });
  },

  getQuantity(key) {
    return get().quantities[key] ?? 0;
  },

  setQuantity(key, qty, meta = {}) {
    set((state) => ({
      quantities: { ...state.quantities, [key]: qty },
    }));
    if (qty > 0) {
      get().upsert({
        key,
        label: (meta.name as string) ?? key,
        count: qty,
        meta,
        items: [],
        valid: true,
      });
    } else {
      get().remove(key);
      get().removeQuantity(key);
    }
  },

  removeQuantity(key) {
    set((state) => {
      const next = { ...state.quantities };
      delete next[key];
      return { quantities: next };
    });
  },

  clearByPrefix(prefix) {
    set((state) => {
      const q = { ...state.quantities };
      const sels = state.selections.filter((s) => {
        if (s.key.startsWith(prefix)) {
          delete q[s.key];
          return false;
        }
        return true;
      });
      return { quantities: q, selections: sels };
    });
  },

  removeInvalid(keys) {
    if (!keys.length) return;
    const set2 = new Set(keys);
    set((state) => ({
      selections: state.selections.filter((s) => !set2.has(s.key)),
      quantities: Object.fromEntries(
        Object.entries(state.quantities).filter(([k]) => !set2.has(k)),
      ),
    }));
  },
}));
