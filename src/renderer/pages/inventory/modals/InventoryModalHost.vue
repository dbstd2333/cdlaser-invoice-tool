<template>
  <OutboundExportDialog
    v-if="modalType === 'outbound'"
    :visible="modalType === 'outbound'"
    :initial-lines="outboundLines"
    @close="handleClose"
    @success="handleOutboundSuccess"
  />
  <ProductFormDialog
    v-else-if="modalType === 'product-form'"
    :visible="modalType === 'product-form'"
    :product-id="editingProductId"
    @close="handleClose"
    @saved="handleSaved"
  />
  <HistoryRecordDialog
    v-else-if="modalType === 'history'"
    :visible="modalType === 'history'"
    :price-version-id="historyPriceVersionId"
    @close="handleClose"
  />
  <InventoryAdjustDialog
    v-else-if="modalType === 'adjust'"
    :visible="modalType === 'adjust'"
    :price-version-id="adjustPriceVersionId"
    @close="handleClose"
    @saved="handleSaved"
  />
</template>

<script setup lang="ts">
import OutboundExportDialog from './OutboundExportDialog.vue';
import ProductFormDialog from './ProductFormDialog.vue';
import HistoryRecordDialog from './HistoryRecordDialog.vue';
import InventoryAdjustDialog from './InventoryAdjustDialog.vue';
import type { SelectedPriceVersion } from '../../../stores/selection';

defineProps<{
  modalType: 'none' | 'product-form' | 'history' | 'adjust' | 'outbound';
  editingProductId: string;
  historyPriceVersionId: string;
  adjustPriceVersionId: string;
  outboundLines: SelectedPriceVersion[];
}>();

const emit = defineEmits<{
  'update:modalType': [val: 'none' | 'product-form' | 'history' | 'adjust' | 'outbound'];
  saved: [];
}>();

function handleClose(): void {
  emit('update:modalType', 'none');
}

function handleSaved(): void {
  emit('saved');
  handleClose();
}

function handleOutboundSuccess(): void {
  emit('saved');
  handleClose();
}
</script>
