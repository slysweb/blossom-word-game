<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import WordGrid from "./WordGrid.vue";

const game = useGameStore();
</script>

<template>
  <div class="yesterday">
    <strong class="letters">
      <span
        v-for="(letter, index) in game.yesterdayAvailableLetters"
        :key="`y-${index}`"
        :class="{ middle: letter === game.yesterdayMiddleLetter }">
        {{ letter }}
      </span>
    </strong>
    <WordGrid :words="game.yesterdayAnswers" />
  </div>
</template>

<style scoped lang="scss">
.letters {
  display: block;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  font-size: 1.2rem;
  color: var(--text);

  .middle {
    color: var(--primary);
  }
}

html:not(.dark) .letters .middle {
  color: #d4bf00;
}
</style>
