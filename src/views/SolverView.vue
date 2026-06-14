<script setup lang="ts">
import { computed, ref } from "vue";
import { loadPuzzles } from "@/utils/puzzle";
import WordGrid from "@/components/WordGrid.vue";

const centerLetter = ref("");
const outerLetters = ref("");
const results = ref<string[]>([]);
const searched = ref(false);

const isValid = computed(
  () =>
    centerLetter.value.length === 1 &&
    outerLetters.value.length === 6 &&
    new Set(centerLetter.value + outerLetters.value).size === 7,
);

function sanitize(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function onCenterInput(): void {
  centerLetter.value = sanitize(centerLetter.value).slice(0, 1);
}

function onOuterInput(): void {
  outerLetters.value = sanitize(outerLetters.value).slice(0, 6);
}

async function findWords(): Promise<void> {
  if (!isValid.value) return;
  const center = centerLetter.value;
  const inputLetters = new Set(center + outerLetters.value);

  const puzzles = await loadPuzzles();
  const match = puzzles.find((puzzle) => {
    if (puzzle.middleLetter !== center) return false;
    if (puzzle.availableLetters.length !== inputLetters.size) return false;
    const puzzleLetters = new Set(puzzle.availableLetters);
    return [...inputLetters].every((letter) => puzzleLetters.has(letter));
  });

  results.value = match ? match.answers : [];
  searched.value = true;
}
</script>

<template>
  <div class="layout">
    <h1 class="solver-title">Blossom Solver</h1>
    <p class="solver-intro">
      A free word finder for the Blossom Word Game and Spelling Bee. Enter the
      center letter and the six outer letters of any hive, and the solver lists
      every valid word &mdash; pangrams included.
    </p>

    <div class="solver">
      <div class="inputs">
        <label class="field">
          <span>{{ $t("Center Letter") }}:</span>
          <input
            v-model="centerLetter"
            maxlength="1"
            :placeholder="$t('Required')"
            @input="onCenterInput" />
        </label>
        <label class="field">
          <span>{{ $t("Outer Letters") }}:</span>
          <input
            v-model="outerLetters"
            maxlength="6"
            :placeholder="$t('6 letters')"
            @input="onOuterInput" />
        </label>
        <button class="solve" :disabled="!isValid" @click="findWords">
          {{ $t("Find Words") }}
        </button>
      </div>

      <div v-if="searched" class="results">
        <h2 v-if="results.length" class="results-title">
          {{ $t("Found Words") }}: {{ results.length }}
        </h2>
        <WordGrid :words="results" :empty-text="$t('No matching puzzle')" />
      </div>
    </div>

    <section class="solver-help">
      <h2 class="section-heading">How the Blossom Solver works</h2>
      <p>
        Every Blossom Word Game puzzle uses seven unique letters with one
        required center letter. The solver matches the letters you enter against
        the full puzzle list and returns all words that are at least four
        letters long and contain the center letter. Words shown in bold are
        pangrams &mdash; they use all seven letters for a big bonus.
      </p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.solver-title {
  text-align: center;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.solver-intro {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
  color: var(--text-muted);
  line-height: 1.6;
}

.solver {
  max-width: 800px;
  margin: 1.5rem auto;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;
  color: var(--text);
}

.field input {
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  font-family: inherit;
  text-transform: lowercase;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-soft);
  }
}

.solve {
  padding: 0.8rem 1rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a1a22;
  background: var(--primary);
  border: none;
  border-radius: 999px;
  box-shadow: 0 4px 14px var(--primary-soft);
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.results {
  margin-top: 1.5rem;

  .results-title {
    color: var(--text);
    font-size: 1.2rem;
  }
}

.solver-help {
  max-width: 800px;
  margin: 2.5rem auto 0;
  text-align: left;

  h2 {
    text-align: left;
    color: var(--text);
    font-size: 1.3rem;
  }

  p {
    color: var(--text-muted);
    line-height: 1.7;
  }
}
</style>
