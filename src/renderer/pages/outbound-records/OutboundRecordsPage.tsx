import { useCallback, useEffect, useState } from 'react';
import { App, Card } from 'antd';
import type { OutboundBatch } from '@shared/contracts/types';
import { centToDisplay } from '@shared/money';
import { api } from '@renderer/api';
import { OutboundRecordsToolbar } from './components/OutboundRecordsToolbar';
import { OutboundRecordsTable } from './components/OutboundRecordsTable';
import { OutboundRecordDetailDialog } from './modals/OutboundRecordDetailDialog';

export function OutboundRecordsPage() {
  const { message, modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<OutboundBatch[]>([]);
  const [total, setTotal] = useState(0);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailBatchId, setDetailBatchId] = useState('');

  const [batchNo, setBatchNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [monthlyTaxCent, setMonthlyTaxCent] = useState(0);

  useEffect(() => {
    void api.outbound.monthlyTax().then((res) => setMonthlyTaxCent(res.taxCent)).catch(() => setMonthlyTaxCent(0));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = (await api.outbound.list({
        batchNo: batchNo || undefined,
        customerName: customerName || undefined,
        productKeyword: productKeyword || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        status: status === 'all' ? undefined : status,
        page,
        pageSize,
      })) as { rows: OutboundBatch[]; total: number };
      setRows(result.rows);
      setTotal(result.total);
    } catch (err) {
      message.error(`加载失败: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [batchNo, customerName, productKeyword, dateFrom, dateTo, status, page, pageSize, message]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleReset = () => {
    setBatchNo('');
    setCustomerName('');
    setProductKeyword('');
    setDateFrom('');
    setDateTo('');
    setStatus('all');
    setPage(1);
  };

  const handleDownload = async (row: OutboundBatch) => {
    try {
      const result = (await api.outbound.download(row.id)) as { saved: boolean };
      if (result.saved) message.success('文件已保存');
    } catch (err) {
      message.error(`下载失败: ${(err as Error).message}`);
    }
  };

  const handleVoid = (row: OutboundBatch) => {
    let reason = '';
    modal.confirm({
      title: '作废开票记录',
      content: (
        <input
          placeholder="请输入作废原因"
          onChange={(e) => (reason = e.target.value)}
          className="w-full p-1.5 mt-2"
        />
      ),
      okText: '确定作废',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        if (!reason.trim()) {
          message.warning('作废原因必填');
          return Promise.reject();
        }
        const confirmed = await new Promise<boolean>((resolve) => {
          modal.confirm({
            title: '最终确认',
            content: '作废后将恢复库存，且不可撤销。确认作废？',
            okText: '确认作废',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });
        if (!confirmed) return Promise.reject();
        await api.outbound.void(row.id, reason);
        message.success('作废成功');
        void loadData();
      },
    });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="!text-lg !font-semibold text-gray-800 mb-3">开票记录</div>
      <Card size="small" className="!mb-3 !shadow-none">
        <div>
          <div className="text-xs text-muted">本月税额总计</div>
          <div className="text-lg font-semibold text-green-600">¥{centToDisplay(monthlyTaxCent)}</div>
        </div>
      </Card>
      <OutboundRecordsToolbar
        batchNo={batchNo}
        customerName={customerName}
        productKeyword={productKeyword}
        dateFrom={dateFrom}
        dateTo={dateTo}
        status={status}
        onBatchNoChange={setBatchNo}
        onCustomerNameChange={setCustomerName}
        onProductKeywordChange={setProductKeyword}
        onDateChange={(from, to) => {
          setDateFrom(from);
          setDateTo(to);
        }}
        onStatusChange={setStatus}
        onSearch={() => setPage(1)}
        onReset={handleReset}
        onRefresh={() => void loadData()}
      />
      <OutboundRecordsTable
        rows={rows}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onViewDetail={(row) => {
          setDetailBatchId(row.id);
          setDetailVisible(true);
        }}
        onDownload={handleDownload}
        onVoid={handleVoid}
        onRowClick={(row) => {
          setDetailBatchId(row.id);
          setDetailVisible(true);
        }}
        onPageChange={setPage}
        onSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
      <OutboundRecordDetailDialog
        visible={detailVisible}
        batchId={detailBatchId}
        onVisibleChange={setDetailVisible}
      />
    </div>
  );
}
