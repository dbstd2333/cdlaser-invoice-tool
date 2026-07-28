<template>
  <ElDialog
    :model-value="visible"
    :title="productId ? '编辑商品' : '新增商品'"
    width="680px"
    :close-on-click-modal="false"
    destroy-on-close
    @close="$emit('close')"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem label="项目名称" prop="name" required>
        <ElInput v-model="form.name" />
      </ElFormItem>
      <ElFormItem label="规格型号" prop="model" required>
        <ElInput v-model="form.model" />
      </ElFormItem>
      <ElFormItem label="单位" prop="unit" required>
        <ElInput v-model="form.unit" maxlength="20" />
      </ElFormItem>
      <ElFormItem label="税收分类编码" prop="taxClassificationCode" required>
        <ElInput v-model="form.taxClassificationCode" maxlength="19" />
      </ElFormItem>
      <ElFormItem label="状态">
        <ElRadioGroup v-model="form.status">
          <ElRadio value="active">启用</ElRadio>
          <ElRadio value="inactive">停用</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="备注">
        <ElInput v-model="form.remark" type="textarea" />
      </ElFormItem>
    </ElForm>

    <!-- 价格版本列表 -->
    <PriceVersionList v-if="productId" ref="pvListRef" :product-id="productId" @reload="$emit('saved')" />

    <template #footer>
      <ElButton @click="$emit('close')">取消</ElButton>
      <ElButton type="primary" :loading="saving" @click="handleSave">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { api } from '../../../api';
import PriceVersionList from './PriceVersionList.vue';

const props = defineProps<{ visible: boolean; productId: string }>();
const emit = defineEmits<{ close: []; saved: [] }>();

const formRef = ref<FormInstance>();
const pvListRef = ref<InstanceType<typeof PriceVersionList>>();
const saving = ref(false);

const form = reactive({
  id: undefined as string | undefined,
  name: '', model: '', unit: '', taxClassificationCode: '',
  status: 'active' as 'active' | 'inactive', remark: '',
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  model: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  taxClassificationCode: [{ required: true, message: '请输入税收分类编码', trigger: 'blur' }],
};

watch(() => props.visible, async (val) => {
  if (val) {
    if (props.productId) {
      const product = await api.catalog.getProductById(props.productId);
      if (product) Object.assign(form, product);
      // 等待下一帧让 PriceVersionList 挂载后加载
      setTimeout(() => pvListRef.value?.loadPriceVersions(), 0);
    } else {
      Object.assign(form, { id: undefined, name: '', model: '', unit: '', taxClassificationCode: '', status: 'active', remark: '' });
    }
  }
}, { immediate: true });

async function handleSave(): Promise<void> {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    saving.value = true;
    if (form.id) {
      await api.catalog.updateProduct(form);
    } else {
      await api.catalog.createProduct(form);
    }
    ElMessage.success('保存成功');
    emit('saved');
  } catch (err) {
    ElMessage.error(`保存失败: ${(err as Error).message}`);
  } finally {
    saving.value = false;
  }
}
</script>
