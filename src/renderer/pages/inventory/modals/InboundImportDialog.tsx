import { App } from 'antd';
import { api } from '@renderer/api';
import { ExcelImportStep } from '../components/ExcelImportStep';

export function InboundImportDialog({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}) {
  const { message } = App.useApp();

  const downloadTemplate = async () => {
    const res = (await api.inbound.downloadTemplate()) as { saved: boolean; path?: string };
    if (res.saved) message.success(`模板已保存：${res.path ?? ''}`);
    else message.error('模板保存失败');
  };

  const preview = async (filePath: string) => {
    const res = (await api.inbound.preview(filePath)) as {
      token: string;
      preview: { hasErrors: boolean; errors: unknown[] };
    };
    return {
      token: res.token,
      ok: !res.preview.hasErrors,
      message: `校验完成，错误 ${(res.preview.errors ?? []).length} 条`,
    };
  };

  const confirm = async (token: string) => {
    const res = (await api.inbound.confirm(token)) as {
      batchId: string;
      batchNo: string;
      lineCount: number;
    };
    if (res.batchId) onImported();
    return res;
  };

  return (
    <ExcelImportStep
      open={open}
      title="入库开票数据导入"
      templateName="入库导入模板.xlsx"
      onDownloadTemplate={downloadTemplate}
      onPreview={preview}
      onConfirm={confirm}
      confirmText="确认导入"
      onClose={onClose}
    />
  );
}
