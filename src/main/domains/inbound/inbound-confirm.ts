import { v7 as uuidv7 } from 'uuid';
import { readFileSync } from 'node:fs';
import { getDb, getRawDb } from '../../db/connection';
import { inboundBatches, inboundLines, products } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { normalizeKey, generateBatchNo } from '@shared/contracts/normalize';
import { recordAudit } from '../audit/audit-service';
import { appendLedger } from '../inventory/ledger-service';
import { markDirty } from '../audit/settings-service';
import { computeFileSha256 } from './inbound-preview';
import type { InboundPreviewResult, InboundPreviewLine } from './inbound-types';

/**
 * 进项导入确认服务。
 * 预览缓存管理和单事务写入。
 */

/** 预览缓存 */
const previewCache = new Map<string, { result: InboundPreviewResult; filePath: string; originalFileName: string }>();

/** 缓存进项预览，返回令牌 */
export function cacheInboundPreview(result: InboundPreviewResult, filePath: string, originalFileName: string): string {
  const token = uuidv7();
  previewCache.set(token, { result, filePath, originalFileName });
  setTimeout(() => previewCache.delete(token), 30 * 60 * 1000);
  return token;
}

/** 确认进项导入：单事务写入批次、明细、库存流水 */
export function confirmInboundImport(token: string): { batchId: string; batchNo: string; lineCount: number } {
  const cached = previewCache.get(token);
  if (!cached) throw new Error('预览已过期，请重新选择文件');
  const { result, filePath, originalFileName } = cached;
  if (result.hasErrors) throw new Error('存在错误，无法导入');

  // 重新校验文件哈希（防止文件被修改）
  const currentSha = computeFileSha256(filePath);
  if (currentSha !== result.fileSha256) {
    throw new Error('文件已变更，请重新预览');
  }

  const fileBuf = readFileSync(filePath);
  const fileBase64 = fileBuf.toString('base64');

  const db = getDb();
  const raw = getRawDb();
  const batchId = uuidv7();
  const batchNo = generateBatchNo('INB');

  const tx = raw.transaction(() => {
    insertInboundBatch(db, batchId, batchNo, originalFileName, fileBase64, result);

    for (const line of result.lines) {
      processInboundLine(db, raw, batchId, batchNo, line);
    }

    recordAudit({
      action: 'inbound.import',
      entityType: 'inbound_batch',
      entityId: batchId,
      sourceBatchId: batchId,
      summary: `月初进项导入 ${batchNo}，共 ${result.lines.length} 行`,
    });
    markDirty();
  });

  tx();
  previewCache.delete(token);
  return { batchId, batchNo, lineCount: result.lines.length };
}

/** 插入进项批次记录 */
function insertInboundBatch(db: ReturnType<typeof getDb>, batchId: string, batchNo: string, fileName: string, fileBase64: string, result: InboundPreviewResult): void {
  db.insert(inboundBatches).values({
    id: batchId, batchNo, originalFileName: fileName, originalFileBlob: fileBase64,
    fileSha256: result.fileSha256, contentSha256: result.contentSha256,
    importedAt: new Date().toISOString(), status: 'imported',
    ignoredRowCount: result.ignoredRows.length, totalQuantity: result.totalQuantity,
    totalAmountCent: result.totalAmountCent, totalTaxCent: result.totalTaxCent, totalCent: result.totalCent,
  }).run();
}

/** 处理单行进项：自动建档或匹配精确价格，再写明细和库存流水。 */
function processInboundLine(db: ReturnType<typeof getDb>, raw: ReturnType<typeof getRawDb>, batchId: string, batchNo: string, line: InboundPreviewLine): void {
  let productId = line.productId;

  // 自动创建新商品
  if (line.isNewProduct && !productId) {
    productId = createAutoProduct(db, batchId, line);
  }

  // 读取当前余额并写入明细和流水
  const balanceBefore = getStockBalance(raw, productId!);
  const balanceAfter = balanceBefore + line.quantity;

  db.insert(inboundLines).values({
    id: uuidv7(), batchId, sourceSheet: line.sourceSheet, sourceRow: line.sourceRow,
    invoiceDate: line.invoiceDate, invoiceNo: line.invoiceNo, sellerName: line.sellerName,
    productId: productId!, name: line.name, model: line.model, unit: line.unit,
    unitPriceDecimal: line.unitPriceDecimal, quantity: line.quantity,
    amountCent: line.amountCent, taxCent: line.taxCent, totalCent: line.totalCent,
  }).run();

  appendLedger({
    productId: productId!, changeQuantity: line.quantity, balanceBefore,
    sourceType: 'inbound', sourceId: batchId, reason: `月初进项导入 ${batchNo}`,
  });

  db.update(products)
    .set({ stockBalance: balanceAfter, updatedAt: new Date().toISOString() })
    .where(eq(products.id, productId!))
    .run();
}

/** 自动创建新商品（缺税收编码标记 incomplete） */
function createAutoProduct(db: ReturnType<typeof getDb>, batchId: string, line: InboundPreviewLine): string {
  const productId = uuidv7();
  const now = new Date().toISOString();
  db.insert(products).values({
    id: productId, name: line.name, nameNormalized: normalizeKey(line.name),
    model: line.model, modelNormalized: normalizeKey(line.model), unit: line.unit,
    taxClassificationCode: '', unitPriceDecimal: line.unitPriceDecimal, taxRate: 13,
    stockBalance: 0, dataStatus: 'incomplete', status: 'active', remark: null,
    createdAt: now, updatedAt: now,
  }).run();

  recordAudit({
    action: 'product.auto_create', entityType: 'product', entityId: productId, sourceBatchId: batchId,
    summary: `进项导入自动建档: ${line.name} ${line.model}`,
  });
  return productId;
}

/** 读取商品当前库存。 */
function getStockBalance(raw: ReturnType<typeof getRawDb>, productId: string): number {
  const row = raw.prepare('SELECT stock_balance FROM products WHERE id = ?').get(productId) as { stock_balance: number } | undefined;
  return row?.stock_balance ?? 0;
}
