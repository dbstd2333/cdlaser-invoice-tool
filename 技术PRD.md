# 发票库存管理系统技术 PRD

## 1. 技术目标

构建面向 Windows 的单机 Electron 应用，在无独立后端服务、无登录的情况下提供可靠的本地数据事务、Excel 导入导出、字段级审计和 S3 云备份。

关键质量目标：

- 库存、开票和进项导入必须原子化。
- 金额与高精度单价不得使用 JavaScript 浮点数直接计算。
- 税务模板除明细数据外不得发生结构性破坏。
- SQLite、导出文件和云备份均可校验、恢复和审计。
- 渲染进程不得直接访问 Node.js、文件系统、SQLite 或 S3 密钥。

## 2. 技术栈

| 层级 | 选型 | 用途 |
| --- | --- | --- |
| 桌面容器 | Electron + TypeScript | Windows 应用、进程隔离、文件对话框 |
| 构建打包 | Vite + electron-builder | 开发构建、Windows x64 NSIS 安装包 |
| 渲染层 | Vue 3 + Vue Router + Pinia | 页面、路由和界面状态 |
| UI | Element Plus | 表格、表单、抽屉、对话框和上传 |
| 本地数据库 | SQLite + better-sqlite3 | 单机事务数据库 |
| 数据访问 | Drizzle ORM + Drizzle Kit | 类型安全查询和版本迁移 |
| 校验 | Zod | IPC、表单及导入数据校验 |
| 精度计算 | decimal.js | 单价、金额、税额计算 |
| Excel 读取 | ExcelJS | 客户、商品、进项及汇总表读取生成 |
| 税务模板写入 | OOXML 定点修改器 | 只修改明细工作表，保留模板其他部件 |
| 云备份 | AWS SDK for JavaScript v3 | AWS S3 和兼容 S3 服务 |
| 测试 | Vitest + Playwright Electron | 单元、集成和桌面端端到端测试 |

实施时锁定当期稳定版本，不使用浮动版本号。原生依赖必须按 Electron ABI 重建并在干净 Windows 环境验证安装包。

## 3. 总体架构

### 3.1 进程边界

**主进程**

- 管理 BrowserWindow、SQLite、迁移、文件系统、Excel、S3 和系统对话框。
- 承载所有领域服务和事务。
- 校验每个 IPC 请求及发送方。

**预加载进程**

- 通过 `contextBridge` 暴露按业务划分的最小 API。
- 只暴露 `customers.list()`、`invoice.export()` 等具体方法。
- 不暴露 `ipcRenderer`、任意频道调用、文件路径读写或 Node.js 对象。

**渲染进程**

- 只负责 Vue 界面、临时表单状态和结果展示。
- 不直接读写 SQLite、S3、Excel 或本机文件。

### 3.2 Electron 安全基线

- `contextIsolation: true`
- `sandbox: true`
- `nodeIntegration: false`
- 仅加载应用打包的本地资源。
- 设置严格 CSP，默认禁止远程脚本和内联脚本。
- 拒绝未授权导航、弹窗、WebView 和权限申请。
- 外部链接仅允许经过白名单校验后交给系统浏览器。
- IPC 主进程同时校验频道、参数、窗口来源和业务权限边界。

### 3.3 Element Plus 应用壳布局

根布局使用 Element Plus Container 组件组合：

```text
ElContainer
├─ ElAside
│  ├─ AppBrand
│  ├─ ElMenu
│  └─ SidebarFooter
│     └─ SettingsMenuItem
└─ ElContainer
   ├─ ElHeader
   │  └─ AppHeader
   └─ ElMain
      └─ RouterView
```

实现约束：

