<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import ToastContainer from "@/components/ToastContainer.vue";
import { useThemeStore } from "@/stores/theme";
import { buildHead } from "@/utils/seo";
import type { RouteSeo } from "@/utils/seo";

const theme = useThemeStore();
const route = useRoute();

useHead(
  computed(() => {
    const seo = route.meta.seo as RouteSeo | undefined;
    return seo ? buildHead(seo) : {};
  }),
);

onMounted(() => theme.apply());
</script>

<template>
  <AppHeader />
  <main class="app-main">
    <RouterView />
  </main>
  <AppFooter />
  <ToastContainer />
</template>

<style scoped lang="scss">
.app-main {
  padding-bottom: 3rem;
}
</style>
