import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '@shared/contracts/types';
import { SharedTable } from '@renderer/components/SharedTable';

export function ProductTable({
  rows,
  loading,
  page,
  pageSize,
  total,
  onEdit,
  onDelete,
  onPageChange,
  onSizeChange,
}: {
  rows: Product[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onEdit: (row: Product) => void;
  onDelete: (row: Product) => void;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}) {
  const columns: ColumnsType<Product> = [
    { title: '名称', dataIndex: 'name', width: 160 },
    { title: '型号', dataIndex: 'model', width: 120 },
    { title: '税收分类编码', dataIndex: 'taxClassificationCode', width: 160 },
    { title: '税率', dataIndex: 'taxRate', width: 90, render: (v: number) => `${v}%` },
    { title: '单位', dataIndex: 'unit', width: 80 },
    {
      title: '含税单价(元)',
      dataIndex: 'unitPriceDecimal',
      width: 120,
      render: (v: string) => `¥${v}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: string) => (
        <Tag color={v === 'active' ? 'success' : 'default'}>
          {v === 'active' ? '在售' : '停售'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 220,
      render: (_, row) => (
        <span className="flex gap-2">
          <a onClick={() => onEdit(row)}>编辑</a>
          <a onClick={() => onDelete(row)}>删除</a>
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
    />
  );
}
