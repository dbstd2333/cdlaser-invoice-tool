import type Database from 'better-sqlite3';
import { normalizeUnitPrice } from '@shared/money/index';
import { migrateLegacyPriceVersions } from './legacy-price-version';

/**
 * 数据库建表迁移 SQL。
 * 从 connection.ts 拆分以控制文件长度。
 * 使用 CREATE TABLE IF NOT EXISTS 确保结构一致。
 */

/** 执行建表 SQL */
export function runMigrations(db: Database.Database): void {
  migrateLegacyPriceVersions(db);
  db.exec(MIGRATION_SQL);
  normalizeProductPrices(db);
  createProductIndexes(db);
}

/** 将历史商品价格统一转换为唯一索引使用的规范化十进制字符串。 */
function normalizeProductPrices(db: Database.Database): void {
  const rows = db.prepare('SELECT id, unit_price_decimal FROM products').all() as Array<{
    id: string;
    unit_price_decimal: string;
  }>;
  const update = db.prepare('UPDATE products SET unit_price_decimal = ? WHERE id = ?');
  for (const row of rows) {
    if (row.unit_price_decimal === '0') continue;
    update.run(normalizeUnitPrice(row.unit_price_decimal), row.id);
  }
}

/** 用名称、型号和规范化价格建立商品唯一约束。 */
function createProductIndexes(db: Database.Database): void {
  db.exec(`
    DROP INDEX IF EXISTS products_name_model_unique;
    CREATE UNIQUE INDEX IF NOT EXISTS products_name_model_price_unique
      ON products(name_normalized, model_normalized, unit_price_decimal);
    CREATE INDEX IF NOT EXISTS products_name_model_idx ON products(name_normalized, model_normalized);
  `);
}

