<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import { getToday, isPlayableDate, parseDateKey } from "@/utils/puzzle";
import HiveGrid from "@/components/HiveGrid.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import CorrectGuesses from "@/components/CorrectGuesses.vue";
import YesterdaysAnswers from "@/components/YesterdaysAnswers.vue";
import WordGrid from "@/components/WordGrid.vue";
import GameRules from "@/components/GameRules.vue";
import HeroSection from "@/components/HeroSection.vue";
import FaqSection from "@/components/FaqSection.vue";
import BaseModal from "@/components/BaseModal.vue";
import ShareButton from "@/components/ShareButton.vue";

const route = useRoute();
const router = useRouter();
const game = useGameStore();

const ready = ref(false);
const error = ref(false);
const showYesterday = ref(false);
const showWon = ref(false);
const wonDismissed = ref(false);
const showAnswers = ref(false);

const isArchive = computed(
  () => typeof route.params.date === "string" && route.params.date.length > 0,
);

async function load(): Promise<void> {
  ready.value = false;
  error.value = false;
  showAnswers.value = false;
  showWon.value = false;
  wonDismissed.value = false;

  try {
    let date = getToday();
    if (isArchive.value) {
      const parsed = parseDateKey(route.params.date as string);
      if (!parsed || !isPlayableDate(parsed)) {
        router.replace("/");
        return;
      }
      date = parsed;
    }
    await game.openDate(date);
    ready.value = true;
  } catch {
    error.value = true;
  }
}

onMounted(load);
watch(() => route.params.date, load);

watch(
  () => game.isComplete,
  (complete) => {
    // Only celebrate automatically for today's puzzle.
    if (complete && game.isToday && !wonDismissed.value) showWon.value = true;
  },
);
</script>

<template>
  <div class="layout">
    <HeroSection v-if="!isArchive" />

    <div v-if="isArchive" class="archive-bar">
      <RouterLink to="/archive" class="pill-link">← Archive</RouterLink>
      <RouterLink to="/" class="pill-link">Play today →</RouterLink>
    </div>

    <h2>
      {{ isArchive ? `Puzzle for ${game.gameDateString}` : "Blossom Word Game of Today" }}
    </h2>

    <div class="game-card fireworks">
      <div v-if="showWon" class="before" />
      <div v-if="showWon" class="after" />

      <p v-if="error" class="status">Failed to load this puzzle.</p>
      <p v-else-if="!ready" class="status">Loading…</p>

      <template v-else>
        <div class="game-card__top">
          <span>#{{ game.puzzleNo }} · {{ game.gameDateString }}</span>
          <span class="yesterday-link" @click="showYesterday = true">
            👁 {{ $t("Yesterday") }} {{ $t("Answer") }}
          </span>
        </div>

        <HiveGrid />

        <div class="game-result">
          <ProgressBar />
          <CorrectGuesses />

          <div v-if="game.userScore > 0" class="share-row">
            <ShareButton />
          </div>

          <div v-if="isArchive" class="reveal">
            <button class="reveal__btn" @click="showAnswers = !showAnswers">
              {{ showAnswers ? "Hide answers" : "Show all answers" }}
              ({{ game.answers.length }})
            </button>
            <div v-if="showAnswers" class="reveal__answers">
              <WordGrid :words="game.answers" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <template v-if="!isArchive">
      <GameRules />
      <FaqSection />
    </template>
  </div>

  <BaseModal v-model="showYesterday" :title="$t('Yesterdays Answers')">
    <YesterdaysAnswers />
  </BaseModal>

  <BaseModal
    v-model="showWon"
    :title="$t('Congratulations')"
    @closed="wonDismissed = true">
    <h2>{{ $t("GeniusMessage") }}</h2>
    <div class="won-share">
      <ShareButton />
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
@use "@/assets/styles/fireworks.scss";

.archive-bar {
  display: flex;
  justify-content: space-between;
  max-width: 720px;
  margin: 0 auto 0.5rem;
}

.pill-link {
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.3rem 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text);
    border-color: var(--primary);
    background: var(--primary-soft);
  }
}

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

.share-row {
  margin-top: 1rem;
  text-align: center;
}

.won-share {
  margin-top: 1rem;
  text-align: center;
}

.reveal {
  margin-top: 1.5rem;
  text-align: center;
}

.reveal__btn {
  font-weight: 700;
  color: var(--text);
  background: var(--surface-alt);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--primary);
  }
}

.reveal__answers {
  margin-top: 1rem;
}

.status {
  padding: 3rem 0;
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .game-card {
    margin: 0.5rem auto 0;
    padding: 0.5rem 0.5rem 1rem;
  }
}
</style>
