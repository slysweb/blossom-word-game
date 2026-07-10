<script setup lang="ts">
import { ref } from "vue";
import ShareModal from "@/components/ShareModal.vue";

defineProps<{
  /** Override the default share text from the game store. */
  text?: string;
}>();

const showModal = ref(false);
/** Blocks rapid re-clicks while the modal is opening or already open. */
const locked = ref(false);

function openShare(): void {
  if (showModal.value || locked.value) return;
  locked.value = true;
  showModal.value = true;
}

function onModalUpdate(open: boolean): void {
  showModal.value = open;
  if (open) return;
  // Short cooldown after close so a double-tap cannot reopen instantly.
  window.setTimeout(() => {
    locked.value = false;
  }, 600);
}
</script>

<template>
  <button
    class="share-btn"
    type="button"
    :disabled="showModal || locked"
    @click="openShare">
    <span class="share-btn__icon" aria-hidden="true">🔗</span>
    {{ $t("Share your result") }}
  </button>

  <ShareModal :model-value="showModal" :text="text" @update:model-value="onModalUpdate" />
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
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px var(--primary-soft);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    box-shadow: none;
  }
}

.share-btn__icon {
  font-size: 1.05rem;
}
</style>
