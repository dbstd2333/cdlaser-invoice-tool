import { v7 as uuidv7 } from 'uuid';
import { getDb, getRawDb } from '../../db/connection';
import { outboundBatches, outboundLines, products } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import type { OutboundExportInput } from '@shared/schemas/index';
import type { CustomerSnapshot } from '@shared/contracts/types';
import {
  amountCentToUnitPrice,
  calcOutboundAmountCent,
  calcTaxCent,
  calcTotalCent,
  centToYuan,
  normalizeUnitPrice,
  OUTBOUND_AMOUNT_FACTOR,
  scaleUnitPrice,
  TAX_RATE_DECIMAL,
} from '@shared/money/index';
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
import { getProductById } from '../catalog/catalog-service';
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
  // 按商品 ID 稳定排序，确保库存扣减顺序确定。
  const sortedLines = [...draft.validLines].sort((a, b) => a.productId.localeCompare(b.productId));
  const amountFactor = input.amountFactor ?? OUTBOUND_AMOUNT_FACTOR;

  // 生成 XLSX
  const taxLines = buildTaxLines(sortedLines, amountFactor);
  const xlsxBuffer = await generateTaxTemplateXlsx(taxLines);
  await validateTaxTemplateXlsx(xlsxBuffer, sortedLines.length);
  const xlsxSha256 = computeSha256(xlsxBuffer);
  const xlsxBase64 = xlsxToBase64(xlsxBuffer);

  // 计算汇总
  const totals = calculateTotals(sortedLines, amountFactor);

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
      processOutboundLine(db, raw, batchId, batchNo, exportedAt, line, amountFactor);
    }

    recordAudit({
      action: 'outbound.export', entityType: 'outbound_batch', entityId: batchId, sourceBatchId: batchId,
      summary: `销项开票 ${batchNo}，客户: ${customer.name}，明细 ${sortedLines.length} 行`,
    });
    markDirty();
  });

  tx();
  return { batchId, batchNo, customerName: customer.name, xlsxBuffer, exportedAt, ...totals };
}

/** 构造税务模板行 */
function buildTaxLines(lines: Array<{ productId: string; name: string; model: string; unit: string; unitPriceDecimal: string; quantity: number; amountCent?: number }>, factor: string): TaxTemplateLine[] {
  return lines.map((l) => {
    const amountCent = resolveLineAmountCent(l, factor);
    const product = getProductById(l.productId)!;
    return {
      name: escapeFormulaInjection(trimInvisible(l.name)),
      taxClassificationCode: product.taxClassificationCode,
      model: escapeFormulaInjection(trimInvisible(l.model)),
      unit: escapeFormulaInjection(trimInvisible(l.unit)),
      quantity: l.quantity,
      unitPriceDecimal: l.amountCent
        ? amountCentToUnitPrice(amountCent, l.quantity)
        : scaleUnitPrice(normalizeUnitPrice(l.unitPriceDecimal), factor),
      amountYuan: centToYuan(amountCent),
      taxRate: TAX_RATE_DECIMAL,
    };
  });
}

/** 计算汇总金额（PRD §7.5：税额=金额×13%，价税合计=金额+税额） */
function calculateTotals(lines: Array<{ quantity: number; unitPriceDecimal: string; amountCent?: number }>, factor: string): {
  totalQuantity: number; totalAmountCent: number; totalTaxCent: number; totalCent: number;
} {
  let totalQuantity = 0, totalAmountCent = 0, totalTaxCent = 0;
  for (const line of lines) {
    totalQuantity += line.quantity;
    const amountCent = resolveLineAmountCent(line, factor);
    totalAmountCent += amountCent;
    totalTaxCent += calcTaxCent(amountCent);
  }
  return {
    totalQuantity,
    totalAmountCent,
    totalTaxCent,
    totalCent: calcTotalCent(totalAmountCent, totalTaxCent),
  };
}

/** 处理单行：扣减库存、写明细、写流水 */
function processOutboundLine(
  db: ReturnType<typeof getDb>,
  raw: ReturnType<typeof getRawDb>,
  batchId: string,
  batchNo: string,
  exportedAt: string,
  line: { productId: string; quantity: number; unitPriceDecimal: string; name: string; amountCent?: number },
  factor: string,
): void {
  const productRow = raw.prepare('SELECT stock_balance FROM products WHERE id = ?').get(line.productId) as { stock_balance: number } | undefined;
  if (!productRow) throw new Error(`商品 ${line.productId} 不存在`);

  const stockBefore = productRow.stock_balance;
  const stockAfter = stockBefore - line.quantity;
  const amountCent = resolveLineAmountCent(line, factor);

  const product = getProductById(line.productId)!;

  db.insert(outboundLines).values({
    id: uuidv7(), batchId, productId: line.productId,
    name: product.name, taxClassificationCode: product.taxClassificationCode,
    model: product.model, unit: product.unit,
    unitPriceDecimal: normalizeUnitPrice(line.unitPriceDecimal), taxRate: 13,
    quantity: line.quantity, amountCent, taxCent: calcTaxCent(amountCent), totalCent: calcTotalCent(amountCent, calcTaxCent(amountCent)),
    stockBefore, stockAfter,
  }).run();

  appendLedger({
    productId: line.productId, changeQuantity: -line.quantity, balanceBefore: stockBefore,
    sourceType: 'outbound', sourceId: batchId, reason: `销项开票 ${batchNo}`,
  });

  db.update(products)
    .set({ stockBalance: stockAfter, updatedAt: exportedAt })
    .where(eq(products.id, line.productId)).run();
}

/** 优先使用用户编辑后的最终金额，否则按统一系数计算。 */
function resolveLineAmountCent(
  line: { quantity: number; unitPriceDecimal: string; amountCent?: number },
  factor: string,
): number {
  return line.amountCent ?? calcOutboundAmountCent(line.quantity, line.unitPriceDecimal, factor);
}

/** 构建客户快照 */
function buildCustomerSnapshot(customer: NonNullable<ReturnType<typeof getCustomerById>>): CustomerSnapshot {
  return {
    name: customer.name, taxId: customer.taxId, address: customer.address,
    phone: customer.phone, bankName: customer.bankName, bankAccount: customer.bankAccount,
  };
}
