# 成都莱盛发票库存管理工具

面向 Windows 的单机 Electron 桌面应用，管理客户、商品价格档案、开票记录和可正可负的发票库存。

## 技术栈

| 层级 | 选型 |
| --- | --- |
| 桌面容器 | Electron + TypeScript |
| 构建打包 | Vite + electron-builder |
| 渲染层 | React 19 + React Router + Zustand |
| UI | Ant Design 6 |
| 本地数据库 | SQLite + better-sqlite3 |
| 数据访问 | Drizzle ORM |
| 校验 | Zod |
| 精度计算 | decimal.js |
| Excel | ExcelJS + JSZip (OOXML 定点修改) |
| 云备份 | AWS SDK for JavaScript v3 |

## 核心架构

### 进程边界

- **主进程**：管理 BrowserWindow、SQLite、迁移、文件系统、Excel、腾讯云 COS 和系统对话框，承载所有领域服务和事务。
- **预加载进程**：通过 `contextBridge` 暴露按业务划分的最小 API，不暴露 `ipcRenderer` 或 Node.js 对象。
- **渲染进程**：只负责 React 界面和临时表单状态，不直接读写 SQLite、COS、Excel 或本机文件。

### 安全基线

- `contextIsolation: true`、`sandbox: true`、`nodeIntegration: false`
- 严格 CSP，禁止远程脚本和内联脚本
- IPC 主进程校验频道、参数、窗口来源和业务权限边界
- 所有 IPC 入参出参经 Zod 校验

## 业务功能

1. **客户管理**（页面一）：客户 CRUD、首次批量导入、字段历史
2. **商品、库存与开票**（页面二）：同名同型号多价格商品管理、跨分页选择、销项开票、商品导入、月底负库存导出、月初进项导入、库存调整、库存流水
3. **开票记录**（页面三）：开票批次查询、明细查看（含扣减前后库存快照）、重新下载、作废恢复
4. **腾讯云 COS 云备份**（设置抽屉）：配置、测试、立即备份、历史列表、安全恢复

## 关键事务

- **销项导出**：生成 XLSX → 保存文件 → 单事务写入批次、明细、库存流水、余额和审计
- **销项作废**：单事务标记作废 + 逐行恢复库存
- **进项导入**：预览校验 → 单事务写入批次、明细、正向库存流水
- **库存调整**：单事务写入流水和余额，禁止直接覆盖

## 精度规范

- 主键：UUIDv7 文本
- 时间：UTC ISO 8601 文本
- 数量及库存：SQLite INTEGER
- 单价：规范化十进制字符串，最多 13 位小数
- 金额、税额、价税合计：人民币分 INTEGER
- 税率：固定整数 13，导出时格式化为 0.13
- 金额计算统一使用 decimal.js，禁止使用 Number 浮点

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 构建 Windows 安装包
pnpm build:win

# 运行测试
pnpm test

# 类型检查
pnpm typecheck
```

## 目录结构

```
src/
  main/              # 主进程
    bootstrap/       # 应用引导
    db/              # 数据库连接和 Schema
    domains/         # 领域服务（customers, catalog, inventory, outbound, inbound, audit, backup）
    excel/           # Excel 导入导出（税务模板、导入解析器）
    ipc/             # IPC 处理器
    security/        # IPC 安全
  preload/           # 预加载脚本
  renderer/          # 渲染进程
    layouts/         # 应用壳布局
    pages/           # 三个一级页面
    stores/          # Zustand 状态
    api/             # API 封装
  shared/            # 共享层
    contracts/       # 领域类型和规范化工具
    schemas/         # Zod 校验 Schema
    money/           # 精度计算
resources/
  templates/         # 税务模板
```

## 税务模板

基准文件为 `resources/templates/发票开具项目信息导入模板.xlsx`，数据工作表为「1-明细模板」。
采用 OOXML 定点修改，仅修改明细工作表 XML 的第 4 行及以后数据，其他部件保持字节级不变。

> **注意**：开发环境使用生成的占位模板。生产环境应替换为官方税务模板。
