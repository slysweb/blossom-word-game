<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";
import { buildGameStats } from "@/utils/stats";
import { getTodayKey } from "@/utils/puzzle";
import BaseModal from "@/components/BaseModal.vue";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const game = useGameStore();

const stats = computed(() =>
  buildGameStats(
    game.puzzles,
    game.progress,
    game.unlimitedProgress,
    getTodayKey(),
  ),
);

const cells = computed(() => [
  { label: "played", value: stats.value.played },
  { label: "solved", value: stats.value.solved },
  { label: "streak", value: stats.value.streak },
  { label: "pangrams", value: stats.value.pangrams },
  { label: "avgScore", value: stats.value.avgScore },
  { label: "highScore", value: stats.value.highScore },
]);

const challengeCells = computed(() => [
  { label: "challengeCompleted", value: stats.value.challengeCompleted },
  { label: "challengeStreak", value: stats.value.challengeStreak },
]);
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('Stats')"
    @update:model-value="emit('update:modelValue', $event)">
    <div class="panel">
      <h4 class="panel__title">{{ $t("stats.allGames") }}</h4>
      <div class="grid">
        <div v-for="cell in cells" :key="cell.label" class="cell">
          <span class="cell__label">{{ $t(`stats.${cell.label}`) }}</span>
          <span class="cell__value">{{ cell.value }}</span>
        </div>
      </div>
    </div>
    <p class="note">{{ $t("stats.note") }}</p>
    <div class="panel panel--challenge">
      <h4 class="panel__title">{{ $t("stats.challenge") }}</h4>
      <div class="grid">
        <div v-for="cell in challengeCells" :key="cell.label" class="cell">
          <span class="cell__label">{{ $t(`stats.${cell.label}`) }}</span>
          <span class="cell__value">{{ cell.value }}</span>
        </div>
      </div>
    </div>
    <p class="note">{{ $t("stats.challengeNote") }}</p>
  </BaseModal>
</template>

<style scoped lang="scss">
.panel {
  background: var(--surface-alt);
  border-radius: 16px;
  padding: 1rem 0.7rem 0.7rem;
}

.panel--challenge {
  margin-top: 0.85rem;
}

.panel__title {
  margin: 0 0 0.8rem;
  text-align: center;
  letter-spacing: 0.14em;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.85rem 0.4rem 0.75rem;
  background: var(--surface);
  border-radius: 12px;
}

.cell__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.cell__value {
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 700;
  line-height: 1.1;
  color: #8d3b55;
}

:global(html.dark) .cell__value {
  color: #f0a3b8;
}

.note {
  margin: 0.85rem 0 0;
  text-align: center;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--text-muted);
}
</style>
