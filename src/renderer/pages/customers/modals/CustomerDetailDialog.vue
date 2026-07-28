<template>
  <ElDialog :model-value="visible" title="客户详情" width="760px" @close="$emit('close')">
    <div v-if="customer" class="detail-content">
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="客户名称">{{ customer.name }}</ElDescriptionsItem>
        <ElDescriptionsItem label="纳税人识别号">{{ customer.taxId }}</ElDescriptionsItem>
        <ElDescriptionsItem label="简码">{{ customer.shortCode || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="地址">{{ customer.address || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="电话">{{ customer.phone || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="开户行">{{ customer.bankName || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="银行账号">{{ customer.bankAccount || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="邮箱">{{ customer.email || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="默认地址">{{ customer.isDefaultAddress ? '是' : '否' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          <ElTag :type="customer.status === 'active' ? 'success' : 'danger'" size="small">
            {{ customer.status === 'active' ? '启用' : '停用' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="最近更新">{{ formatTime(customer.updatedAt) }}</ElDescriptionsItem>
      </ElDescriptions>
    </div>
    <template #footer>
      <ElButton @click="$emit('close')">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import type { Customer } from '@shared/contracts/types';

defineProps<{
  visible: boolean;
  customer: Customer | null;
}>();

defineEmits<{ close: [] }>();

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}
</script>
