import { useEffect, useState } from 'react';
import type { Customer } from '@shared/contracts/types';
import { CustomerDetailDialog } from './CustomerDetailDialog';
import { CustomerFormDialog } from './CustomerFormDialog';
import { CustomerHistoryDialog } from './CustomerHistoryDialog';
import { CustomerInitialImportDialog } from './CustomerInitialImportDialog';

export type CustomerDialogType =
  | 'detail'
  | 'edit'
  | 'create'
  | 'history'
  | 'initialImport'
  | null;

export function CustomerModalHost({
  type,
  customer,
  onChange,
  onRefresh,
}: {
  type: CustomerDialogType;
  customer: Customer | null;
  onChange: (t: CustomerDialogType) => void;
  onRefresh: () => void;
}) {
  const [initialImportOpen, setInitialImportOpen] = useState(false);

  useEffect(() => {
    if (type === 'initialImport') {
      setInitialImportOpen(true);
      onChange(null);
    }
  }, [type, onChange]);

  const open = (t: CustomerDialogType) => onChange(t);
  const close = () => onChange(null);

  return (
    <>
      <CustomerDetailDialog
        open={type === 'detail'}
        customer={customer}
        onClose={close}
        onEdit={() => open('edit')}
      />
      <CustomerFormDialog
        open={type === 'edit' || type === 'create'}
        customer={type === 'edit' ? customer : null}
        onClose={close}
        onSaved={onRefresh}
      />
      <CustomerHistoryDialog
        open={type === 'history'}
        customer={customer}
        onClose={close}
      />
      <CustomerInitialImportDialog
        open={initialImportOpen}
        onClose={() => setInitialImportOpen(false)}
        onImported={onRefresh}
      />
    </>
  );
}
