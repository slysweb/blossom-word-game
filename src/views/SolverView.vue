<script setup lang="ts">
import { computed, ref } from "vue";
import { loadWordList, solveHive } from "@/utils/puzzle";
import WordGrid from "@/components/WordGrid.vue";

const centerLetter = ref("");
const outerLetters = ref("");
const results = ref<string[]>([]);
const searched = ref(false);
const loading = ref(false);

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
  loading.value = true;
  try {
    const words = await loadWordList();
    results.value = solveHive(
      words,
      centerLetter.value,
      centerLetter.value + outerLetters.value,
    );
    searched.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="layout">
    <h1 class="solver-title">Blossom Solver</h1>
    <p class="solver-intro">
      A free word finder for any 7-letter hive &mdash; Blossom Word Game, NYT
      Spelling Bee, or the Merriam-Webster Blossom. Enter the center letter and
      the six outer letters, and the solver lists every valid word &mdash;
      pangrams included.
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
        <button class="solve" :disabled="!isValid || loading" @click="findWords">
          {{ loading ? "…" : $t("Find Words") }}
        </button>
      </div>

      <div v-if="searched" class="results">
        <h2 v-if="results.length" class="results-title">
          {{ $t("Found Words") }}: {{ results.length }}
        </h2>
        <WordGrid :words="results" :empty-text="$t('No words found')" />
      </div>
    </div>

    <section class="solver-help">
      <h2 class="section-heading">How the Blossom Solver works</h2>
      <p>
        A hive uses seven unique letters with one required center letter. Enter
        them above and the solver returns every word that is at least four
        letters long, contains the center letter, and uses only those seven
        letters. Words shown in bold are pangrams &mdash; they use all seven
        letters for a big bonus.
      </p>
      <p class="solver-note">
        <strong>Note:</strong> results come from our own word list. Other games
        such as the NYT Spelling Bee and the Merriam-Webster Blossom use
        different dictionaries, so a word we list may not be accepted there (and
        vice versa).
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

.solver-note {
  margin-top: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.92rem;

  strong {
    color: var(--text);
  }
}
</style>
