# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

成都莱盛发票库存管理工具 - 面向 Windows 的单机 Electron 桌面应用。

## 常用命令

```bash
pnpm install              # 安装依赖
pnpm dev                  # 开发模式（electron-vite dev）
pnpm build                # 构建（electron-vite build）
pnpm build:win            # 构建 Windows 安装包（electron-builder --win --x64）
pnpm build:mac            # 构建 macOS 安装包
pnpm test                 # 运行单元测试（vitest）
pnpm test:watch           # 监听模式运行测试
pnpm test:e2e             # 运行 E2E 测试（playwright）
pnpm typecheck            # 类型检查（tsc --noEmit）
pnpm lint                 # 代码检查（oxlint src）
pnpm db:generate          # Drizzle Kit 生成迁移
pnpm db:migrate           # Drizzle Kit 执行迁移
```

## 技术栈

| 层级 | 选型 |
| --- | --- |
| 桌面容器 | Electron 43 + TypeScript 7 |
| 构建打包 | electron-vite + Vite 8 + electron-builder |
| 渲染层 | React 19 + react-router-dom 7 + zustand 5 |
| UI | Ant Design 6 + Tailwind CSS 4 |
| 本地数据库 | SQLite + better-sqlite3 13 |
| 数据访问 | Drizzle ORM 0.45 |
| 校验 | Zod 4 |
| 精度计算 | decimal.js 10 |
| Excel | JSZip 3 (OOXML 定点修改) + xlsx (SheetJS) |
| 云备份 | 腾讯云 COS (cos-nodejs-sdk-v5) |
| 测试 | Vitest 4 + Playwright 1 |

## 架构要点

- **进程隔离**：主进程承载所有领域服务和事务；预加载通过 contextBridge 暴露最小 API（`window.api`）；渲染进程不直接访问 Node.js/SQLite/COS。
- **IPC 安全**：所有 IPC 走 ipcMain.handle/ipcRenderer.invoke，经 Zod 校验入参出参，校验窗口来源。渲染进程通过 `window.api` 调用，preload 层做 JSON 序列化防注入。
- **精度计算**：金额以「人民币分」INTEGER 存储，单价以规范化十进制字符串存储，统一使用 decimal.js 计算，禁止 Number 浮点。
- **税务模板**：采用 OOXML 定点修改（JSZip），仅修改「1-明细模板」工作表第 4 行及以后，其他部件字节级不变。
- **库存事务**：`stock_balance` 与 `inventory_ledger` 在同一事务更新，余额可由流水重算。支持一致性检查。
- **审计日志**：所有业务动作（导入/导出/作废/调整/备份）通过 `audit-service` 记录，支持字段级变更追踪。
- **导入两阶段**：客户/商品/进项导入均采用「预览→确认」两阶段模式，预览数据以 `import_jobs.preview_token` 缓存，确认时事务写入。

## 关键路径

- **主进程入口**：`src/main/index.ts` → `src/main/bootstrap/index.ts`
- **数据库 Schema**：`src/main/db/schema/index.ts`（Drizzle ORM 表定义）
- **数据库迁移**：`src/main/db/migrations/initial-schema.ts`（原始建表 SQL）
- **数据库连接**：`src/main/db/connection.ts`（单例 better-sqlite3）
- **领域服务**：`src/main/domains/`（catalog, customers, inventory, outbound, inbound, audit, backup）
- **IPC 处理器**：`src/main/ipc/`（每个领域一个文件，注册 ipcMain.handle）
- **预加载 API**：`src/preload/index.ts`（定义 window.api 类型）
- **渲染进程**：`src/renderer/`（React 19 + Ant Design + Tailwind）
- **共享类型**：`src/shared/contracts/`（领域类型、IPC 频道定义、规范化工具）
- **Zod Schema**：`src/shared/schemas/index.ts`（IPC 入参校验 Schema）
- **精度计算**：`src/shared/money/index.ts`（decimal.js 封装）
- **税务模板**：`src/main/excel/tax-template/template-writer.ts`
- **导入解析器**：`src/main/excel/importers/`（客户/商品/进项导入解析器）
- **脚本工具**：`scripts/generate-template.ts`（生成占位税务模板）