const MIGRATION_SQL = `
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY NOT NULL,
    category TEXT NOT NULL DEFAULT '客户分类',
    name TEXT NOT NULL,
    tax_id TEXT NOT NULL,
    tax_id_normalized TEXT NOT NULL,
    short_code TEXT,
    address TEXT,
    phone TEXT,
    bank_name TEXT,
    bank_account TEXT,
    email TEXT,
    is_default_address INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS customers_tax_id_normalized_unique ON customers(tax_id_normalized);
  CREATE INDEX IF NOT EXISTS customers_name_idx ON customers(name);
  CREATE INDEX IF NOT EXISTS customers_status_idx ON customers(status);

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    name_normalized TEXT NOT NULL,
    model TEXT NOT NULL,
    model_normalized TEXT NOT NULL,
    unit TEXT NOT NULL,
    tax_classification_code TEXT NOT NULL,
    unit_price_decimal TEXT NOT NULL,
    tax_rate INTEGER NOT NULL DEFAULT 13,
    stock_balance INTEGER NOT NULL DEFAULT 0,
    data_status TEXT NOT NULL DEFAULT 'complete',
    status TEXT NOT NULL DEFAULT 'active',
    remark TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
  CREATE INDEX IF NOT EXISTS products_stock_idx ON products(stock_balance);

  CREATE TABLE IF NOT EXISTS outbound_batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_no TEXT NOT NULL UNIQUE,
    customer_id TEXT NOT NULL,
    customer_snapshot TEXT NOT NULL,
    exported_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid',
    void_reason TEXT,
    voided_at TEXT,
    xlsx_blob TEXT NOT NULL,
    xlsx_sha256 TEXT NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    total_amount_cent INTEGER NOT NULL DEFAULT 0,
    total_tax_cent INTEGER NOT NULL DEFAULT 0,
    total_cent INTEGER NOT NULL DEFAULT 0,
    line_count INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS outbound_batches_exported_at_idx ON outbound_batches(exported_at, id);
  CREATE INDEX IF NOT EXISTS outbound_batches_status_idx ON outbound_batches(status, exported_at);
  CREATE INDEX IF NOT EXISTS outbound_batches_customer_idx ON outbound_batches(customer_id);

  CREATE TABLE IF NOT EXISTS outbound_lines (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES outbound_batches(id),
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    tax_classification_code TEXT NOT NULL,
    model TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price_decimal TEXT NOT NULL,
    tax_rate INTEGER NOT NULL DEFAULT 13,
    quantity INTEGER NOT NULL,
    amount_cent INTEGER NOT NULL,
    tax_cent INTEGER NOT NULL,
    total_cent INTEGER NOT NULL,
    stock_before INTEGER NOT NULL,
    stock_after INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS outbound_lines_batch_idx ON outbound_lines(batch_id);
  CREATE INDEX IF NOT EXISTS outbound_lines_product_idx ON outbound_lines(product_id);

  CREATE TABLE IF NOT EXISTS inbound_batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_no TEXT NOT NULL UNIQUE,
    original_file_name TEXT NOT NULL,
    original_file_blob TEXT NOT NULL,
    file_sha256 TEXT NOT NULL UNIQUE,
    content_sha256 TEXT NOT NULL UNIQUE,
    imported_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'imported',
    void_reason TEXT,
    voided_at TEXT,
    ignored_row_count INTEGER NOT NULL DEFAULT 0,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    total_amount_cent INTEGER NOT NULL DEFAULT 0,
    total_tax_cent INTEGER NOT NULL DEFAULT 0,
    total_cent INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS inbound_batches_imported_at_idx ON inbound_batches(imported_at);

  CREATE TABLE IF NOT EXISTS inbound_lines (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES inbound_batches(id),
    source_sheet TEXT NOT NULL,
    source_row INTEGER NOT NULL,
    invoice_date TEXT,
    invoice_no TEXT,
    seller_name TEXT,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price_decimal TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    amount_cent INTEGER NOT NULL,
    tax_cent INTEGER NOT NULL,
    total_cent INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS inbound_lines_batch_idx ON inbound_lines(batch_id);
  CREATE INDEX IF NOT EXISTS inbound_lines_product_idx ON inbound_lines(product_id);

  CREATE TABLE IF NOT EXISTS replenishment_exports (
    id TEXT PRIMARY KEY NOT NULL,
    export_no TEXT NOT NULL UNIQUE,
    exported_at TEXT NOT NULL,
    negative_stock_snapshot_at TEXT NOT NULL,
    xlsx_blob TEXT NOT NULL,
    xlsx_sha256 TEXT NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    total_amount_cent INTEGER NOT NULL DEFAULT 0,
    total_tax_cent INTEGER NOT NULL DEFAULT 0,
    total_cent INTEGER NOT NULL DEFAULT 0,
    line_count INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS replenishment_exports_exported_at_idx ON replenishment_exports(exported_at);

  CREATE TABLE IF NOT EXISTS replenishment_export_lines (
    id TEXT PRIMARY KEY NOT NULL,
    export_id TEXT NOT NULL REFERENCES replenishment_exports(id),
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price_decimal TEXT NOT NULL,
    stock_balance_snapshot INTEGER NOT NULL,
    replenishment_quantity INTEGER NOT NULL,
    amount_cent INTEGER NOT NULL,
    tax_cent INTEGER NOT NULL,
    total_cent INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS replenishment_export_lines_export_idx ON replenishment_export_lines(export_id);

  CREATE TABLE IF NOT EXISTS import_jobs (
    id TEXT PRIMARY KEY NOT NULL,
    job_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_sha256 TEXT,
    status TEXT NOT NULL DEFAULT 'previewing',
    stats TEXT,
    errors TEXT,
    preview_token TEXT,
    preview_data TEXT,
    created_at TEXT NOT NULL,
    confirmed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS inventory_ledger (
    id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    change_quantity INTEGER NOT NULL,
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    source_type TEXT NOT NULL,
    source_id TEXT NOT NULL,
    reason TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS inventory_ledger_product_idx ON inventory_ledger(product_id, created_at);
  CREATE INDEX IF NOT EXISTS inventory_ledger_source_idx ON inventory_ledger(source_type, source_id);

  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    source_batch_id TEXT,
    operator TEXT NOT NULL DEFAULT '本机财务',
    created_at TEXT NOT NULL,
    summary TEXT
  );
  CREATE INDEX IF NOT EXISTS audit_events_entity_idx ON audit_events(entity_type, entity_id, created_at);

  CREATE TABLE IF NOT EXISTS audit_field_changes (
    id TEXT PRIMARY KEY NOT NULL,
    event_id TEXT NOT NULL REFERENCES audit_events(id),
    field_path TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT
  );
  CREATE INDEX IF NOT EXISTS audit_field_changes_event_idx ON audit_field_changes(event_id);

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`;
