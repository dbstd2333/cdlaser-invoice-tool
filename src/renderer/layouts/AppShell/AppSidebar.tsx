import { NavLink } from 'react-router-dom';
import { UserOutlined, ShopOutlined, ExportOutlined } from '@renderer/icons';
import { SidebarFooter } from './SidebarFooter';
import { CosBackupPanel } from './CosBackupPanel';

const items = [
  { to: '/inventory', label: '库存与开票', icon: <ShopOutlined /> },
  { to: '/customers', label: '客户管理', icon: <UserOutlined /> },
  { to: '/outbound-records', label: '开票记录', icon: <ExportOutlined /> },
];

export function AppSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-[15px] font-semibold text-gray-800 p-4 whitespace-nowrap overflow-hidden text-ellipsis border-b border-line">
        成都莱盛发票库存管理
      </div>
      <nav className="flex-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-3 text-sm no-underline ${
                isActive
                  ? 'text-brand bg-[rgba(64,158,255,0.12)] font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <SidebarFooter />
      <CosBackupPanel />
    </div>
  );
}
