/**
 * IPC 频道定义 - 按业务命名空间组织。
 * 主进程通过 ipcMain.handle 注册，渲染进程通过 preload 暴露的 API 调用。
 */

export const IPC_CHANNELS = {
  // 系统
  system: {
    getVersion: 'system.getVersion',
    getInitStatus: 'system.getInitStatus',
    getDbHealth: 'system.getDbHealth',
    getDiskSpace: 'system.getDiskSpace',
    exportDiagnostics: 'system.exportDiagnostics',
    selectFile: 'system.selectFile',
  },
  // 客户
  customers: {
    list: 'customers.list',
    getById: 'customers.getById',
    create: 'customers.create',
    update: 'customers.update',
    toggleStatus: 'customers.toggleStatus',
    initialImportPreview: 'customers.initialImportPreview',
    initialImportConfirm: 'customers.initialImportConfirm',
    downloadTemplate: 'customers.downloadTemplate',
    history: 'customers.history',
  },
  // 商品与价格版本
  catalog: {
    listPriceVersions: 'catalog.listPriceVersions',
    getProductById: 'catalog.getProductById',
    createProduct: 'catalog.createProduct',
    updateProduct: 'catalog.updateProduct',
    createPriceVersion: 'catalog.createPriceVersion',
    deleteProduct: 'catalog.deleteProduct',
    getPriceVersionsByProduct: 'catalog.getPriceVersionsByProduct',
    initialImportPreview: 'catalog.initialImportPreview',
    initialImportConfirm: 'catalog.initialImportConfirm',
    dailyImportPreview: 'catalog.dailyImportPreview',
    dailyImportConfirm: 'catalog.dailyImportConfirm',
    downloadTemplate: 'catalog.downloadTemplate',
    fieldHistory: 'catalog.fieldHistory',
  },
  // 销项开票
  outbound: {
    validateDraft: 'outbound.validateDraft',
    export: 'outbound.export',
    list: 'outbound.list',
    getDetail: 'outbound.getDetail',
    download: 'outbound.download',
    void: 'outbound.void',
  },
  // 月底补票导出
  replenishment: {
    preview: 'replenishment.preview',
    export: 'replenishment.export',
    list: 'replenishment.list',
    getDetail: 'replenishment.getDetail',
    download: 'replenishment.download',
  },
  // 月初进项导入
  inbound: {
    preview: 'inbound.preview',
    confirm: 'inbound.confirm',
    downloadTemplate: 'inbound.downloadTemplate',
    list: 'inbound.list',
    getDetail: 'inbound.getDetail',
    void: 'inbound.void',
  },
  // 库存
  inventory: {
    ledger: 'inventory.ledger',
    adjust: 'inventory.adjust',
    consistencyCheck: 'inventory.consistencyCheck',
  },
  // 备份
  backup: {
    getStatus: 'backup.getStatus',
    getConfig: 'backup.getConfig',
    saveConfig: 'backup.saveConfig',
    testConnection: 'backup.testConnection',
    create: 'backup.create',
    list: 'backup.list',
    restore: 'backup.restore',
    getTaskStatus: 'backup.getTaskStatus',
  },
} as const;

export type IpcChannel = string;
