import { InputNumber, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Decimal from 'decimal.js';
import type { OutboundLine } from './OutboundExportDialog';

const { Text } = Typography;

/** 展示销项商品，并只允许调整本次开票数量。 */
export function OutboundLinesTable({
  lines,
  autoRound,
  onQuantityChange,
  onRemove,
}: {
  lines: OutboundLine[];
  autoRound: boolean;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  const columns: ColumnsType<OutboundLine> = [
    { title: '项目名称', dataIndex: 'name', ellipsis: true },
    { title: '型号', dataIndex: 'model', width: 120, ellipsis: true },
    { title: '单位', dataIndex: 'unit', width: 70 },
    {
      title: '含税单价',
      dataIndex: 'unitPriceDecimal',
      width: 150,
      align: 'right',
      render: (value: string) => <Text>¥{value}</Text>,
    },
    {
      title: '当前库存',
      dataIndex: 'stockBalance',
      width: 100,
      align: 'center',
      render: (value: number) => (
        <Tag color={value > 0 ? 'success' : value < 0 ? 'error' : 'default'}>{value}</Tag>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 120,
      render: (_, row) => (
        <InputNumber
          min={1}
          step={1}
          precision={0}
          value={row.quantity}
          className="!w-full"
          onChange={(value) => onQuantityChange(row.productId, value ?? 0)}
        />
      ),
    },
    {
      title: '税利单价',
      dataIndex: 'scaledUnitPriceDecimal',
      align: 'right',
      render: (value: string) => <Text>¥{autoRound ? value : new Decimal(value).toFixed(2)}</Text>,
    },
    {
      title: '当前商品总价',
      dataIndex: 'amountYuan',
      width: 130,
      align: 'right',
      render: (value: string) => <Text strong>¥{value}</Text>,
    },
    {
      title: '操作',
      width: 80,
      render: (_, row) => (
        <Typography.Link type="danger" onClick={() => onRemove(row.productId)}>
          移除
        </Typography.Link>
      ),
    },
  ];

  return (
    <Table<OutboundLine>
      rowKey="productId"
      size="small"
      columns={columns}
      dataSource={lines}
      pagination={false}
      scroll={{ y: 360 }}
      locale={{ emptyText: '请先在库存列表选择要开票的商品' }}
    />
  );
}
