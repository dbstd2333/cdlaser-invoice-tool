import { Drawer, Switch, Typography } from 'antd';
import { useAppStore } from '@renderer/stores/app';

const { Text } = Typography;

export function SettingsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const themeMode = useAppStore((s) => s.themeMode);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <Drawer title="设置" open={open} onClose={onClose} width={320}>
      <div className="flex items-center justify-between">
        <Text>深色模式</Text>
        <Switch
          checked={themeMode === 'dark'}
          onChange={(checked) => void setTheme(checked ? 'dark' : 'light')}
        />
      </div>
    </Drawer>
  );
}
