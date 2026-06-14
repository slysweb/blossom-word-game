import { differenceInDays } from "date-fns";
import type { Puzzle } from "@/types/puzzle";

/**
 * Year the game started. Used as a fixed reference point so that the puzzle for
 * a given calendar day is always deterministic, and "yesterday" is always one
 * index behind "today".
 */
export const EPOCH = new Date("2022-01-01");

const DATA_URL = "/data/allAnswers.json";

let puzzlesPromise: Promise<Puzzle[]> | null = null;

/** Fetch and memoize the full puzzle list (served as a static asset). */
export function loadPuzzles(): Promise<Puzzle[]> {
  if (!puzzlesPromise) {
    puzzlesPromise = fetch(DATA_URL).then((res) => {
      if (!res.ok) {
        puzzlesPromise = null;
        throw new Error(`Failed to load puzzles: ${res.status}`);
      }
      return res.json() as Promise<Puzzle[]>;
    });
  }
  return puzzlesPromise;
}

/** Pick today's and yesterday's puzzles for a given date from the full list. */
export function getPuzzlesForDate(
  puzzles: Puzzle[],
  date: Date,
): { today: Puzzle; yesterday: Puzzle } {
  const daysSinceEpoch = differenceInDays(date, EPOCH);
  const len = puzzles.length;
  // `% len` makes the sequence circular so we never run out of puzzles.
  const todayIndex = ((daysSinceEpoch % len) + len) % len;
  const yesterdayIndex = (((daysSinceEpoch - 1) % len) + len) % len;
  return { today: puzzles[todayIndex], yesterday: puzzles[yesterdayIndex] };
}

/** A word using all 7 unique letters is a pangram. */
export function isPangram(word: string): boolean {
  return new Set(word).size === 7;
}

/** Points for a single word: 4 letters = 1, longer = length, pangram = length + 7. */
export function calculatePoints(word: string): number {
  if (word.length === 4) return 1;
  if (isPangram(word)) return word.length + 7;
  return word.length;
}
