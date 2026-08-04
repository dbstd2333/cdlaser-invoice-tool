import { Alert, Descriptions, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { CatalogImportPreviewResult, CatalogImportRow } from '@shared/contracts/preview-types';

export interface CatalogImportResult {
  createdCount: number;
  newProductCount: number;
  newPriceVariantCount: number;
}

const columns: ColumnsType<CatalogImportRow> = [
  { title: '行号', dataIndex: 'rowIndex', width: 72, fixed: 'left' },
  { title: '项目名称', dataIndex: 'name', width: 180, ellipsis: true },
  { title: '规格型号', dataIndex: 'model', width: 140, ellipsis: true },
  { title: '单位', dataIndex: 'unit', width: 80 },
  { title: '税收分类编码', dataIndex: 'taxClassificationCode', width: 180, ellipsis: true },
  { title: '含税单价', dataIndex: 'unitPriceDecimal', width: 130, align: 'right' },
  {
    title: '状态',
    width: 92,
    render: (_, row) => (
      <Tag color={row.deduped ? 'warning' : row.errors.length > 0 ? 'error' : 'success'}>
        {row.deduped ? '已去重' : row.errors.length > 0 ? '错误' : '正常'}
      </Tag>
    ),
  },
  {
    title: '校验说明',
    width: 260,
    render: (_, row) => row.errors.length > 0 ? row.errors.join('；') : '可导入',
  },
];

/** 展示商品导入的统计摘要和逐行校验结果。 */
export function CatalogImportPreviewPanel({ preview }: { preview: CatalogImportPreviewResult }) {
  return (
    <div className="space-y-3">
      <ImportStatistics preview={preview} />
      <Alert
        showIcon
        type={preview.hasErrors ? 'error' : 'success'}
        message={preview.hasErrors ? '存在错误行，整批无法导入' : '校验通过，可进入确认步骤'}
        description={preview.hasErrors ? '请修正文件后重新选择或重新校验。' : undefined}
      />
      <Table<CatalogImportRow>
        rowKey="rowIndex"
        size="small"
        bordered
        columns={columns}
        dataSource={preview.rows}
        pagination={false}
        scroll={{ x: 1200, y: 360 }}
      />
    </div>
  );
}

/** 展示最终写入前的商品导入确认摘要。 */
export function CatalogImportConfirmation({ preview }: { preview: CatalogImportPreviewResult }) {
  return (
    <div className="space-y-3">
      <Alert
        type="warning"
        showIcon
        message={preview.isInitial
          ? '确认后将一次性写入全部有效商品及其初始库存。'
          : '确认后将一次性新增全部有效价格商品，已有商品价格和库存不会被修改。'}
      />
      <ImportStatistics preview={preview} />
    </div>
  );
}

/** 展示商品导入完成后的实际创建结果。 */
export function CatalogImportCompletion({ result }: { result: CatalogImportResult }) {
  return (
    <Alert
      type="success"
      showIcon
      message={`成功创建 ${result.createdCount} 条商品记录`}
      description={`新增名称型号 ${result.newProductCount} 组，同名型号新价格 ${result.newPriceVariantCount} 条。`}
    />
  );
}

/** 统一渲染预览和确认阶段的计数口径。 */
function ImportStatistics({ preview }: { preview: CatalogImportPreviewResult }) {
  return (
    <Descriptions size="small" bordered column={preview.isInitial ? 5 : 4}>
      <Descriptions.Item label="新增名称型号">{preview.newProductCount}</Descriptions.Item>
      <Descriptions.Item label="同名型号新价格">{preview.newPriceVariantCount}</Descriptions.Item>
      <Descriptions.Item label="文件内去重">{preview.dedupedRowCount}</Descriptions.Item>
      <Descriptions.Item label="错误">{preview.errorCount}</Descriptions.Item>
      {preview.isInitial && <Descriptions.Item label="初始库存合计">{preview.totalStockSum}</Descriptions.Item>}
    </Descriptions>
  );
}
