import { InputNumber, Tag, Typography } from 'antd';
import type { ReactNode } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '@shared/contracts/types';
import { getStockStatusText } from '@shared/contracts/types';
import { calcOutboundAmountCent } from '@shared/money';
import { useSelectionStore } from '@renderer/stores/selection';
import { SharedTable } from '@renderer/components/SharedTable';
import { centToDisplay } from '@renderer/money';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}

export function InventoryTable({
  rows,
  loading,
  page,
  pageSize,
  total,
  onViewHistory,
  onEditProduct,
  onDeleteProduct,
  onPageChange,
  onSizeChange,
  onQuantityChange,
  toolbar,
}: {
  rows: Product[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onViewHistory: (row: Product) => void;
  onEditProduct: (row: Product) => void;
  onDeleteProduct: (row: Product) => void;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onQuantityChange: (row: Product, qty: number) => void;
  toolbar?: ReactNode;
}) {
  const selectionStore = useSelectionStore();

  const columns: ColumnsType<Product> = [
    {
      title: '开票数量',
      width: 128,
      fixed: 'left',
      align: 'center',
      render: (_, row) => (
        <InputNumber
          value={selectionStore.getQuantity(row.id)}
          min={0}
          step={1}
          precision={0}
          size="small"
          className="!w-[104px]"
          onChange={(v) => onQuantityChange(row, v ?? 0)}
        />
      ),
    },
    { title: '商品 / 项目名称', dataIndex: 'name', width: 180, ellipsis: true },
    { title: '规格型号', dataIndex: 'model', minWidth: 140, ellipsis: true },
    { title: '单位', dataIndex: 'unit', width: 80 },
    {
      title: '含税单价（元）',
      dataIndex: 'unitPriceDecimal',
      width: 140,
      align: 'right',
      render: (v: number) => `¥${v}`,
    },
    {
      title: '本行已选金额',
      width: 150,
      align: 'right',
      render: (_, row) => {
        const qty = selectionStore.getQuantity(row.id);
        if (qty > 0) {
          return <strong className="text-brand">¥{centToDisplay(calcOutboundAmountCent(qty, row.unitPriceDecimal, '1'))}</strong>;
        }
        return <span className="text-muted">—</span>;
      },
    },
    {
      title: '当前库存',
      width: 120,
      render: (_, row) => (
        <Tag color={row.stockBalance > 0 ? 'success' : row.stockBalance < 0 ? 'error' : 'default'}>
          {getStockStatusText(row.stockBalance)}
        </Tag>
      ),
    },
    { title: '最近变更', dataIndex: 'updatedAt', width: 160, render: (v: string) => formatTime(v) },
    {
      title: '商品操作',
      width: 190,
      fixed: 'right',
      render: (_, row) => (
        <span className="flex gap-2">
          <Typography.Link type="secondary" onClick={() => onViewHistory(row)}>
            历史记录
          </Typography.Link>
          <a onClick={() => onEditProduct(row)}>编辑</a>
          <Typography.Link type="danger" onClick={() => onDeleteProduct(row)}>
            删除
          </Typography.Link>
        </span>
      ),
    },
  ];

  return (
    <SharedTable<Product>
      rowKey="id"
      columns={columns}
      dataSource={rows}
      loading={loading}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      toolbar={toolbar}
    />
  );
}
