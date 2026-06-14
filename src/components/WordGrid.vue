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
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 1rem 0;
}
</style>
