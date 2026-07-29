# MEMORY

## 项目：cdlaser-invoice-tool (Electron 桌面应用)

- 名称：成都莱盛发票库存管理工具，单机 Electron 桌面端。
- 主技术栈：Electron 43 + Vue 3.5 + Element Plus + Pinia + better-sqlite3 + Drizzle ORM + electron-vite + electron-builder。
- 包管理：pnpm（必须 `pnpm install --frozen-lockfile` 才能正确编译 better-sqlite3 的原生模块，注意 .npmrc 用了 `node-linker=hoisted`）。
- 脚本：`dev` / `build` / `build:win`（= build && electron-builder --win --x64），`lint`（oxlint），`typecheck`，`test`（vitest run），`db:generate` / `db:migrate`（drizzle-kit）。
- 构建产物 NSIS 安装包输出到 `release/`，CI 用 `softprops/action-gh-release@v2` 创建草稿 Release。

## CI/CD 关键决策

- **不要让 electron-builder 自动发布**：CI 工作流 `.github/workflows/build-windows.yml` 已经用 `softprops/action-gh-release@v2` 自己负责发布，因此 `package.json -> build.publish` 必须设为 `null`，否则 electron-builder 在打 NSIS 时会去找 `process.env.GH_TOKEN`，找不到就报 "GitHub Personal Access Token is not set"。
- **不要把 token 放在 Environment secrets**：Environment secret 必须 workflow 显式声明 `environment:` 或手动选 environment 时才会注入。如果要传 token 给 action，优先用 Repository secrets 或者直接用 GitHub Actions 自动提供的 `GITHUB_TOKEN`（`${{ secrets.GITHUB_TOKEN }}`），不要新建奇怪名字的 Environment。

## 仓库与远程

- 远程地址：git@github.com:dbstd2333/cdlaser-invoice-tool.git
- 主分支：main。
- 2026-06-11 曾经用 `git push --force-with-lease` 把本地 main 强制推送到远端，覆盖了远端 3 个不同提交（本地 1 个提交）。
