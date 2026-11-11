<script setup lang="ts">
import type { HintChart } from "@/utils/hintChart";

defineProps<{
  chart: HintChart;
}>();

function cell(count: number): string {
  return count > 0 ? String(count) : "–";
}
</script>

<template>
  <div class="chart">
    <p class="letters" aria-hidden="true">
      <span class="letters__center">{{ chart.center }}</span>
      <span>{{ chart.letters.slice(1).join("") }}</span>
    </p>
    <p class="stats">
      {{ chart.wordCount }} words | {{ chart.pointTotal }} points
    </p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col"></th>
            <th v-for="length in chart.lengths" :key="length" scope="col">{{ length }}</th>
            <th scope="col">Σ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in chart.rows" :key="row.letter">
            <th scope="row" :class="{ 'is-center': row.letter === chart.center }">
              {{ row.letter }}
            </th>
            <td v-for="(count, index) in row.counts" :key="index">{{ cell(count) }}</td>
            <td class="is-total">{{ row.total }}</td>
          </tr>
          <tr class="is-sum">
            <th scope="row">Σ</th>
            <td v-for="(count, index) in chart.totals" :key="index">{{ count }}</td>
            <td class="is-total">{{ chart.wordCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h4 class="pairs-title">Two letter list</h4>
    <ul class="pairs">
      <li v-for="pair in chart.pairs" :key="pair.prefix">
        <span class="pairs__prefix">{{ pair.prefix }}</span>
        <span class="pairs__count">{{ pair.count }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.chart {
  color: var(--text);
}

.letters {
  margin: 0;
  text-align: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.45rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.letters__center {
  color: #9a7209;
  margin-right: 0.45rem;
}

:global(html.dark) .letters__center {
  color: #f0c84a;
}

.stats {
  margin: 0.35rem 0 1rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
  font-size: 0.95rem;
}

th,
td {
  padding: 0.4rem 0.35rem;
  text-align: center;
  border-bottom: 1px solid var(--border);
  text-transform: uppercase;
}

thead th {
  color: var(--text-muted);
  font-weight: 700;
  font-size: 0.85rem;
}

tbody th {
  font-family: var(--font-display);
  font-weight: 700;
}

.is-center {
  color: #9a7209;
}

:global(html.dark) .is-center {
  color: #f0c84a;
}

.is-total,
.is-sum th,
.is-sum td {
  font-weight: 800;
}

.pairs-title {
  margin: 1.25rem 0 0.6rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
}

.pairs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
}

.pairs li {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.35rem 0.6rem;
  border-bottom: 1px solid var(--border);
  text-transform: uppercase;
}

.pairs__prefix {
  font-weight: 800;
  letter-spacing: 0.04em;
}

.pairs__count {
  color: var(--text-muted);
}

@media (max-width: 520px) {
  .pairs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
