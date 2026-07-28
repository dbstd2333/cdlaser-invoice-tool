import { dialog, type WebContents } from 'electron';
import { registerHandler } from '../security/ipc-security';
import { IPC_CHANNELS } from '@shared/contracts/channels';
import { pageRequestSchema, voidRequestSchema } from '@shared/schemas/index';
import {
  buildInboundPreview,
  cacheInboundPreview,
  confirmInboundImport,
  listInboundBatches,
  getInboundDetail,
  voidInboundBatch,
  computeFileSha256,
} from '../domains/inbound/inbound-service';
import { parseInboundExcel } from '../excel/importers/parsers';
import { generateInboundTemplate } from '../excel/importers/template-generator';

/**
 * 月初进项导入 IPC 处理器。
 */
export function registerInboundIpc(): void {
  // 预览
  registerHandler(IPC_CHANNELS.inbound.preview, null, async (filePath: string) => {
    const fileSha256 = computeFileSha256(filePath);
    const { rows, fileName } = await parseInboundExcel(filePath);
    const preview = buildInboundPreview(rows, fileSha256);
    const token = cacheInboundPreview(preview, filePath, fileName);
    return { token, preview };
  });

  registerHandler(IPC_CHANNELS.inbound.confirm, null, (token: string) => {
    return confirmInboundImport(token);
  });

  // 下载月初总部进项导入模板
  registerHandler(IPC_CHANNELS.inbound.downloadTemplate, null, async (_input: null, _sender: WebContents) => {
    const result = await dialog.showSaveDialog({
      title: '保存月初总部进项导入模板',
      defaultPath: '月初总部进项导入模板.xlsx',
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });
    if (result.canceled || !result.filePath) return { saved: false };
    await generateInboundTemplate(result.filePath);
    return { saved: true, path: result.filePath };
  });

  registerHandler(IPC_CHANNELS.inbound.list, pageRequestSchema, (input) => {
    return listInboundBatches(input.page, input.pageSize);
  });

  registerHandler(IPC_CHANNELS.inbound.getDetail, null, (id: string) => {
    return getInboundDetail(id);
  });

  registerHandler(IPC_CHANNELS.inbound.void, voidRequestSchema, (input) => {
    return voidInboundBatch(input.id, input.reason);
  });
}
