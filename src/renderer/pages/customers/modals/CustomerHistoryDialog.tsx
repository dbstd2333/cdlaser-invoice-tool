import { useEffect, useState } from 'react';
import { Drawer, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Customer, FieldHistoryEntry } from '@shared/contracts/types';
import { api } from '@renderer/api';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}

export function CustomerHistoryDialog({
  open,
  customer,
  onClose,
}: {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<FieldHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && customer) {
      setLoading(true);
      api.customers
        .history(customer.id)
        .then((res) => setRows((res as { rows: FieldHistoryEntry[] }).rows))
        .finally(() => setLoading(false));
    } else {
      setRows([]);
    }
  }, [open, customer]);

  const columns: ColumnsType<FieldHistoryEntry> = [
    { title: '字段', dataIndex: 'field', width: 120 },
    { title: '原值', dataIndex: 'oldValue', ellipsis: true },
    { title: '新值', dataIndex: 'newValue', ellipsis: true },
    { title: '操作人', dataIndex: 'operator', width: 120 },
    {
      title: '时间',
      dataIndex: 'timestamp',
      width: 170,
      render: (v: string) => formatTime(v),
    },
    {
      title: '类型',
      dataIndex: 'changeType',
      width: 90,
      render: (v: string) => <Tag>{v}</Tag>,
    },
  ];

  return (
    <Drawer title="变更历史" width={720} open={open} onClose={onClose}>
      <Table<FieldHistoryEntry>
        rowKey="id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 20 }}
      />
    </Drawer>
  );
}
