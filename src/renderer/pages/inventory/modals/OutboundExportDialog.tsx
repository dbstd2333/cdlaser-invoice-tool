import { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Modal, Select, Space, Typography, App } from 'antd';
import type { Customer } from '@shared/contracts/types';
import type { DraftValidationResult } from '@shared/contracts/preview-types';
import Decimal from 'decimal.js';
import {
  centToDisplay,
  centToYuan,
  OUTBOUND_AMOUNT_FACTOR,
  roundUnitPriceToWholeYuan,
  scaleUnitPrice,
  yuanToCent,
} from '@shared/money';
import { api } from '@renderer/api';
import { useSelectionStore } from '@renderer/stores/selection';
import { OutboundLinesTable } from './OutboundLinesTable';

const { Text } = Typography;

export interface OutboundLine {
  productId: string;
  name: string;
  model: string;
  unit: string;
  unitPriceDecimal: string;
  stockBalance: number;
  quantity: number;
  /** 税利单价 = 含税单价 × 1.09（勾选时四舍五入到整数元） */
  scaledUnitPriceDecimal: string;
  /** 当前商品总价（元）= 税利单价 × 数量 */
  amountYuan: string;
}

/** 由含税单价、数量、是否自动四舍五入、系数，重算税利单价与当前商品总价。 */
function recompute(
  unitPrice: string,
  qty: number,
  autoRound: boolean,
  factor: string,
): { scaledUnitPriceDecimal: string; amountYuan: string } {
  const scaled = autoRound
    ? roundUnitPriceToWholeYuan(scaleUnitPrice(unitPrice, factor))
    : scaleUnitPrice(unitPrice, factor);
  const totalCent = new Decimal(scaled).times(qty).times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
  return { scaledUnitPriceDecimal: scaled, amountYuan: centToYuan(totalCent) };
}

