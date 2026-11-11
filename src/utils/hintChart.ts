import { calculatePoints } from "@/utils/puzzle";

export interface HintChartRow {
  letter: string;
  counts: number[];
  total: number;
}

export interface HintPair {
  prefix: string;
  count: number;
}

export interface HintChart {
  /** Center letter, then the other six in alphabetical order. */
  letters: string[];
  center: string;
  /** Word lengths that actually occur, shortest first. */
  lengths: number[];
  rows: HintChartRow[];
  /** Count of answers at each length, same order as `lengths`. */
  totals: number[];
  wordCount: number;
  pointTotal: number;
  pairs: HintPair[];
}

/**
 * Spelling-bee style hint chart. Cells count answers; they never list them.
 * Rows are first letters. Columns are word lengths.
 */
export function buildHintChart(
  answers: string[],
  center: string,
  availableLetters: string,
): HintChart {
  const words = answers.map((word) => word.toLowerCase());
  const mid = center.toLowerCase();
  const outer = availableLetters
    .toLowerCase()
    .split("")
    .filter((letter) => letter !== mid)
    .sort();
  const letters = [mid, ...outer];
  const lengths = [...new Set(words.map((word) => word.length))].sort((a, b) => a - b);

  const rows = letters.map((letter) => {
    const counts = lengths.map(
      (length) => words.filter((word) => word.startsWith(letter) && word.length === length).length,
    );
    return {
      letter,
      counts,
      total: counts.reduce((sum, count) => sum + count, 0),
    };
  });

  const totals = lengths.map((_, index) =>
    rows.reduce((sum, row) => sum + (row.counts[index] ?? 0), 0),
  );

  const pairMap = new Map<string, number>();
  for (const word of words) {
    if (word.length < 2) continue;
    const prefix = word.slice(0, 2);
    pairMap.set(prefix, (pairMap.get(prefix) ?? 0) + 1);
  }

  return {
    letters,
    center: mid,
    lengths,
    rows,
    totals,
    wordCount: words.length,
    pointTotal: words.reduce((sum, word) => sum + calculatePoints(word), 0),
    pairs: [...pairMap.entries()]
      .map(([prefix, count]) => ({ prefix, count }))
      .sort((a, b) => a.prefix.localeCompare(b.prefix)),
  };
}

/** Hive used as the worked example in the hints article. Center E, outer D I P T U Z. */
export const EXAMPLE_HIVE_ID = "ediptuz";
