import { useEffect, type ReactNode } from 'react';
import { Layout } from 'antd';
import { useAppStore } from '@renderer/stores/app';
import { AppSidebar } from './AppSidebar';

const { Sider, Content } = Layout;

export function AppShell({ children }: { children: ReactNode }) {
  const loadSystemInfo = useAppStore((s) => s.loadSystemInfo);

  useEffect(() => {
    void loadSystemInfo();
  }, [loadSystemInfo]);

  return (
    <Layout className="!h-screen">
      <Sider width={220} theme="light" className="!overflow-auto !bg-white !border-r !border-line">
        <AppSidebar />
      </Sider>
      <Layout>
        <Content className="!overflow-hidden !relative">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
