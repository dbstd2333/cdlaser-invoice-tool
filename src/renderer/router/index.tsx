import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { CustomersPage } from '../pages/customers/CustomersPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { OutboundRecordsPage } from '../pages/outbound-records/OutboundRecordsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <InventoryPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'outbound-records', element: <OutboundRecordsPage /> },
    ],
  },
]);
