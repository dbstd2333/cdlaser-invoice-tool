import { useState, type ReactNode } from 'react';
import { Alert, App, Button, Modal, Steps, Typography } from 'antd';
import { DownloadOutlined, InboxOutlined } from '@renderer/icons';
import { api } from '@renderer/api';

const { Text } = Typography;

export interface ImportPreviewResponse<TPreview> {
  token: string;
  ok: boolean;
  message?: string;
  preview: TPreview;
}

interface ExcelImportStepProps<TPreview, TResult> {
  open: boolean;
  title: string;
  templateName: string;
  onDownloadTemplate: () => Promise<void>;
  onPreview: (filePath: string) => Promise<ImportPreviewResponse<TPreview>>;
  onConfirm: (token: string) => Promise<TResult>;
  renderPreview?: (preview: TPreview) => ReactNode;
  renderConfirmation?: (preview: TPreview) => ReactNode;
  renderCompletion?: (result: TResult) => ReactNode;
  confirmText?: string;
  width?: number | string;
  onClose: () => void;
}

/** 提供“选择、校验、确认、完成”四阶段的通用 Excel 导入流程。 */
export function ExcelImportStep<TPreview, TResult>({
  open,
  title,
  templateName,
  onDownloadTemplate,
  onPreview,
  onConfirm,
  renderPreview,
  renderConfirmation,
  renderCompletion,
  confirmText = '确认导入',
  width = 560,
  onClose,
}: ExcelImportStepProps<TPreview, TResult>) {
  const { message } = App.useApp();
  const [step, setStep] = useState(0);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [previewResponse, setPreviewResponse] = useState<ImportPreviewResponse<TPreview> | null>(null);
  const [confirmResult, setConfirmResult] = useState<TResult | null>(null);
  const [busy, setBusy] = useState(false);

  /** 清空本轮导入产生的文件、令牌和结果状态。 */
  const reset = () => {
    setStep(0);
    setFilePath(null);
    setPreviewResponse(null);
    setConfirmResult(null);
    setBusy(false);
  };

  /** 关闭弹窗并恢复到第一步。 */
  const handleClose = () => {
    if (busy) return;
    reset();
    onClose();
  };

  /** 通过主进程选择待导入的 Excel 文件。 */
  const handlePickFile = async () => {
    const res = (await api.system.selectFile({ extensions: ['xlsx'] })) as {
      canceled: boolean;
      filePath: string | null;
    };
    if (res.canceled || !res.filePath) return;
    setFilePath(res.filePath);
    setPreviewResponse(null);
    setStep(1);
  };

  /** 执行校验并停留在第二步展示完整结果。 */
  const handlePreview = async () => {
    if (!filePath || busy) return;
    setBusy(true);
    try {
      const response = await onPreview(filePath);
      setPreviewResponse(response);
    } catch (error) {
      message.error(`校验失败：${(error as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  /** 提交已校验的预览令牌，避免重复确认。 */
  const handleConfirm = async () => {
    if (!previewResponse?.token || !previewResponse.ok || busy) return;
    setBusy(true);
    try {
      const result = await onConfirm(previewResponse.token);
      setConfirmResult(result);
      setStep(3);
      message.success('导入完成');
    } catch (error) {
      message.error(`导入失败：${(error as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={width}
      maskClosable={false}
      keyboard={!busy}
      destroyOnHidden
    >
      <Steps
        current={step}
        size="small"
        className="!mb-5"
        items={[{ title: '选择文件' }, { title: '校验' }, { title: '确认' }, { title: '完成' }]}
      />

      {step === 0 && (
        <div className="space-y-3">
          <Button icon={<DownloadOutlined />} onClick={() => void onDownloadTemplate()}>
            下载模板（{templateName}）
          </Button>
          <button
            type="button"
            className="w-full border border-dashed border-[#b8c2cc] rounded-lg p-8 text-center cursor-pointer bg-[#fafcff] hover:border-brand transition-colors"
            onClick={() => void handlePickFile()}
          >
            <InboxOutlined className="!text-[34px] !text-brand" />
            <span className="block mt-2 text-sm text-gray-700">点击选择 Excel 文件</span>
            <Text type="secondary">仅支持 .xlsx 模板</Text>
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Alert type="info" showIcon message="已选择文件" description={filePath} />
          {previewResponse && (
            renderPreview ? renderPreview(previewResponse.preview) : (
              <Alert
                showIcon
                type={previewResponse.ok ? 'success' : 'error'}
                message={previewResponse.message ?? (previewResponse.ok ? '校验通过' : '校验未通过')}
              />
            )
          )}
          <div className="flex justify-end gap-2">
            <Button disabled={busy} onClick={reset}>重新选择</Button>
            {!previewResponse && <Button type="primary" loading={busy} onClick={() => void handlePreview()}>开始校验</Button>}
            {previewResponse && !previewResponse.ok && <Button type="primary" loading={busy} onClick={() => void handlePreview()}>重新校验</Button>}
            {previewResponse?.ok && <Button type="primary" onClick={() => setStep(2)}>下一步</Button>}
          </div>
        </div>
      )}

      {step === 2 && previewResponse && (
        <div className="space-y-4">
          {renderConfirmation ? renderConfirmation(previewResponse.preview) : (
            <Alert type="warning" showIcon message="请确认导入" description={previewResponse.message ?? '校验已通过'} />
          )}
          <div className="flex justify-end gap-2">
            <Button disabled={busy} onClick={() => setStep(1)}>上一步</Button>
            <Button type="primary" loading={busy} onClick={() => void handleConfirm()}>{confirmText}</Button>
          </div>
        </div>
      )}

      {step === 3 && confirmResult !== null && (
        <div className="space-y-4">
          {renderCompletion ? renderCompletion(confirmResult) : <Alert type="success" showIcon message="导入已完成" />}
          <div className="text-right"><Button type="primary" onClick={handleClose}>完成</Button></div>
        </div>
      )}
    </Modal>
  );
}