- `ElAside` 固定在窗口左侧，展开宽 220px、折叠宽 64px，宽度切换使用短动画。
- `ElAside` 内部使用纵向 Flex 布局，上方 `ElMenu` 占据剩余空间，`SidebarFooter` 固定在底部。
- `ElMenu` 使用 vertical 模式和 `collapse` 属性，业务菜单 index 直接对应 Vue Router 路由。
- 配置 `/customers`、`/inventory` 与 `/outbound-records` 三个一级菜单；三个页面都始终渲染各自大表格，不使用 `ElTabs` 或子路由。
- Vue Router 根路径 `/` 固定重定向到 `/inventory`，未知业务路由也回退到 `/inventory`。
- 应用每次启动都以 `/inventory` 作为初始路由，不持久化或恢复上次访问路由。
- `SettingsMenuItem` 位于左侧菜单底部，不作为路由；点击后切换全局 `SettingsDrawer`。
- 折叠状态下 `SettingsMenuItem` 仅显示齿轮图标，并通过 Tooltip 提供文本含义。
- `ElHeader` 高度 56px，仅包含侧栏开关、`ElBreadcrumb` 和页面标题。
- `ElMain` 只负责主内容滚动，侧栏和顶部栏保持可见；复杂表格区域使用独立 `ElScrollbar`。
- 内容背景、卡片边距和表格高度使用统一 CSS 变量，禁止各页面自行计算窗口高度。
- 折叠状态存入非敏感本地 UI 配置，应用重启后恢复。
- 小于 1280px 时默认折叠侧栏；最小可用窗口按 1024×720 验证，不设计移动端布局。
- 全局 `SettingsDrawer` 挂载在应用壳，使用 `ElDrawer` 的 `rtl` 方向，从左下角设置入口打开且不改变当前路由。

### 3.4 页面二表格与 Modal

`InventoryPage` 采用“工具栏 + ElTable + 分页器”的单页结构：

- `InventoryToolbar` 承载搜索、筛选、刷新、列设置和业务操作入口。
- `InventoryTable` 使用服务端分页、固定表头、固定多选列和固定右侧操作列。
- 默认 `pageSize = 50`，可选 20、50、100；每次进入页面二恢复默认页码和每页数量。
- `ElTable` 使用 `row-key="priceVersionId"`，`type="selection"` 列启用 `reserve-selection`。
- 页面级 `selectedPriceVersions` Store 以 `priceVersionId` 为键保存跨页选择；翻页、改变每页数量和改变筛选条件只更新当前页数据，不清空 Store。
- 工具栏展示全局已选数量，并提供查看已选和清空操作；离开 `/inventory` 或开票成功后清空，取消开票 Dialog 时保留。
- 打开开票 Dialog 前，主进程按全部已选 ID 批量重新读取并校验启用、资料完整度和价格版本状态；失效项从 Store 移除并返回明确提示。
- 表格高度由主内容区 Flex 布局分配，通过 `max-height` 保持表头固定，禁止在窗口 resize 时散落手工高度计算。
- 库存正、零、负状态使用统一 Tag 和语义色，不以整行高饱和底色影响可读性。
- URL 只保存必要的筛选和分页状态，不为 Modal 创建子路由。

子功能使用独立 `ElDialog` 组件：

- 默认 `width: 90vw`，内容最大高度约 `88vh`；窗口宽度小于 1200px 时使用 fullscreen。
- 自定义 header、body、footer 区域；header/footer 固定，body 使用 `ElScrollbar`。
- 复杂记录表格继续使用固定表头。
- 业务 Modal 由 `InventoryModalHost` 统一调度，同一时间只能有一个活动类型。
- 禁止嵌套大 Dialog；确认动作使用 `ElMessageBox`。
- 导入预览等重组件使用 `destroy-on-close`，有未保存表单时通过关闭守卫二次确认。
- 长任务关闭 Modal 后继续执行，再次打开时根据 `taskId` 恢复状态。

### 3.5 页面一表格与 Modal

`CustomersPage` 采用与页面二一致的工作台结构：

- `CustomersToolbar` 承载搜索、状态筛选、新增客户、首次批量导入、刷新和列设置。
- `CustomersTable` 使用服务端分页、固定表头和固定右侧操作列。
- 默认 `pageSize = 50`，可选 20、50、100。
- 客户名称、税号、联系电话和银行账号等长字段支持省略显示与 Tooltip，不允许挤压操作列。
- `/customers` 路由只保存筛选和分页状态，不为详情或编辑创建子路由。

Modal 组件：

- `CustomerFormDialog`：新增和编辑，建议宽度 760px。
- `CustomerDetailDialog`：只读详情和关联摘要。
- `CustomerInitialImportDialog`：约 `90vw × 88vh`，承载解析、错误表和预览表。
- `CustomerHistoryDialog`：大尺寸字段历史表格。
- `CustomerModalHost`：保证同一时间只有一个客户业务 Modal。

