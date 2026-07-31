import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import type { ReactNode } from 'react';

export interface SharedTableProps<T> {
  rowKey: string | ((record: T) => string);
  columns: TableColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  total?: number;
  maxHeight?: number;
  onRowClick?: (record: T) => void;
  onPageChange?: (page: number) => void;
  onSizeChange?: (size: number) => void;
  toolbar?: ReactNode;
}

export function SharedTable<T extends object>(props: SharedTableProps<T>) {
  const {
    rowKey,
    columns,
    dataSource,
    loading,
    page = 1,
    pageSize = 20,
    total = 0,
    maxHeight = 550,
    onRowClick,
    onPageChange,
    onSizeChange,
    toolbar,
  } = props;

  return (
    <div className="flex-1 overflow-auto">
      {toolbar}
      <Table<T>
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        size="middle"
        bordered
        scroll={{ y: maxHeight, x: 'max-content' }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          pageSizeOptions: [20, 50, 100],
          onChange: (p, ps) => {
            if (p !== page && onPageChange) onPageChange(p);
            if (ps !== pageSize && onSizeChange) onSizeChange(ps);
          },
        }}
        onRow={(record) =>
          onRowClick
            ? { onClick: () => onRowClick(record), className: 'cursor-pointer' }
            : {}
        }
      />
    </div>
  );
}
