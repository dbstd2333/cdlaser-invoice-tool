<template>
  <ElDialog v-model="visible" title="已选价格版本" width="700px">
    <ElTable :data="selectionStore.getSelected()" border size="small" max-height="400">
      <ElTableColumn prop="name" label="项目名称" min-width="150" />
      <ElTableColumn prop="model" label="型号" width="120" />
      <ElTableColumn prop="unit" label="单位" width="80" />
      <ElTableColumn prop="unitPriceDecimal" label="单价" width="120" />
      <ElTableColumn prop="stockBalance" label="库存" width="80" />
    </ElTable>
    <template #footer>
      <ElButton @click="visible = false">关闭</ElButton>
      <ElButton type="danger" @click="handleClear">清空已选</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSelectionStore } from '../../../stores/selection';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [val: boolean]; clear: [] }>();

const selectionStore = useSelectionStore();
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

function handleClear(): void {
  emit('clear');
  visible.value = false;
}
</script>