首次导入按钮是否显示必须由主进程返回的初始化状态决定；即使渲染进程被篡改，主进程也必须拒绝第二次首次导入。关闭有变更的客户表单时使用关闭守卫。

### 3.6 页面三开票记录与明细 Modal

`OutboundRecordsPage` 采用“筛选工具栏 + ElTable + 分页器”的单页结构：

- 路由固定为 `/outbound-records`，列表按 `exported_at DESC, id DESC` 稳定排序。
- `OutboundRecordsToolbar` 支持批次号、客户、Excel 导出时间范围、状态和商品关键词筛选。
- `OutboundRecordsTable` 使用服务端分页、固定表头和固定右侧操作列；默认 `pageSize = 50`，可选 20、50、100。
- 点击普通行区域打开 `OutboundRecordDetailDialog`；下载和作废按钮必须阻止行点击事件冒泡。
- 详情 Dialog 使用约 `90vw × 88vh`，汇总区展示客户和金额快照，明细表固定表头。
- 明细接口逐行返回 `stockBefore` 与 `stockAfter`，界面渲染为“扣减前库存 → 扣减后库存”；禁止用当前 `stock_balance` 反向计算。
- 详情中的重新下载读取批次原始 `xlsx_blob`；作废只对 `valid` 状态开放，并复用销项作废事务。
- 页面三不复用 `InventoryModalHost`，使用独立 `OutboundRecordDetailDialog`，避免页面间状态耦合。

## 4. 代码组织

建议目录：

```text
src/
  main/
    bootstrap/
    db/
      schema/
      migrations/
      repositories/
    domains/
      customers/
      catalog/
      inventory/
      outbound/
      inbound/
      audit/
      backup/
    excel/
      tax-template/
      importers/
      exporters/
    ipc/
    security/
  preload/
  renderer/
    layouts/
      AppShell/
    pages/
      customers/
        components/
        modals/
      inventory/
        components/
        modals/
      outbound-records/
        components/
        modals/
    components/
    stores/
    api/
  shared/
    contracts/
    schemas/
    money/
```

约束：

- 单文件尽量不超过 300 行，超出时按领域、服务或组件拆分。
- 所有导出函数、领域服务函数和复杂转换函数添加简洁清晰的函数级注释。
- IPC 合同、Zod Schema 和领域类型放在 `shared`，不共享数据库对象。
- 页面组件只编排交互，客户/商品大表格、工具栏、导入预览和各业务 Modal 分别拆为独立组件。
- `AppShell`、`AppSidebar`、`SidebarFooter`、`AppHeader` 和 `SettingsDrawer` 独立组件化，页面不得复制全局布局。
- `InventoryModalHost` 只负责 Modal 类型与生命周期，不承载具体业务表单。
- `CustomerModalHost` 只负责客户 Modal 类型与生命周期，不承载表单校验或数据库操作。
- `OutboundRecordsPage`、记录表格和详情 Dialog 分文件实现，详情商品表及汇总区继续组件化，确保单文件尽量不超过 300 行。

## 5. 数据与精度规范

### 5.1 通用类型

- 主键：UUIDv7 文本。
- 时间：UTC ISO 8601 文本；界面按 Windows 本地时区显示。
- 数量及库存：SQLite INTEGER。
- 单价：规范化十进制字符串，最多 13 位小数。
- 金额、税额、价税合计：人民币分 INTEGER。
- 税率：固定整数 `13`，导出时格式化为 `0.13`。
- 税号、编码、型号、电话、银行账号和发票号：TEXT。

金额计算统一使用 `decimal.js`：

1. `金额 = quantity × unitPrice`，ROUND_HALF_UP 到 2 位。
2. `税额 = 金额 × 0.13`，ROUND_HALF_UP 到 2 位。
3. `价税合计 = 金额 + 税额`。

禁止使用 `Number`、SQLite REAL 或二进制浮点进行业务金额计算。

### 5.2 SQLite 配置

- 启用 `PRAGMA foreign_keys = ON`。
- 启用 WAL。
- 设置合理 `busy_timeout`。
- 写事务使用 `BEGIN IMMEDIATE` 语义，防止嵌套业务操作交叉写入。
- 应用启动时先执行 Drizzle 迁移，再开放窗口。
- 每次迁移前创建本地数据库快照，失败自动回滚到旧版本。

