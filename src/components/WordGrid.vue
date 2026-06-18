<script setup lang="ts">
import { computed } from "vue";
import { isPangram } from "@/utils/puzzle";

const props = defineProps<{
  words: string[];
  emptyText?: string;
  /** Words the player has already found — highlighted separately from pangrams. */
  foundWords?: string[];
}>();

const sorted = computed(() => [...props.words].sort());

const foundSet = computed(
  () => new Set(props.foundWords?.map((w) => w.toLowerCase()) ?? []),
);

function isFound(word: string): boolean {
  return foundSet.value.has(word.toLowerCase());
}
</script>

<template>
  <p v-if="sorted.length === 0" class="empty">{{ emptyText }}</p>
  <ul v-else class="word-grid">
    <li
      v-for="word in sorted"
      :key="word"
      :class="{
        found: isFound(word),
        pangram: isPangram(word) && !isFound(word),
        'found-pangram': isFound(word) && isPangram(word),
      }">
      {{ word }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.word-grid {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;

  li {
    padding: 0.35rem 0.8rem;
    background: var(--surface-alt);
    border: 1px solid var(--border);
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: capitalize;
    color: var(--text);
    transition: transform 0.12s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  .pangram {
    font-weight: 800;
    color: #1a1a22;
    background: var(--primary);
    border-color: var(--primary);
  }

  .found {
    font-weight: 700;
    color: var(--text);
    background: rgba(46, 125, 50, 0.14);
    border-color: #43a047;
  }

  .found-pangram {
    font-weight: 800;
    background: rgba(46, 125, 50, 0.22);
    border-color: #2e7d32;
  }
}

:global(html.dark) .word-grid li.found {
  background: rgba(102, 187, 106, 0.18);
  border-color: #66bb6a;
}

:global(html.dark) .word-grid li.found-pangram {
  background: rgba(102, 187, 106, 0.28);
  border-color: #81c784;
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 1rem 0;
}
</style>
