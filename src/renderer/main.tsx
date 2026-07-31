import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import { router } from './router';
import './styles/global.css';

const theme = {
  token: {
    colorPrimary: '#409eff',
    borderRadius: 8,
  },
};

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
