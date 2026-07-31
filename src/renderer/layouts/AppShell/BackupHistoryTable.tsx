import { Table, Tag } from 'antd';
import type { BackupHistoryItem } from '@shared/contracts/preview-types';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}

function formatSize(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function BackupHistoryTable({
  data,
  onSelect,
}: {
  data: BackupHistoryItem[];
  onSelect?: (key: string) => void;
}) {
  return (
    <Table<BackupHistoryItem>
      rowKey="objectKey"
      size="small"
      pagination={false}
      dataSource={data}
      onRow={(record) =>
        onSelect
          ? { onClick: () => onSelect(record.objectKey), style: { cursor: 'pointer' } }
          : {}
      }
      columns={[
        {
          title: '时间',
          dataIndex: 'backupTime',
          render: (v: string) => formatTime(v),
        },
        {
          title: '类型',
          dataIndex: 'backupType',
          render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'default'}>{v === 'auto' ? '自动' : '手动'}</Tag>,
        },
        {
          title: '大小',
          dataIndex: 'size',
          render: (v: number) => formatSize(v),
        },
        {
          title: '校验',
          dataIndex: 'checksumStatus',
          render: (v: string) => (v === 'verified' ? <Tag color="success">已校验</Tag> : <Tag>未知</Tag>),
        },
      ]}
    />
  );
}
