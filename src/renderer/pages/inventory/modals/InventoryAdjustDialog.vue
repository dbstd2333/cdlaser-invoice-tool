<template>
  <ElDialog
    v-model="dialogVisible"
    title="库存调整"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
    @close="$emit('close')"
  >
    <div v-if="priceVersion" class="adjust-content">
      <ElDescriptions :column="1" border size="small">
        <ElDescriptionsItem label="商品">{{ productName || '—' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="当前库存">{{ priceVersion.stockBalance }}</ElDescriptionsItem>
      </ElDescriptions>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px" style="margin-top: 16px">
        <ElFormItem label="调整量" prop="changeQuantity" required>
          <ElInputNumber v-model="form.changeQuantity" :step="1" :precision="0" />
          <span class="hint">正数增加，负数减少，不可为 0</span>
        </ElFormItem>
        <ElFormItem label="原因" prop="reason" required>
          <ElInput v-model="form.reason" type="textarea" :rows="3" />
        </ElFormItem>
      </ElForm>
      <div class="preview-balance">
        调整后库存：<strong>{{ priceVersion.stockBalance + (form.changeQuantity || 0) }}</strong>
      </div>
    </div>
    <template #footer>
      <ElButton @click="$emit('close')">取消</ElButton>
      <ElButton type="primary" :loading="saving" @click="handleSave">确认调整</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { api } from '../../../api';
import type { PriceVersion } from '@shared/contracts/types';

const props = defineProps<{
  visible: boolean;
  priceVersionId: string;
}>();

const emit = defineEmits<{ close: []; saved: [] }>();

const dialogVisible = computed({
  get: () => props.visible,
  set: () => emit('close'),
});

const formRef = ref<FormInstance>();
const saving = ref(false);
const priceVersion = ref<PriceVersion | null>(null);
const productName = ref('');

const form = reactive({
  changeQuantity: 0,
  reason: '',
});

const rules: FormRules = {
  changeQuantity: [
    { required: true, message: '请输入调整量', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === 0) callback(new Error('调整量不能为 0'));
        else if (!Number.isInteger(value)) callback(new Error('调整量必须为整数'));
        else callback();
      },
      trigger: 'blur',
    },
  ],
  reason: [{ required: true, message: '请填写调整原因', trigger: 'blur' }],
};

watch(
  () => props.visible,
  async (val) => {
    if (val && props.priceVersionId) {
      try {
        const pvs = await api.catalog.getPriceVersionsByIds([props.priceVersionId]);
        const pv = pvs[0] || null;
        priceVersion.value = pv;
        if (pv) {
          const product = await api.catalog.getProductById(pv.productId);
          productName.value = product?.name ?? '';
        } else {
          productName.value = '';
        }
      } catch {
        priceVersion.value = null;
        productName.value = '';
      }
      form.changeQuantity = 0;
      form.reason = '';
    }
  },
  { immediate: true },
);

async function handleSave(): Promise<void> {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    saving.value = true;
    await api.inventory.adjust({
      priceVersionId: props.priceVersionId,
      changeQuantity: form.changeQuantity,
      reason: form.reason,
    });
    ElMessage.success('调整成功');
    emit('saved');
  } catch (err) {
    ElMessage.error(`调整失败: ${(err as Error).message}`);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.adjust-content { display: flex; flex-direction: column; }
.hint { margin-left: 8px; color: var(--text-secondary); font-size: 12px; }
.preview-balance { margin-top: 16px; padding: 12px; background: var(--app-bg); border-radius: 4px; }
</style>