## 6. 数据模型

### 6.1 主数据

**customers**

- `id`
- 客户 10 个业务字段
- `tax_id_normalized` 唯一索引
- `status`
- `created_at`、`updated_at`

**products**

- `id`
- `name`、`name_normalized`
- `model`、`model_normalized`
- `unit`
- `tax_classification_code`
- `data_status`: complete/incomplete
- `status`: active/inactive
- `remark`
- 唯一索引：`name_normalized + model_normalized`

**price_versions**

- `id`
- `product_id`
- `unit_price_decimal`
- `tax_rate`
- `stock_balance`
- `status`
- 唯一索引：`product_id + unit_price_decimal`

### 6.2 销项

**outbound_batches**

- `id`、`batch_no`
- `customer_id`
- 客户快照 JSON
- `exported_at`
- `status`: valid/voided
- `void_reason`、`voided_at`
- `xlsx_blob`、`xlsx_sha256`
- 数量及金额汇总

**outbound_lines**

- `id`、`batch_id`
- `price_version_id`
- 商品、编码、型号、单位、单价和税率快照
- `quantity`
- `amount_cent`、`tax_cent`、`total_cent`
- `stock_before`、`stock_after`：本次扣减发生前后的库存整数快照

保存原始 XLSX BLOB 和逐行库存前后快照，确保重新下载和历史详情不受模板、商品、客户或后续库存变化影响。

### 6.3 进项和导入

**inbound_batches**

- `id`、`batch_no`
- 原文件名、原文件 BLOB
- 原文件 SHA-256、标准化内容 SHA-256，均唯一
- 导入时间、状态、忽略行数和汇总金额
- 作废原因及时间

**inbound_lines**

- `id`、`batch_id`
- 原工作表、行号、发票日期、发票号、销售方
- `price_version_id`
- 商品、型号、单位和价格快照
- `quantity`、金额字段

**replenishment_exports**

- `id`、`export_no`、`exported_at`
- 负库存快照时间、原始 XLSX BLOB 和 SHA-256
- 数量及金额汇总

**replenishment_export_lines**

- `export_id`、`price_version_id`
- 商品和价格版本快照
- `stock_balance_snapshot`
- `replenishment_quantity`，等于负库存绝对值
- 金额、税额和价税合计

**import_jobs**

- 导入类型、文件哈希、状态、统计、错误 JSON、创建时间。
- 预览阶段可保存短期草稿，确认或过期后清理。

### 6.4 库存与审计

**inventory_ledger**

- `id`
- `price_version_id`
- `change_quantity`
- `balance_before`
- `balance_after`
- `source_type`: initialization/outbound/outbound_void/inbound/inbound_void/adjustment
- `source_id`
- `reason`
- `created_at`

`price_versions.stock_balance` 用于查询，`inventory_ledger` 为变更证据。两者必须在同一事务更新。

**audit_events**

- 业务动作、实体类型、实体 ID、来源批次、操作者、时间及摘要。

**audit_field_changes**

- `event_id`
- 字段路径
- 变更前值、变更后值

**app_settings**

- 客户首次导入状态、商品首次导入状态、模板版本、备份策略等非密钥配置。

## 7. IPC 合同

IPC 使用 `invoke/handle` 请求响应模型，所有入参和出参均经 Zod 校验。

主要命名空间：

- `customers.*`：分页、详情、新增、编辑、停用、首次导入预览、首次导入确认、历史。
- `catalog.*`：商品和价格版本 CRUD、商品首次导入、商品日常导入、库存查询。
- `outbound.*`：创建草稿校验、导出、列表、详情、重新下载、作废。
- `replenishment.*`：月底负库存预览、导出、历史和重新下载。
- `inbound.*`：月初总部进项预览、确认、列表、详情、作废。
- `inventory.*`：流水、调整、一致性检查。
- `backup.*`：配置、连接测试、立即备份、列表、恢复。
- `system.*`：版本、目录空间、数据库健康状态。

长任务通过任务 ID 和受限事件订阅报告进度，不向渲染进程传递 Electron Event 对象。

