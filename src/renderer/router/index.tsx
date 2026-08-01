import { Navigate, createHashRouter } from 'react-router-dom';
import { App } from '../App';
import { CustomersPage } from '../pages/customers/CustomersPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { OutboundRecordsPage } from '../pages/outbound-records/OutboundRecordsPage';

/**
 * Electron 生产环境使用 file:// 加载页面，Hash Router 可避免把本地文件路径误判为业务路由。
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <InventoryPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'outbound-records', element: <OutboundRecordsPage /> },
      { path: '*', element: <Navigate to="/inventory" replace /> },
    ],
  },
]);
