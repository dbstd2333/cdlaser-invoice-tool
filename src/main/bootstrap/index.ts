import { app, BrowserWindow, shell, dialog } from 'electron';
import { resolve } from 'node:path';
import log from 'electron-log/main';
import { initDatabase, closeDatabase } from '../db/connection';
import { registerAllowedWindow } from '../security/ipc-security';
import { registerSystemIpc } from '../ipc/system-ipc';
import { registerCustomersIpc } from '../ipc/customers-ipc';
import { registerCatalogIpc } from '../ipc/catalog-ipc';
import { registerOutboundIpc } from '../ipc/outbound-ipc';
import { registerReplenishmentIpc } from '../ipc/replenishment-ipc';
import { registerInboundIpc } from '../ipc/inbound-ipc';
import { registerInventoryIpc } from '../ipc/inventory-ipc';
import { registerBackupIpc } from '../ipc/backup-ipc';

/**
 * 主进程引导 - 创建窗口、初始化数据库、注册 IPC、配置安全基线。
 */

log.initialize();
log.info('[main] 应用启动');

let mainWindow: BrowserWindow | null = null;

/** 注册所有 IPC 处理器 */
function registerAllIpc(): void {
  registerSystemIpc();
  registerCustomersIpc();
  registerCatalogIpc();
  registerOutboundIpc();
  registerReplenishmentIpc();
  registerInboundIpc();
  registerInventoryIpc();
  registerBackupIpc();
  log.info('[main] IPC 处理器注册完成');
}

/** 创建主窗口 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    show: false,
    title: '成都莱盛发票库存管理工具',
    webPreferences: {
      preload: resolve(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  registerAllowedWindow(mainWindow);

  // 设置 CSP
  // 开发模式需放行 'unsafe-inline'：Vite + @vitejs/plugin-react 会注入 React Fast Refresh 内联 preamble 脚本，
  // 严格 CSP 会拦截该内联脚本，导致 "can't detect preamble" 错误。生产模式保持严格限制。
  const isDev = !app.isPackaged;
  const cspHeader = isDev
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'"
    : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'";
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [cspHeader],
      },
    });
  });

  // 拒绝外部导航，交给系统浏览器
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // 阻止权限申请
  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 加载渲染进程
  if (isDev) {
    const devUrl = process.env['VITE_DEV_SERVER_URL'] || 'http://localhost:5173';
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const rendererPath = resolve(__dirname, '../renderer/index.html');
    mainWindow.loadFile(rendererPath);
  }
}

/** 应用就绪 */
app.whenReady().then(() => {
  // 初始化数据库
  try {
    initDatabase();
    log.info('[main] 数据库初始化完成');
  } catch (err) {
    log.error('[main] 数据库初始化失败:', err);
    dialog.showErrorBox('数据库初始化失败', `应用无法启动：\n${(err as Error).message}`);
    app.quit();
    return;
  }

  registerAllIpc();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/** 所有窗口关闭时退出（Windows 行为） */
app.on('window-all-closed', () => {
  closeDatabase();
  app.quit();
});

/** 应用退出前关闭数据库 */
app.on('before-quit', () => {
  closeDatabase();
});

/** 异常退出处理 */
process.on('uncaughtException', (err) => {
  log.error('[main] 未捕获异常:', err);
});

process.on('unhandledRejection', (reason) => {
  log.error('[main] 未处理的 Promise 拒绝:', reason);
});