入口门禁由主进程读取 `app_settings` 强制执行：客户和商品首次导入只能各成功一次；商品日常导入必须在商品首次导入完成后才能调用，不能只依赖前端隐藏按钮。

## 8. 关键事务

### 8.1 销项导出

1. 主进程重新读取并校验客户、价格版本和数量。
2. 使用当前模板生成内存 XLSX。
3. 校验 XLSX ZIP 结构、必需工作表、版本单元格及明细行。
4. 弹出保存对话框并写入临时文件。
5. 原子替换为用户目标文件。
6. SQLite 单事务按稳定顺序逐行读取当前余额，计算 `stock_after = stock_before - quantity`，并写入开票批次、带库存前后快照的明细、XLSX BLOB、负向库存流水、余额和审计。
7. 数据库事务失败时删除本次新建目标文件；删除失败则记录孤立文件告警。

渲染进程传入的单价、金额和库存均不可信，主进程必须从数据库重新计算。`stock_before` 与 `stock_after` 必须和对应库存流水、最终余额在同一事务内落库，事务回滚时不得保留任何快照。

### 8.2 销项作废

单事务完成：

- 锁定并验证批次仍为 valid。
- 标记 voided。
- 每行写入正向库存流水并更新余额。
- 写入字段历史和操作事件。

重复作废返回幂等结果，不再次变更库存。

### 8.3 进项导入

预览阶段：

1. 限制扩展名、文件大小、工作表数量和最大行数。
2. 计算原文件 SHA-256。
3. 按表头定位列，不依赖固定列字母。
4. 标准化名称、型号、单位和十进制单价。
5. 忽略完整的非库存费用行；部分填写行报错。
6. 对相同业务键聚合后再校验，防止拆行绕过超量规则。
7. 计算标准化内容 SHA-256。

确认阶段必须重新解析文件或校验预览令牌，随后在单个 SQLite 事务中：

- 插入进项批次与明细。
- 精确匹配已有商品和价格版本。
- 已有负库存的版本若导入量超过绝对值则回滚整批。
- 已有非负库存版本允许继续增加。
- 全新商品自动创建；缺少税收编码时标记 incomplete。
- 写入正向库存流水、余额及字段审计。

### 8.4 人工调整

调整量必须为非零整数，原因必填。服务读取当前余额并在单事务中写入新余额、流水和审计，禁止直接更新余额字段。

## 9. Excel 实现

### 9.1 税务模板

基准文件为 `发票开具项目信息导入模板.xlsx`，数据工作表为“1-明细模板”。模板作为只读资源随应用打包，并记录 SHA-256。

为避免第三方库重新序列化时丢失隐藏工作表、版本信息或未知 OOXML 部件，采用 ZIP/OOXML 定点修改：

- 复制原始 XLSX 包。
- 仅修改“1-明细模板”对应 worksheet XML 的第 4 行及以后数据。
- 必要时更新工作表 dimension。
- 其他 XML、关系、样式、隐藏工作表和版本单元保持字节级不变。
- 对 XML 文本进行实体转义，防止特殊字符破坏文件。

生成后自动验证：

- XLSX 可解压并重新打开。
- 4 个原始工作表仍存在。
- `excelVersion` 版本值仍存在。
- 表头和说明未变化。
- 明细数量、金额和税率与开票快照一致。
- 明细不得超过 2,000 行，超出时在进入文件生成前返回业务错误。

### 9.2 月底负库存导出

月底导出使用同一数据库读快照查询全部 `stock_balance < 0` 的启用价格版本，不读取开票日期范围，也不按开票明细汇总。

- `replenishment_quantity = abs(stock_balance)`。
- 金额按快照数量和价格版本单价计算。
- 查询、生成 XLSX、保存导出记录和 XLSX BLOB 使用同一份不可变快照。
- 导出记录不写库存流水。
- 查询结果为空时不生成文件或记录。

### 9.3 导入防护

- 单元格公式不作为业务值接受。
- 文本字段去除首尾空白和不可见空格，但保留原始快照。
- 型号、税号、账号和发票号禁止自动转数字。
- 超过 Excel 15 位数字精度且已被数值化的标识字段报错。
- 导出到普通报表的文本若以 `= + - @` 开头，进行公式注入转义。

## 10. S3 云备份

### 10.1 配置

支持：

