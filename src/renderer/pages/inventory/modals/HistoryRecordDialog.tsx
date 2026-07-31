import { useEffect, useState } from 'react';
import { Drawer, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type {
  FieldHistoryEntry,
  InventoryLedger,
} from '@shared/contracts/types';
import { api } from '@renderer/api';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}

const SOURCE_LABEL: Record<string, string> = {
  initialization: '初始化',
  outbound: '销项开票',
  outbound_void: '销项作废',
  inbound: '月初进项',
  inbound_void: '进项作废',
  adjustment: '库存调整',
};

export function HistoryRecordDialog({
  open,
  product,
  onClose,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState('ledger');
  const [ledger, setLedger] = useState<InventoryLedger[]>([]);
  const [history, setHistory] = useState<FieldHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product) {
      setLoading(true);
      Promise.all([
        api.inventory.ledger({ productId: product.id, page: 1, pageSize: 50 }),
        api.catalog.fieldHistory({ entityType: 'product', entityId: product.id, page: 1, pageSize: 50 }),
      ])
        .then(([l, h]) => {
          setLedger((l as { rows: InventoryLedger[] }).rows);
          setHistory((h as { rows: FieldHistoryEntry[] }).rows);
        })
        .finally(() => setLoading(false));
    } else {
      setLedger([]);
      setHistory([]);
    }
  }, [open, product]);

  const ledgerColumns: ColumnsType<InventoryLedger> = [
    { title: '时间', dataIndex: 'createdAt', width: 170, render: (v: string) => formatTime(v) },
    { title: '来源', dataIndex: 'sourceType', width: 110, render: (v: string) => SOURCE_LABEL[v] ?? v },
    {
      title: '变更量',
      dataIndex: 'changeQuantity',
      width: 90,
      align: 'right',
      render: (v: number) => <span className={v > 0 ? 'text-green-600' : 'text-red-600'}>{v > 0 ? `+${v}` : v}</span>,
    },
    { title: '变更前', dataIndex: 'balanceBefore', width: 90, align: 'right' },
    { title: '变更后', dataIndex: 'balanceAfter', width: 90, align: 'right' },
    { title: '原因', dataIndex: 'reason', ellipsis: true, render: (v: string | null) => v ?? '—' },
  ];

  const historyColumns: ColumnsType<FieldHistoryEntry> = [
    { title: '时间', dataIndex: 'createdAt', width: 170, render: (v: string) => formatTime(v) },
    { title: '动作', dataIndex: 'action', width: 120 },
    { title: '字段', dataIndex: 'fieldPath', width: 140, ellipsis: true },
    { title: '原值', dataIndex: 'oldValue', ellipsis: true, render: (v: string | null) => v ?? '—' },
    { title: '新值', dataIndex: 'newValue', ellipsis: true, render: (v: string | null) => v ?? '—' },
    { title: '操作人', dataIndex: 'operator', width: 120 },
  ];

  return (
    <Drawer title={`历史记录 · ${product?.name ?? ''}`} width={760} open={open} onClose={onClose}>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: 'ledger',
            label: `库存流水 (${ledger.length})`,
            children: (
              <Table<InventoryLedger>
                rowKey="id"
                size="small"
                loading={loading}
                columns={ledgerColumns}
                dataSource={ledger}
                pagination={false}
              />
            ),
          },
          {
            key: 'history',
            label: `变更历史 (${history.length})`,
            children: (
              <Table<FieldHistoryEntry>
                rowKey="id"
                size="small"
                loading={loading}
                columns={historyColumns}
                dataSource={history}
                pagination={false}
              />
            ),
          },
        ]}
      />
    </Drawer>
  );
}
