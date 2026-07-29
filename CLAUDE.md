# 项目说明

成都莱盛发票库存管理工具 - 面向 Windows 的单机 Electron 桌面应用。

## 常用命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 开发模式
pnpm build            # 构建
pnpm build:win        # 构建 Windows 安装包
pnpm test             # 运行测试
pnpm typecheck        # 类型检查
```

## 架构要点

- **进程隔离**：主进程承载所有领域服务和事务；预加载通过 contextBridge 暴露最小 API；渲染进程不直接访问 Node.js/SQLite/COS。
- **IPC 安全**：所有 IPC 经 Zod 校验入参出参，校验窗口来源。渲染进程通过 `window.api` 调用。
- **精度计算**：金额以人民币分 INTEGER 存储，单价以十进制字符串存储，统一使用 decimal.js 计算，禁止 Number 浮点。
- **税务模板**：采用 OOXML 定点修改（JSZip），仅修改「1-明细模板」工作表第 4 行及以后，其他部件字节级不变。
- **库存事务**：stock_balance 与 inventory_ledger 在同一事务更新，余额可由流水重算。

## 关键路径

- 主进程入口：`src/main/index.ts` -> `src/main/bootstrap/index.ts`
- 数据库 Schema：`src/main/db/schema/index.ts`
- 领域服务：`src/main/domains/`
- IPC 处理器：`src/main/ipc/`
- 预加载 API：`src/preload/index.ts`
- 渲染页面：`src/renderer/pages/`（customers, inventory, outbound-records）
- 共享类型：`src/shared/contracts/`
- 精度计算：`src/shared/money/index.ts`

## 注意事项

- 税务模板 `resources/templates/发票开具项目信息导入模板.xlsx` 为占位文件，生产环境需替换为官方模板。
- better-sqlite3 为原生模块，Electron 打包时需按 ABI 重建。
- COS 密钥使用 Electron safeStorage 加密存储，不写入业务数据库。
