import { useEffect, useState } from 'react';
import { Button, Modal, Space, Table, Tag, Typography, App } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { api } from '@renderer/api';
import type { ReplenishmentPreviewLine } from '@shared/contracts/preview-types';

const { Text } = Typography;

export function ReplenishmentExportDialog({
  open,
  onClose,
  onExported,
}: {
  open: boolean;
  onClose: () => void;
  onExported: () => void;
}) {
  const { message } = App.useApp();
  const [rows, setRows] = useState<ReplenishmentPreviewLine[]>([]);
  const [previewed, setPreviewed] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadPreview = async () => {
    setBusy(true);
    try {
      const res = (await api.replenishment.preview()) as { lines: ReplenishmentPreviewLine[] };
      setRows(res.lines);
      setPreviewed(true);
    } catch (err) {
      message.error(`加载失败: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (open) {
      setPreviewed(false);
      void loadPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleExport = async () => {
    setBusy(true);
    try {
      const res = (await api.replenishment.export()) as { exported: boolean; saved: boolean; path?: string };
      if (res.saved) {
        message.success(`已导出：${res.path ?? ''}`);
        onExported();
        onClose();
      } else {
        message.error('导出失败');
      }
    } finally {
      setBusy(false);
    }
  };

  const columns: ColumnsType<ReplenishmentPreviewLine> = [
    { title: '商品', dataIndex: 'name', width: 150 },
    { title: '型号', dataIndex: 'model', width: 110 },
    { title: '单位', dataIndex: 'unit', width: 70 },
    {
      title: '库存',
      dataIndex: 'stockBalanceSnapshot',
      width: 100,
      render: (v: number) => <Tag color="red">{v}</Tag>,
    },
  ];

  return (
    <Modal title="导出补票清单" open={open} onCancel={onClose} footer={null} width={820}>
      <Space direction="vertical" size="middle" className="!w-full">
        <div>
          <Button type="primary" disabled={!previewed} loading={busy} onClick={handleExport} className="!ml-2">
            导出 Excel
          </Button>
        </div>
        {previewed && (
          <>
            <Text type="secondary">共 {rows.length} 条明细（本月负库存）</Text>
            <Table<ReplenishmentPreviewLine>
              rowKey="productId"
              size="small"
              pagination={false}
              dataSource={rows}
              columns={columns}
            />
          </>
        )}
      </Space>
    </Modal>
  );
}