## 领域模块

### 领域职责

| 领域 | 目录 | 核心功能 |
| --- | --- | --- |
| 商品 | `domains/catalog/` | 商品 CRUD、唯一含税单价管理、首次/日常导入（预览→确认） |
| 客户 | `domains/customers/` | 客户 CRUD、首次导入、字段历史查询 |
| 销项开票 | `domains/outbound/` | 草稿校验、XLSX 生成、事务导出、分页查询、作废恢复库存 |
| 进项导入 | `domains/inbound/` | 文件解析预览、事务确认、作废、列表查询 |
| 月底补票 | `domains/inventory/replenishment-*` | 负库存预览、XLSX 导出、列表查询、重新下载 |
| 库存调整 | `domains/inventory/` | 库存流水查看、金额调整、一致性检查 |
| 审计 | `domains/audit/` | 操作事件记录、字段级变更追踪、历史查询 |
| 备份 | `domains/backup/` | COS 配置（safeStorage 加密）、远程备份、密码恢复 |

### 关键业务规则

- **销项金额系数**：销项开票金额 = 含税单价 × 数量 × 1.09（`calcOutboundAmountCent`），进项/补票按标准含税价计算。
- **含税单价体系**：`unitPriceDecimal` 语义为含税单价，`calcAmountCent` 内部 ÷ 1.13 得含税金额，销项导出时通过 `taxExclusiveUnitPrice` 转不含税填入金税模板。
- **库存可以负**：库存支持负数（代表已开票未到货），月底补票导出负库存项。
- **作废反向恢复**：销项作废恢复正向库存流水，进项作废扣除正向库存，幂等。

## 数据模型

主键统一为 UUIDv7 文本，时间统一为 UTC ISO 8601 文本。

| 表 | 说明 |
| --- | --- |
| customers | 客户（含规范化税号、状态、默认开票地址） |
| products | 商品（名称+规格型号联合唯一，含唯一含税单价和库存余额） |
| outbound_batches | 销项开票批次（含 XLSX Blob 存储） |
| outbound_lines | 销项明细行（含扣减前后库存快照） |
| inbound_batches | 进项导入批次（含原始文件 Blob 和双重 SHA-256） |
| inbound_lines | 进项明细行 |
| replenishment_exports | 月底补票导出记录 |
| replenishment_export_lines | 补票导出明细行 |
| inventory_ledger | 库存流水（不可变证据，source_type: initialization/outbound/outbound_void/inbound/inbound_void/adjustment） |
| import_jobs | 导入任务（两阶段预览-确认，带过期机制） |
| audit_events | 审计事件 |
| audit_field_changes | 字段级变更 |
| app_settings | 键值设置 |

## 精度规范

- 主键：UUIDv7 文本
- 数量及库存：SQLite INTEGER
- 单价：规范化十进制字符串，最多 13 位小数
- 金额、税额、价税合计：人民币分 INTEGER
- 税率：固定整数 13，导出时格式化为 `"0.13"`
- 金额计算统一使用 `decimal.js`，禁止使用 `Number` 浮点

## 安全基线

- `contextIsolation: true`、`sandbox: true`、`nodeIntegration: false`
- 严格 CSP，禁止远程脚本和内联脚本
- IPC 主进程校验频道、参数、窗口来源和业务权限边界
- COS 密钥使用 Electron safeStorage 加密存储，不写入业务数据库
- Excel 导出防公式注入（`escapeFormulaInjection`）

## 渲染进程页面

- `/customers` — 客户管理（CRUD、首次导入、字段历史）
- `/inventory` — 商品、库存与开票（商品唯一含税单价管理、跨分页选择、销项开票、商品导入、进项导入、月底负库存导出、库存调整、库存流水）
- `/outbound-records` — 开票记录（批次查询、明细查看、重新下载、作废恢复）

## 测试结构

- 单元测试：Vitest，文件命名 `*.test.ts`，与源码同目录放置
- 组件测试：Vitest + jsdom
- E2E 测试：Playwright，配置在 `playwright.config.ts`，测试文件在 `tests/`
- 使用 `vitest` CLI 而非 `npx vitest`
