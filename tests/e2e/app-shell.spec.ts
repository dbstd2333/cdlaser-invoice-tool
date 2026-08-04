import { expect, test, _electron as electron } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import * as XLSX from 'xlsx';

/** 生成商品首次或日常导入使用的临时工作簿。 */
function writeCatalogWorkbook(filePath: string, isInitial: boolean, rows: Array<Array<string | number>>): void {
  const headers = ['项目名称', '规格型号', '单位', '税收分类编码', '含税单价'];
  if (isInitial) headers.push('初始库存');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([headers, ...rows]), '商品导入');
  XLSX.writeFile(workbook, filePath);
}

/** 将下一次 Electron 原生选文件对话框固定返回指定测试文件。 */
async function mockNextOpenDialog(electronApp: Awaited<ReturnType<typeof electron.launch>>, filePath: string): Promise<void> {
  await electronApp.evaluate(({ dialog }, selectedPath) => {
    const mutableDialog = dialog as typeof dialog & {
      showOpenDialog: (...args: unknown[]) => Promise<{ canceled: boolean; filePaths: string[] }>;
    };
    mutableDialog.showOpenDialog = async () => ({ canceled: false, filePaths: [selectedPath] });
  }, filePath);
}

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

test('商品导入可预览确认并保留同名同型号的不同价格', async () => {
  const userDataDir = await mkdtemp(join(tmpdir(), 'cdlaser-import-e2e-'));
  const initialFile = join(userDataDir, '商品首次导入.xlsx');
  const dailyFile = join(userDataDir, '商品日常导入.xlsx');
  writeCatalogWorkbook(initialFile, true, [
    ['测试耗材', 'A1', '个', '1090127010100000000', '100.00', 2],
  ]);
  writeCatalogWorkbook(dailyFile, false, [
    ['测试耗材', 'A1', '个', '1090127010100000000', '120.00'],
    ['测试耗材', 'A1', '个', '1090127010100000000', '120.0000'],
  ]);

  const electronApp = await electron.launch({
    args: [resolve(__dirname, '../../out/main/index.js')],
    env: { ...process.env, CDLASER_E2E_PRODUCTION: '1', CDLASER_E2E_USER_DATA_DIR: userDataDir },
  });

  try {
    const window = await electronApp.firstWindow();
    await mockNextOpenDialog(electronApp, initialFile);
    await window.getByRole('button', { name: '初始化导入' }).click();
    await window.getByRole('button', { name: /点击选择 Excel 文件/ }).click();
    await window.getByRole('button', { name: '开始校验' }).click();
    await expect(window.getByText('校验通过，可进入确认步骤')).toBeVisible();
    await expect(window.getByText('100.00', { exact: true })).toBeVisible();
    await window.getByRole('button', { name: '下一步' }).click();
    await expect(window.getByText('确认后将一次性写入全部有效商品及其初始库存。')).toBeVisible();
    await window.getByRole('button', { name: '确认导入' }).click();
    await expect(window.getByText('成功创建 1 条商品记录')).toBeVisible();
    await window.getByRole('button', { name: /完\s*成/ }).click();

    await mockNextOpenDialog(electronApp, dailyFile);
    await window.getByRole('button', { name: '商品导入' }).click();
    await window.getByRole('button', { name: /点击选择 Excel 文件/ }).click();
    await window.getByRole('button', { name: '开始校验' }).click();
    await expect(window.getByText('已去重')).toBeVisible();
    await expect(window.getByText('同名型号新价格')).toBeVisible();
    await window.getByRole('button', { name: '下一步' }).click();
    await expect(window.getByText('已有商品价格和库存不会被修改。', { exact: false })).toBeVisible();
    await window.getByRole('button', { name: '确认导入' }).click();
    await expect(window.getByText('成功创建 1 条商品记录')).toBeVisible();
    await window.getByRole('button', { name: /完\s*成/ }).click();

    await expect(window.getByText('¥100', { exact: true })).toBeVisible();
    await expect(window.getByText('¥120', { exact: true })).toBeVisible();
    const summary = window.getByTestId('inventory-summary-bar');
    await expect(summary).toBeVisible();
    expect(await summary.evaluate((element) => element.parentElement?.firstElementChild === element)).toBe(true);

    await window.setViewportSize({ width: 1024, height: 720 });
    await expect(summary).toBeVisible();
    await expect(window.getByText('总负库存')).toBeVisible();
  } finally {
    await electronApp.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});
