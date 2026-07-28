<template>
  <div class="app-container">
    <AppSidebar />
    <div class="app-main-container">
      <AppHeader />
      <main class="app-main">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';

const route = useRoute();
const pageTitle = computed(() => (route.meta.title as string) || '首页');
</script>
