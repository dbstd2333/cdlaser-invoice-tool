import { expect, test, _electron as electron } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/** 以 file:// 生产入口启动 Electron，验证 Hash Router 不会渲染 404。 */
test('Windows 同构生产入口可打开库存页并切换路由', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'cdlaser-e2e-'));
  const electronApp = await electron.launch({
    args: [resolve(__dirname, '../../out/main/index.js')],
    env: {
      ...process.env,
      CDLASER_E2E_PRODUCTION: '1',
      CDLASER_E2E_USER_DATA_DIR: userDataDir,
    },
  });

  try {
    const window = await electronApp.firstWindow();
    await expect(window.getByText('库存与开票', { exact: true }).first()).toBeVisible();
    await expect(window.getByText('Unexpected Application Error')).toHaveCount(0);
    expect(await window.evaluate(() => window.location.protocol)).toBe('file:');
    expect(['', '#/']).toContain(await window.evaluate(() => window.location.hash));

    await window.getByText('客户管理', { exact: true }).first().click();
    await expect(window.getByText('客户管理', { exact: true }).last()).toBeVisible();
    expect(await window.evaluate(() => window.location.hash)).toBe('#/customers');

    await window.getByText('开票记录', { exact: true }).first().click();
    expect(await window.evaluate(() => window.location.hash)).toBe('#/outbound-records');
  } finally {
    await electronApp.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});
