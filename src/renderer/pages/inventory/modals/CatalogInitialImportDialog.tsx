import { App } from 'antd';
import { api } from '@renderer/api';
import { ExcelImportStep } from '../components/ExcelImportStep';
import {
  CatalogImportCompletion,
  CatalogImportConfirmation,
  CatalogImportPreviewPanel,
  type CatalogImportResult,
} from '../components/CatalogImportPreview';
import type { CatalogImportPreviewResult } from '@shared/contracts/preview-types';

export function CatalogInitialImportDialog({
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
    const res = (await api.catalog.downloadTemplate(true)) as { saved: boolean; path?: string };
    if (res.saved) message.success(`模板已保存：${res.path ?? ''}`);
    else message.error('模板保存失败');
  };

  const preview = async (filePath: string) => {
    const res = (await api.catalog.initialImportPreview(filePath)) as {
      token: string;
      preview: CatalogImportPreviewResult;
    };
    return {
      token: res.token,
      ok: !res.preview.hasErrors,
      message: `校验完成，错误 ${res.preview.errorCount} 条`,
      preview: res.preview,
    };
  };

  const confirm = async (token: string) => {
    const res = (await api.catalog.initialImportConfirm(token)) as CatalogImportResult;
    if (res.createdCount >= 0) onImported();
    return res;
  };

  return (
    <ExcelImportStep
      open={open}
      title="商品期初导入"
      templateName="商品期初导入模板.xlsx"
      onDownloadTemplate={downloadTemplate}
      onPreview={preview}
      onConfirm={confirm}
      renderPreview={(result) => <CatalogImportPreviewPanel preview={result} />}
      renderConfirmation={(result) => <CatalogImportConfirmation preview={result} />}
      renderCompletion={(result) => <CatalogImportCompletion result={result} />}
      width="90vw"
      onClose={onClose}
    />
  );
}
