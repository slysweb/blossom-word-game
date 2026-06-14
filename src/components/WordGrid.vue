<script setup lang="ts">
import { computed } from "vue";
import { isPangram } from "@/utils/puzzle";

const props = defineProps<{
  words: string[];
  emptyText?: string;
}>();

const sorted = computed(() => [...props.words].sort());
</script>

<template>
  <p v-if="sorted.length === 0" class="empty">{{ emptyText }}</p>
  <ul v-else class="word-grid">
    <li
      v-for="word in sorted"
      :key="word"
      :class="{ pangram: isPangram(word) }">
      {{ word }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.word-grid {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem 0.75rem;

  li {
    padding: 0.35rem 0.25rem;
    border-bottom: 1px solid var(--border);
    text-transform: capitalize;
    color: var(--text);
  }

  .pangram {
    font-weight: 700;
    color: var(--primary);
  }
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 1rem 0;
}

html:not(.dark) .word-grid .pangram {
  color: #000;
  border-bottom-color: var(--primary);
}
</style>
