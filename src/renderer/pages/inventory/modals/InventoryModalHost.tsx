import type { Product } from '@shared/contracts/types';
import { ProductFormDialog } from './ProductFormDialog';
import { HistoryRecordDialog } from './HistoryRecordDialog';
import { OutboundExportDialog } from './OutboundExportDialog';
import { ReplenishmentExportDialog } from './ReplenishmentExportDialog';
import { InboundImportDialog } from './InboundImportDialog';
import { CatalogInitialImportDialog } from './CatalogInitialImportDialog';
import { CatalogDailyImportDialog } from './CatalogDailyImportDialog';

export type InventoryDialogType =
  | 'addProduct'
  | 'editProduct'
  | 'history'
  | 'outboundExport'
  | 'replenishmentExport'
  | 'inboundImport'
  | 'initialImport'
  | 'dailyImport'
  | null;

export function InventoryModalHost({
  type,
  product,
  onChange,
  onSaved,
}: {
  type: InventoryDialogType;
  product: Product | null;
  onChange: (t: InventoryDialogType) => void;
  onSaved: () => void;
}) {
  const close = () => onChange(null);

  return (
    <>
      <ProductFormDialog
        open={type === 'addProduct' || type === 'editProduct'}
        product={type === 'editProduct' ? product : null}
        onClose={close}
        onSaved={onSaved}
      />
      <HistoryRecordDialog open={type === 'history'} product={product} onClose={close} />
      <OutboundExportDialog open={type === 'outboundExport'} onClose={close} onExported={onSaved} />
      <ReplenishmentExportDialog open={type === 'replenishmentExport'} onClose={close} onExported={onSaved} />
      <InboundImportDialog open={type === 'inboundImport'} onClose={close} onImported={onSaved} />
      <CatalogInitialImportDialog open={type === 'initialImport'} onClose={close} onImported={onSaved} />
      <CatalogDailyImportDialog open={type === 'dailyImport'} onClose={close} onImported={onSaved} />
    </>
  );
}
