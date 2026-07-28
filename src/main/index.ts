import { app } from 'electron';
import { resolve } from 'node:path';

/**
 * 主进程入口 - 设置应用路径并引导启动。
 */

// 确保应用名称
app.setName('发票库存管理系统');

// 设置 userData 目录
app.setPath('userData', resolve(app.getPath('home'), '.cdlaser-invoice-tool'));

// 导入并执行引导
import('./bootstrap/index.js');
