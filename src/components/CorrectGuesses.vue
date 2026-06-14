<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useGameStore } from "@/stores/game";
import WordGrid from "./WordGrid.vue";

const { t } = useI18n();
const game = useGameStore();

const foundMessage = computed(() =>
  t("foundWords", game.correctGuessesList.length),
);
</script>

<template>
  <div class="correct-guesses">
    <p class="count">{{ foundMessage }}</p>
    <WordGrid :words="game.correctGuessesList" :empty-text="$t('No words yet')" />
  </div>
</template>

<style scoped lang="scss">
.count {
  text-align: center;
  color: var(--text);
}
</style>
