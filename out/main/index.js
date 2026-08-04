let electron = require("electron");
let node_path = require("node:path");
//#region src/main/index.ts
/**
* 主进程入口 - 设置应用路径并引导启动。
*/
electron.app.setName("成都莱盛发票库存管理工具");
var e2eUserDataDir = process.env["CDLASER_E2E_USER_DATA_DIR"];
electron.app.setPath("userData", e2eUserDataDir || (0, node_path.resolve)(electron.app.getPath("home"), ".cdlaser-invoice-tool"));
Promise.resolve().then(() => require("./bootstrap-DnL3vLVo.js"));
//#endregion
