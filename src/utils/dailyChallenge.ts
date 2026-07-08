import { isPangram } from "@/utils/puzzle";

export type ChallengeCategory = "len4" | "len5" | "len6" | "pangram";

export interface FlowerSlot {
  id: string;
  category: ChallengeCategory;
  lit: boolean;
  word?: string;
}

export interface ChallengeGroup {
  category: ChallengeCategory;
  labelKey: string;
  /** Petals per flower in this row (4 / 5 / 6 / 7). */
  petalCount: number;
  /** One color per petal when bloomed — shared by every flower in the row. */
  petalColors: string[];
  slots: FlowerSlot[];
}

export interface DailyChallengeState {
  groups: ChallengeGroup[];
  litCount: number;
  totalCount: number;
  complete: boolean;
}

const TARGETS: Record<ChallengeCategory, number> = {
  len4: 5,
  len5: 4,
  len6: 2,
  pangram: 1,
};

/** Petal count matches word length (pangram = all 7 letters). */
export const PETAL_COUNT: Record<ChallengeCategory, number> = {
  len4: 4,
  len5: 5,
  len6: 6,
  pangram: 7,
};

/** Rainbow palette — first N colors used per category (4-color, 5-color, etc.). */
export const PETAL_PALETTE = [
  "#FF6B6B",
  "#FF8E53",
  "#FFC107",
  "#6BCB77",
  "#4ECDC4",
  "#4D96FF",
  "#C77DFF",
];

const GROUP_ORDER: ChallengeCategory[] = ["len4", "len5", "len6", "pangram"];

const LABEL_KEYS: Record<ChallengeCategory, string> = {
  len4: "challenge.len4",
  len5: "challenge.len5",
  len6: "challenge.len6",
  pangram: "challenge.pangram",
};

export function petalColorsFor(category: ChallengeCategory): string[] {
  return PETAL_PALETTE.slice(0, PETAL_COUNT[category]);
}

export function puzzleHasPangram(answers: string[]): boolean {
  return answers.some((w) => isPangram(w));
}

function categoryForWord(word: string): ChallengeCategory | null {
  if (isPangram(word)) return "pangram";
  if (word.length === 4) return "len4";
  if (word.length === 5) return "len5";
  if (word.length === 6) return "len6";
  return null;
}

function createSlots(includePangram: boolean): FlowerSlot[] {
  const slots: FlowerSlot[] = [];

  for (const category of GROUP_ORDER) {
    const count =
      category === "pangram"
        ? includePangram
          ? TARGETS.pangram
          : 0
        : TARGETS[category];
    for (let i = 0; i < count; i++) {
      slots.push({
        id: `${category}-${i}`,
        category,
        lit: false,
      });
    }
  }
  return slots;
}

/** Derive lit flowers from guesses in discovery order. */
export function buildChallengeState(
  guesses: string[],
  answers: string[],
): DailyChallengeState {
  const includePangram = puzzleHasPangram(answers);
  const slots = createSlots(includePangram);
  const filled: Record<ChallengeCategory, number> = {
    len4: 0,
    len5: 0,
    len6: 0,
    pangram: 0,
  };

  for (const raw of guesses) {
    const word = raw.toLowerCase();
    const category = categoryForWord(word);
    if (!category) continue;
    if (category === "pangram" && !includePangram) continue;
    if (filled[category] >= TARGETS[category]) continue;

    const slot = slots.find((s) => s.category === category && !s.lit);
    if (!slot) continue;

    slot.lit = true;
    slot.word = word;
    filled[category]++;
  }

  const groups: ChallengeGroup[] = GROUP_ORDER.flatMap((category) => {
    const categorySlots = slots.filter((s) => s.category === category);
    if (!categorySlots.length) return [];
    return [
      {
        category,
        labelKey: LABEL_KEYS[category],
        petalCount: PETAL_COUNT[category],
        petalColors: petalColorsFor(category),
        slots: categorySlots,
      },
    ];
  });

  const litCount = slots.filter((s) => s.lit).length;

  return {
    groups,
    litCount,
    totalCount: slots.length,
    complete: litCount === slots.length,
  };
}
