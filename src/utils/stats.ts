import { format, parseISO, subDays } from "date-fns";
import type { Puzzle } from "@/types/puzzle";
import {
  getPuzzleForKey,
  hiveId,
  isPangram,
  isPlayableKey,
} from "@/utils/puzzle";
import { buildChallengeState } from "@/utils/dailyChallenge";
import { maxScoreFor, rankIndexFor, scoreFor, scoreLevelsFor } from "@/utils/score";

export interface GameStats {
  played: number;
  solved: number;
  streak: number;
  pangrams: number;
  avgScore: number;
  highScore: number;
  /** Daily puzzles where every Today's Challenge flower bloomed. */
  challengeCompleted: number;
  /** Consecutive days the challenge was finished, ending today or yesterday. */
  challengeStreak: number;
}

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Totals across every saved game. A game counts once it has a found word.
 * Solved means the Genius rank. The streak is consecutive daily Genius
 * ranks, ending today or yesterday.
 */
export function buildGameStats(
  puzzles: Puzzle[],
  daily: Record<string, string[]>,
  unlimited: Record<string, string[]>,
  todayKey: string,
): GameStats {
  const byId = new Map<string, Puzzle>();
  for (const puzzle of puzzles) {
    const id = hiveId(puzzle);
    if (!byId.has(id)) byId.set(id, puzzle);
  }

  let played = 0;
  let solved = 0;
  let pangrams = 0;
  let scoreSum = 0;
  let highScore = 0;
  const solvedDates = new Set<string>();
  const challengeDates = new Set<string>();
  let challengeCompleted = 0;

  const add = (words: string[], puzzle: Puzzle | null, date: string | null): void => {
    const found = words.filter((word) => word.length > 0);
    if (found.length === 0) return;
    const score = scoreFor(found);
    played += 1;
    scoreSum += score;
    if (score > highScore) highScore = score;
    pangrams += found.filter((word) => isPangram(word)).length;
    if (puzzle && reachedGenius(score, puzzle.answers)) {
      solved += 1;
      if (date) solvedDates.add(date);
    }
  };

  for (const [key, words] of Object.entries(daily)) {
    if (!DATE_KEY.test(key) || !isPlayableKey(key)) continue;
    const puzzle = puzzles.length ? getPuzzleForKey(puzzles, key) : null;
    add(words, puzzle, key);
    if (puzzle && buildChallengeState(words, puzzle.answers).complete) {
      challengeCompleted += 1;
      challengeDates.add(key);
    }
  }
  for (const [id, words] of Object.entries(unlimited)) {
    add(words, byId.get(id) ?? null, null);
  }

  return {
    played,
    solved,
    streak: streakEnding(solvedDates, todayKey),
    pangrams,
    avgScore: played === 0 ? 0 : Math.round(scoreSum / played),
    highScore,
    challengeCompleted,
    challengeStreak: streakEnding(challengeDates, todayKey),
  };
}

function reachedGenius(score: number, answers: string[]): boolean {
  const levels = scoreLevelsFor(maxScoreFor(answers));
  return rankIndexFor(score, levels) === levels.length - 1;
}

function previousKey(key: string): string {
  return format(subDays(parseISO(key), 1), "yyyy-MM-dd");
}

/** Walk backward from today. A missed day ends the streak. */
function streakEnding(solvedDates: Set<string>, todayKey: string): number {
  let cursor = solvedDates.has(todayKey) ? todayKey : previousKey(todayKey);
  let streak = 0;
  while (solvedDates.has(cursor)) {
    streak += 1;
    cursor = previousKey(cursor);
  }
  return streak;
}
