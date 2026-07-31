let electron = require("electron");
let node_path = require("node:path");
//#region src/main/index.ts
/**
* 主进程入口 - 设置应用路径并引导启动。
*/
electron.app.setName("成都莱盛发票库存管理工具");
electron.app.setPath("userData", (0, node_path.resolve)(electron.app.getPath("home"), ".cdlaser-invoice-tool"));
Promise.resolve().then(() => require("./bootstrap-C6Ou6mqC.js"));
//#endregion
