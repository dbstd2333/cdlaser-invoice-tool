import { useCallback, useEffect, useState } from 'react';
import { App } from 'antd';
import type { Customer } from '@shared/contracts/types';
import { api } from '@renderer/api';
import { CustomersToolbar } from './components/CustomersToolbar';
import { CustomersTable } from './components/CustomersTable';
import { CustomerModalHost, type CustomerDialogType } from './modals/CustomerModalHost';

export function CustomersPage() {
  const { message, modal } = App.useApp();
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogType, setDialogType] = useState<CustomerDialogType>(null);
  const [active, setActive] = useState<Customer | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.customers.list({
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        pageSize,
      })) as { rows: Customer[]; total: number };
      setRows(res.rows);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, pageSize]);

  useEffect(() => {
    void load();
  }, [load]);

  const openDialog = (t: CustomerDialogType, c: Customer | null) => {
    setActive(c);
    setDialogType(t);
  };

  const handleToggle = (c: Customer) => {
    modal.confirm({
      title: '确认操作',
      content: `确定要${c.status === 'active' ? '停用' : '启用'}该客户吗？`,
      onOk: async () => {
        await api.customers.toggleStatus(c.id);
        message.success('操作成功');
        void load();
      },
    });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="!text-lg !font-semibold text-gray-800 mb-3">客户管理</div>
      <CustomersToolbar
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
        onSearch={() => setPage(1)}
        onReset={() => {
          setSearch('');
          setStatusFilter('all');
          setPage(1);
        }}
        onRefresh={() => void load()}
        onAdd={() => openDialog('create', null)}
        onInitialImport={() => openDialog('initialImport', null)}
      />
      <CustomersTable
        rows={rows}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onViewDetail={(c) => openDialog('detail', c)}
        onEdit={(c) => openDialog('edit', c)}
        onToggle={handleToggle}
        onViewHistory={(c) => openDialog('history', c)}
        onPageChange={setPage}
        onSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
      <CustomerModalHost
        type={dialogType}
        customer={active}
        onChange={setDialogType}
        onRefresh={() => void load()}
      />
    </div>
  );
}