export function OutboundExportDialog({
  open,
  onClose,
  onExported,
}: {
  open: boolean;
  onClose: () => void;
  onExported: () => void;
}) {
  const { message } = App.useApp();
  const selectionStore = useSelectionStore();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [customerLoading, setCustomerLoading] = useState(false);
  const [amountFactor, setAmountFactor] = useState(OUTBOUND_AMOUNT_FACTOR);
  const [autoRound, setAutoRound] = useState(true);
  const [lines, setLines] = useState<OutboundLine[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCustomerId(undefined);
    setAmountFactor(OUTBOUND_AMOUNT_FACTOR);
    setAutoRound(true);
    loadCustomers();

    const selected: OutboundLine[] = selectionStore.selections
      .filter((sel) => sel.valid)
      .map((sel) => {
        const meta = sel.meta as Record<string, unknown>;
        const qty = selectionStore.getQuantity(sel.key);
        const unitPriceDecimal = String(meta.unitPriceDecimal ?? '0');
        const { scaledUnitPriceDecimal, amountYuan } = recompute(
          unitPriceDecimal,
          qty,
          true,
          OUTBOUND_AMOUNT_FACTOR,
        );
        return {
          productId: sel.key,
          name: (meta.name as string) ?? sel.label,
          model: (meta.model as string) ?? '',
          unit: (meta.unit as string) ?? '',
          unitPriceDecimal,
          stockBalance: Number(meta.stockBalance ?? 0),
          quantity: qty,
          scaledUnitPriceDecimal,
          amountYuan,
        };
      });
    setLines(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const loadCustomers = async (keyword?: string) => {
    setCustomerLoading(true);
    try {
      const res = await api.customers.list({
        status: 'active',
        page: 1,
        pageSize: 100,
        keyword: keyword?.trim() || undefined,
      });
      setCustomers(res.rows);
    } catch {
      setCustomers([]);
    } finally {
      setCustomerLoading(false);
    }
  };

  const updateQty = (id: string, qty: number) => {
    setLines((prev) =>
      prev.map((l) =>
        l.productId === id
          ? { ...l, quantity: qty, ...recompute(l.unitPriceDecimal, qty, autoRound, amountFactor) }
          : l,
      ),
    );
  };

  const removeLine = (id: string) => setLines((prev) => prev.filter((l) => l.productId !== id));

  const applyFactor = () => {
    setLines((prev) =>
      prev.map((l) => ({ ...l, ...recompute(l.unitPriceDecimal, l.quantity, autoRound, amountFactor) })),
    );
  };

  const toggleAutoRound = (checked: boolean) => {
    setAutoRound(checked);
    setLines((prev) =>
      prev.map((l) => ({ ...l, ...recompute(l.unitPriceDecimal, l.quantity, checked, amountFactor) })),
    );
  };

  const totalQuantity = lines.reduce((s, l) => s + (l.quantity > 0 ? l.quantity : 0), 0);
  const totalBaseCent = lines.reduce((s, l) => {
    try {
      return s + new Decimal(l.unitPriceDecimal).times(l.quantity).times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
    } catch {
      return s;
    }
  }, 0);
  const totalAmountCent = lines.reduce((s, l) => {
    try {
      return s + yuanToCent(l.amountYuan);
    } catch {
      return s;
    }
  }, 0);
  const totalProfitCent = totalAmountCent - totalBaseCent;

  const canExport = !!customerId && lines.length > 0 && lines.every((l) => l.quantity > 0);

  const handleExport = async () => {
    if (!canExport || !customerId) {
      message.warning('请选择客户并填写每行的正整数数量');
      return;
    }
    if (lines.length > 2000) {
      message.error('单次最多 2000 条明细');
      return;
    }
    setBusy(true);
    try {
      const payload = {
        customerId,
        amountFactor,
        lines: lines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
          amountCent: yuanToCent(l.amountYuan),
        })),
      };

      const draft = (await api.outbound.validateDraft(payload)) as DraftValidationResult;
      if (draft.invalidProductIds.length > 0) {
        selectionStore.removeInvalid(draft.invalidProductIds);
        setLines((prev) => prev.filter((l) => !draft.invalidProductIds.includes(l.productId)));
        message.warning(`部分商品已失效并移除：${draft.errors.join('；')}`);
        if (draft.validLines.length === 0) {
          setBusy(false);
          return;
        }
      }

      const res = (await api.outbound.export(payload)) as {
        saved: boolean;
        batchNo: string;
        path?: string;
      };
      if (res.saved) {
        message.success(`已导出：${res.batchNo}`);
        selectionStore.clear();
        onExported();
        onClose();
      } else {
        message.error('导出失败');
      }
    } catch (e) {
      message.error(`导出失败：${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title="销项开票"
      open={open}
      onCancel={onClose}
      width={1020}
      footer={
        <div className="flex items-center justify-between">
          <Space size="large">
            <Text className="!text-brand">商品种类 {lines.length}</Text>
            <Text className="!text-muted">数量合计 {totalQuantity}</Text>
            <Text className="!text-blue-500">含税总价 {centToDisplay(totalBaseCent)}</Text>
            <Text className="!text-green-600">利润 {centToDisplay(totalProfitCent)}</Text>
            <Text strong className="!text-red-500">全部总计 {centToDisplay(totalAmountCent)}</Text>
          </Space>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={busy} disabled={!canExport} onClick={handleExport}>
              确认导出
            </Button>
          </Space>
        </div>
      }
    >
      <Space direction="vertical" size="middle" className="!w-full">
        <Space className="!w-full" wrap>
          <Select
            className="!w-[320px]"
            placeholder="选择开票客户（仅启用客户）"
            value={customerId}
            onChange={setCustomerId}
            loading={customerLoading}
            showSearch
            optionFilterProp="label"
            filterOption={false}
            onSearch={(v) => loadCustomers(v)}
            options={customers.map((c) => ({ value: c.id, label: `${c.name} (${c.taxId})` }))}
          />
          <Space>
            <Text type="secondary">金额系数</Text>
            <Input
              value={amountFactor}
              className="!w-[100px]"
              onChange={(e) => setAmountFactor(e.target.value)}
              onBlur={applyFactor}
            />
          </Space>
          <Checkbox checked={autoRound} onChange={(e) => toggleAutoRound(e.target.checked)}>
            含税单价 × 1.09 后自动四舍五入
          </Checkbox>
        </Space>

        <OutboundLinesTable
          lines={lines}
          autoRound={autoRound}
          onQuantityChange={updateQty}
          onRemove={removeLine}
        />
      </Space>
    </Modal>
  );
}
