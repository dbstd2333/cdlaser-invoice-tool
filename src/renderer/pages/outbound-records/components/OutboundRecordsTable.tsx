import type { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import type { OutboundBatch } from '@shared/contracts/types';
import { SharedTable } from '@renderer/components/SharedTable';
import { centToDisplay } from '@renderer/money';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}

export function OutboundRecordsTable({
  rows,
  loading,
  page,
  pageSize,
  total,
  onViewDetail,
  onDownload,
  onVoid,
  onRowClick,
  onPageChange,
  onSizeChange,
}: {
  rows: OutboundBatch[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onViewDetail: (row: OutboundBatch) => void;
  onDownload: (row: OutboundBatch) => void;
  onVoid: (row: OutboundBatch) => void;
  onRowClick: (row: OutboundBatch) => void;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}) {
  const columns: ColumnsType<OutboundBatch> = [
    { title: '开票批次号', dataIndex: 'batchNo', width: 220, ellipsis: true },
    {
      title: '客户名称',
      minWidth: 150,
      render: (_, row) => row.customerSnapshot?.name || '-',
    },
    {
      title: 'Excel 导出时间',
      dataIndex: 'exportedAt',
      width: 170,
      render: (v: string) => formatTime(v),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      render: (v: string) => (
        <Tag color={v === 'valid' ? 'success' : 'error'}>
          {v === 'valid' ? '有效' : '已作废'}
        </Tag>
      ),
    },
    { title: '明细行数', dataIndex: 'lineCount', width: 100, align: 'center' },
    { title: '数量合计', dataIndex: 'totalQuantity', width: 100, align: 'center' },
    { title: '金额', dataIndex: 'totalAmountCent', width: 120, render: (v: number) => centToDisplay(v) },
    { title: '税额', dataIndex: 'totalTaxCent', width: 120, render: (v: number) => centToDisplay(v) },
    { title: '价税合计', dataIndex: 'totalCent', width: 130, render: (v: number) => centToDisplay(v) },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, row) => (
        <span className="flex gap-2">
          <a onClick={(e) => { e.stopPropagation(); onViewDetail(row); }}>查看明细</a>
          <a onClick={(e) => { e.stopPropagation(); onDownload(row); }}>下载</a>
          {row.status === 'valid' && (
            <a onClick={(e) => { e.stopPropagation(); onVoid(row); }}>作废</a>
          )}
        </span>
      ),
    },
  ];

  return (
    <SharedTable<OutboundBatch>
      rowKey="id"
      columns={columns}
      dataSource={rows}
      loading={loading}
      page={page}
      pageSize={pageSize}
      total={total}
      onRowClick={onRowClick}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
    />
  );
}
