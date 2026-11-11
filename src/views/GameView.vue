<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useGameStore } from "@/stores/game";
import { useToast } from "@/composables/useToast";
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
import DailyChallenge from "@/components/DailyChallenge.vue";
import HintButtons from "@/components/HintButtons.vue";
import GameListModal from "@/components/GameListModal.vue";
import UnlimitedGuide from "@/components/UnlimitedGuide.vue";

const route = useRoute();
const router = useRouter();
const game = useGameStore();
const toast = useToast();
const { t } = useI18n();

const ready = ref(false);
const error = ref(false);
const showYesterday = ref(false);
const showWon = ref(false);
const wonDismissed = ref(false);
const showAnswers = ref(false);
const showChallengeWon = ref(false);
const showGameList = ref(false);

/** Dates when the challenge celebration modal was already shown. */
const challengeCelebrated = useStorage<Record<string, boolean>>(
  "challengeCelebrated",
  {},
);

const isArchive = computed(() => route.name === "play");
const isUnlimited = computed(
  () => route.name === "unlimited" || route.name === "unlimited-game",
);

async function load(): Promise<void> {
  if (!game.isLoaded) ready.value = false;
  error.value = false;
  showAnswers.value = false;
  showWon.value = false;
  wonDismissed.value = false;
  showChallengeWon.value = false;

  try {
    if (isUnlimited.value) {
      const requested = typeof route.params.id === "string" ? route.params.id : "";
      const opened = await game.openUnlimited(requested || null);
      if (opened.unknown) toast.show(t("unlimited.unknown"));
      if (!opened.id) {
        error.value = true;
        ready.value = false;
        return;
      }
      ready.value = true;
      if (requested.toLowerCase() !== opened.id) {
        await router.replace(`/unlimited/${opened.id}`);
      }
      return;
    }

    showGameList.value = false;
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
    ready.value = false;
  }
}

async function startNewGame(): Promise<void> {
  const id = game.createUnlimitedGame();
  if (!id) {
    toast.show(t("unlimited.exhausted"));
    return;
  }
  showGameList.value = false;
  if (route.params.id !== id) await router.push(`/unlimited/${id}`);
}

async function openListedGame(id: string): Promise<void> {
  if (route.params.id !== id) await router.push(`/unlimited/${id}`);
}

async function removeListedGame(id: string): Promise<void> {
  const { removedActive, nextId } = game.removeUnlimitedGame(id);
  if (!removedActive) return;
  if (nextId) {
    await router.replace(`/unlimited/${nextId}`);
    return;
  }
  await startNewGame();
}

onMounted(load);
watch(
  () =>
    `${String(route.name)}:${String(route.params.date ?? "")}:${String(route.params.id ?? "")}`,
  load,
);

watch(
  () => game.isComplete,
  (complete) => {
    // Celebrate on today's daily puzzle and on unlimited games.
    if (complete && (game.isToday || game.isUnlimited) && !wonDismissed.value) {
      showWon.value = true;
    }
  },
);

let challengeFireworksTimer: ReturnType<typeof setTimeout> | null = null;

function maybeCelebrateChallenge(): void {
  if (!game.dailyChallenge?.complete) return;
  if (!game.progressKey || challengeCelebrated.value[game.progressKey]) return;

  showChallengeWon.value = true;
  challengeCelebrated.value = {
    ...challengeCelebrated.value,
    [game.progressKey]: true,
  };

  if (challengeFireworksTimer) clearTimeout(challengeFireworksTimer);
  // Keep fireworks for a few seconds, then stop — no modal.
  challengeFireworksTimer = setTimeout(() => {
    showChallengeWon.value = false;
    challengeFireworksTimer = null;
  }, 5500);
}

watch(
  () => game.dailyChallenge?.complete,
  (complete) => {
    if (complete) maybeCelebrateChallenge();
  },
);

watch(ready, (isReady) => {
  if (isReady) maybeCelebrateChallenge();
});
</script>

