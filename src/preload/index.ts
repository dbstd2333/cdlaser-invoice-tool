import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/contracts/channels';
import type {
  Customer,
  PageResponse,
  FieldHistoryEntry,
  PriceVersion,
  PriceVersionRow,
  Product,
  OutboundBatch,
  OutboundLine,
  InboundBatch,
  InboundLine,
  ReplenishmentExport,
  ReplenishmentExportLine,
  InventoryLedger,
  InitStatus,
  CustomerImportPreviewResult,
  CatalogImportPreviewResult,
  DraftValidationResult,
  ReplenishmentPreviewLine,
  InboundPreviewResult,
  BackupStatus,
  BackupHistoryItem,
  CosConfig,
} from '../shared/contracts/preview-types';

/**
 * 预加载脚本 - 通过 contextBridge 暴露按业务划分的最小 API。
 * 只暴露具体方法，不暴露 ipcRenderer、任意频道调用、文件路径读写或 Node.js 对象。
 */

type IpcResponse<T> = { ok: true; data: T } | { ok: false; error: string; fieldErrors?: Array<{ path: string; message: string }> };

/** 调用 IPC 并解包响应，序列化参数作为 preload 侧的第二层保护。 */
async function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  // renderer 已在跨 contextBridge 前序列化，此处防止 preload 内部新增调用传入复杂对象
  const safe = args.length > 0 ? JSON.parse(JSON.stringify(args)) : args;
  const response = (await ipcRenderer.invoke(channel, ...safe)) as IpcResponse<T>;
  if (response.ok) {
    return response.data;
  }
  const err = new Error(response.error);
  (err as Error & { fieldErrors?: unknown[] }).fieldErrors = response.fieldErrors;
  throw err;
}

