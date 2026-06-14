<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useGameStore } from "@/stores/game";
import { EPOCH, dateKey, getPuzzleForDate } from "@/utils/puzzle";

const game = useGameStore();
const ready = ref(false);
const viewMonth = ref(startOfMonth(new Date()));

const minMonth = startOfMonth(EPOCH);
const maxMonth = startOfMonth(new Date());

const canPrev = computed(() => isAfter(viewMonth.value, minMonth));
const canNext = computed(() => isBefore(viewMonth.value, maxMonth));
const monthLabel = computed(() => format(viewMonth.value, "MMMM yyyy"));

interface DayEntry {
  key: string;
  label: string;
  weekday: string;
  letters: string;
  middle: string;
  found: number;
  total: number;
  solved: boolean;
}

const days = computed<DayEntry[]>(() => {
  if (!game.puzzles.length) return [];
  const start = startOfMonth(viewMonth.value);
  const monthEnd = endOfMonth(viewMonth.value);
  const today = new Date();
  const from = isBefore(start, EPOCH) ? EPOCH : start;
  const to = isAfter(monthEnd, today) ? today : monthEnd;
  if (isAfter(from, to)) return [];

  return eachDayOfInterval({ start: from, end: to })
    .reverse()
    .map((date) => {
      const puzzle = getPuzzleForDate(game.puzzles, date);
      const key = dateKey(date);
      const found = game.progress[key]?.length ?? 0;
      return {
        key,
        label: format(date, "MMM d"),
        weekday: format(date, "EEE"),
        letters: puzzle.availableLetters,
        middle: puzzle.middleLetter,
        found,
        total: puzzle.answers.length,
        solved: found > 0 && found === puzzle.answers.length,
      };
    });
});

function prevMonth(): void {
  if (canPrev.value) viewMonth.value = subMonths(viewMonth.value, 1);
}
function nextMonth(): void {
  if (canNext.value) viewMonth.value = addMonths(viewMonth.value, 1);
}

onMounted(async () => {
  await game.ensureLoaded();
  ready.value = true;
});
</script>

<template>
  <div class="layout">
    <h1 class="archive-title">Puzzle Archive</h1>
    <p class="archive-intro">
      Browse and replay every past Blossom Word Game. Pick any day to play that
      puzzle, see how many words you found, and reveal the full answer list.
    </p>

    <div class="month-nav">
      <button :disabled="!canPrev" aria-label="Previous month" @click="prevMonth">
        ‹
      </button>
      <span class="month-nav__label">{{ monthLabel }}</span>
      <button :disabled="!canNext" aria-label="Next month" @click="nextMonth">
        ›
      </button>
    </div>

    <p v-if="!ready" class="status">Loading…</p>
    <p v-else-if="!days.length" class="status">No puzzles this month.</p>

    <ul v-else class="day-grid">
      <li v-for="day in days" :key="day.key">
        <RouterLink :to="`/play/${day.key}`" class="day-card">
          <div class="day-card__head">
            <span class="day-card__date">{{ day.label }}</span>
            <span class="day-card__weekday">{{ day.weekday }}</span>
          </div>
          <div class="day-card__letters">
            <span
              v-for="(letter, i) in day.letters"
              :key="i"
              :class="{ middle: letter === day.middle }">
              {{ letter }}
            </span>
          </div>
          <div class="day-card__progress">
            <span v-if="day.solved" class="solved">✓ Solved</span>
            <span v-else-if="day.found > 0">{{ day.found }} / {{ day.total }} words</span>
            <span v-else class="muted">{{ day.total }} words</span>
          </div>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.archive-title {
  text-align: center;
  margin-bottom: 0.5rem;
}

.archive-intro {
  max-width: 640px;
  margin: 0 auto 1.5rem;
  text-align: center;
  color: var(--text-muted);
  line-height: 1.6;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  button {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
    line-height: 1;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      border-color: var(--primary);
      transform: translateY(-1px);
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__label {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.25rem;
    min-width: 9rem;
    text-align: center;
  }
}

.day-grid {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 880px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 0.85rem;
}

.day-card {
  display: block;
  padding: 0.9rem 1rem;
  text-decoration: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
}

.day-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.day-card__date {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--text);
}

.day-card__weekday {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.day-card__letters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin-bottom: 0.6rem;

  span {
    color: var(--text-muted);
  }
  .middle {
    color: var(--primary-dark);
  }
}

.day-card__progress {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);

  .solved {
    color: var(--primary-dark);
  }
  .muted {
    color: var(--text-muted);
    font-weight: 600;
  }
}
</style>
