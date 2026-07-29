<template>
  <ElCard shadow="never">
    <template #header>腾讯云 COS 连接配置</template>
    <ElForm :model="backupStore.config" label-width="140px" label-position="right">
      <ElFormItem label="Region">
        <ElInput v-model="backupStore.config.region" placeholder="ap-guangzhou" />
      </ElFormItem>
      <ElFormItem label="Bucket">
        <ElInput v-model="backupStore.config.bucket" placeholder="invoice-backup-1250000000" />
        <span class="hint">需包含 APPID，格式为 BucketName-APPID</span>
      </ElFormItem>
      <ElFormItem label="对象路径前缀">
        <ElInput v-model="backupStore.config.prefix" placeholder="invoice-backups" />
      </ElFormItem>
      <ElFormItem label="SecretId">
        <ElInput v-model="backupStore.config.secretId" :placeholder="backupStore.credentialConfigured ? '已配置（不回显）' : '请输入'" />
      </ElFormItem>
      <ElFormItem label="SecretKey">
        <ElInput v-model="backupStore.config.secretKey" type="password" show-password :placeholder="backupStore.credentialConfigured ? '已配置（不回显）' : '请输入'" />
      </ElFormItem>
      <ElFormItem label="SecurityToken">
        <ElInput v-model="backupStore.config.securityToken" type="password" show-password placeholder="使用临时密钥时填写" />
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
