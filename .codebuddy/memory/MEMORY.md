# MEMORY

## 项目：cdlaser-invoice-tool (Electron 桌面应用)

- 名称：成都莱盛发票库存管理工具，单机 Electron 桌面端。
- 主技术栈（渲染进程，React 版）：Electron 43 + **React 19 + antd v6 + Tailwind CSS v4** + zustand + react-router-dom + better-sqlite3 + Drizzle ORM + electron-vite + electron-builder。主进程仍是 TS/Node（better-sqlite3 + Drizzle），通过 preload contextBridge 暴露 `window.api`。
- 包管理：pnpm（必须 `pnpm install --frozen-lockfile` 才能正确编译 better-sqlite3 的原生模块，注意 .npmrc 用了 `node-linker=hoisted`）。
- 脚本：`dev` / `build` / `build:win`（= build && electron-builder --win --x64），`lint`（oxlint），`typecheck`，`test`（vitest run），`db:generate` / `db:migrate`（drizzle-kit）。
- 构建产物 NSIS 安装包输出到 `release/`，CI 用 `softprops/action-gh-release@v2` 创建草稿 Release。

## UI / 样式约定（Tailwind CSS v4 + antd）

- 2026-07-31：把全部手写 CSS 迁移到 **Tailwind CSS v4**。配置方式：`@tailwindcss/vite` 插件注册在 `electron.vite.config.ts` 的 renderer（`plugins: [react(), tailwindcss()]`）；唯一 CSS 入口 `src/renderer/styles/global.css` 用 `@import "tailwindcss";` + 极简 base reset（html/body/#app 字体与背景）+ `@theme` 主题 token。
- `@theme` 自定义色板（用于 `text-/bg-/border-` 工具类）：`--color-brand:#409eff`、`--color-line:#e4e7ed`、`--color-muted:#909399`。
- **antd 优先级规则（重要）**：antd v6 用 CSS-in-JS 在运行时把组件样式注入到 `<head>` 末尾，**晚于** Tailwind 静态样式表，因此**同一属性上 antd 默认样式会覆盖 Tailwind**。规则：在 antd 组件（`Layout`/`Input`/`Select`/`Button`/`Modal`/`Drawer`/`Card`/`Table`/`Space`/`Header`/`Sider`/`Content`/`Steps`/`Alert`/`Icon` 等）上用 Tailwind 覆盖其默认外观时，必须加 `!` 重要修饰符（如 `!w-[220px]`、`!bg-white`、`!border-line`、`!mb-3`、`!ml-auto`）；普通 `<div>`/`<span>` 等原生元素无需 `!`。
- 所有 UI 优先用 antd 组件（Table/Tag/Card/Descriptions/Modal/Drawer/Steps/Alert/Space/Input/Select/Button…），布局/间距/排版用 Tailwind 替代原先的全局 class 与 inline `style={{}}`。迁移时已无残留 inline style。
- CSP（`index.html` 的 `style-src 'self' 'unsafe-inline'`）对 Tailwind 静态样式表（'self'）与 antd 运行时注入（'unsafe-inline'）均兼容，无需改动。

## Excel 库（SheetJS 社区版）

- 2026-07-31：把 `xlsx-populate` 全部替换为 **SheetJS 社区版**，从官方 CDN 安装（npm 上的 `xlsx` 长期停在 0.18.5 旧版）。
- 安装命令：`pnpm add https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`（包名仍为 `xlsx`，版本 0.20.3）。
- **关键限制**：SheetJS 社区版**不能写单元格样式**（加粗、填充、数字格式 `@`、数据校验、冻结窗格、自动筛选），仅列宽 `!cols` 可写。模板生成器因此丢失了表头加粗、文本格式保护等样式。
- ESM 构建（vitest/Node ESM）不会自动加载 `fs`，读取/写入文件前必须 `XLSX.set_fs(fs)`（CJS 生产构建中该调用无害）。涉及文件：`src/main/excel/importers/parser-utils.ts`、`template-generator.ts`、`src/main/domains/inventory/replenishment-excel.ts`、`scripts/generate-template.ts`。
- 读取端用 `XLSX.readFile(path,{cellDates:true})` + `sheet_to_json(ws,{header:1,raw:true})`，文本标识符存为字符串、数值存为 number，支撑超精度识别。

## CI/CD 关键决策

- **不要让 electron-builder 自动发布**：CI 工作流 `.github/workflows/build-windows.yml` 已经用 `softprops/action-gh-release@v2` 自己负责发布，因此 `package.json -> build.publish` 必须设为 `null`，否则 electron-builder 在打 NSIS 时会去找 `process.env.GH_TOKEN`，找不到就报 "GitHub Personal Access Token is not set"。
- **不要把 token 放在 Environment secrets**：Environment secret 必须 workflow 显式声明 `environment:` 或手动选 environment 时才会注入。如果要传 token 给 action，优先用 Repository secrets 或者直接用 GitHub Actions 自动提供的 `GITHUB_TOKEN`（`${{ secrets.GITHUB_TOKEN }}`），不要新建奇怪名字的 Environment。

## 仓库与远程

- 远程地址：git@github.com:dbstd2333/cdlaser-invoice-tool.git
- 主分支：main。
- 2026-06-11 曾经用 `git push --force-with-lease` 把本地 main 强制推送到远端，覆盖了远端 3 个不同提交（本地 1 个提交）。
