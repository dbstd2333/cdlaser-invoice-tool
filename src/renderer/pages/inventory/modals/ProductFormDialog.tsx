import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Radio, Button, App } from 'antd';
import type { Product } from '@shared/contracts/types';
import { api } from '@renderer/api';

interface ProductFormValues {
  name: string;
  model?: string;
  unit?: string;
  taxClassificationCode?: string;
  taxRate?: number;
  unitPrice?: number;
  status: 'active' | 'inactive';
  remark?: string;
}

export function ProductFormDialog({
  open,
  product,
  onClose,
  onSaved,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { message } = App.useApp();
  const [form] = Form.useForm<ProductFormValues>();
  const isEdit = !!product;

  useEffect(() => {
    if (open) {
      if (product) {
        form.setFieldsValue({
          name: product.name,
          model: product.model,
          unit: product.unit,
          taxClassificationCode: product.taxClassificationCode,
          taxRate: product.taxRate,
          unitPrice: Number(product.unitPriceDecimal),
          status: product.status,
          remark: product.remark ?? undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, product, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const payload = {
      name: values.name,
      model: values.model,
      unit: values.unit,
      taxClassificationCode: values.taxClassificationCode,
      taxRate: values.taxRate,
      unitPriceDecimal: (values.unitPrice ?? 0).toFixed(4),
      status: values.status,
      remark: values.remark ?? null,
    };
    if (isEdit && product) {
      await api.catalog.updateProduct({
        id: product.id,
        ...(payload as unknown as Record<string, unknown>),
      });
      message.success('已更新商品');
    } else {
      await api.catalog.createProduct(payload as unknown as Omit<Product, 'id'>);
      message.success('已新增商品');
    }
    onSaved();
    onClose();
  };

  return (
    <Modal
      title={isEdit ? '编辑商品' : '新增商品'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      destroyOnClose
      okText="保存"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'active', taxRate: 13, unit: '台' }}
      >
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入商品名称" />
        </Form.Item>
        <Form.Item label="型号" name="model" rules={[{ required: true, message: '请输入型号' }]}>
          <Input placeholder="请输入型号" />
        </Form.Item>
        <Form.Item label="税收分类编码" name="taxClassificationCode" rules={[{ required: true, message: '请输入税收分类编码' }]}>
          <Input placeholder="请输入税收分类编码" />
        </Form.Item>
        <Form.Item label="税率(%)" name="taxRate" rules={[{ required: true }]}>
          <InputNumber className="!w-full" min={0} max={100} />
        </Form.Item>
        <Form.Item label="单位" name="unit" rules={[{ required: true, message: '请输入单位' }]}>
          <Input placeholder="请输入单位" />
        </Form.Item>
        <Form.Item label="含税单价(元)" name="unitPrice" rules={[{ required: true, message: '请输入含税单价' }]}>
          <InputNumber className="!w-full" min={0.01} precision={4} />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value="active">在售</Radio>
            <Radio value="inactive">停售</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="内部备注" name="remark">
          <Input.TextArea rows={2} />
        </Form.Item>
        {isEdit && product && <StockAdjustSection product={product} onAdjusted={onSaved} />}
      </Form>
    </Modal>
  );
}

/** 编辑态下直接调整商品唯一库存。 */
function StockAdjustSection({ product, onAdjusted }: { product: Product; onAdjusted: () => void }) {
  const { message } = App.useApp();
  const [editing, setEditing] = useState(false);
  const [qty, setQty] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setEditing(true);
    setQty(0);
    setReason('');
  };

  const confirm = async () => {
    if (qty === 0) {
      message.error('调整量不能为 0');
      return;
    }
    if (!Number.isInteger(qty)) {
      message.error('调整量必须为整数');
      return;
    }
    if (!reason.trim()) {
      message.error('请填写调整原因');
      return;
    }
    setSaving(true);
    try {
      await api.inventory.adjust({ productId: product.id, changeQuantity: qty, reason });
      message.success('调整成功');
      setEditing(false);
      onAdjusted();
    } catch (e) {
      message.error(`调整失败: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-2 border border-line rounded-lg p-3">
      <div className="text-sm font-medium text-gray-700 mb-2">库存调整</div>
      <div className="flex flex-col gap-2">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                当前库存 <strong className="text-gray-800">{product.stockBalance}</strong>
              </div>
              {!editing && (
                <Button size="small" onClick={startEdit}>
                  调整
                </Button>
              )}
            </div>
            {editing && (
              <div className="flex items-center gap-2 mt-2">
                <InputNumber
                  value={qty}
                  min={-99999}
                  max={99999}
                  step={1}
                  precision={0}
                  className="!w-[120px]"
                  onChange={(v) => setQty(v ?? 0)}
                  placeholder="调整量"
                />
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="!flex-1"
                  placeholder="调整原因（必填）"
                />
                <Button type="primary" size="small" loading={saving} onClick={confirm}>
                  确认
                </Button>
                <Button size="small" onClick={() => setEditing(false)}>
                  取消
                </Button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
