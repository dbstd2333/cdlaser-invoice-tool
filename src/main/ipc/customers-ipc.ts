import { dialog, type WebContents } from 'electron';
import { registerHandler } from '../security/ipc-security';
import { IPC_CHANNELS } from '@shared/contracts/channels';
import {
  customerQuerySchema,
  customerUpsertSchema,
  fieldHistoryQuerySchema,
} from '@shared/schemas/index';
import {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  toggleCustomerStatus,
} from '../domains/customers/customer-service';
import {
  buildCustomerPreview,
  cacheCustomerPreview,
  confirmCustomerInitialImport,
} from '../domains/customers/customer-import-service';
import { queryFieldHistory } from '../domains/audit/audit-service';
import { parseCustomerExcel } from '../excel/importers/parsers';
import { generateCustomerTemplate } from '../excel/importers/template-generator';
import { getInitStatus } from '../domains/audit/settings-service';

/**
 * 客户 IPC 处理器。
 */
export function registerCustomersIpc(): void {
  registerHandler(IPC_CHANNELS.customers.list, customerQuerySchema, (input) => {
    return listCustomers(input);
  });

  registerHandler(IPC_CHANNELS.customers.getById, null, (id: string) => {
    return getCustomerById(id);
  });

  registerHandler(IPC_CHANNELS.customers.create, customerUpsertSchema, (input) => {
    return createCustomer(input);
  });

  registerHandler(IPC_CHANNELS.customers.update, customerUpsertSchema, (input) => {
    return updateCustomer(input);
  });

  registerHandler(IPC_CHANNELS.customers.toggleStatus, null, (id: string) => {
    return toggleCustomerStatus(id);
  });

  registerHandler(IPC_CHANNELS.customers.initialImportPreview, null, async (filePath: string, _sender: WebContents) => {
    const initStatus = getInitStatus();
    if (initStatus.customerInitialImportDone) {
      throw new Error('客户首次导入已完成，不能重复执行');
    }
    const parsed = await parseCustomerExcel(filePath);
    const preview = buildCustomerPreview(
      parsed.map((p) => ({
        rowIndex: p.rowIndex,
        name: p.name,
        taxId: p.taxId,
        taxIdUnsafeNumericPrecision: p.taxIdUnsafeNumericPrecision,
        shortCode: p.shortCode,
        address: p.address,
        phone: p.phone,
        bankName: p.bankName,
        bankAccount: p.bankAccount,
        bankAccountUnsafeNumericPrecision: p.bankAccountUnsafeNumericPrecision,
        email: p.email,
        isDefaultAddress: p.isDefaultAddress,
      })),
    );
    const token = cacheCustomerPreview(preview);
    return { token, preview };
  });

  registerHandler(IPC_CHANNELS.customers.initialImportConfirm, null, (token: string) => {
    return confirmCustomerInitialImport(token);
  });

  registerHandler(IPC_CHANNELS.customers.history, fieldHistoryQuerySchema, (input) => {
    return queryFieldHistory(input.entityType, input.entityId, input.page, input.pageSize);
  });

  // 下载客户模板
  registerHandler(IPC_CHANNELS.customers.downloadTemplate, null, async (_input: null, _sender: WebContents) => {
    const result = await dialog.showSaveDialog({
      title: '保存客户导入模板',
      defaultPath: '客户导入模板.xlsx',
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });
    if (result.canceled || !result.filePath) return { saved: false };
    await generateCustomerTemplate(result.filePath);
    return { saved: true, path: result.filePath };
  });
}
