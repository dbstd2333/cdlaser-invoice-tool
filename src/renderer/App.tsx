import { Outlet } from 'react-router-dom';
import { AppShell } from './layouts/AppShell/AppShell';

export function App() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
