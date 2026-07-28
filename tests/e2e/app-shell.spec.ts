import { test, expect, _electron as electron } from '@playwright/test';
import { resolve } from 'node:path';

/**
 * Electron 端到端测试 - 应用壳和基本导航。
 * 对应技术 PRD 第 13.4 节：应用壳覆盖左侧菜单折叠、路由高亮、面包屑、内容滚动，
 * 以及启动默认落在 /inventory 且菜单高亮正确。
 */

test.describe('应用壳', () => {
  test('启动后默认进入页面二（/inventory）', async () => {
    const electronApp = await electron.launch({
      args: [resolve(__dirname, '../../dist/main/index.js')],
    });
    const window = await electronApp.firstWindow();

    // 等待应用加载
    await window.waitForSelector('.app-container', { timeout: 15000 });

    // 验证默认路由为 /inventory
    const activeMenu = await window.locator('.el-menu-item.is-active').textContent();
    expect(activeMenu).toContain('商品');

    await electronApp.close();
  });

  test('左侧菜单包含三个一级页面', async () => {
    const electronApp = await electron.launch({
      args: [resolve(__dirname, '../../dist/main/index.js')],
    });
    const window = await electronApp.firstWindow();

    await window.waitForSelector('.app-container', { timeout: 15000 });

    const menuItems = await window.locator('.el-menu-item').allTextContents();
    expect(menuItems.some((t) => t.includes('客户管理'))).toBeTruthy();
    expect(menuItems.some((t) => t.includes('商品'))).toBeTruthy();
    expect(menuItems.some((t) => t.includes('开票记录'))).toBeTruthy();

    await electronApp.close();
  });

  test('设置入口位于菜单左下角', async () => {
    const electronApp = await electron.launch({
      args: [resolve(__dirname, '../../dist/main/index.js')],
    });
    const window = await electronApp.firstWindow();

    await window.waitForSelector('.app-container', { timeout: 15000 });

    // 验证设置入口存在
    const settingsItem = window.locator('.app-sidebar-footer');
    await expect(settingsItem).toBeVisible();

    await electronApp.close();
  });
});
