import { format, isValid, parseISO } from "date-fns";
import type { Puzzle } from "@/types/puzzle";

/**
 * Day the game started. Used as a fixed reference point so the puzzle for a
 * given calendar day is always deterministic, and "yesterday" is always one
 * index behind "today". Constructed in local time so its calendar day is
 * 2022-01-01 in every timezone.
 */
export const EPOCH = new Date(2022, 0, 1);

/**
 * The game's reference timezone. "Today" is the current calendar date here, so
 * every visitor worldwide sees the same daily puzzle (the audience is US-based).
 */
const TIME_ZONE = "America/New_York";

const EPOCH_UTC = Date.UTC(2022, 0, 1);
const DAY_MS = 86_400_000;

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

/**
 * Number of whole days from EPOCH to a calendar-date key. Computed at UTC
 * midnight for both ends so the result is independent of the runtime's
 * timezone — this avoids any off-by-one when crossing midnight.
 */
function dayNumberForKey(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - EPOCH_UTC) / DAY_MS);
}

/** Index into the (circular) puzzle list for a given calendar-date key. */
function puzzleIndexForKey(key: string, len: number): number {
  // `% len` makes the sequence circular so we never run out of puzzles.
  return ((dayNumberForKey(key) % len) + len) % len;
}

/** Pick the puzzle for a calendar-date key from the full list. */
export function getPuzzleForKey(puzzles: Puzzle[], key: string): Puzzle {
  return puzzles[puzzleIndexForKey(key, puzzles.length)];
}

/** Pick the puzzle for a single date from the full list. */
export function getPuzzleForDate(puzzles: Puzzle[], date: Date): Puzzle {
  return getPuzzleForKey(puzzles, dateKey(date));
}

/** Sequential puzzle number for a key (#1 = the EPOCH day). */
export function puzzleNumberForKey(key: string): number {
  return dayNumberForKey(key) + 1;
}

/** Sequential puzzle number for a date (#1 = the EPOCH day). */
export function puzzleNumber(date: Date): number {
  return puzzleNumberForKey(dateKey(date));
}

/** Stable key (yyyy-MM-dd) used for routing and per-date progress storage. */
export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Parse a yyyy-MM-dd key into a Date (local midnight), or null if invalid. */
export function parseDateKey(key: string): Date | null {
  const date = parseISO(key);
  return isValid(date) ? date : null;
}

/** Today's calendar date (yyyy-MM-dd) in the game's reference timezone. */
export function getTodayKey(): string {
  // en-CA formats as yyyy-MM-dd.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Today as a Date (local midnight of the reference-timezone calendar date). */
export function getToday(): Date {
  return parseISO(getTodayKey());
}

/** Whether a key is within the playable range: epoch .. today (inclusive). */
export function isPlayableKey(key: string): boolean {
  const n = dayNumberForKey(key);
  return n >= 0 && n <= dayNumberForKey(getTodayKey());
}

/** Whether a date is within the playable range: epoch .. today (inclusive). */
export function isPlayableDate(date: Date): boolean {
  return isPlayableKey(dateKey(date));
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
