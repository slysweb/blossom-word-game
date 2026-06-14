<script setup lang="ts">
import { watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  closed: [];
}>();

function close(): void {
  emit("update:modelValue", false);
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === "Escape") close();
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      window.addEventListener("keydown", onKeydown);
    } else {
      window.removeEventListener("keydown", onKeydown);
      emit("closed");
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal" role="dialog" aria-modal="true">
          <header class="modal__header">
            <h3>{{ title }}</h3>
            <button class="modal__close" aria-label="Close" @click="close">
              &times;
            </button>
          </header>
          <div class="modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--overlay);
  overflow-y: auto;
}

.modal {
  width: 100%;
  max-width: 600px;
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  margin: auto;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
}

.modal__close {
  background: none;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--text-muted);
  padding: 0 0.25rem;

  &:hover {
    color: var(--text);
  }
}

.modal__body {
  padding: 1.25rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
