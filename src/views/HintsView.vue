<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import HintChart from "@/components/HintChart.vue";
import { EXAMPLE_HIVE_ID, buildHintChart, type HintChart as HintChartData } from "@/utils/hintChart";
import { hiveId, loadPuzzles } from "@/utils/puzzle";

const chart = ref<HintChartData | null>(null);
const failed = ref(false);

onMounted(async () => {
  try {
    const puzzles = await loadPuzzles();
    const puzzle = puzzles.find((item) => hiveId(item) === EXAMPLE_HIVE_ID);
    if (!puzzle) {
      failed.value = true;
      return;
    }
    chart.value = buildHintChart(
      puzzle.answers,
      puzzle.middleLetter,
      puzzle.availableLetters,
    );
  } catch {
    failed.value = true;
  }
});

const center = computed(() => chart.value?.center.toUpperCase() ?? "E");
const outer = computed(() =>
  chart.value ? chart.value.letters.slice(1).join(", ").toUpperCase() : "D, I, P, T, U, Z",
);

function countAt(letter: string, length: number): number {
  const current = chart.value;
  if (!current) return 0;
  const row = current.rows.find((item) => item.letter === letter);
  const index = current.lengths.indexOf(length);
  if (!row || index < 0) return 0;
  return row.counts[index] ?? 0;
}

const exampleCell = computed(() => countAt("d", 4));
const busiestPair = computed(() => {
  const pairs = chart.value?.pairs ?? [];
  let best: HintChartData["pairs"][number] | null = null;
  for (const pair of pairs) {
    if (best === null || pair.count > best.count) best = pair;
  }
  return best;
});
</script>

<template>
  <article class="prose layout">
    <h1>Blossom Word Game Hints</h1>
    <span class="prose__updated">How to read the letter grid and the two-letter list</span>

    <p>
      A Blossom Word Game hint chart shows the shape of the answer list without
      spelling the words. Each row is a first letter. Each column is a word
      length. The number in a cell is how many answers start with that letter
      and have that length. A dash means there are none. Under the grid, the
      two-letter list counts words by their first two letters.
    </p>
    <p>
      This is separate from the three small hint lights. Those fill in the
      first three letters of one word you have not found yet, and you only get
      three of them per puzzle. The yellow light opens this chart, and it does
      not use those three up.
    </p>

    <h2>A worked example</h2>
    <p>
      Take the hive with center <strong>{{ center }}</strong> and outer letters
      <strong>{{ outer }}</strong>. Every answer is at least four letters long
      and includes {{ center }}.
      <RouterLink :to="`/unlimited/${EXAMPLE_HIVE_ID}`">Play this puzzle</RouterLink>
      if you want to try the chart while you hunt.
    </p>

    <HintChart v-if="chart" :chart="chart" />
    <p v-else-if="failed">This example puzzle could not be loaded.</p>
    <p v-else>Loading the example puzzle…</p>

    <h2>How to read the grid</h2>
    <p>
      The gold letter is the center. It is also the first row. The other rows
      follow the outer letters in alphabetical order. Columns appear only for
      lengths this puzzle actually uses, so a hive with an 8-letter or 9-letter
      answer gets a column for it, and a hive without one does not. Σ on the
      right is the total for that first letter. Σ along the bottom is the total
      for that length.
    </p>
    <p v-if="chart">
      On this hive, row <strong>D</strong> and column <strong>4</strong> meet at
      <strong>{{ exampleCell }}</strong>. That means {{ exampleCell }} answers
      are four letters long and start with D. The chart stops there. It does
      not tell you which letters come next, only that those words exist and
      that each of them still has to include the center {{ center }}.
    </p>
    <p>
      Use a crowded cell as a place to search, and a dash as a place to skip.
      If a letter's whole row is zero, no answer starts with it. You can stop
      trying that opening.
    </p>

    <h2>How to read the two-letter list</h2>
    <p v-if="busiestPair">
      Each pair is the first two letters of an answer, followed by how many
      answers share that opening.
      <strong>{{ busiestPair.prefix.toUpperCase() }} {{ busiestPair.count }}</strong>
      is the busiest opening on this hive: {{ busiestPair.count }} words begin
      with {{ busiestPair.prefix.toUpperCase() }}. Start with the large numbers.
      A pair that shows 1 is a single word, so it is a poor place to spend your
      time until the big groups are done.
    </p>
    <p>
      The two letters already include whatever the word begins with. If the
      center letter is not one of those two, it still has to appear later in
      the word.
    </p>

    <h2>What the chart will not do</h2>
    <ul>
      <li>It does not list the answers. The Blossom Solver does that.</li>
      <li>It does not mark which words you have already found.</li>
      <li>Points in the header are the puzzle maximum, including the pangram bonus. The grid itself only counts words.</li>
    </ul>
    <p>
      Open the yellow hint light above any hive, daily or unlimited, to see that
      puzzle's own chart.
    </p>
  </article>
</template>
