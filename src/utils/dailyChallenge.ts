import { isPangram } from "@/utils/puzzle";

/** Daily challenges begin on this calendar date (US Eastern puzzle day). */
export const CHALLENGE_START = "2026-07-08";

export type ChallengeCategory = "len4" | "len5" | "len6" | "pangram";

export interface FlowerSlot {
  id: string;
  category: ChallengeCategory;
  color: string;
  lit: boolean;
  word?: string;
}

export interface ChallengeGroup {
  category: ChallengeCategory;
  labelKey: string;
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

/** One unique color per flower slot (12 total). */
const FLOWER_COLORS = [
  "#FF6B6B",
  "#FF8E53",
  "#FFB020",
  "#FFD93D",
  "#6BCB77",
  "#4ECDC4",
  "#4D96FF",
  "#7B68EE",
  "#C77DFF",
  "#E056FD",
  "#FF6FAE",
  "#00BCD4",
];

const GROUP_ORDER: ChallengeCategory[] = ["len4", "len5", "len6", "pangram"];

const LABEL_KEYS: Record<ChallengeCategory, string> = {
  len4: "challenge.len4",
  len5: "challenge.len5",
  len6: "challenge.len6",
  pangram: "challenge.pangram",
};

export function isChallengeActive(dateKey: string): boolean {
  return dateKey >= CHALLENGE_START;
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
  let colorIdx = 0;

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
        color: FLOWER_COLORS[colorIdx++] ?? "#fce303",
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