- AWS S3：region、bucket、prefix。
- 兼容服务：自定义 HTTPS endpoint、region、bucket、path-style 开关。
- Access Key ID、Secret Access Key，可选 Session Token。

密钥使用 Electron `safeStorage` 交给 Windows DPAPI 加密，只在主进程内解密，不写入业务数据库、日志或备份。

### 10.2 备份格式

1. 使用 SQLite Online Backup API 生成一致性快照，不直接复制正在写入的 WAL 数据库。
2. 对快照执行 `PRAGMA integrity_check`。
3. 生成包含应用版本、Schema 版本、记录计数和 SHA-256 的 manifest。
4. 数据库和 manifest 压缩后使用 AES-256-GCM 客户端加密。
5. 用户启用云备份时设置恢复密码；密钥通过 Argon2id 派生。
6. 上传时提供内容长度、SHA-256 校验和及元数据。

对象键建议：

```text
{prefix}/{install-id}/YYYY/MM/invoice-backup-YYYYMMDD-HHmmssZ.cdbak
```

### 10.3 调度与保留

- 每次数据变化设置 dirty 标记。
- 每日首次启动且 dirty 时自动备份。
- 提供手动“立即备份”。
- 网络失败指数退避重试，不阻塞本地业务。
- 默认保留最近 30 个成功备份，删除前先确认新备份已上传并校验。

### 10.4 恢复

1. 列出备份并显示时间、应用版本、Schema 版本和大小。
2. 下载后校验对象和 manifest 哈希。
3. 输入恢复密码并解密。
4. 校验 SQLite 完整性及 Schema 兼容性。
5. 创建当前数据的本地恢复前备份。
6. 关闭数据库连接，原子替换数据库并重启。
7. 启动后执行迁移、一致性检查并写入恢复审计。

### 10.5 设置界面实现

S3 界面由渲染进程的全局设置抽屉承载，建议拆分为：

- `SettingsDrawer`：设置容器和页签切换。
- `S3BackupPanel`：数据加载和操作编排。
- `BackupStatusCard`：连接、最近备份、dirty 状态和错误摘要。
- `S3ConnectionForm`：服务类型、Endpoint、Region、Bucket、Prefix、凭据和 Path Style。
- `BackupPolicyForm`：自动备份及保留数量。
- `BackupHistoryTable`：分页读取备份对象并触发恢复。
- `RestoreBackupDialog`：风险提示、恢复密码、二次确认和进度。

界面状态机：

- `unconfigured`
- `idle`
- `testing`
- `backing_up`
- `restoring`
- `error`

要求：

- 备份和恢复互斥，同一时间只允许一个任务。
- 任务开始后按钮进入 loading，重复调用由主进程幂等保护。
- 长任务返回 `taskId`，通过受限事件通道报告阶段、百分比和已处理字节数。
- 设置抽屉关闭后任务继续，重新打开时通过 `backup.getTaskStatus` 恢复进度。
- 恢复期间禁用所有业务写操作，并提示应用即将重启。
- Secret Access Key、Session Token 和恢复密码不写入 Pinia 持久化状态，不出现在错误对象或开发日志中。
- 已保存密钥不回传渲染进程；界面只获得 `credentialConfigured: true/false`。

扩展 IPC：

- `backup.getStatus`
- `backup.getConfig`
- `backup.saveConfig`
- `backup.testConnection`
- `backup.create`
- `backup.list`
- `backup.restore`
- `backup.getTaskStatus`

所有配置和恢复请求继续执行 Zod 校验；Endpoint 只允许 HTTPS，开发测试环境例外。

## 11. Windows 交付

- 目标：Windows 10/11 x64。
- 安装方式：NSIS 安装包，默认按用户安装，不要求管理员权限。
- 数据目录：Electron `userData` 下的专用目录。
- 支持中文路径、长路径和无网络使用。
- 生产发布建议配置代码签名，降低 SmartScreen 警告。
- 自动更新不纳入 V1；升级通过新版安装包执行并保留用户数据。

## 12. 日志与可观测性

- 日志按日期滚动，默认保留 14 天。
- 严禁记录客户完整税号、银行账号、S3 密钥、恢复密码和 Excel 全量内容。
- 错误日志使用批次 ID、任务 ID、错误码和脱敏摘要。
- 设置页提供“导出诊断包”，只包含脱敏日志、版本和数据库健康结果。

