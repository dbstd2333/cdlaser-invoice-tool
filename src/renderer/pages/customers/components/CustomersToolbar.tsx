import { Input, Select, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, UploadOutlined } from '@renderer/icons';

export function CustomersToolbar({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onSearch,
  onReset,
  onRefresh,
  onAdd,
  onInitialImport,
}: {
  search: string;
  statusFilter: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onAdd: () => void;
  onInitialImport: () => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap p-3 px-4 bg-white border border-line rounded-lg mb-3">
      <Input
        allowClear
        placeholder="客户名称 / 编码 / 税号"
        className="!w-[220px]"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onPressEnter={onSearch}
      />
      <Select
        className="!w-[120px]"
        placeholder="状态"
        value={statusFilter}
        onChange={onStatusChange}
        options={[
          { label: '全部', value: 'all' },
          { label: '启用', value: 'active' },
          { label: '停用', value: 'inactive' },
        ]}
      />
      <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
        搜索
      </Button>
      <Button onClick={onReset}>重置</Button>
      <Button icon={<ReloadOutlined />} onClick={onRefresh}>
        刷新
      </Button>
      <Space className="!ml-auto">
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          新增客户
        </Button>
        <Button icon={<UploadOutlined />} onClick={onInitialImport}>
          期初导入
        </Button>
      </Space>
    </div>
  );
}
