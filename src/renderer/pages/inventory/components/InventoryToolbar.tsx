import { Input, Select, Button, Space } from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  ImportOutlined,
} from '@renderer/icons';
import { useAppStore } from '@renderer/stores/app';

export function InventoryToolbar({
  name,
  model,
  stockStatus,
  onNameChange,
  onModelChange,
  onStockStatusChange,
  onSearch,
  onReset,
  onRefresh,
  onAddProduct,
  onDailyImport,
  onOutbound,
  onMonthEndExport,
  onMonthBeginningImport,
  onInitialImport,
}: {
  name: string;
  model: string;
  stockStatus: string;
  onNameChange: (v: string) => void;
  onModelChange: (v: string) => void;
  onStockStatusChange: (v: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onAddProduct: () => void;
  onDailyImport: () => void;
  onOutbound: () => void;
  onMonthEndExport: () => void;
  onMonthBeginningImport: () => void;
  onInitialImport: () => void;
}) {
  const productImportDone = useAppStore((s) => s.productImportDone);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap p-3 px-4 bg-white border border-line rounded-lg">
        <Input
          value={name}
          placeholder="项目名称"
          allowClear
          className="!w-[200px]"
          onChange={(e) => onNameChange(e.target.value)}
          onPressEnter={onSearch}
        />
        <Input
          value={model}
          placeholder="型号"
          allowClear
          className="!w-[160px]"
          onChange={(e) => onModelChange(e.target.value)}
          onPressEnter={onSearch}
        />
        <Select
          value={stockStatus}
          placeholder="库存状态"
          className="!w-[110px]"
          onChange={onStockStatusChange}
          options={[
            { label: '全部', value: 'all' },
            { label: '有余量', value: 'positive' },
            { label: '已平衡', value: 'zero' },
            { label: '待补票', value: 'negative' },
          ]}
        />
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
        <Button onClick={onReset}>重置</Button>
        <Button className="!ml-auto" onClick={onRefresh}>
          刷新
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="bg-white border border-line rounded-lg p-4 flex-1 min-w-[280px]">
          <div className="text-sm font-medium text-gray-700 mb-3">库存与开票</div>
          <Space wrap>
            <Button type="primary" onClick={onOutbound}>
              销项开票
            </Button>
            <Button onClick={onMonthEndExport} icon={<DownloadOutlined />}>
              导出补票清单
            </Button>
            <Button onClick={onMonthBeginningImport} icon={<ImportOutlined />}>
              月初进项
            </Button>
          </Space>
        </div>

        <div className="bg-white border border-line rounded-lg p-4 flex-1 min-w-[280px]">
          <div className="text-sm font-medium text-gray-700 mb-3">商品管理</div>
          <Space wrap>
            <Button icon={<PlusOutlined />} onClick={onAddProduct}>
              新增商品
            </Button>
            <Button icon={<UploadOutlined />} onClick={onDailyImport}>
              商品导入
            </Button>
            {!productImportDone && (
              <Button danger onClick={onInitialImport}>
                初始化导入
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
}
