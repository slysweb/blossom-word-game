<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useGameStore } from "@/stores/game";
import { loadPuzzles } from "@/utils/puzzle";
import HiveGrid from "@/components/HiveGrid.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import CorrectGuesses from "@/components/CorrectGuesses.vue";
import YesterdaysAnswers from "@/components/YesterdaysAnswers.vue";
import GameRules from "@/components/GameRules.vue";
import BaseModal from "@/components/BaseModal.vue";

const game = useGameStore();

const ready = ref(false);
const error = ref(false);
const showYesterday = ref(false);
const showWon = ref(false);
const wonDismissed = ref(false);

onMounted(async () => {
  try {
    const puzzles = await loadPuzzles();
    game.startGame(puzzles);
    ready.value = true;
  } catch {
    error.value = true;
  }
});

watch(
  () => game.isComplete,
  (complete) => {
    if (complete && !wonDismissed.value) showWon.value = true;
  },
);
</script>

<template>
  <div class="layout">
    <h2>Blossom Word Game of Today</h2>

    <div class="game-card fireworks">
      <div v-if="showWon" class="before" />
      <div v-if="showWon" class="after" />

      <p v-if="error" class="status">Failed to load today's puzzle.</p>
      <p v-else-if="!ready" class="status">Loading…</p>

      <template v-else>
        <div class="game-card__top">
          <span>{{ game.gameDateString }}</span>
          <span class="yesterday-link" @click="showYesterday = true">
            👁 {{ $t("Yesterday") }} {{ $t("Answer") }}
          </span>
        </div>

        <HiveGrid />

        <div class="game-result">
          <ProgressBar />
          <CorrectGuesses />
        </div>
      </template>
    </div>

    <GameRules />
  </div>

  <BaseModal v-model="showYesterday" :title="$t('Yesterdays Answers')">
    <YesterdaysAnswers />
  </BaseModal>

  <BaseModal
    v-model="showWon"
    :title="$t('Congratulations')"
    @closed="wonDismissed = true">
    <h2>{{ $t("GeniusMessage") }}</h2>
  </BaseModal>
</template>

<style scoped lang="scss">
@use "@/assets/styles/fireworks.scss";

.game-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin: 1rem auto;
  padding: 1rem;
  max-width: 760px;
}

.game-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
}

.yesterday-link {
  cursor: pointer;
  color: var(--text-muted);

  &:hover {
    color: var(--text);
  }
}

.game-result {
  max-width: 800px;
  margin: 0 auto;
}

.status {
  padding: 3rem 0;
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .game-card {
    margin: 0.5rem auto;
    padding: 0.5rem;
  }
}
</style>
