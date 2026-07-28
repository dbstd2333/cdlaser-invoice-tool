<template>
  <AppShell />
  <SettingsDrawer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppShell from './layouts/AppShell/AppShell.vue';
import SettingsDrawer from './layouts/AppShell/SettingsDrawer.vue';
import { useAppStore } from './stores/app';

const appStore = useAppStore();

onMounted(async () => {
  await appStore.loadInitStatus();
});
</script>
