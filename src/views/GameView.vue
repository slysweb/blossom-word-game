<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useGameStore } from "@/stores/game";
import { loadPuzzles } from "@/utils/puzzle";
import HiveGrid from "@/components/HiveGrid.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import CorrectGuesses from "@/components/CorrectGuesses.vue";
import YesterdaysAnswers from "@/components/YesterdaysAnswers.vue";
import GameRules from "@/components/GameRules.vue";
import HeroSection from "@/components/HeroSection.vue";
import FaqSection from "@/components/FaqSection.vue";
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
    <HeroSection />
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
    <FaqSection />
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
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  margin: 1rem auto 0;
  padding: 1.25rem 1.25rem 1.75rem;
  max-width: 720px;
}

.game-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.game-card__top > span:first-child {
  font-weight: 700;
  color: var(--text-muted);
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.yesterday-link {
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text);
    border-color: var(--primary);
    background: var(--primary-soft);
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
