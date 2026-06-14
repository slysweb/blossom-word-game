import { differenceInDays, format, isValid, parseISO } from "date-fns";
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

/** Index into the (circular) puzzle list for a given date. */
function puzzleIndex(date: Date, len: number): number {
  const daysSinceEpoch = differenceInDays(date, EPOCH);
  // `% len` makes the sequence circular so we never run out of puzzles.
  return ((daysSinceEpoch % len) + len) % len;
}

/** Pick the puzzle for a single date from the full list. */
export function getPuzzleForDate(puzzles: Puzzle[], date: Date): Puzzle {
  return puzzles[puzzleIndex(date, puzzles.length)];
}

/** Sequential puzzle number for a date (#1 = the EPOCH day). */
export function puzzleNumber(date: Date): number {
  return differenceInDays(date, EPOCH) + 1;
}

/** Stable key (yyyy-MM-dd) used for routing and per-date progress storage. */
export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Parse a yyyy-MM-dd key into a Date, or null if invalid. */
export function parseDateKey(key: string): Date | null {
  const date = parseISO(key);
  return isValid(date) ? date : null;
}

/** Whether a date is within the playable range: epoch .. today (inclusive). */
export function isPlayableDate(date: Date): boolean {
  const today = new Date();
  return (
    differenceInDays(date, EPOCH) >= 0 && differenceInDays(today, date) >= 0
  );
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
