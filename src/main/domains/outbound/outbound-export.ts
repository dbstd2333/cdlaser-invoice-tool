import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { outboundBatches, outboundLines, priceVersions } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import type { OutboundExportInput } from '@shared/schemas/index';
import type { CustomerSnapshot } from '@shared/contracts/types';
import { calcAmountCent, calcTaxCent, calcTotalCent, centToYuan, normalizeUnitPrice, TAX_RATE_DECIMAL } from '@shared/money/index';
import { trimInvisible, generateBatchNo, escapeFormulaInjection } from '@shared/contracts/normalize';
import { recordAudit } from '../audit/audit-service';
import { appendLedger } from '../inventory/ledger-service';
import { markDirty } from '../audit/settings-service';
import {
  generateTaxTemplateXlsx,
  validateTaxTemplateXlsx,
  xlsxToBase64,
  computeSha256,
  type TaxTemplateLine,
} from '../../excel/tax-template/template-writer';
import { getProductById, getPriceVersionById } from '../catalog/catalog-service';
import { getCustomerById } from '../customers/customer-service';
import { validateDraft } from './outbound-validate';
import type { OutboundExportResult } from './outbound-types';

/**
 * 销项导出事务。
 * 生成 XLSX -> 验证结构 -> 单事务写入批次、明细、库存流水、余额和审计。
 */

/** 执行销项导出事务 */
export async function executeOutboundExport(input: OutboundExportInput): Promise<OutboundExportResult> {
  const draft = validateDraft(input);
  if (draft.errors.length > 0) throw new Error(draft.errors.join('; '));
  if (draft.validLines.length === 0) throw new Error('没有有效的开票行');

  const customer = getCustomerById(input.customerId)!;
  // 按稳定顺序排列（priceVersionId 升序），确保库存扣减顺序确定
  const sortedLines = [...draft.validLines].sort((a, b) => a.priceVersionId.localeCompare(b.priceVersionId));

  // 生成 XLSX
  const taxLines = buildTaxLines(sortedLines);
  const xlsxBuffer = await generateTaxTemplateXlsx(taxLines);
  await validateTaxTemplateXlsx(xlsxBuffer, sortedLines.length);
  const xlsxSha256 = computeSha256(xlsxBuffer);
  const xlsxBase64 = xlsxToBase64(xlsxBuffer);

  // 计算汇总
  const totals = calculateTotals(sortedLines);

  const batchId = uuidv7();
  const batchNo = generateBatchNo('OUT');
  const exportedAt = new Date().toISOString();
  const customerSnapshot = JSON.stringify(buildCustomerSnapshot(customer));

  const db = getDb();
  const raw = getRawDb();

  const tx = raw.transaction(() => {
    db.insert(outboundBatches).values({
      id: batchId, batchNo, customerId: customer.id, customerSnapshot, exportedAt,
      status: 'valid', xlsxBlob: xlsxBase64, xlsxSha256, lineCount: sortedLines.length,
      ...totals,
    }).run();

    for (const line of sortedLines) {
      processOutboundLine(db, raw, batchId, batchNo, exportedAt, line);
    }

    recordAudit({
      action: 'outbound.export', entityType: 'outbound_batch', entityId: batchId, sourceBatchId: batchId,
      summary: `销项开票 ${batchNo}，客户: ${customer.name}，明细 ${sortedLines.length} 行`,
    });
    markDirty();
  });

  tx();
  return { batchId, batchNo, xlsxBuffer, exportedAt, ...totals };
}

/** 构造税务模板行 */
function buildTaxLines(lines: Array<{ priceVersionId: string; name: string; model: string; unit: string; unitPriceDecimal: string; quantity: number }>): TaxTemplateLine[] {
  return lines.map((l) => {
    const amountCent = calcAmountCent(l.quantity, l.unitPriceDecimal);
    const pv = getPriceVersionById(l.priceVersionId)!;
    const product = getProductById(pv.productId)!;
    return {
      name: escapeFormulaInjection(trimInvisible(l.name)),
      taxClassificationCode: product.taxClassificationCode,
      model: escapeFormulaInjection(trimInvisible(l.model)),
      unit: escapeFormulaInjection(trimInvisible(l.unit)),
      quantity: l.quantity,
      unitPriceDecimal: normalizeUnitPrice(l.unitPriceDecimal),
      amountYuan: centToYuan(amountCent),
      taxRate: TAX_RATE_DECIMAL,
    };
  });
}

/** 计算汇总金额 */
function calculateTotals(lines: Array<{ quantity: number; unitPriceDecimal: string }>): {
  totalQuantity: number; totalAmountCent: number; totalTaxCent: number; totalCent: number;
} {
  let totalQuantity = 0, totalAmountCent = 0, totalTaxCent = 0, totalCent = 0;
  for (const line of lines) {
    totalQuantity += line.quantity;
    const amountCent = calcAmountCent(line.quantity, line.unitPriceDecimal);
    const taxCent = calcTaxCent(amountCent);
    totalAmountCent += amountCent;
    totalTaxCent += taxCent;
    totalCent += calcTotalCent(amountCent, taxCent);
  }
  return { totalQuantity, totalAmountCent, totalTaxCent, totalCent };
}

/** 处理单行：扣减库存、写明细、写流水 */
function processOutboundLine(
  db: ReturnType<typeof getDb>,
  raw: ReturnType<typeof getRawDb>,
  batchId: string,
  batchNo: string,
  exportedAt: string,
  line: { priceVersionId: string; quantity: number; unitPriceDecimal: string; name: string },
): void {
  const pvRow = raw.prepare('SELECT stock_balance FROM price_versions WHERE id = ?').get(line.priceVersionId) as { stock_balance: number } | undefined;
  if (!pvRow) throw new Error(`价格版本 ${line.priceVersionId} 不存在`);

  const stockBefore = pvRow.stock_balance;
  const stockAfter = stockBefore - line.quantity;
  const amountCent = calcAmountCent(line.quantity, line.unitPriceDecimal);
  const taxCent = calcTaxCent(amountCent);
  const lineTotal = calcTotalCent(amountCent, taxCent);

  const product = getProductById(getPriceVersionById(line.priceVersionId)!.productId)!;

  db.insert(outboundLines).values({
    id: uuidv7(), batchId, priceVersionId: line.priceVersionId,
    name: product.name, taxClassificationCode: product.taxClassificationCode,
    model: product.model, unit: product.unit,
    unitPriceDecimal: normalizeUnitPrice(line.unitPriceDecimal), taxRate: 13,
    quantity: line.quantity, amountCent, taxCent, totalCent: lineTotal,
    stockBefore, stockAfter,
  }).run();

  appendLedger({
    priceVersionId: line.priceVersionId, changeQuantity: -line.quantity, balanceBefore: stockBefore,
    sourceType: 'outbound', sourceId: batchId, reason: `销项开票 ${batchNo}`,
  });

  db.update(priceVersions)
    .set({ stockBalance: stockAfter, updatedAt: exportedAt })
    .where(eq(priceVersions.id, line.priceVersionId)).run();
}

/** 构建客户快照 */
function buildCustomerSnapshot(customer: NonNullable<ReturnType<typeof getCustomerById>>): CustomerSnapshot {
  return {
    name: customer.name, taxId: customer.taxId, address: customer.address,
    phone: customer.phone, bankName: customer.bankName, bankAccount: customer.bankAccount,
  };
}