const api = {
  system: {
    getVersion: () => invoke<{ version: string; electron: string }>(IPC_CHANNELS.system.getVersion),
    getInitStatus: () => invoke<InitStatus>(IPC_CHANNELS.system.getInitStatus),
    getDbHealth: () => invoke<{ integrityOk: boolean; consistent: boolean; mismatchCount: number }>(IPC_CHANNELS.system.getDbHealth),
    getDiskSpace: () => invoke<{ available: number | null }>(IPC_CHANNELS.system.getDiskSpace),
    exportDiagnostics: () => invoke<{ saved: boolean; path?: string }>(IPC_CHANNELS.system.exportDiagnostics),
    selectFile: (params: { extensions: string[]; title?: string }) =>
      invoke<{ canceled: boolean; filePath: string | null }>(IPC_CHANNELS.system.selectFile, params),
  },
  customers: {
    list: (params: unknown) => invoke<PageResponse<Customer>>(IPC_CHANNELS.customers.list, params),
    getById: (id: string) => invoke<Customer | null>(IPC_CHANNELS.customers.getById, id),
    create: (params: unknown) => invoke<Customer>(IPC_CHANNELS.customers.create, params),
    update: (params: unknown) => invoke<Customer>(IPC_CHANNELS.customers.update, params),
    toggleStatus: (id: string) => invoke<Customer>(IPC_CHANNELS.customers.toggleStatus, id),
    initialImportPreview: (filePath: string) => invoke<{ token: string; preview: CustomerImportPreviewResult }>(IPC_CHANNELS.customers.initialImportPreview, filePath),
    initialImportConfirm: (token: string) => invoke<{ imported: number }>(IPC_CHANNELS.customers.initialImportConfirm, token),
    history: (params: unknown) => invoke<{ rows: FieldHistoryEntry[]; total: number }>(IPC_CHANNELS.customers.history, params),
    downloadTemplate: () => invoke<{ saved: boolean; path?: string }>(IPC_CHANNELS.customers.downloadTemplate),
  },
  catalog: {
    listPriceVersions: (params: unknown) => invoke<PageResponse<PriceVersionRow>>(IPC_CHANNELS.catalog.listPriceVersions, params),
    getProductById: (id: string) => invoke<Product | null>(IPC_CHANNELS.catalog.getProductById, id),
    createProduct: (params: unknown) => invoke<Product>(IPC_CHANNELS.catalog.createProduct, params),
    updateProduct: (params: unknown) => invoke<Product>(IPC_CHANNELS.catalog.updateProduct, params),
    createPriceVersion: (params: unknown) => invoke<PriceVersion>(IPC_CHANNELS.catalog.createPriceVersion, params),
    deleteProduct: (id: string) => invoke<void>(IPC_CHANNELS.catalog.deleteProduct, id),
    initialImportPreview: (filePath: string) => invoke<{ token: string; preview: CatalogImportPreviewResult }>(IPC_CHANNELS.catalog.initialImportPreview, filePath),
    initialImportConfirm: (token: string) => invoke<{ products: number; priceVersions: number }>(IPC_CHANNELS.catalog.initialImportConfirm, token),
    dailyImportPreview: (filePath: string) => invoke<{ token: string; preview: CatalogImportPreviewResult }>(IPC_CHANNELS.catalog.dailyImportPreview, filePath),
    dailyImportConfirm: (token: string) => invoke<{ products: number; priceVersions: number }>(IPC_CHANNELS.catalog.dailyImportConfirm, token),
    fieldHistory: (params: unknown) => invoke<{ rows: FieldHistoryEntry[]; total: number }>(IPC_CHANNELS.catalog.fieldHistory, params),
    getPriceVersionsByIds: (ids: string[]) => invoke<PriceVersion[]>('catalog.getPriceVersionsByIds', ids),
    downloadTemplate: (isInitial: boolean) =>
      invoke<{ saved: boolean; path?: string }>(IPC_CHANNELS.catalog.downloadTemplate, { isInitial }),
  },
  outbound: {
    validateDraft: (params: unknown) => invoke<DraftValidationResult>(IPC_CHANNELS.outbound.validateDraft, params),
    export: (params: unknown) => invoke<{ saved: boolean; batchId: string; batchNo: string; path?: string; totalQuantity?: number; totalAmountCent?: number; totalTaxCent?: number; totalCent?: number }>(IPC_CHANNELS.outbound.export, params),
    list: (params: unknown) => invoke<PageResponse<OutboundBatch>>(IPC_CHANNELS.outbound.list, params),
    getDetail: (id: string) => invoke<{ batch: OutboundBatch; lines: OutboundLine[] } | null>(IPC_CHANNELS.outbound.getDetail, id),
    download: (id: string) => invoke<{ saved: boolean; path?: string }>(IPC_CHANNELS.outbound.download, id),
    void: (id: string, reason: string) => invoke<OutboundBatch>(IPC_CHANNELS.outbound.void, { id, reason }),
  },
  replenishment: {
    preview: () => invoke<{ lines: ReplenishmentPreviewLine[]; snapshotAt: string }>(IPC_CHANNELS.replenishment.preview),
    export: () => invoke<{ exported: boolean; saved?: boolean; exportId?: string; exportNo?: string; path?: string; lineCount?: number; reason?: string }>(IPC_CHANNELS.replenishment.export),
    list: (page: number, pageSize: number) => invoke<PageResponse<ReplenishmentExport>>(IPC_CHANNELS.replenishment.list, { page, pageSize }),
    getDetail: (id: string) => invoke<{ exportRecord: ReplenishmentExport; lines: ReplenishmentExportLine[] } | null>(IPC_CHANNELS.replenishment.getDetail, id),
    download: (id: string) => invoke<{ saved: boolean; path?: string }>(IPC_CHANNELS.replenishment.download, id),
  },
  inbound: {
    preview: (filePath: string) => invoke<{ token: string; preview: InboundPreviewResult }>(IPC_CHANNELS.inbound.preview, filePath),
    confirm: (token: string) => invoke<{ batchId: string; batchNo: string; lineCount: number }>(IPC_CHANNELS.inbound.confirm, token),
    downloadTemplate: () => invoke<{ saved: boolean; path?: string }>(IPC_CHANNELS.inbound.downloadTemplate),
    list: (page: number, pageSize: number) => invoke<PageResponse<InboundBatch>>(IPC_CHANNELS.inbound.list, { page, pageSize }),
    getDetail: (id: string) => invoke<{ batch: InboundBatch; lines: InboundLine[] } | null>(IPC_CHANNELS.inbound.getDetail, id),
    void: (id: string, reason: string) => invoke<InboundBatch>(IPC_CHANNELS.inbound.void, { id, reason }),
  },
  inventory: {
    ledger: (priceVersionId: string, page: number, pageSize: number) => invoke<{ rows: InventoryLedger[]; total: number }>(IPC_CHANNELS.inventory.ledger, { priceVersionId, page, pageSize }),
    adjust: (params: unknown) => invoke<{ newBalance: number; ledgerId: string }>(IPC_CHANNELS.inventory.adjust, params),
    consistencyCheck: () => invoke<{ consistent: boolean; mismatches: Array<{ priceVersionId: string; cachedBalance: number; recomputedBalance: number | null }> }>(IPC_CHANNELS.inventory.consistencyCheck),
  },
  backup: {
    getStatus: () => invoke<BackupStatus>(IPC_CHANNELS.backup.getStatus),
    getConfig: () => invoke<{ configured: boolean; config: Partial<CosConfig>; credentialConfigured: boolean }>(IPC_CHANNELS.backup.getConfig),
    saveConfig: (params: unknown) => invoke<{ saved: boolean }>(IPC_CHANNELS.backup.saveConfig, params),
    testConnection: (params: unknown) => invoke<{ success: boolean; message: string }>(IPC_CHANNELS.backup.testConnection, params),
    create: () => invoke<{ taskId: string; objectKey: string; size: number; createdAt: string }>(IPC_CHANNELS.backup.create),
    list: () => invoke<{ rows: BackupHistoryItem[]; total: number }>(IPC_CHANNELS.backup.list),
    restore: (objectKey: string, restorePassword: string) => invoke<{ taskId: string; restored: boolean; manifest: unknown }>(IPC_CHANNELS.backup.restore, { objectKey, restorePassword }),
    getTaskStatus: () => invoke<{ taskId: string; type: string; phase: string; progress: number; processedBytes: number } | null>(IPC_CHANNELS.backup.getTaskStatus),
  },
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
