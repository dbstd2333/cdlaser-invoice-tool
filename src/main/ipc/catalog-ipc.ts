import { dialog, type WebContents } from 'electron';
import { registerHandler } from '../security/ipc-security';
import { IPC_CHANNELS } from '@shared/contracts/channels';
import {
  priceVersionQuerySchema,
  productUpsertSchema,
  priceVersionCreateSchema,
  fieldHistoryQuerySchema,
} from '@shared/schemas/index';
import {
  listPriceVersions,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  createPriceVersion,
  togglePriceVersionStatus,
  getPriceVersionsByIds,
} from '../domains/catalog/catalog-service';
import {
  buildInitialImportPreview,
  buildDailyImportPreview,
  cacheCatalogPreview,
  confirmInitialImport,
  confirmDailyImport,
} from '../domains/catalog/catalog-import-service';
import { parseCatalogExcel } from '../excel/importers/parsers';
import { generateCatalogTemplate } from '../excel/importers/template-generator';
import { queryFieldHistory } from '../domains/audit/audit-service';
import { getInitStatus } from '../domains/audit/settings-service';

/**
 * 商品与价格版本 IPC 处理器。
 */
export function registerCatalogIpc(): void {
  registerHandler(IPC_CHANNELS.catalog.listPriceVersions, priceVersionQuerySchema, (input) => {
    return listPriceVersions(input);
  });

  registerHandler(IPC_CHANNELS.catalog.getProductById, null, (id: string) => {
    return getProductById(id);
  });

  registerHandler(IPC_CHANNELS.catalog.createProduct, productUpsertSchema, (input) => {
    return createProduct(input);
  });

  registerHandler(IPC_CHANNELS.catalog.updateProduct, productUpsertSchema, (input) => {
    return updateProduct(input);
  });

  registerHandler(IPC_CHANNELS.catalog.toggleProductStatus, null, (id: string) => {
    return toggleProductStatus(id);
  });

  registerHandler(IPC_CHANNELS.catalog.createPriceVersion, priceVersionCreateSchema, (input) => {
    return createPriceVersion(input);
  });

  registerHandler(IPC_CHANNELS.catalog.togglePriceVersionStatus, null, (id: string) => {
    return togglePriceVersionStatus(id);
  });

  // 商品首次导入预览
  registerHandler(IPC_CHANNELS.catalog.initialImportPreview, null, async (filePath: string) => {
    if (getInitStatus().productInitialImportDone) {
      throw new Error('商品首次导入已完成，不能重复执行');
    }
    const parsed = await parseCatalogExcel(filePath, true);
    const preview = buildInitialImportPreview(
      parsed.map((p) => ({
        rowIndex: p.rowIndex,
        name: p.name,
        model: p.model,
        unit: p.unit,
        taxClassificationCode: p.taxClassificationCode,
        unitPriceDecimal: p.unitPriceDecimal,
        initialStock: p.initialStock,
        remark: p.remark,
      })),
    );
    const token = cacheCatalogPreview(preview);
    return { token, preview };
  });

  registerHandler(IPC_CHANNELS.catalog.initialImportConfirm, null, (token: string) => {
    return confirmInitialImport(token);
  });

  // 商品日常导入预览
  registerHandler(IPC_CHANNELS.catalog.dailyImportPreview, null, async (filePath: string) => {
    if (!getInitStatus().productInitialImportDone) {
      throw new Error('商品首次导入尚未完成，不能执行日常导入');
    }
    const parsed = await parseCatalogExcel(filePath, false);
    const preview = buildDailyImportPreview(
      parsed.map((p) => ({
        rowIndex: p.rowIndex,
        name: p.name,
        model: p.model,
        unit: p.unit,
        taxClassificationCode: p.taxClassificationCode,
        unitPriceDecimal: p.unitPriceDecimal,
        initialStock: null,
        remark: p.remark,
      })),
    );
    const token = cacheCatalogPreview(preview);
    return { token, preview };
  });

  registerHandler(IPC_CHANNELS.catalog.dailyImportConfirm, null, (token: string) => {
    return confirmDailyImport(token);
  });

  registerHandler(IPC_CHANNELS.catalog.fieldHistory, fieldHistoryQuerySchema, (input) => {
    return queryFieldHistory(input.entityType, input.entityId, input.page, input.pageSize);
  });

  // 批量获取价格版本详情（开票 Modal 前校验）
  registerHandler('catalog.getPriceVersionsByIds', null, (ids: string[]) => {
    return getPriceVersionsByIds(ids);
  });

  // 下载商品模板
  registerHandler(IPC_CHANNELS.catalog.downloadTemplate, null, async (input: { isInitial: boolean }, _sender: WebContents) => {
    const result = await dialog.showSaveDialog({
      title: input.isInitial ? '保存商品首次导入模板' : '保存商品日常导入模板',
      defaultPath: input.isInitial ? '商品首次导入模板.xlsx' : '商品日常导入模板.xlsx',
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });
    if (result.canceled || !result.filePath) return { saved: false };
    await generateCatalogTemplate(result.filePath, input.isInitial);
    return { saved: true, path: result.filePath };
  });
}
