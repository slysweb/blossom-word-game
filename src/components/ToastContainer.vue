<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useToast } from "@/composables/useToast";

const { toasts } = useToast();

/** Game card to center on, or null when the toast should use the page. */
const card = ref<HTMLElement | null>(null);
let observer: MutationObserver | null = null;

function syncCard(): void {
  const modalOpen = document.querySelector(".modal-overlay");
  card.value = modalOpen
    ? null
    : document.querySelector<HTMLElement>(".game-card");
}

onMounted(() => {
  syncCard();
  observer = new MutationObserver(syncCard);
  observer.observe(document.body, { childList: true, subtree: true });
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <Teleport :to="card ?? 'body'">
    <TransitionGroup
      name="toast"
      tag="div"
      class="toast-container"
      :class="{ 'toast-container--card': card }">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`">
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 22vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
}

.toast-container--card {
  position: absolute;
  top: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
}

.toast {
  max-width: 80vw;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  box-shadow: var(--shadow);
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.toast--success {
  background: var(--primary);
  color: #000;
  border-color: var(--primary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
