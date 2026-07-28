<template>
  <div class="price-versions">
    <div class="section-header">
      <span>价格版本</span>
      <ElButton type="primary" size="small" @click="showAddPrice = true">新增价格版本</ElButton>
    </div>
    <ElTable :data="priceVersions" border size="small">
      <ElTableColumn prop="unitPriceDecimal" label="不含税单价" />
      <ElTableColumn prop="taxRate" label="税率" width="80" />
      <ElTableColumn prop="stockBalance" label="当前库存" width="100" />
      <ElTableColumn label="状态" width="80">
        <template #default="{ row }">
          <ElTag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="100">
        <template #default="{ row }">
          <ElButton link :type="row.status === 'active' ? 'warning' : 'success'" size="small" @click="togglePvStatus(row.id)">
            {{ row.status === 'active' ? '停用' : '启用' }}
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <!-- 新增价格版本 Dialog -->
    <ElDialog v-model="showAddPrice" title="新增价格版本" width="400px" append-to-body>
      <ElForm label-width="120px">
        <ElFormItem label="不含税单价" required>
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
    priceVersions.value = await api.catalog.getPriceVersionsByIds([props.productId]);
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

/** 切换价格版本状态 */
async function togglePvStatus(id: string): Promise<void> {
  try {
    await api.catalog.togglePriceVersionStatus(id);
    await loadPriceVersions();
  } catch (err) {
    ElMessage.error(`操作失败: ${(err as Error).message}`);
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
