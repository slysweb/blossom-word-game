<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useGameStore } from "@/stores/game";
import { useThemeStore } from "@/stores/theme";
import { shuffle } from "@/utils/array";

const game = useGameStore();
const theme = useThemeStore();

const strokeColor = computed(() => (theme.isDark ? "#1c1b22" : "#ffffff"));

const otherLetters = ref<string[]>(
  game.availableLetters.split("").filter((l) => l !== game.middleLetter),
);
const userGuess = ref("");

function addLetter(letter: string): void {
  userGuess.value += letter;
}

function deleteLetter(): void {
  userGuess.value = userGuess.value.slice(0, -1);
}

function submit(): void {
  game.submitGuess(userGuess.value);
  userGuess.value = "";
}

function shuffleLetters(): void {
  otherLetters.value = shuffle(otherLetters.value, Math.random());
}

function onKeyup(e: KeyboardEvent): void {
  const key = e.key.toLowerCase();
  if (key === "enter") return submit();
  if (key === "backspace" || key === "delete") return deleteLetter();
  if (key.length === 1 && game.availableLetters.includes(key)) {
    userGuess.value += key;
  }
}

onMounted(() => window.addEventListener("keyup", onKeyup));
onUnmounted(() => window.removeEventListener("keyup", onKeyup));
</script>

<template>
  <div class="hive-controls">
    <div class="user-guess">
      <span
        v-for="(letter, index) in userGuess"
        :key="`guess-${index}`"
        :class="{ 'is-middle': letter === game.middleLetter }">
        {{ letter }}
      </span>
    </div>

    <div class="hive">
      <svg
        class="hive-cell center"
        viewBox="0 0 120 104"
        @click="addLetter(game.middleLetter)">
        <polygon
          class="cell-fill"
          points="0,52 30,0 90,0 120,52 90,104 30,104"
          :stroke="strokeColor"
          stroke-width="7.5" />
        <text class="cell-letter" x="50%" y="50%" dy="10.75%">
          {{ game.middleLetter }}
        </text>
      </svg>
      <svg
        v-for="(letter, index) in otherLetters"
        :key="index"
        class="hive-cell outer"
        viewBox="0 0 120 104"
        @click="addLetter(letter)">
        <polygon
          class="cell-fill"
          points="0,52 30,0 90,0 120,52 90,104 30,104"
          :stroke="strokeColor"
          stroke-width="7.5" />
        <text class="cell-letter" x="50%" y="50%" dy="10.75%">{{ letter }}</text>
      </svg>
    </div>

    <div class="hive-actions">
      <button class="action action--text" @click="deleteLetter">
        {{ $t("Delete") }}
      </button>
      <button
        class="action action--icon"
        :aria-label="$t('Shuffle')"
        @click="shuffleLetters"
        type="button">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M16 3h5v5" />
          <path d="M4 20 21 3" />
          <path d="M21 16v5h-5" />
          <path d="m15 15 6 6" />
          <path d="M4 4l5 5" />
        </svg>
      </button>
      <button class="action action--text action--primary" @click="submit">
        {{ $t("Enter") }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
@use "@/assets/styles/variables" as *;

.hive-controls {
  max-width: 290px;
  margin: 25px auto;
}

.user-guess {
  font-family: var(--font-display);
  text-transform: uppercase;
  margin-bottom: 10px;
  height: 38px;
  font-weight: 600;
  font-size: 27px;
  letter-spacing: 0.04em;
  color: var(--text);

  .is-middle {
    color: var(--primary-dark);
  }
}

.hive {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
}

.hive-cell {
  position: absolute;
  top: calc(100% / 3);
  left: 30%;
  width: 40%;
  height: calc(100% / 3);
  filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.12));
  cursor: pointer;

  .cell-fill {
    fill: var(--cell);
    transition: all 120ms ease;
    transform-origin: 50% 50%;
  }

  &:hover .cell-fill {
    fill: color.adjust($bl-grey, $lightness: -6%);
  }

  &:active .cell-fill {
    transform: scale(0.9);
  }
}

.cell-letter {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 32px;
  text-anchor: middle;
  text-transform: uppercase;
  pointer-events: none;
  fill: #1a1a22;
}

.hive-cell.center .cell-fill {
  fill: $bl-yellow;
}

.hive-cell.center:hover .cell-fill {
  fill: color.adjust($bl-yellow, $lightness: -4%);
}

.hive-cell:nth-child(1) {
  transform: translate(0, 0);
}
.hive-cell:nth-child(2) {
  transform: translate(-75%, -50%);
}
.hive-cell:nth-child(3) {
  transform: translate(0, -100%);
}
.hive-cell:nth-child(4) {
  transform: translate(75%, -50%);
}
.hive-cell:nth-child(5) {
  transform: translate(75%, 50%);
}
.hive-cell:nth-child(6) {
  transform: translate(0, 100%);
}
.hive-cell:nth-child(7) {
  transform: translate(-75%, 50%);
}

.hive-actions {
  margin-top: 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action {
  padding: 13px;
  background: var(--surface);
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  user-select: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-1px);
  }

  &:active {
    box-shadow: 0 3px var(--cell);
    transform: translateY(3px);
  }
}

.action--text {
  flex: 1;
  margin: 0 12px;
  min-width: 5.5em;

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
}

.action--primary {
  background: var(--primary);
  color: #1a1a22;
  border-color: var(--primary);

  &:hover {
    background: var(--primary-dark);
    border-color: var(--primary-dark);
  }
}

.action--icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  min-width: 50px;
}
</style>
