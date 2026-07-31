import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Customer } from '@shared/contracts/types';
import { SharedTable } from '@renderer/components/SharedTable';

export function CustomersTable({
  rows,
  loading,
  page,
  pageSize,
  total,
  onViewDetail,
  onEdit,
  onToggle,
  onViewHistory,
  onPageChange,
  onSizeChange,
}: {
  rows: Customer[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onViewDetail: (row: Customer) => void;
  onEdit: (row: Customer) => void;
  onToggle: (row: Customer) => void;
  onViewHistory: (row: Customer) => void;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}) {
  const columns: ColumnsType<Customer> = [
    { title: '客户名称', dataIndex: 'name', width: 180 },
    { title: '客户编码', dataIndex: 'code', width: 120 },
    { title: '税号', dataIndex: 'taxNo', width: 160 },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '电话', dataIndex: 'phone', width: 140 },
    { title: '开户行', dataIndex: 'bank', width: 160 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: string) => (
        <Tag color={v === 'active' ? 'success' : 'default'}>
          {v === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, row) => (
        <span className="flex gap-2">
          <a onClick={() => onViewDetail(row)}>查看</a>
          <a onClick={() => onEdit(row)}>编辑</a>
          <a onClick={() => onToggle(row)}>{row.status === 'active' ? '停用' : '启用'}</a>
          <a onClick={() => onViewHistory(row)}>变更历史</a>
        </span>
      ),
    },
  ];

  return (
    <SharedTable<Customer>
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
