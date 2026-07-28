/** 领域类型入口 - 按领域分文件，此处统一重新导出。 */

export type { EntityId, IsoTimestamp, StockStatus, PageRequest, PageResponse, InitStatus } from './types/common';
export { getStockStatus, getStockStatusText } from './types/common';

export type { CustomerStatus, Customer, CustomerSnapshot } from './types/customer';
export type { ProductDataStatus, ProductStatus, PriceVersionStatus, Product, PriceVersion, PriceVersionRow } from './types/catalog';
export type { OutboundBatchStatus, OutboundBatch, OutboundLine } from './types/outbound';
export type { InboundBatchStatus, InboundBatch, InboundLine } from './types/inbound';
export type { LedgerSourceType, InventoryLedger, ReplenishmentExport, ReplenishmentExportLine } from './types/inventory';
export type { AuditEvent, AuditFieldChange, FieldHistoryEntry } from './types/audit';
