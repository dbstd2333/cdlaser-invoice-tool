import { Descriptions, Drawer, Tag } from 'antd';
import type { Customer } from '@shared/contracts/types';

const STATUS_TEXT: Record<string, string> = { active: '启用', inactive: '停用' };

export function CustomerDetailDialog({
  open,
  customer,
  onClose,
  onEdit,
}: {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onEdit: (c: Customer) => void;
}) {
  return (
    <Drawer
      title="客户详情"
      width={520}
      open={open}
      onClose={onClose}
      extra={customer && <a onClick={() => onEdit(customer)}>编辑</a>}
    >
      {customer && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="客户名称">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="客户编码">{customer.shortCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="税号">{customer.taxId || '-'}</Descriptions.Item>
          <Descriptions.Item label="地址">{customer.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="电话">{customer.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="开户行">{customer.bankName || '-'}</Descriptions.Item>
          <Descriptions.Item label="银行账号">{customer.bankAccount || '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={customer.status === 'active' ? 'success' : 'default'}>
              {STATUS_TEXT[customer.status] ?? customer.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{customer.createdAt || '-'}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{customer.updatedAt || '-'}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
}
