import { useCallback, useEffect, useState } from 'react';
import { App } from 'antd';
import type { Product } from '@shared/contracts/types';
import type { StockSummary } from '@shared/schemas/index';
import { yuanToCent } from '@shared/money';
import { api } from '@renderer/api';
import { InventoryToolbar } from './components/InventoryToolbar';
import { InventoryTable } from './components/InventoryTable';
import { InventorySummaryBar } from './components/InventorySummaryBar';
import { InventoryModalHost, type InventoryDialogType } from './modals/InventoryModalHost';
import { useSelectionStore } from '@renderer/stores/selection';

export function InventoryPage() {
  const { message, modal } = App.useApp();
  const setQuantity = useSelectionStore((s) => s.setQuantity);
  const selections = useSelectionStore((s) => s.selections);
  const quantities = useSelectionStore((s) => s.quantities);

  const [dialog, setDialog] = useState<InventoryDialogType>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // 商品列表状态
  const [products, setProducts] = useState<Product[]>([]);
  const [pLoading, setPLoading] = useState(false);
  const [pPage, setPPage] = useState(1);
  const [pPageSize, setPPageSize] = useState(20);
  const [pTotal, setPTotal] = useState(0);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [stockStatus, setStockStatus] = useState('all');

  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);

  const loadStockSummary = useCallback(async () => {
    try {
      const res = await api.catalog.stockSummary();
      setStockSummary(res);
    } catch {
      setStockSummary(null);
    }
  }, []);

  useEffect(() => {
    void loadStockSummary();
  }, [loadStockSummary]);

  const selectedAmountCent = selections.reduce((sum, sel) => {
    const qty = quantities[sel.key] ?? 0;
    if (qty <= 0) return sum;
    const unitPriceDecimal = String((sel.meta as Record<string, unknown>).unitPriceDecimal ?? '0');
    try {
      return sum + qty * yuanToCent(unitPriceDecimal);
    } catch {
      return sum;
    }
  }, 0);

  const loadProducts = useCallback(async () => {
    setPLoading(true);
    try {
      const res = (await api.catalog.listProducts({
        name: name || undefined,
        model: model || undefined,
        stockStatus: stockStatus === 'all' ? undefined : stockStatus,
        page: pPage,
        pageSize: pPageSize,
      })) as { rows: Product[]; total: number };
      setProducts(res.rows);
      setPTotal(res.total);
    } finally {
      setPLoading(false);
    }
  }, [name, model, stockStatus, pPage, pPageSize]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const openDialog = (t: InventoryDialogType, product: Product | null = null) => {
    setActiveProduct(product);
    setDialog(t);
  };

  const handleQuantityChange = (row: Product, qty: number) => {
    setQuantity(row.id, qty, {
      name: row.name,
      model: row.model,
      unit: row.unit,
      unitPriceDecimal: row.unitPriceDecimal,
    });
  };

  const handleDeleteProduct = (row: Product) => {
    modal.confirm({
      title: '确认删除',
      content: `确定要删除商品「${row.name}」吗？`,
      okType: 'danger',
      onOk: async () => {
        await api.catalog.deleteProduct(row.id);
        message.success('已删除');
        void loadProducts();
      },
    });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="!text-lg !font-semibold text-gray-800 mb-3">库存与开票</div>
      <InventoryToolbar
        name={name}
        model={model}
        stockStatus={stockStatus}
        onNameChange={setName}
        onModelChange={setModel}
        onStockStatusChange={(v) => {
          setStockStatus(v);
          setPPage(1);
        }}
        onSearch={() => setPPage(1)}
        onReset={() => {
          setName('');
          setModel('');
          setStockStatus('all');
          setPPage(1);
        }}
        onRefresh={() => void loadProducts()}
        onAddProduct={() => openDialog('addProduct')}
        onDailyImport={() => openDialog('dailyImport')}
        onOutbound={() => openDialog('outboundExport')}
        onMonthEndExport={() => openDialog('replenishmentExport')}
        onMonthBeginningImport={() => openDialog('inboundImport')}
        onInitialImport={() => openDialog('initialImport')}
      />
      <div className="!mt-3 !flex-1 !min-h-0">
      <InventoryTable
        rows={products}
        loading={pLoading}
        page={pPage}
        pageSize={pPageSize}
        total={pTotal}
        onViewHistory={(row) => openDialog('history', row)}
        onEditProduct={(row) => openDialog('editProduct', row)}
        onDeleteProduct={handleDeleteProduct}
        onPageChange={setPPage}
        onSizeChange={(s) => {
          setPPageSize(s);
          setPPage(1);
        }}
        onQuantityChange={handleQuantityChange}
        toolbar={<InventorySummaryBar selectedAmountCent={selectedAmountCent} stockSummary={stockSummary} />}
      />
      </div>
      <InventoryModalHost
        type={dialog}
        product={activeProduct}
        onChange={setDialog}
        onSaved={() => {
          void loadProducts();
          void loadStockSummary();
        }}
      />
    </div>
  );
}
