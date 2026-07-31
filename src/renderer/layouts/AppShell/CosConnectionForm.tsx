import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Switch, App } from 'antd';
import { useBackupStore, DEFAULT_CONFIG, type CosConfigInput } from '@renderer/stores/backup';

const EMPTY: CosConfigInput = {
  region: '',
  bucket: '',
  prefix: '',
  secretId: '',
  secretKey: '',
  autoBackup: false,
  retentionCount: 10,
  restorePassword: '',
};

export function CosConnectionForm({ onSaved }: { onSaved: () => void }) {
  const { config, testing, testConnection, saveConfig } = useBackupStore();
  const { message } = App.useApp();
  const [form] = Form.useForm<CosConfigInput>();
  const [draft, setDraft] = useState<CosConfigInput>(config ?? EMPTY);

  useEffect(() => {
    if (config) setDraft(config);
  }, [config]);

  const handleTest = async () => {
    const values = form.getFieldsValue();
    const ok = await testConnection(values);
    if (ok) message.success('连接成功');
    else message.error('连接失败');
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload: CosConfigInput = {
      ...values,
      retentionCount: Number(values.retentionCount ?? DEFAULT_CONFIG.retentionCount),
    };
    await saveConfig(payload);
    message.success('已保存配置');
    onSaved();
  };

  return (
    <Card size="small" title="COS 连接配置">
      <Form
        form={form}
        layout="vertical"
        initialValues={draft}
        onValuesChange={(_, all) => setDraft(all)}
      >
        <Form.Item label="地域" name="region" rules={[{ required: true, message: '请输入地域' }]}>
          <Input placeholder="ap-chengdu" />
        </Form.Item>
        <Form.Item label="存储桶" name="bucket" rules={[{ required: true, message: '请输入存储桶' }]}>
          <Input placeholder="cdlaser-backup-1250000000" />
        </Form.Item>
        <Form.Item label="路径前缀" name="prefix">
          <Input placeholder="invoices/" />
        </Form.Item>
        <Form.Item label="SecretId" name="secretId" rules={[{ required: true, message: '请输入 SecretId' }]}>
          <Input.Password placeholder="AKID..." />
        </Form.Item>
        <Form.Item label="SecretKey" name="secretKey" rules={[{ required: true, message: '请输入 SecretKey' }]}>
          <Input.Password placeholder="******" />
        </Form.Item>
        <Form.Item label="自动备份" name="autoBackup" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="保留份数" name="retentionCount">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="恢复口令" name="restorePassword">
          <Input.Password placeholder="恢复数据库时校验" />
        </Form.Item>
        <div className="flex gap-2">
          <Button loading={testing} onClick={handleTest}>
            测试连接
          </Button>
          <Button type="primary" onClick={handleSave}>
            保存配置
          </Button>
        </div>
      </Form>
    </Card>
  );
}
