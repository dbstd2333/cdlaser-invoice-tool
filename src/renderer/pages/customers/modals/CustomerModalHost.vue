<template>
  <CustomerFormDialog
    v-if="modalType === 'form'"
    :visible="modalType === 'form'"
    :customer="editingCustomer"
    @close="handleClose"
    @saved="handleSaved"
  />
  <CustomerDetailDialog
    v-else-if="modalType === 'detail'"
    :visible="modalType === 'detail'"
    :customer="viewingCustomer"
    @close="handleClose"
  />
  <CustomerHistoryDialog
    v-else-if="modalType === 'history'"
    :visible="modalType === 'history'"
    :entity-id="historyEntityId"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import CustomerFormDialog from './CustomerFormDialog.vue';
import CustomerDetailDialog from './CustomerDetailDialog.vue';
import CustomerHistoryDialog from './CustomerHistoryDialog.vue';
import type { Customer } from '@shared/contracts/types';

const props = defineProps<{
  modalType: 'none' | 'form' | 'detail' | 'history';
  editingCustomer: Customer | null;
  viewingCustomer: Customer | null;
  historyEntityId: string;
}>();

const emit = defineEmits<{
  'update:modalType': [val: 'none' | 'form' | 'detail' | 'history'];
  saved: [];
}>();

function handleClose(): void {
  emit('update:modalType', 'none');
}

function handleSaved(): void {
  emit('saved');
  handleClose();
}
</script>
