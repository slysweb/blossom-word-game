export interface Puzzle {
  /** All valid words for this puzzle. */
  answers: string[];
  /** The 7 unique letters available (includes the middle letter). */
  availableLetters: string;
  /** The required center letter. */
  middleLetter: string;
}
