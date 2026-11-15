import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { subDays } from "date-fns";
import { i18n } from "@/i18n";
import { useToast } from "@/composables/useToast";
import {
  calculatePoints,
  dateKey,
  getPuzzleForDate,
  getToday,
  getTodayKey,
  hiveId,
  isHiveId,
  isPangram,
  loadPuzzles,
  puzzleNumber,
} from "@/utils/puzzle";
import { maxScoreFor, rankIndexFor, scoreFor, scoreLevelsFor } from "@/utils/score";
import { SITE_URL } from "@/utils/seo";
import { buildChallengeState } from "@/utils/dailyChallenge";
import { useSoundStore } from "@/stores/sound";
import type { Puzzle } from "@/types/puzzle";

const PROGRESS_PERCENTAGES = [0, 20, 40, 50, 60, 70, 80, 90, 100];
const POINTS_MESSAGES: Record<number, string> = {
  1: "good",
  5: "nice",
  6: "great",
  7: "excellent",
  8: "amazing",
};

/** Found words per puzzle key (a date, or an unlimited hive id). */
type Progress = Record<string, string[]>;

export interface UnlimitedGameSummary {
  id: string;
  center: string;
  outer: string;
  score: number;
  maxScore: number;
  rankIndex: number;
}

export interface OpenUnlimitedResult {
  id: string;
  /** The requested id was not a hive in the puzzle pool. */
  unknown: boolean;
}

