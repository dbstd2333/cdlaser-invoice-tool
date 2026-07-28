import { defineConfig } from '@playwright/test';

/**
 * Playwright 配置 - Electron 端到端测试。
 * 测试策略对应技术 PRD 第 13.4 节。
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'electron',
      use: {
        // Electron 测试通过 _electron fixture 启动应用
      },
    },
  ],
});
