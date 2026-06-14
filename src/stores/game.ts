import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { isSameDay, subDays } from "date-fns";
import { i18n } from "@/i18n";
import { useToast } from "@/composables/useToast";
import { incrementDups } from "@/utils/array";
import {
  calculatePoints,
  dateKey,
  getPuzzleForDate,
  isPangram,
  loadPuzzles,
} from "@/utils/puzzle";
import type { Puzzle } from "@/types/puzzle";

const PROGRESS_PERCENTAGES = [0, 20, 40, 50, 60, 70, 80, 90, 100];
const POINTS_MESSAGES: Record<number, string> = {
  1: "good",
  5: "nice",
  6: "great",
  7: "excellent",
  8: "amazing",
};

/** Found words per puzzle date, e.g. { "2026-06-14": ["mint", "saint"] }. */
type Progress = Record<string, string[]>;

export const useGameStore = defineStore("game", () => {
  const { t } = i18n.global;
  const toast = useToast();

  const puzzles = ref<Puzzle[]>([]);
  const isLoaded = ref(false);
  // The date currently being played (defaults to today; changed for archive).
  const activeDate = ref<Date>(new Date());
  // Per-date progress survives reloads and lets users resume any puzzle.
  const progress = useStorage<Progress>("progress", {});

  const activeKey = computed(() => dateKey(activeDate.value));
  const isToday = computed(() => isSameDay(activeDate.value, new Date()));

  const puzzle = computed<Puzzle | null>(() =>
    puzzles.value.length ? getPuzzleForDate(puzzles.value, activeDate.value) : null,
  );
  const previousPuzzle = computed<Puzzle | null>(() =>
    puzzles.value.length
      ? getPuzzleForDate(puzzles.value, subDays(activeDate.value, 1))
      : null,
  );

  const answers = computed(() => puzzle.value?.answers ?? []);
  const availableLetters = computed(() => puzzle.value?.availableLetters ?? "");
  const middleLetter = computed(() => puzzle.value?.middleLetter ?? "");

  const yesterdayAnswers = computed(() => previousPuzzle.value?.answers ?? []);
  const yesterdayAvailableLetters = computed(
    () => previousPuzzle.value?.availableLetters ?? "",
  );
  const yesterdayMiddleLetter = computed(
    () => previousPuzzle.value?.middleLetter ?? "",
  );

  const correctGuessesList = computed(() => progress.value[activeKey.value] ?? []);
  const gameDateString = computed(() => activeKey.value);

  const maxScore = computed(() =>
    answers.value.reduce((acc, word) => acc + calculatePoints(word), 0),
  );
  const userScore = computed(() =>
    correctGuessesList.value.reduce(
      (acc, word) => acc + calculatePoints(word),
      0,
    ),
  );

  const scoreLevels = computed(() => {
    const levels = [
      0,
      5,
      Math.floor(maxScore.value * 0.1),
      Math.floor(maxScore.value * 0.2),
      Math.floor(maxScore.value * 0.3),
      Math.floor(maxScore.value * 0.4),
      Math.floor(maxScore.value * 0.5),
      Math.floor(maxScore.value * 0.55),
      Math.floor(maxScore.value * 0.6),
    ].sort((a, b) => a - b);
    const unique = incrementDups(levels);
    const min = Math.min(...unique);
    return unique.map((level) => level - min);
  });

  const progressIndex = computed(
    () => scoreLevels.value.filter((v) => v <= userScore.value).length - 1,
  );
  const progressPercentage = computed(
    () => PROGRESS_PERCENTAGES[progressIndex.value] ?? 0,
  );
  const isComplete = computed(() => progressPercentage.value === 100);

  function pointsMessage(points: number): string {
    const key = POINTS_MESSAGES[points] ?? "awesome";
    return `${t(`points.${key}`)}! +${points}`;
  }

  function submitGuess(guess: string): void {
    const word = guess.toLowerCase();
    if (word.length < 4) return toast.show(t("too short"));
    if (!word.includes(middleLetter.value)) {
      return toast.show(t("missing middle letter"));
    }
    if (!answers.value.includes(word)) {
      return toast.show(t("not in word list"));
    }
    const found = correctGuessesList.value;
    if (found.includes(word)) return toast.show(t("already found"));

    // Reassign for reactivity + persistence.
    progress.value = {
      ...progress.value,
      [activeKey.value]: [...found, word],
    };

    const points = calculatePoints(word);
    if (isPangram(word)) {
      toast.show(`${t("Pangram")}! +${points}`, "success");
    } else {
      toast.show(pointsMessage(points), "success");
    }
  }

  /** One-time migration from the older single-game storage layout. */
  function migrateLegacy(): void {
    try {
      if (Object.keys(progress.value).length > 0) return;
      const rawGuesses = localStorage.getItem("correctGuesses");
      const rawDate = localStorage.getItem("gameDate");
      if (rawGuesses && rawDate) {
        const words = JSON.parse(rawGuesses);
        const date = new Date(rawDate);
        if (Array.isArray(words) && words.length && !isNaN(date.getTime())) {
          progress.value = { ...progress.value, [dateKey(date)]: words };
        }
      }
    } catch {
      // ignore malformed legacy data
    } finally {
      [
        "correctGuesses",
        "answers",
        "availableLetters",
        "middleLetter",
        "gameDate",
        "lastGameDate",
        "yesterdayAnswers",
        "yesterdayAvailableLetters",
        "yesterdayMiddleLetter",
      ].forEach((key) => localStorage.removeItem(key));
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (isLoaded.value) return;
    migrateLegacy();
    puzzles.value = await loadPuzzles();
    isLoaded.value = true;
  }

  /** Load puzzles (if needed) and switch to the given date. */
  async function openDate(date: Date): Promise<void> {
    await ensureLoaded();
    activeDate.value = date;
  }

  return {
    puzzles,
    progress,
    isLoaded,
    activeDate,
    isToday,
    answers,
    availableLetters,
    middleLetter,
    yesterdayAnswers,
    yesterdayAvailableLetters,
    yesterdayMiddleLetter,
    correctGuessesList,
    gameDateString,
    maxScore,
    userScore,
    scoreLevels,
    progressIndex,
    progressPercentage,
    isComplete,
    submitGuess,
    ensureLoaded,
    openDate,
  };
});