<template>
  <div class="layout">
    <HeroSection v-if="!isArchive && !isUnlimited" />

    <div v-if="isArchive" class="archive-bar">
      <RouterLink to="/archive" class="pill-link">← Archive</RouterLink>
      <RouterLink to="/" class="pill-link">Play today →</RouterLink>
    </div>

    <div class="game-heading">
      <h2>
        {{
          isUnlimited
            ? $t("Unlimited")
            : isArchive
              ? `Puzzle for ${game.gameDateString}`
              : "Blossom Word Game of Today"
        }}
      </h2>
      <p v-if="isUnlimited" class="game-heading__subtitle">
        {{ $t("unlimited.subtitle") }}
      </p>
      <p v-else-if="!isArchive" class="game-heading__subtitle">
        Hunt words, blossom flowers.
      </p>
    </div>

    <div class="game-play">
      <div
        class="game-area"
        :class="{ 'game-area--with-challenge': !isArchive }">
        <div class="game-card fireworks">
          <div v-if="showWon || showChallengeWon" class="before" />
          <div v-if="showWon || showChallengeWon" class="after" />

          <p v-if="error" class="status">Failed to load this puzzle.</p>
          <p v-else-if="!ready" class="status">Loading…</p>

          <template v-else>
            <div class="game-card__top">
              <button
                v-if="isUnlimited"
                type="button"
                class="yesterday-link game-card__action--start"
                @click="showGameList = true">
                {{ $t("Game List") }}
              </button>
              <span v-else class="game-card__meta">
                #{{ game.puzzleNo }} · {{ game.gameDateString }}
              </span>
              <HintButtons />
              <button
                v-if="isUnlimited"
                type="button"
                class="yesterday-link"
                @click="startNewGame">
                + {{ $t("New game") }}
              </button>
              <span v-else class="yesterday-link" @click="showYesterday = true">
                👁 {{ $t("Yesterday") }} {{ $t("Answer") }}
              </span>
            </div>

            <HiveGrid />

            <div class="game-result">
              <ProgressBar />
            </div>
          </template>
        </div>

        <DailyChallenge v-if="ready && !error" />
        <div
          v-else-if="!isArchive && !error"
          class="daily-challenge-placeholder"
          aria-hidden="true" />
      </div>

      <div v-if="ready && !error" class="game-found">
        <CorrectGuesses />
        <div class="game-found__share">
          <ShareButton />
        </div>
        <div v-if="isArchive" class="game-found__reveal">
          <button class="reveal__btn" @click="showAnswers = !showAnswers">
            {{ showAnswers ? "Hide answers" : "Show all answers" }}
            ({{ game.answers.length }})
          </button>
          <div v-if="showAnswers" class="reveal__answers">
            <WordGrid
              :words="game.answers"
              :found-words="game.correctGuessesList" />
          </div>
        </div>
      </div>
    </div>

    <UnlimitedGuide v-if="isUnlimited" />

    <template v-if="!isArchive && !isUnlimited">
      <GameRules />
      <FaqSection />
    </template>
  </div>

  <GameListModal
    v-model="showGameList"
    @select="openListedGame"
    @remove="removeListedGame"
    @new-game="startNewGame" />

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

.game-heading {
  text-align: center;
  margin-bottom: 0.25rem;
}

.game-heading h2 {
  margin: 0;
}

.game-heading__subtitle {
  margin: 0.35rem 0 0;
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.5;
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

.game-play {
  max-width: 960px;
  margin: 1rem auto 0;
  padding: 0 0.5rem;
}

.game-area {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 1.25rem;
}

.game-area--with-challenge {
  @media (min-width: 769px) {
    min-height: 580px;
  }
}

.daily-challenge-placeholder {
  flex: 0 0 320px;
  min-width: 320px;
  max-width: 340px;
  min-height: 520px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  visibility: hidden;
}

.game-card {
  position: relative;
  flex: 1 1 560px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  padding: 1.25rem 1.25rem 1.75rem;
  max-width: 560px;
  min-width: 0;

  @media (min-width: 769px) {
    min-height: 480px;
  }
}

.game-card__top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "meta hints yesterday";
  align-items: center;
  column-gap: 0.5rem;
  row-gap: 0.45rem;
  margin-bottom: 0.5rem;
}

.game-card__meta {
  grid-area: meta;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  justify-self: start;
}

.game-card__top :deep(.hints) {
  grid-area: hints;
}

.yesterday-link {
  grid-area: yesterday;
  justify-self: end;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-muted);
  background: transparent;
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

.game-card__action--start {
  grid-area: meta;
  justify-self: start;
}

.game-result {
  max-width: 800px;
  margin: 0 auto;
}

.game-found {
  max-width: 720px;
  margin: 1.25rem auto 0;
  text-align: center;
}

.game-found__share {
  margin-top: 1rem;
}

.game-found__reveal {
  margin-top: 1rem;
}

.won-share {
  margin-top: 1rem;
  text-align: center;
}

.reveal {
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
  .game-play {
    padding: 0;
  }

  .game-area {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .daily-challenge-placeholder {
    display: none;
  }

  .game-card {
    flex: none;
    width: 100%;
    max-width: none;
    min-height: 0;
    margin: 0.5rem 0 0;
    padding: 0.5rem 0.5rem 1rem;
  }

  .game-card__top {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "meta yesterday"
      "hints hints";
  }

  .game-card__top :deep(.hints) {
    justify-content: center;
  }

  .game-found {
    margin-top: 1rem;
    padding: 0 0.25rem;
  }
}
</style>
