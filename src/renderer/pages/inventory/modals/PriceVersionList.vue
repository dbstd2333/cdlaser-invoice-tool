<template>
  <div class="price-versions">
    <div class="section-header">
      <span>价格版本</span>
      <ElButton type="primary" size="small" @click="showAddPrice = true">新增价格版本</ElButton>
    </div>
    <ElTable :data="priceVersions" border size="small">
      <ElTableColumn prop="unitPriceDecimal" label="含税单价" />
      <ElTableColumn prop="taxRate" label="税率" width="80" />
      <ElTableColumn prop="stockBalance" label="当前库存" width="100" />
    </ElTable>

    <!-- 新增价格版本 Dialog -->
    <ElDialog v-model="showAddPrice" title="新增价格版本" width="400px" append-to-body>
      <ElForm label-width="120px">
        <ElFormItem label="含税单价" required>
          <ElInput v-model="newPrice" placeholder="最多 13 位小数" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="showAddPrice = false">取消</ElButton>
        <ElButton type="primary" @click="handleAddPriceVersion">确认</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../../api';
import type { PriceVersion } from '@shared/contracts/types';

const props = defineProps<{ productId: string }>();
const emit = defineEmits<{ reload: [] }>();

const priceVersions = ref<PriceVersion[]>([]);
const showAddPrice = ref(false);
const newPrice = ref('');

/** 加载价格版本列表 */
async function loadPriceVersions(): Promise<void> {
  if (!props.productId) return;
  try {
    priceVersions.value = await api.catalog.getPriceVersionsByProduct(props.productId);
  } catch {
    priceVersions.value = [];
  }
}

/** 新增价格版本 */
async function handleAddPriceVersion(): Promise<void> {
  if (!newPrice.value || !props.productId) return;
  try {
    await api.catalog.createPriceVersion({ productId: props.productId, unitPriceDecimal: newPrice.value });
    ElMessage.success('价格版本已创建');
    showAddPrice.value = false;
    newPrice.value = '';
    await loadPriceVersions();
    emit('reload');
  } catch (err) {
    ElMessage.error(`创建失败: ${(err as Error).message}`);
  }
}

defineExpose({ loadPriceVersions });
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
}
</style>
