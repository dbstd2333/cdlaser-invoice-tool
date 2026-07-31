import { useState } from 'react';
import { Alert, Button, Modal, Steps, Typography } from 'antd';
import { InboxOutlined, DownloadOutlined } from '@renderer/icons';
import { api } from '@renderer/api';
import { App } from 'antd';

const { Text } = Typography;

export function CustomerInitialImportDialog({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}) {
  const { message } = App.useApp();
  const [step, setStep] = useState(0);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [previewMsg, setPreviewMsg] = useState<string | null>(null);
  const [previewOk, setPreviewOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setStep(0);
    setFilePath(null);
    setToken(null);
    setPreviewMsg(null);
    setPreviewOk(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDownloadTemplate = async () => {
    const res = (await api.customers.downloadTemplate()) as { saved: boolean; path?: string };
    if (res.saved) message.success(`模板已保存：${res.path ?? ''}`);
    else message.error('模板保存失败');
  };

  const handlePickFile = async () => {
    const res = (await api.system.selectFile({ extensions: ['xlsx'] })) as { canceled: boolean; filePath: string | null };
    if (res.canceled || !res.filePath) {
      message.warning('未选择文件');
      return;
    }
    setFilePath(res.filePath);
    setStep(1);
  };

  const handlePreview = async () => {
    if (!filePath) return;
    setBusy(true);
    try {
      const res = (await api.customers.initialImportPreview(filePath)) as {
        token: string;
        preview: { hasErrors: boolean; errorCount: number; newCount: number; duplicateTaxIdCount: number };
      };
      setToken(res.token);
      setPreviewOk(!res.preview.hasErrors);
      setPreviewMsg(
        `新增 ${res.preview.newCount} 条，重复税号 ${res.preview.duplicateTaxIdCount} 条，错误 ${res.preview.errorCount} 条`,
      );
      if (!res.preview.hasErrors) setStep(2);
    } catch (e) {
      message.error(`预览失败：${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async () => {
    if (!token) return;
    setBusy(true);
    try {
      const res = (await api.customers.initialImportConfirm(token)) as { imported: number };
      if (res.imported >= 0) {
        message.success(`期初导入完成，共导入 ${res.imported} 条`);
        setStep(3);
        onImported();
      } else {
        message.error('导入失败');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="客户期初导入" open={open} onCancel={handleClose} footer={null} width={560}>
      <Steps
        current={step}
        size="small"
        className="!mb-4"
        items={[{ title: '选择文件' }, { title: '校验' }, { title: '确认' }, { title: '完成' }]}
      />
      {step === 0 && (
        <>
          <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate} className="!mb-3">
            下载模板
          </Button>
          <div
            className="border border-dashed border-[#d9d9d9] rounded-lg p-6 text-center cursor-pointer"
            onClick={() => void handlePickFile()}
          >
            <InboxOutlined className="!text-[32px] !text-brand" />
            <p className="ant-upload-text">点击选择 Excel 文件</p>
            <Text type="secondary">仅支持 .xlsx 模板</Text>
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <Alert type="info" message={`已选择：${filePath}`} className="!mb-3" />
          <div className="text-right">
            <Button className="!mr-2" onClick={() => setStep(0)}>
              上一步
            </Button>
            <Button type="primary" loading={busy} onClick={handlePreview}>
              校验
            </Button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <Alert type={previewOk ? 'success' : 'error'} message={previewMsg ?? '校验未通过'} className="!mb-3" />
          <div className="text-right">
            <Button className="!mr-2" onClick={() => setStep(1)}>
              上一步
            </Button>
            <Button type="primary" loading={busy} onClick={handleImport}>
              确认导入
            </Button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <Alert type="success" message="期初导入已完成" className="!mb-3" />
          <div className="text-right">
            <Button type="primary" onClick={handleClose}>
              完成
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
