import type { StockSummary } from '@shared/schemas/index';
import { centToDisplay } from '@shared/money';

/** 在库存表格首行展示当前选择金额及正负库存汇总。 */
export function InventorySummaryBar({
  selectedAmountCent,
  stockSummary,
}: {
  selectedAmountCent: number;
  stockSummary: StockSummary | null;
}) {
  return (
    <div data-testid="inventory-summary-bar" className="mb-2 flex min-h-12 flex-wrap items-center gap-x-8 gap-y-2 rounded-lg border border-line border-l-4 border-l-brand bg-white px-4 py-2">
      <SummaryMetric label="总已选金额" value={`¥${centToDisplay(selectedAmountCent)}`} valueClass="text-brand" />
      <SummaryMetric label="总库存（正数）" value={stockSummary?.positiveStock ?? '—'} valueClass="text-green-600" />
      <SummaryMetric label="总负库存" value={stockSummary?.negativeStock ?? '—'} valueClass="text-red-500" />
    </div>
  );
}

/** 渲染紧凑、可换行的单项统计指标。 */
function SummaryMetric({ label, value, valueClass }: { label: string; value: string | number; valueClass: string }) {
  return (
    <div className="flex items-baseline gap-2 whitespace-nowrap">
      <span className="text-xs text-muted">{label}</span>
      <strong className={`text-base tabular-nums ${valueClass}`}>{value}</strong>
    </div>
  );
}
