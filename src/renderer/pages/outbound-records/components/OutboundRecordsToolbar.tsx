import { Input, Select, DatePicker, Button } from 'antd';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

export function OutboundRecordsToolbar({
  batchNo,
  customerName,
  productKeyword,
  dateFrom,
  dateTo,
  status,
  onBatchNoChange,
  onCustomerNameChange,
  onProductKeywordChange,
  onDateChange,
  onStatusChange,
  onSearch,
  onReset,
  onRefresh,
}: {
  batchNo: string;
  customerName: string;
  productKeyword: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  onBatchNoChange: (v: string) => void;
  onCustomerNameChange: (v: string) => void;
  onProductKeywordChange: (v: string) => void;
  onDateChange: (from: string, to: string) => void;
  onStatusChange: (v: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onRefresh: () => void;
}) {
  const dateRange: [Dayjs, Dayjs] | null =
    dateFrom && dateTo ? ([dateFrom, dateTo] as unknown as [Dayjs, Dayjs]) : null;

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 flex-wrap p-3 px-4 bg-white border border-line rounded-lg">
        <Input
          value={batchNo}
          placeholder="批次号"
          allowClear
          className="!w-[160px]"
          onChange={(e) => onBatchNoChange(e.target.value)}
        />
        <Input
          value={customerName}
          placeholder="客户名称"
          allowClear
          className="!w-[150px]"
          onChange={(e) => onCustomerNameChange(e.target.value)}
        />
        <Input
          value={productKeyword}
          placeholder="商品名称/型号"
          allowClear
          className="!w-[150px]"
          onChange={(e) => onProductKeywordChange(e.target.value)}
        />
        <RangePicker
          value={dateRange}
          onChange={(v) =>
            onDateChange(
              v && v[0] ? v[0].format('YYYY-MM-DD') : '',
              v && v[1] ? v[1].format('YYYY-MM-DD') : '',
            )
          }
        />
        <Select
          value={status}
          placeholder="状态"
          className="!w-[100px]"
          onChange={onStatusChange}
          options={[
            { label: '全部', value: 'all' },
            { label: '有效', value: 'valid' },
            { label: '已作废', value: 'voided' },
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
    </div>
  );
}
