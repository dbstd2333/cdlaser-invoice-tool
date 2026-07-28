<template>
  <ElCard shadow="never">
    <template #header>S3 连接配置</template>
    <ElForm :model="backupStore.config" label-width="140px" label-position="right">
      <ElFormItem label="服务类型">
        <ElRadioGroup v-model="backupStore.config.serviceType">
          <ElRadio value="aws">AWS S3</ElRadio>
          <ElRadio value="compatible">S3 兼容服务</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem v-if="backupStore.config.serviceType === 'compatible'" label="Endpoint">
        <ElInput v-model="backupStore.config.endpoint" placeholder="https://s3.example.com" />
      </ElFormItem>
      <ElFormItem label="Region">
        <ElInput v-model="backupStore.config.region" placeholder="us-east-1" />
      </ElFormItem>
      <ElFormItem label="Bucket">
        <ElInput v-model="backupStore.config.bucket" placeholder="my-backup-bucket" />
      </ElFormItem>
      <ElFormItem label="对象路径前缀">
        <ElInput v-model="backupStore.config.prefix" placeholder="invoice-backups" />
      </ElFormItem>
      <ElFormItem label="Access Key ID">
        <ElInput v-model="backupStore.config.accessKeyId" :placeholder="backupStore.credentialConfigured ? '已配置（不回显）' : '请输入'" />
      </ElFormItem>
      <ElFormItem label="Secret Access Key">
        <ElInput v-model="backupStore.config.secretAccessKey" type="password" show-password :placeholder="backupStore.credentialConfigured ? '已配置（不回显）' : '请输入'" />
      </ElFormItem>
      <ElFormItem label="Session Token">
        <ElInput v-model="backupStore.config.sessionToken" type="password" show-password placeholder="可选" />
      </ElFormItem>
      <ElFormItem label="Path Style">
        <ElSwitch v-model="backupStore.config.pathStyle" />
        <span class="hint">兼容服务可开启</span>
      </ElFormItem>
      <ElFormItem label="恢复密码">
        <ElInput v-model="backupStore.config.restorePassword" type="password" show-password placeholder="用于备份文件加密" />
      </ElFormItem>
      <ElFormItem>
        <ElButton :loading="testing" @click="handleTest">测试连接</ElButton>
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useBackupStore } from '../../stores/backup';

const backupStore = useBackupStore();
const testing = ref(false);

async function handleTest(): Promise<void> {
  testing.value = true;
  try {
    const result = await backupStore.testConnection();
    if (result.success) {
      ElMessage.success(result.message);
    } else {
      ElMessage.error(result.message);
    }
  } catch (err) {
    ElMessage.error(`测试失败: ${(err as Error).message}`);
  } finally {
    testing.value = false;
  }
}
</script>

<style scoped>
.hint {
  margin-left: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}
</style>
