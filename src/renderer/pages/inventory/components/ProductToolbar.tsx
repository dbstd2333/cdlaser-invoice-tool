import { Input, Button, Space } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  UploadOutlined,
  ImportOutlined,
} from '@renderer/icons';

export function ProductToolbar({
  search,
  onSearchChange,
  onSearch,
  onReset,
  onRefresh,
  onAdd,
  onInitialImport,
  onDailyImport,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onAdd: () => void;
  onInitialImport: () => void;
  onDailyImport: () => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap p-3 px-4 bg-white border border-line rounded-lg mb-3">
      <Input
        allowClear
        placeholder="名称 / 型号 / 编码"
        className="!w-[220px]"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onPressEnter={onSearch}
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
          新增商品
        </Button>
        <Button icon={<UploadOutlined />} onClick={onInitialImport}>
          期初导入
        </Button>
        <Button icon={<ImportOutlined />} onClick={onDailyImport}>
          每日导入
        </Button>
      </Space>
    </div>
  );
}
