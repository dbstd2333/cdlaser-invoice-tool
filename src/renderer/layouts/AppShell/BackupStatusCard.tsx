import { Card, Space, Tag, Typography } from 'antd';
import { useBackupStore } from '@renderer/stores/backup';

const { Text } = Typography;

const STATUS_TEXT: Record<string, string> = {
  unconfigured: '未配置',
  idle: '空闲',
  testing: '连接测试中',
  backing_up: '备份中',
  restoring: '恢复中',
  error: '错误',
};

function formatTime(iso: string | null): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}

function formatSize(bytes: number | null): string {
  if (!bytes) return '-';
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function BackupStatusCard() {
  const status = useBackupStore((s) => s.status);

  return (
    <Card size="small" title="备份状态">
      <Space direction="vertical" size={4} className="!w-full">
        <Space>
          <Text type="secondary">状态：</Text>
          <Tag color={status?.status === 'error' ? 'error' : 'blue'}>
            {status ? STATUS_TEXT[status.status] : '-'}
          </Tag>
        </Space>
        <div>
          <Text type="secondary">上次备份：</Text>
          {formatTime(status?.lastBackupTime ?? null)}
        </div>
        <div>
          <Text type="secondary">备份大小：</Text>
          {formatSize(status?.lastBackupSize ?? null)}
        </div>
        <div>
          <Text type="secondary">凭据：</Text>
          {status?.credentialConfigured ? '已配置' : '未配置'}
        </div>
        {status?.dirty && <Tag color="warning">本地有未备份变更</Tag>}
      </Space>
    </Card>
  );
}
