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
    <h2>Blossom Solver</h2>

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
        <h3 v-if="results.length">
          {{ $t("Found Words") }}: {{ results.length }}
        </h3>
        <WordGrid :words="results" :empty-text="$t('No matching puzzle')" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.solver {
  max-width: 800px;
  margin: 1.5rem auto;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;
  color: var(--text);
}

.field input {
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  text-transform: lowercase;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
}

.solve {
  padding: 0.7rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  background: var(--primary);
  border: none;
  border-radius: 6px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.results {
  margin-top: 1.5rem;

  h3 {
    color: var(--text);
  }
}
</style>
