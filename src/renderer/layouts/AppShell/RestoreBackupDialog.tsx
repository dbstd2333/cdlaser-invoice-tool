import { useEffect, useState } from 'react';
import { Alert, Button, Drawer, Input, Space, Typography, App } from 'antd';
import { useBackupStore } from '@renderer/stores/backup';
import { BackupHistoryTable } from './BackupHistoryTable';

const { Text } = Typography;

export function RestoreBackupDialog({
  open,
  onClose,
  onOpened,
}: {
  open: boolean;
  onClose: () => void;
  onOpened: () => void;
}) {
  const { history, restore, restoring } = useBackupStore();
  const { message, modal } = App.useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (open) onOpened();
  }, [open, onOpened]);

  const handleRestore = () => {
    if (!selected) {
      message.warning('请选择要恢复的备份');
      return;
    }
    modal.confirm({
      title: '确认恢复？',
      content: '恢复将覆盖当前本地数据库，且不可撤销。',
      okText: '确认恢复',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await restore(selected, password);
        message.success('恢复完成');
        onClose();
      },
    });
  };

  return (
    <Drawer title="恢复备份 / 历史" open={open} onClose={onClose} width={520}>
      <Space direction="vertical" size="middle" className="!w-full">
        {history.length === 0 && <Alert type="info" message="暂无备份历史" />}
        <BackupHistoryTable data={history} onSelect={setSelected} />
        <div>
          <Text type="secondary">已选：</Text>
          {selected ?? '未选择'}
        </div>
        <Input.Password
          placeholder="恢复口令"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="primary"
          danger
          loading={restoring}
          disabled={!selected}
          onClick={handleRestore}
        >
          恢复所选备份
        </Button>
      </Space>
    </Drawer>
  );
}
