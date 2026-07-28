<template>
  <aside class="app-aside" :class="{ 'is-collapsed': appStore.sidebarCollapsed }">
    <div class="app-brand">
      <span class="brand-icon">📋</span>
      <span v-show="!appStore.sidebarCollapsed" class="brand-text">发票库存管理</span>
    </div>
    <div class="app-menu-container">
      <ElMenu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        background-color="#ffffff"
        text-color="#606266"
        active-text-color="#409eff"
        router
      >
        <ElMenuItem index="/customers">
          <ElIcon><User /></ElIcon>
          <template #title>客户管理</template>
        </ElMenuItem>
        <ElMenuItem index="/inventory">
          <ElIcon><Box /></ElIcon>
          <template #title>商品、库存与开票</template>
        </ElMenuItem>
        <ElMenuItem index="/outbound-records">
          <ElIcon><Document /></ElIcon>
          <template #title>开票记录</template>
        </ElMenuItem>
      </ElMenu>
    </div>
    <SidebarFooter />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../../stores/app';
import SidebarFooter from './SidebarFooter.vue';

const appStore = useAppStore();
const route = useRoute();

const activeMenu = computed(() => route.path);
</script>
