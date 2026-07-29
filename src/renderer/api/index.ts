/**
 * 渲染进程 API 封装 - 访问 preload 暴露的 window.api。
 * 渲染进程不直接访问 Node.js、文件系统、SQLite 或 COS 密钥。
 */

import { wrapIpcApi } from './bridge';

const bridgeApi = window.api;

if (!bridgeApi) {
  throw new Error('API 未注入，请检查 preload 脚本');
}

const api = wrapIpcApi(bridgeApi);

export { api };
