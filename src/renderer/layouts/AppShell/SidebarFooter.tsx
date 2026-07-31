import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@renderer/icons';
import { useAppStore } from '@renderer/stores/app';

export function SidebarFooter() {
  const appVersion = useAppStore((s) => s.appVersion);
  const schemaVersion = useAppStore((s) => s.schemaVersion);
  const themeMode = useAppStore((s) => s.themeMode);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <div className="px-4 py-3 border-t border-line flex items-center justify-between">
      <div className="text-gray-400 text-xs leading-tight">
        <div>版本 {appVersion}</div>
        <div>Schema v{schemaVersion}</div>
      </div>
      <Tooltip title={themeMode === 'light' ? '切换到深色' : '切换到浅色'}>
        <Button
          type="text"
          size="small"
          icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />}
          onClick={() => void toggleTheme()}
        />
      </Tooltip>
    </div>
  );
}
