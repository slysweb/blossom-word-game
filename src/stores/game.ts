import { computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { isSameDay } from "date-fns";
import { i18n } from "@/i18n";
import { useToast } from "@/composables/useToast";
import { incrementDups } from "@/utils/array";
import {
  EPOCH,
  calculatePoints,
  getPuzzlesForDate,
  isPangram,
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

export const useGameStore = defineStore("game", () => {
  const { t } = i18n.global;
  const toast = useToast();

  // Today's puzzle (persisted so progress survives reloads within the day).
  const correctGuesses = useStorage("correctGuesses", new Set<string>());
  const answers = useStorage<string[]>("answers", []);
  const availableLetters = useStorage("availableLetters", "");
  const middleLetter = useStorage("middleLetter", "");
  const gameDate = useStorage("gameDate", EPOCH);

  // Yesterday's puzzle (shown in the "Yesterday's Answers" dialog).
  const yesterdayAnswers = useStorage<string[]>("yesterdayAnswers", []);
  const yesterdayAvailableLetters = useStorage("yesterdayAvailableLetters", "");
  const yesterdayMiddleLetter = useStorage("yesterdayMiddleLetter", "");

  const correctGuessesList = computed(() => Array.from(correctGuesses.value));

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
    // Ensure levels are strictly increasing and the first is always 0.
    return unique.map((level) => level - min);
  });

  const progressIndex = computed(
    () => scoreLevels.value.filter((v) => v <= userScore.value).length - 1,
  );

  const progressPercentage = computed(
    () => PROGRESS_PERCENTAGES[progressIndex.value] ?? 0,
  );

  const isComplete = computed(() => progressPercentage.value === 100);

  const gameDateString = computed(
    () => gameDate.value.toISOString().split("T")[0],
  );

  function pointsMessage(points: number): string {
    const key = POINTS_MESSAGES[points] ?? "awesome";
    return `${t(`points.${key}`)}! +${points}`;
  }

  function submitGuess(guess: string): void {
    if (guess.length < 4) return toast.show(t("too short"));
    if (!guess.includes(middleLetter.value)) {
      return toast.show(t("missing middle letter"));
    }
    if (!answers.value.includes(guess)) {
      return toast.show(t("not in word list"));
    }
    if (correctGuesses.value.has(guess)) {
      return toast.show(t("already found"));
    }

    correctGuesses.value.add(guess);
    const points = calculatePoints(guess);
    if (isPangram(guess)) {
      toast.show(`${t("Pangram")}! +${points}`, "success");
    } else {
      toast.show(pointsMessage(points), "success");
    }
  }

  function startGame(puzzles: Puzzle[]): void {
    const now = new Date();

    // Only reset the player's progress when the day actually changes.
    if (!isSameDay(gameDate.value, now)) {
      gameDate.value = now;
      correctGuesses.value = new Set<string>();
    }

    // Puzzles are deterministic per date, so always (re)sync today's and
    // yesterday's data. This keeps things correct after a reload and repairs
    // any stale/missing values left in localStorage (e.g. from an older build).
    const { today, yesterday } = getPuzzlesForDate(puzzles, now);
    answers.value = today.answers;
    availableLetters.value = today.availableLetters;
    middleLetter.value = today.middleLetter;
    yesterdayAnswers.value = yesterday.answers;
    yesterdayAvailableLetters.value = yesterday.availableLetters;
    yesterdayMiddleLetter.value = yesterday.middleLetter;
  }

  return {
    correctGuesses,
    correctGuessesList,
    answers,
    availableLetters,
    middleLetter,
    gameDate,
    gameDateString,
    yesterdayAnswers,
    yesterdayAvailableLetters,
    yesterdayMiddleLetter,
    maxScore,
    userScore,
    scoreLevels,
    progressIndex,
    progressPercentage,
    isComplete,
    submitGuess,
    startGame,
  };
});
