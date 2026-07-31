import { useEffect, useState } from 'react';
import { Badge, Button, Drawer, Space, Typography } from 'antd';
import { CloudUploadOutlined, HistoryOutlined } from '@renderer/icons';
import { useBackupStore } from '@renderer/stores/backup';
import { BackupStatusCard } from './BackupStatusCard';
import { CosConnectionForm } from './CosConnectionForm';
import { RestoreBackupDialog } from './RestoreBackupDialog';

const { Text } = Typography;

const STATUS_COLOR: Record<string, 'default' | 'success' | 'processing' | 'error' | 'warning'> = {
  unconfigured: 'default',
  idle: 'success',
  testing: 'processing',
  backing_up: 'processing',
  restoring: 'processing',
  error: 'error',
};

export function CosBackupPanel() {
  const [open, setOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const { status, loadAll, loadHistory, triggerBackup, backingUp } = useBackupStore();

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const statusColor = status ? STATUS_COLOR[status.status] ?? 'default' : 'default';

  return (
    <>
      <div className="px-4 py-3 border-t border-line">
        <Badge status={statusColor} offset={[-4, 28]}>
          <Button
            type="primary"
            block
            icon={<CloudUploadOutlined />}
            onClick={() => setOpen(true)}
          >
            云备份
          </Button>
        </Badge>
      </div>

      <Drawer
        title="数据库备份 (COS)"
        open={open}
        onClose={() => setOpen(false)}
        width={460}
      >
        <Space direction="vertical" size="middle" className="!w-full">
          <BackupStatusCard />

          <CosConnectionForm onSaved={() => void loadAll()} />

          <Space>
            <Button
              type="primary"
              loading={backingUp}
              icon={<CloudUploadOutlined />}
              onClick={() => void triggerBackup()}
            >
              立即备份
            </Button>
            <Button icon={<HistoryOutlined />} onClick={() => setRestoreOpen(true)}>
              恢复 / 历史
            </Button>
          </Space>

          {status?.lastError && (
            <Text type="danger">最近错误：{status.lastError}</Text>
          )}
        </Space>
      </Drawer>

      <RestoreBackupDialog
        open={restoreOpen}
        onClose={() => setRestoreOpen(false)}
        onOpened={() => void loadHistory()}
      />
    </>
  );
}
