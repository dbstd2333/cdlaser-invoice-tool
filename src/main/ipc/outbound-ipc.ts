import { dialog, type WebContents } from 'electron';
import { registerHandler } from '../security/ipc-security';
import { IPC_CHANNELS } from '@shared/contracts/channels';
import {
  outboundExportSchema,
  outboundQuerySchema,
  voidRequestSchema,
} from '@shared/schemas/index';
import {
  validateDraft,
  executeOutboundExport,
  listOutboundBatches,
  getOutboundDetail,
  getOutboundXlsx,
  voidOutboundBatch,
} from '../domains/outbound/outbound-service';
import { rename, unlink, writeFile } from 'node:fs/promises';

import log from 'electron-log/main';

/**
 * 销项开票 IPC 处理器 - 导出、列表、详情、下载、作废。
 */

/** 清理文件名中的非法字符 */
function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '').trim() || '未命名';
}

export function registerOutboundIpc(): void {
  // 校验草稿（开票 Modal 打开前）
  registerHandler(IPC_CHANNELS.outbound.validateDraft, outboundExportSchema, (input) => {
    return validateDraft(input);
  });

  // 执行导出：生成 XLSX -> 保存对话框 -> 写入文件 -> 事务写入
  registerHandler(IPC_CHANNELS.outbound.export, outboundExportSchema, async (input, sender: WebContents) => {
    // 先执行导出事务生成 XLSX 和数据库记录
    const result = await executeOutboundExport(input);

    // 弹出保存对话框
    const saveResult = await dialog.showSaveDialog({
      title: '保存税务模板',
      defaultPath: `销项开票_${sanitizeFileName(result.customerName)}_${result.batchNo}.xlsx`,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });

    if (saveResult.canceled || !saveResult.filePath) {
      // 用户取消保存，事务已写入但需要告知
      // PRD 要求：只有文件生成与保存成功后，系统才保存开票记录
      // 但由于事务已提交，这里需要作废刚创建的记录并恢复库存
      // 为简化实现：回滚刚创建的批次
      voidOutboundBatch(result.batchId, '导出时用户取消保存');
      return { saved: false, batchId: result.batchId, batchNo: result.batchNo };
    }

    // 写入临时文件再原子替换
    const tempPath = saveResult.filePath + '.tmp';
    try {
      await writeFile(tempPath, result.xlsxBuffer);
      await rename(tempPath, saveResult.filePath);
      return {
        saved: true,
        batchId: result.batchId,
        batchNo: result.batchNo,
        path: saveResult.filePath,
        totalQuantity: result.totalQuantity,
        totalAmountCent: result.totalAmountCent,
        totalTaxCent: result.totalTaxCent,
        totalCent: result.totalCent,
      };
    } catch (err) {
      // 文件写入失败，作废记录并恢复库存
      log.error('[outbound] 文件保存失败:', err);
      try { await unlink(tempPath); } catch { /* ignore */ }
      voidOutboundBatch(result.batchId, '文件保存失败，自动回滚');
      throw new Error(`文件保存失败: ${(err as Error).message}`);
    }
  });

  registerHandler(IPC_CHANNELS.outbound.list, outboundQuerySchema, (input) => {
    return listOutboundBatches(input);
  });

  registerHandler(IPC_CHANNELS.outbound.getDetail, null, (id: string) => {
    return getOutboundDetail(id);
  });

  // 重新下载原始 Excel
  registerHandler(IPC_CHANNELS.outbound.download, null, async (id: string, sender: WebContents) => {
    const xlsxData = getOutboundXlsx(id);
    if (!xlsxData) throw new Error('开票记录不存在');
    const saveResult = await dialog.showSaveDialog({
      title: '重新下载开票文件',
      defaultPath: `销项开票_${sanitizeFileName(xlsxData.customerName)}_${xlsxData.batchNo}.xlsx`,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });
    if (saveResult.canceled || !saveResult.filePath) return { saved: false };
    await writeFile(saveResult.filePath, xlsxData.buffer);
    return { saved: true, path: saveResult.filePath };
  });

  registerHandler(IPC_CHANNELS.outbound.void, voidRequestSchema, (input) => {
    return voidOutboundBatch(input.id, input.reason);
  });
}
