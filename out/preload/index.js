let electron = require("electron");
//#region src/shared/contracts/channels.ts
/**
* IPC 频道定义 - 按业务命名空间组织。
* 主进程通过 ipcMain.handle 注册，渲染进程通过 preload 暴露的 API 调用。
*/
var IPC_CHANNELS = {
	system: {
		getVersion: "system.getVersion",
		getInitStatus: "system.getInitStatus",
		getDbHealth: "system.getDbHealth",
		getDiskSpace: "system.getDiskSpace",
		exportDiagnostics: "system.exportDiagnostics",
		selectFile: "system.selectFile"
	},
	customers: {
		list: "customers.list",
		getById: "customers.getById",
		create: "customers.create",
		update: "customers.update",
		toggleStatus: "customers.toggleStatus",
		initialImportPreview: "customers.initialImportPreview",
		initialImportConfirm: "customers.initialImportConfirm",
		downloadTemplate: "customers.downloadTemplate",
		history: "customers.history"
	},
	catalog: {
		listPriceVersions: "catalog.listPriceVersions",
		getProductById: "catalog.getProductById",
		createProduct: "catalog.createProduct",
		updateProduct: "catalog.updateProduct",
		createPriceVersion: "catalog.createPriceVersion",
		deleteProduct: "catalog.deleteProduct",
		getPriceVersionsByProduct: "catalog.getPriceVersionsByProduct",
		initialImportPreview: "catalog.initialImportPreview",
		initialImportConfirm: "catalog.initialImportConfirm",
		dailyImportPreview: "catalog.dailyImportPreview",
		dailyImportConfirm: "catalog.dailyImportConfirm",
		downloadTemplate: "catalog.downloadTemplate",
		fieldHistory: "catalog.fieldHistory"
	},
	outbound: {
		validateDraft: "outbound.validateDraft",
		export: "outbound.export",
		list: "outbound.list",
		getDetail: "outbound.getDetail",
		download: "outbound.download",
		void: "outbound.void"
	},
	replenishment: {
		preview: "replenishment.preview",
		export: "replenishment.export",
		list: "replenishment.list",
		getDetail: "replenishment.getDetail",
		download: "replenishment.download"
	},
	inbound: {
		preview: "inbound.preview",
		confirm: "inbound.confirm",
		downloadTemplate: "inbound.downloadTemplate",
		list: "inbound.list",
		getDetail: "inbound.getDetail",
		void: "inbound.void"
	},
	inventory: {
		ledger: "inventory.ledger",
		adjust: "inventory.adjust",
		consistencyCheck: "inventory.consistencyCheck"
	},
	backup: {
		getStatus: "backup.getStatus",
		getConfig: "backup.getConfig",
		saveConfig: "backup.saveConfig",
		testConnection: "backup.testConnection",
		create: "backup.create",
		list: "backup.list",
		restore: "backup.restore",
		getTaskStatus: "backup.getTaskStatus"
	}
};
//#endregion
//#region src/preload/index.ts
/** 调用 IPC 并解包响应，序列化参数作为 preload 侧的第二层保护。 */
async function invoke(channel, ...args) {
	const safe = args.length > 0 ? JSON.parse(JSON.stringify(args)) : args;
	const response = await electron.ipcRenderer.invoke(channel, ...safe);
	if (response.ok) return response.data;
	const err = new Error(response.error);
	err.fieldErrors = response.fieldErrors;
	throw err;
}
electron.contextBridge.exposeInMainWorld("api", {
	system: {
		getVersion: () => invoke(IPC_CHANNELS.system.getVersion),
		getInitStatus: () => invoke(IPC_CHANNELS.system.getInitStatus),
		getDbHealth: () => invoke(IPC_CHANNELS.system.getDbHealth),
		getDiskSpace: () => invoke(IPC_CHANNELS.system.getDiskSpace),
		exportDiagnostics: () => invoke(IPC_CHANNELS.system.exportDiagnostics),
		selectFile: (params) => invoke(IPC_CHANNELS.system.selectFile, params)
	},
	customers: {
		list: (params) => invoke(IPC_CHANNELS.customers.list, params),
		getById: (id) => invoke(IPC_CHANNELS.customers.getById, id),
		create: (params) => invoke(IPC_CHANNELS.customers.create, params),
		update: (params) => invoke(IPC_CHANNELS.customers.update, params),
		toggleStatus: (id) => invoke(IPC_CHANNELS.customers.toggleStatus, id),
		initialImportPreview: (filePath) => invoke(IPC_CHANNELS.customers.initialImportPreview, filePath),
		initialImportConfirm: (token) => invoke(IPC_CHANNELS.customers.initialImportConfirm, token),
		history: (params) => invoke(IPC_CHANNELS.customers.history, params),
		downloadTemplate: () => invoke(IPC_CHANNELS.customers.downloadTemplate)
	},
	catalog: {
		listPriceVersions: (params) => invoke(IPC_CHANNELS.catalog.listPriceVersions, params),
		getProductById: (id) => invoke(IPC_CHANNELS.catalog.getProductById, id),
		createProduct: (params) => invoke(IPC_CHANNELS.catalog.createProduct, params),
		updateProduct: (params) => invoke(IPC_CHANNELS.catalog.updateProduct, params),
		createPriceVersion: (params) => invoke(IPC_CHANNELS.catalog.createPriceVersion, params),
		deleteProduct: (id) => invoke(IPC_CHANNELS.catalog.deleteProduct, id),
		initialImportPreview: (filePath) => invoke(IPC_CHANNELS.catalog.initialImportPreview, filePath),
		initialImportConfirm: (token) => invoke(IPC_CHANNELS.catalog.initialImportConfirm, token),
		dailyImportPreview: (filePath) => invoke(IPC_CHANNELS.catalog.dailyImportPreview, filePath),
		dailyImportConfirm: (token) => invoke(IPC_CHANNELS.catalog.dailyImportConfirm, token),
		fieldHistory: (params) => invoke(IPC_CHANNELS.catalog.fieldHistory, params),
		getPriceVersionsByIds: (ids) => invoke("catalog.getPriceVersionsByIds", ids),
		getPriceVersionsByProduct: (productId) => invoke(IPC_CHANNELS.catalog.getPriceVersionsByProduct, productId),
		downloadTemplate: (isInitial) => invoke(IPC_CHANNELS.catalog.downloadTemplate, { isInitial })
	},
	outbound: {
		validateDraft: (params) => invoke(IPC_CHANNELS.outbound.validateDraft, params),
		export: (params) => invoke(IPC_CHANNELS.outbound.export, params),
		list: (params) => invoke(IPC_CHANNELS.outbound.list, params),
		getDetail: (id) => invoke(IPC_CHANNELS.outbound.getDetail, id),
		download: (id) => invoke(IPC_CHANNELS.outbound.download, id),
		void: (id, reason) => invoke(IPC_CHANNELS.outbound.void, {
			id,
			reason
		})
	},
	replenishment: {
		preview: () => invoke(IPC_CHANNELS.replenishment.preview),
		export: () => invoke(IPC_CHANNELS.replenishment.export),
		list: (page, pageSize) => invoke(IPC_CHANNELS.replenishment.list, {
			page,
			pageSize
		}),
		getDetail: (id) => invoke(IPC_CHANNELS.replenishment.getDetail, id),
		download: (id) => invoke(IPC_CHANNELS.replenishment.download, id)
	},
	inbound: {
		preview: (filePath) => invoke(IPC_CHANNELS.inbound.preview, filePath),
		confirm: (token) => invoke(IPC_CHANNELS.inbound.confirm, token),
		downloadTemplate: () => invoke(IPC_CHANNELS.inbound.downloadTemplate),
		list: (page, pageSize) => invoke(IPC_CHANNELS.inbound.list, {
			page,
			pageSize
		}),
		getDetail: (id) => invoke(IPC_CHANNELS.inbound.getDetail, id),
		void: (id, reason) => invoke(IPC_CHANNELS.inbound.void, {
			id,
			reason
		})
	},
	inventory: {
		ledger: (priceVersionId, page, pageSize) => invoke(IPC_CHANNELS.inventory.ledger, {
			priceVersionId,
			page,
			pageSize
		}),
		adjust: (params) => invoke(IPC_CHANNELS.inventory.adjust, params),
		consistencyCheck: () => invoke(IPC_CHANNELS.inventory.consistencyCheck)
	},
	backup: {
		getStatus: () => invoke(IPC_CHANNELS.backup.getStatus),
		getConfig: () => invoke(IPC_CHANNELS.backup.getConfig),
		saveConfig: (params) => invoke(IPC_CHANNELS.backup.saveConfig, params),
		testConnection: (params) => invoke(IPC_CHANNELS.backup.testConnection, params),
		create: () => invoke(IPC_CHANNELS.backup.create),
		list: () => invoke(IPC_CHANNELS.backup.list),
		restore: (objectKey, restorePassword) => invoke(IPC_CHANNELS.backup.restore, {
			objectKey,
			restorePassword
		}),
		getTaskStatus: () => invoke(IPC_CHANNELS.backup.getTaskStatus)
	}
});
//#endregion
