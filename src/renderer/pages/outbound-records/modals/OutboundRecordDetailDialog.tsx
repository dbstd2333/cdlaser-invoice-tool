import { useEffect, useState } from 'react';
import { Card, Descriptions, Modal, Table, Tag, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { OutboundBatch, OutboundLine } from '@shared/contracts/types';
import { api } from '@renderer/api';
import { centToDisplay } from '@renderer/money';

function formatTime(iso: string | null): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}

function stockClass(balance: number): string {
  if (balance > 0) return 'text-[#52c41a]';
  if (balance < 0) return 'text-[#f5222d]';
  return '';
}

export function OutboundRecordDetailDialog({
  visible,
  batchId,
  onVisibleChange,
}: {
  visible: boolean;
  batchId: string;
  onVisibleChange: (v: boolean) => void;
}) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<{ batch: OutboundBatch; lines: OutboundLine[] } | null>(null);

  useEffect(() => {
    if (visible && batchId) {
      setLoading(true);
      api.outbound
        .getDetail(batchId)
        .then((res) => setDetail(res as { batch: OutboundBatch; lines: OutboundLine[] }))
        .catch((err) => message.error(`加载失败: ${(err as Error).message}`))
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
    }
  }, [visible, batchId, message]);

  const columns: ColumnsType<OutboundLine> = [
    { title: '#', dataIndex: 'index', width: 50, render: (_, __, i) => i + 1 },
    { title: '项目名称', dataIndex: 'name', minWidth: 150 },
    { title: '型号', dataIndex: 'model', width: 100 },
    { title: '单位', dataIndex: 'unit', width: 70 },
    { title: '含税单价', dataIndex: 'unitPriceDecimal', width: 120 },
    { title: '税率', dataIndex: 'taxRate', width: 80, render: () => '0.13' },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '金额', dataIndex: 'amountCent', width: 110, render: (v: number) => centToDisplay(v) },
    {
      title: '扣减前库存 -> 扣减后库存',
      width: 200,
      align: 'center',
      render: (_, row) => (
        <span>
          <span className={stockClass(row.stockBefore)}>{row.stockBefore}</span>
          <span className="mx-1 text-muted"> -&gt; </span>
          <span className={stockClass(row.stockAfter)}>{row.stockAfter}</span>
        </span>
      ),
    },
  ];

  return (
    <Modal
      title="开票明细"
      open={visible}
      width="90vw"
      destroyOnClose
      onCancel={() => onVisibleChange(false)}
      footer={[<a key="close" onClick={() => onVisibleChange(false)}>关闭</a>]}
    >
      <div className={loading ? 'opacity-50' : undefined}>
        {detail && (
          <div className="flex flex-col gap-4">
            <Card size="small" title="汇总">
              <Descriptions column={3} bordered size="small">
                <Descriptions.Item label="批次号">{detail.batch.batchNo}</Descriptions.Item>
                <Descriptions.Item label="客户">{detail.batch.customerSnapshot?.name}</Descriptions.Item>
                <Descriptions.Item label="导出时间">{formatTime(detail.batch.exportedAt)}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={detail.batch.status === 'valid' ? 'success' : 'error'}>
                    {detail.batch.status === 'valid' ? '有效' : '已作废'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="数量合计">{detail.batch.totalQuantity}</Descriptions.Item>
                <Descriptions.Item label="明细行数">{detail.batch.lineCount}</Descriptions.Item>
                <Descriptions.Item label="金额">{centToDisplay(detail.batch.totalAmountCent)}</Descriptions.Item>
              </Descriptions>
            </Card>

            {detail.batch.status === 'voided' && (
              <Card size="small" title="作废信息">
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="作废时间">{formatTime(detail.batch.voidedAt)}</Descriptions.Item>
                  <Descriptions.Item label="作废原因">{detail.batch.voidReason}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            <Card size="small" title="商品明细">
              <Table<OutboundLine>
                rowKey="id"
                size="small"
                bordered
                scroll={{ y: 400 }}
                pagination={false}
                dataSource={detail.lines}
                columns={columns}
              />
            </Card>
          </div>
        )}
      </div>
    </Modal>
  );
}
