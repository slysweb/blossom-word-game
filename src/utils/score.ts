import { incrementDups } from "@/utils/array";
import { calculatePoints } from "@/utils/puzzle";

/** Total points available in a puzzle. */
export function maxScoreFor(answers: string[]): number {
  return answers.reduce((acc, word) => acc + calculatePoints(word), 0);
}

/** Points earned by a list of found words. */
export function scoreFor(words: string[]): number {
  return words.reduce((acc, word) => acc + calculatePoints(word), 0);
}

/**
 * Rank thresholds for a puzzle. Same curve the daily game uses:
 * fixed early steps, then percentages of the maximum score.
 */
export function scoreLevelsFor(maxScore: number): number[] {
  const levels = [
    0,
    5,
    Math.floor(maxScore * 0.1),
    Math.floor(maxScore * 0.2),
    Math.floor(maxScore * 0.3),
    Math.floor(maxScore * 0.4),
    Math.floor(maxScore * 0.5),
    Math.floor(maxScore * 0.55),
    Math.floor(maxScore * 0.6),
  ].sort((a, b) => a - b);
  const unique = incrementDups(levels);
  const min = Math.min(...unique);
  return unique.map((level) => level - min);
}

/** Index into the rank list for a score. 0 is Beginner. */
export function rankIndexFor(score: number, levels: number[]): number {
  return levels.filter((level) => level <= score).length - 1;
}