## 13. 测试策略

### 13.1 单元测试

- 十进制金额和四舍五入。
- 商品、型号和单价规范化。
- 正负库存状态映射。
- 销项、作废、进项、进项作废和调整的余额变化。
- 进项聚合、超量校验和重复哈希。

### 13.2 数据库集成测试

- 每个领域事务成功及中途异常回滚。
- 唯一约束、外键和迁移。
- 由流水重算余额并与缓存余额核对。
- 重复点击、重复作废和重复导入幂等。

### 13.3 Excel 契约测试

- 使用真实税务模板作为固定测试夹具。
- 对生成文件重新读取并校验工作表、版本、表头、明细和格式。
- 测试中文、特殊字符、前导零、13 位小数和大批量行。
- 使用总部样例测试费用行忽略、冲突定位和全量回滚。

### 13.4 Electron 端到端测试

- 客户大表格、CRUD Modal、字段历史 Modal 和首次批量导入大 Modal。
- 客户首次导入和商品首次导入分别成功后，各自入口独立隐藏。
- 选购、保存文件、库存变负、页面三历史查看和作废恢复。
- 月底只导出负库存，并保存快照与文件。
- 月初进项预览、确认、重复导入拦截和新商品建档。
- S3 使用测试桶或本地兼容服务完成备份恢复。
- 设置抽屉覆盖未配置、连接失败、立即备份、进度恢复、历史列表和恢复二次确认。
- 应用壳覆盖左侧菜单折叠、路由高亮、面包屑、内容滚动，以及左下角设置入口在任意页面打开抽屉。
- 启动、正常重启、异常恢复和数据库恢复重启均验证默认落在 `/inventory` 且菜单高亮正确。
- 页面二 E2E 覆盖默认每页 50 条，翻页、改变每页数量和调整筛选后选择仍保留，失效项剔除，以及各 Modal 打开关闭、未保存关闭保护和禁止多 Modal 叠加。
- 页面一 E2E 覆盖客户大表格筛选、CRUD、首次导入入口隐藏、Modal 生命周期和未保存关闭保护。
- 页面三 E2E 覆盖默认每页 50 条、组合筛选、行点击详情、操作按钮阻止冒泡、原 Excel 重新下载、作废恢复，以及每条明细的库存前后快照与库存流水一致。

### 13.5 Windows 验证

- 在干净 Windows 10/11 x64 虚拟机安装、启动、升级和卸载。
- 验证原生 SQLite 模块 ABI、中文路径、Excel 打开、SmartScreen 和恢复流程。

## 14. 性能与容量

- 目标数据量：10 万开票明细、10 万进项明细、100 万审计字段变更。
- 普通列表首屏小于 1 秒，搜索小于 500 毫秒。
- 1 万行导入预览小于 10 秒，过程显示进度且界面可取消。
- 大任务在主进程 Worker Thread 执行，数据库最终写入仍串行事务化。
- 索引覆盖导出时间、客户、状态、商品规范名、型号、价格版本和流水时间；页面三使用 `outbound_batches(exported_at, id)`、`outbound_batches(status, exported_at)` 及明细商品检索索引。

## 15. 实施阶段

1. 工程骨架、安全 IPC、SQLite Schema 和迁移。
2. 客户首次导入、商品首次导入、商品日常导入、主数据及字段历史。
3. 销项选购、税务模板导出、记录、库存流水和作废。
4. 月底负库存导出、月初总部进项导入、幂等和进项作废。
5. S3 备份恢复、诊断和数据一致性检查。
6. Windows 安装包、全链路测试和验收。

## 16. 技术验收门槛

- TypeScript、Lint、单元测试、集成测试和 Electron E2E 全部通过。
- 所有 IPC 均有 Schema 校验，不存在任意频道或任意文件访问。
- 库存余额可由流水完整重算，抽样和全量检查均一致。
- 任一导入错误不会产生部分写入。
- 税务模板结构契约测试通过，实际 Excel 可正常打开。
- S3 备份完成上传后可在另一台 Windows 设备恢复。
- 日志和诊断包扫描不包含密钥、完整税号或银行账号。
- 安装包在干净 Windows 10/11 x64 环境通过验证。
