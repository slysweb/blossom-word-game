<script setup lang="ts">
import { onMounted } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import ToastContainer from "@/components/ToastContainer.vue";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();

onMounted(() => theme.apply());
</script>

<template>
  <AppHeader />
  <main class="app-main">
    <RouterView />
  </main>
  <ToastContainer />
</template>

<style scoped lang="scss">
.app-main {
  padding-bottom: 3rem;
}
</style>
