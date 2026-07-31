import { dialog, type WebContents } from 'electron';
import { registerHandler } from '../security/ipc-security';
import { IPC_CHANNELS } from '@shared/contracts/channels';
import { pageRequestSchema } from '@shared/schemas/index';
import {
  previewReplenishment,
  executeReplenishmentExport,
  listReplenishmentExports,
  getReplenishmentDetail,
  getReplenishmentXlsx,
} from '../domains/inventory/replenishment-service';
import { writeFile } from 'node:fs/promises';

/**
 * 月底负库存导出 IPC 处理器。
 */
export function registerReplenishmentIpc(): void {
  // 预览负库存
  registerHandler(IPC_CHANNELS.replenishment.preview, null, () => {
    return previewReplenishment();
  });

  // 执行导出
  registerHandler(IPC_CHANNELS.replenishment.export, null, async (_input: null, _sender: WebContents) => {
    const result = await executeReplenishmentExport();
    if (!result) {
      return { exported: false, reason: '当前无需向总部补票' };
    }

    const saveResult = await dialog.showSaveDialog({
      title: '保存月底负库存导出',
      defaultPath: `月底负库存导出_${result.exportNo}.xlsx`,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });

    if (saveResult.canceled || !saveResult.filePath) {
      return { exported: true, saved: false, exportId: result.exportId, exportNo: result.exportNo };
    }

    await writeFile(saveResult.filePath, result.xlsxBuffer);
    return {
      exported: true,
      saved: true,
      exportId: result.exportId,
      exportNo: result.exportNo,
      path: saveResult.filePath,
      lineCount: result.lineCount,
    };
  });

  registerHandler(IPC_CHANNELS.replenishment.list, pageRequestSchema, (input) => {
    return listReplenishmentExports(input.page, input.pageSize);
  });

  registerHandler(IPC_CHANNELS.replenishment.getDetail, null, (id: string) => {
    return getReplenishmentDetail(id);
  });

  registerHandler(IPC_CHANNELS.replenishment.download, null, async (id: string, _sender: WebContents) => {
    const xlsxData = getReplenishmentXlsx(id);
    if (!xlsxData) throw new Error('导出记录不存在');
    const saveResult = await dialog.showSaveDialog({
      title: '重新下载月底导出文件',
      defaultPath: `月底负库存导出_${xlsxData.exportNo}.xlsx`,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });
    if (saveResult.canceled || !saveResult.filePath) return { saved: false };
    await writeFile(saveResult.filePath, xlsxData.buffer);
    return { saved: true, path: saveResult.filePath };
  });
}
