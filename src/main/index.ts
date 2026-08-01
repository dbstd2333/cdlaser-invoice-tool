import { app } from 'electron';
import { resolve } from 'node:path';

/**
 * 主进程入口 - 设置应用路径并引导启动。
 */

// 确保应用名称
app.setName('成都莱盛发票库存管理工具');

// E2E 可使用隔离目录；正式环境仍固定写入用户主目录。
const e2eUserDataDir = process.env['CDLASER_E2E_USER_DATA_DIR'];
app.setPath('userData', e2eUserDataDir || resolve(app.getPath('home'), '.cdlaser-invoice-tool'));

// 导入并执行引导
import('./bootstrap/index.js');
