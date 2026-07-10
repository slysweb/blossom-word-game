<script setup lang="ts">
import { ref } from "vue";
import ShareModal from "@/components/ShareModal.vue";

defineProps<{
  /** Override the default share text from the game store. */
  text?: string;
}>();

const showModal = ref(false);
</script>

<template>
  <button class="share-btn" type="button" @click="showModal = true">
    <span class="share-btn__icon" aria-hidden="true">🔗</span>
    {{ $t("Share your result") }}
  </button>

  <ShareModal v-model="showModal" :text="text" />
</template>

<style scoped lang="scss">
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem auto 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  color: #1a1a22;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  box-shadow: 0 4px 14px var(--primary-soft);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px var(--primary-soft);
  }

  &:active {
    transform: translateY(0);
  }
}

.share-btn__icon {
  font-size: 1.05rem;
}
</style>