export const useGameStore = defineStore("game", () => {
  const { t } = i18n.global;
  const toast = useToast();

  const puzzles = ref<Puzzle[]>([]);
  const isLoaded = ref(false);
  const mode = ref<"daily" | "unlimited">("daily");
  // The date currently being played (defaults to today; changed for archive).
  const activeDate = ref<Date>(getToday());
  const activeUnlimitedId = ref<string | null>(null);
  // Per-date progress survives reloads and lets users resume any puzzle.
  const progress = useStorage<Progress>("progress", {});
  /** Hive ids in the unlimited game list, newest first. */
  const unlimitedOrder = useStorage<string[]>("unlimitedGames", []);
  const unlimitedProgress = useStorage<Progress>("unlimitedProgress", {});
  const unlimitedHints = useStorage<Record<string, number>>("unlimitedHints", {});
  const lastUnlimitedId = useStorage("unlimitedLastId", "");

  const isUnlimited = computed(() => mode.value === "unlimited");
  const gameDateString = computed(() => dateKey(activeDate.value));
  const isToday = computed(() => gameDateString.value === getTodayKey());

  const puzzlesById = computed(() => {
    const map = new Map<string, Puzzle>();
    for (const puzzle of puzzles.value) {
      const id = hiveId(puzzle);
      if (!map.has(id)) map.set(id, puzzle);
    }
    return map;
  });

  /** Key used to store guesses, hints, and the flower-challenge celebration. */
  const progressKey = computed(() =>
    isUnlimited.value ? (activeUnlimitedId.value ?? "") : gameDateString.value,
  );

  const puzzle = computed<Puzzle | null>(() => {
    if (!puzzles.value.length) return null;
    if (isUnlimited.value) {
      const id = activeUnlimitedId.value;
      return id ? (puzzlesById.value.get(id) ?? null) : null;
    }
    return getPuzzleForDate(puzzles.value, activeDate.value);
  });
  const previousPuzzle = computed<Puzzle | null>(() =>
    puzzles.value.length
      ? getPuzzleForDate(puzzles.value, subDays(activeDate.value, 1))
      : null,
  );

  const answers = computed(() => puzzle.value?.answers ?? []);
  const availableLetters = computed(() => puzzle.value?.availableLetters ?? "");
  const middleLetter = computed(() => puzzle.value?.middleLetter ?? "");

  const yesterdayAnswers = computed(() => previousPuzzle.value?.answers ?? []);
  const yesterdayAvailableLetters = computed(
    () => previousPuzzle.value?.availableLetters ?? "",
  );
  const yesterdayMiddleLetter = computed(
    () => previousPuzzle.value?.middleLetter ?? "",
  );

  const correctGuessesList = computed(() => {
    const bag = isUnlimited.value ? unlimitedProgress.value : progress.value;
    return bag[progressKey.value] ?? [];
  });

  const maxScore = computed(() => maxScoreFor(answers.value));
  const userScore = computed(() => scoreFor(correctGuessesList.value));
  const scoreLevels = computed(() => scoreLevelsFor(maxScore.value));
  const progressIndex = computed(() =>
    rankIndexFor(userScore.value, scoreLevels.value),
  );
  const progressPercentage = computed(
    () => PROGRESS_PERCENTAGES[progressIndex.value] ?? 0,
  );
  const isComplete = computed(() => progressPercentage.value === 100);

  const puzzleNo = computed(() => puzzleNumber(activeDate.value));
  const rankLabel = computed(() => t(`rank.${progressIndex.value}`));
  const pangramCount = computed(
    () => correctGuessesList.value.filter((w) => isPangram(w)).length,
  );

  /** Saved unlimited games, in list order, with score and rank. */
  const unlimitedGames = computed<UnlimitedGameSummary[]>(() =>
    unlimitedOrder.value.flatMap((id) => {
      const entry = puzzlesById.value.get(id);
      if (!entry) return [];
      const found = unlimitedProgress.value[id] ?? [];
      const max = maxScoreFor(entry.answers);
      const score = scoreFor(found);
      return [
        {
          id,
          center: id.slice(0, 1),
          outer: id.slice(1),
          score,
          maxScore: max,
          rankIndex: rankIndexFor(score, scoreLevelsFor(max)),
        },
      ];
    }),
  );

  /** Per-date hint usage (0–3). Resets implicitly when the key is absent. */
  const hintsUsed = useStorage<Record<string, number>>("hintsUsed", {});

  /** Letters to pre-fill the guess input after using a hint. */
  const hintDraft = ref("");

  const hintsUsedForActiveDate = computed(() => {
    const bag = isUnlimited.value ? unlimitedHints.value : hintsUsed.value;
    return bag[progressKey.value] ?? 0;
  });
  const hintsRemaining = computed(() =>
    Math.max(0, 3 - hintsUsedForActiveDate.value),
  );

  /** Word-length flower challenge for the active puzzle. */
  const dailyChallenge = computed(() =>
    buildChallengeState(correctGuessesList.value, answers.value),
  );

  function saveFound(words: string[]): void {
    const key = progressKey.value;
    if (!key) return;
    if (isUnlimited.value) {
      unlimitedProgress.value = { ...unlimitedProgress.value, [key]: words };
      return;
    }
    progress.value = { ...progress.value, [key]: words };
  }

  /** Pick an unfound answer and reveal its first three letters. Returns status. */
  function useHint(): "ok" | "empty" | "exhausted" {
    const used = hintsUsedForActiveDate.value;
    if (used >= 3) return "exhausted";

    const unfound = answers.value.filter(
      (word) => !correctGuessesList.value.includes(word),
    );
    if (unfound.length === 0) return "empty";

    const word = unfound[Math.floor(Math.random() * unfound.length)]!;
    hintDraft.value = word.slice(0, 3);

    const key = progressKey.value;
    const next = used + 1;
    if (isUnlimited.value) {
      unlimitedHints.value = { ...unlimitedHints.value, [key]: next };
    } else {
      hintsUsed.value = { ...hintsUsed.value, [key]: next };
    }
    return "ok";
  }

  function clearHintDraft(): void {
    hintDraft.value = "";
  }

  /** Label drawn on the share card. */
  const shareLabel = computed(() =>
    isUnlimited.value && activeUnlimitedId.value
      ? activeUnlimitedId.value.toUpperCase()
      : `#${puzzleNo.value} · ${gameDateString.value}`,
  );

  /** Share link for the active puzzle. */
  const shareUrl = computed(() => {
    if (isUnlimited.value && activeUnlimitedId.value) {
      return `${SITE_URL}/unlimited/${activeUnlimitedId.value}`;
    }
    return isToday.value ? SITE_URL : `${SITE_URL}/play/${gameDateString.value}`;
  });

  /** Outer hive letters in stable order for share images. */
  const sortedOuterLetters = computed(() =>
    availableLetters.value
      .split("")
      .filter((l) => l !== middleLetter.value)
      .sort(),
  );

  function shareTitle(): string {
    if (isUnlimited.value && activeUnlimitedId.value) {
      return `🌸 Blossom Word Game ${activeUnlimitedId.value.toUpperCase()}`;
    }
    return `🌸 Blossom Word Game #${puzzleNo.value}`;
  }

  /** A no-spoiler, Wordle-style result string for sharing. */
  const shareText = computed(() => {
    // Bloomed flowers vs buds; show at least one bloom once the player scores.
    const raw = Math.round(progressPercentage.value / 10);
    const filled = userScore.value > 0 ? Math.max(1, raw) : raw;
    const bar = "🌸".repeat(filled) + "🌱".repeat(10 - filled);
    const words = `${correctGuessesList.value.length}/${answers.value.length} ${t("words")}`;
    const pangrams =
      pangramCount.value > 0
        ? ` · ${pangramCount.value} ${t("pangrams", pangramCount.value)}`
        : "";
    return [
      shareTitle(),
      `${bar} ${rankLabel.value}`,
      `${words}${pangrams} · ${userScore.value} ${t("pts")}`,
      shareUrl.value,
    ].join("\n");
  });

  /** Share text when the flower challenge is complete. */
  const challengeShareText = computed(() => {
    const ch = dailyChallenge.value;
    const base = shareText.value;
    if (!ch?.complete) return base;
    const blooms = "🌸".repeat(ch.totalCount);
    const lineKey = isUnlimited.value
      ? "challenge.shareLineUnlimited"
      : "challenge.shareLine";
    return [
      shareTitle(),
      `${t(lineKey, { total: ch.totalCount })} ${blooms}`,
      ...base.split("\n").slice(1),
    ].join("\n");
  });

  function pointsMessage(points: number): string {
    const key = POINTS_MESSAGES[points] ?? "awesome";
    return `${t(`points.${key}`)}! +${points}`;
  }

  function submitGuess(guess: string): void {
    const sound = useSoundStore();
    const word = guess.toLowerCase();
    if (word.length < 4) {
      sound.play("error");
      return toast.show(t("too short"));
    }
    if (!word.includes(middleLetter.value)) {
      sound.play("error");
      return toast.show(t("missing middle letter"));
    }
    if (!answers.value.includes(word)) {
      sound.play("error");
      return toast.show(t("not in word list"));
    }
    const found = correctGuessesList.value;
    if (found.includes(word)) {
      sound.play("error");
      return toast.show(t("already found"));
    }

    const litBefore = dailyChallenge.value?.litCount ?? 0;
    saveFound([...found, word]);
    const bloomed = (dailyChallenge.value?.litCount ?? 0) > litBefore;
    sound.play(bloomed ? "bloom" : "correct");

    const points = calculatePoints(word);
    if (isPangram(word)) {
      toast.show(`${t("Pangram")}! +${points}`, "success");
    } else {
      toast.show(pointsMessage(points), "success");
    }
  }

  /** One-time migration from the older single-game storage layout. */
  function migrateLegacy(): void {
    try {
      if (Object.keys(progress.value).length > 0) return;
      const rawGuesses = localStorage.getItem("correctGuesses");
      const rawDate = localStorage.getItem("gameDate");
      if (rawGuesses && rawDate) {
        const words = JSON.parse(rawGuesses);
        const date = new Date(rawDate);
        if (Array.isArray(words) && words.length && !isNaN(date.getTime())) {
          progress.value = { ...progress.value, [dateKey(date)]: words };
        }
      }
    } catch {
      // ignore malformed legacy data
    } finally {
      [
        "correctGuesses",
        "answers",
        "availableLetters",
        "middleLetter",
        "gameDate",
        "lastGameDate",
        "yesterdayAnswers",
        "yesterdayAvailableLetters",
        "yesterdayMiddleLetter",
      ].forEach((key) => localStorage.removeItem(key));
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (isLoaded.value) return;
    migrateLegacy();
    puzzles.value = await loadPuzzles();
    isLoaded.value = true;
  }

  function todayHiveId(): string | null {
    if (!puzzles.value.length) return null;
    return hiveId(getPuzzleForDate(puzzles.value, getToday()));
  }

  function pruneUnlimited(): void {
    const map = puzzlesById.value;
    const next = unlimitedOrder.value.filter((id) => map.has(id));
    if (next.length !== unlimitedOrder.value.length) {
      unlimitedOrder.value = next;
    }
  }

  /**
   * Add a random hive from the pool that is not already in the list.
   * Today's daily hive is skipped so unlimited play does not spoil it.
   * Returns the new id, or null when the pool is exhausted.
   */
  function createUnlimitedGame(): string | null {
    const used = new Set(unlimitedOrder.value);
    const today = todayHiveId();
    const pool = [...puzzlesById.value.keys()];
    let candidates = pool.filter((id) => !used.has(id) && id !== today);
    if (candidates.length === 0) {
      candidates = pool.filter((id) => !used.has(id));
    }
    if (candidates.length === 0) return null;

    const id = candidates[Math.floor(Math.random() * candidates.length)]!;
    unlimitedOrder.value = [id, ...unlimitedOrder.value];
    activeUnlimitedId.value = id;
    lastUnlimitedId.value = id;
    hintDraft.value = "";
    return id;
  }

  /** Switch to unlimited and resolve which hive to show. */
  async function openUnlimited(requested: string | null): Promise<OpenUnlimitedResult> {
    await ensureLoaded();
    mode.value = "unlimited";
    hintDraft.value = "";
    pruneUnlimited();

    const normalized = requested?.toLowerCase() ?? "";
    const known = isHiveId(normalized) && puzzlesById.value.has(normalized);
    if (known) {
      if (!unlimitedOrder.value.includes(normalized)) {
        unlimitedOrder.value = [normalized, ...unlimitedOrder.value];
      }
      activeUnlimitedId.value = normalized;
      lastUnlimitedId.value = normalized;
      return { id: normalized, unknown: false };
    }

    const remembered =
      lastUnlimitedId.value && unlimitedOrder.value.includes(lastUnlimitedId.value)
        ? lastUnlimitedId.value
        : (unlimitedOrder.value[0] ?? null);
    const id = remembered ?? createUnlimitedGame();
    if (!id) {
      activeUnlimitedId.value = null;
      return { id: "", unknown: normalized.length > 0 };
    }
    activeUnlimitedId.value = id;
    lastUnlimitedId.value = id;
    return { id, unknown: normalized.length > 0 };
  }

  /**
   * Remove a hive from the list, including its guesses and hints.
   * When the open game is removed, `nextId` is what should be shown next.
   */
  function removeUnlimitedGame(id: string): { removedActive: boolean; nextId: string | null } {
    const wasActive = activeUnlimitedId.value === id;
    unlimitedOrder.value = unlimitedOrder.value.filter((item) => item !== id);

    const progressNext = { ...unlimitedProgress.value };
    delete progressNext[id];
    unlimitedProgress.value = progressNext;

    const hintsNext = { ...unlimitedHints.value };
    delete hintsNext[id];
    unlimitedHints.value = hintsNext;

    const nextId = unlimitedOrder.value[0] ?? null;
    if (wasActive) {
      activeUnlimitedId.value = nextId;
      lastUnlimitedId.value = nextId ?? "";
    } else if (lastUnlimitedId.value === id) {
      lastUnlimitedId.value = activeUnlimitedId.value ?? nextId ?? "";
    }
    return { removedActive: wasActive, nextId };
  }

  /** Load puzzles (if needed) and switch to the given date. */
  async function openDate(date: Date): Promise<void> {
    await ensureLoaded();
    mode.value = "daily";
    activeDate.value = date;
    hintDraft.value = "";
  }

  return {
    puzzles,
    progress,
    unlimitedProgress,
    isLoaded,
    activeDate,
    isToday,
    isUnlimited,
    activeUnlimitedId,
    unlimitedGames,
    answers,
    availableLetters,
    middleLetter,
    yesterdayAnswers,
    yesterdayAvailableLetters,
    yesterdayMiddleLetter,
    correctGuessesList,
    gameDateString,
    progressKey,
    maxScore,
    userScore,
    scoreLevels,
    progressIndex,
    progressPercentage,
    isComplete,
    puzzleNo,
    rankLabel,
    pangramCount,
    hintsUsedForActiveDate,
    hintsRemaining,
    hintDraft,
    dailyChallenge,
    shareText,
    shareUrl,
    shareLabel,
    sortedOuterLetters,
    challengeShareText,
    useHint,
    clearHintDraft,
    submitGuess,
    ensureLoaded,
    openDate,
    openUnlimited,
    createUnlimitedGame,
    removeUnlimitedGame,
  };
});
