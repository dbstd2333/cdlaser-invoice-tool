import { useEffect } from 'react';
import { Form, Input, Modal, Radio, App } from 'antd';
import type { Customer } from '@shared/contracts/types';
import { api } from '@renderer/api';

export function CustomerFormDialog({
  open,
  customer,
  onClose,
  onSaved,
}: {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { message } = App.useApp();
  const [form] = Form.useForm<Customer>();
  const isEdit = !!customer;

  useEffect(() => {
    if (open) {
      if (customer) form.setFieldsValue(customer);
      else form.resetFields();
    }
  }, [open, customer, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    if (isEdit && customer) {
      await api.customers.update({ id: customer.id, ...(values as unknown as Record<string, unknown>) });
      message.success('已更新客户');
    } else {
      await api.customers.create(values);
      message.success('已新增客户');
    }
    onSaved();
    onClose();
  };

  return (
    <Modal
      title={isEdit ? '编辑客户' : '新增客户'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      destroyOnClose
      okText="保存"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" initialValues={{ status: 'active' }}>
        <Form.Item label="客户名称" name="name" rules={[{ required: true, message: '请输入客户名称' }]}>
          <Input placeholder="请输入客户名称" />
        </Form.Item>
        <Form.Item label="客户编码" name="shortCode">
          <Input placeholder="请输入客户编码" />
        </Form.Item>
        <Form.Item label="税号" name="taxId">
          <Input placeholder="请输入税号" />
        </Form.Item>
        <Form.Item label="地址" name="address">
          <Input placeholder="请输入地址" />
        </Form.Item>
        <Form.Item label="电话" name="phone">
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item label="开户行" name="bankName">
          <Input placeholder="请输入开户行" />
        </Form.Item>
        <Form.Item label="银行账号" name="bankAccount">
          <Input placeholder="请输入银行账号" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value="active">启用</Radio>
            <Radio value="inactive">停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
