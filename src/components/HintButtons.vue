<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";
import { useToast } from "@/composables/useToast";
import { useI18n } from "vue-i18n";

const game = useGameStore();
const toast = useToast();
const { t } = useI18n();

const hintsUsed = computed(
  () => game.hintsUsedForActiveDate,
);

function useHint(): void {
  const result = game.useHint();
  if (result === "empty") {
    toast.show(t("hint.noWords"));
  }
}
</script>

<template>
  <div v-if="game.hintsRemaining > 0" class="hints">
    <button
      v-for="slot in 3"
      v-show="slot > hintsUsed"
      :key="slot"
      type="button"
      class="hint-btn"
      :aria-label="t('hint.use')"
      @click="useHint">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.hints {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
}

.hint-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--text-muted);
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-dark);
    border-color: var(--primary);
    background: var(--primary-soft);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
