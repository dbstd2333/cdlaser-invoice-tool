<template>
  <ElDialog
    :model-value="visible"
    title="客户信息"
    width="760px"
    :close-on-click-modal="false"
    :before-close="handleBeforeClose"
    @close="$emit('close')"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="right">
      <ElFormItem label="客户名称" prop="name" required>
        <ElInput v-model="form.name" maxlength="100" />
      </ElFormItem>
      <ElFormItem label="纳税人识别号" prop="taxId" required>
        <ElInput v-model="form.taxId" />
      </ElFormItem>
      <ElFormItem label="简码" prop="shortCode">
        <ElInput v-model="form.shortCode" />
      </ElFormItem>
      <ElFormItem label="地址" prop="address">
        <ElInput v-model="form.address" />
      </ElFormItem>
      <ElFormItem label="电话" prop="phone">
        <ElInput v-model="form.phone" />
      </ElFormItem>
      <ElFormItem label="开户行名称" prop="bankName">
        <ElInput v-model="form.bankName" />
      </ElFormItem>
      <ElFormItem label="银行账号" prop="bankAccount">
        <ElInput v-model="form.bankAccount" />
      </ElFormItem>
      <ElFormItem label="联系邮箱" prop="email">
        <ElInput v-model="form.email" />
      </ElFormItem>
      <ElFormItem label="是否默认地址">
        <ElSwitch v-model="form.isDefaultAddress" />
      </ElFormItem>
      <ElFormItem label="状态">
        <ElRadioGroup v-model="form.status">
          <ElRadio value="active">启用</ElRadio>
          <ElRadio value="inactive">停用</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" :loading="saving" @click="handleSave">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { api } from '../../../api';
import type { Customer } from '@shared/contracts/types';

const props = defineProps<{
  visible: boolean;
  customer: Customer | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const formRef = ref<FormInstance>();
const saving = ref(false);
const formChanged = ref(false);

const form = reactive({
  id: undefined as string | undefined,
  name: '',
  taxId: '',
  shortCode: '',
  address: '',
  phone: '',
  bankName: '',
  bankAccount: '',
  email: '',
  isDefaultAddress: false,
  status: 'active' as 'active' | 'inactive',
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  taxId: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
};

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.customer) {
        Object.assign(form, props.customer);
      } else {
        Object.assign(form, {
          id: undefined,
          name: '',
          taxId: '',
          shortCode: '',
          address: '',
          phone: '',
          bankName: '',
          bankAccount: '',
          email: '',
          isDefaultAddress: false,
          status: 'active',
        });
      }
      formChanged.value = false;
    }
  },
  { immediate: true },
);

watch(form, () => {
  formChanged.value = true;
}, { deep: true });

async function handleSave(): Promise<void> {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    saving.value = true;
    if (form.id) {
      await api.customers.update(form);
    } else {
      await api.customers.create(form);
    }
    ElMessage.success('保存成功');
    emit('saved');
  } catch (err) {
    ElMessage.error(`保存失败: ${(err as Error).message}`);
  } finally {
    saving.value = false;
  }
}

function handleCancel(): void {
  emit('close');
}

function handleBeforeClose(done: () => void): void {
  if (formChanged.value) {
    ElMessageBox.confirm('存在未保存的更改，确认放弃？', '提示', { type: 'warning' })
      .then(() => done())
      .catch(() => {});
  } else {
    done();
  }
}
</script>
