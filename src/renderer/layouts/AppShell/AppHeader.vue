<template>
  <header class="app-header">
    <ElIcon class="collapse-btn" @click="appStore.toggleSidebar()">
      <Fold v-if="!appStore.sidebarCollapsed" />
      <Expand v-else />
    </ElIcon>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem>{{ pageTitle }}</ElBreadcrumbItem>
    </ElBreadcrumb>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../../stores/app';

const appStore = useAppStore();
const route = useRoute();

const pageTitle = computed(() => (route.meta.title as string) || '发票库存管理系统');
</script>

<style scoped>
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: var(--text-regular);
}

.collapse-btn:hover {
  color: var(--el-color-primary);
}

</style>
