<script setup lang="ts">
import { faqs } from "@/data/faq";
</script>

<template>
  <section class="faq layout" aria-labelledby="faq-heading">
    <h2 id="faq-heading" class="section-heading">Frequently Asked Questions</h2>
    <details v-for="(item, index) in faqs" :key="index" class="faq__item">
      <summary>{{ item.question }}</summary>
      <p>{{ item.answer }}</p>
    </details>
  </section>
</template>

<style scoped lang="scss">
.faq {
  margin-top: 2.5rem;
  text-align: left;
}

h2 {
  text-align: left;
  color: var(--text);
}

.faq__item {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 0.6rem;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: var(--primary);
  }

  summary {
    cursor: pointer;
    padding: 1rem 1.1rem;
    font-weight: 600;
    color: var(--text);
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &::-webkit-details-marker {
      display: none;
    }

    &::after {
      content: "+";
      font-size: 1.3rem;
      color: var(--text-muted);
      transition: transform 0.2s ease;
    }
  }

  &[open] summary::after {
    content: "\2212";
  }

  p {
    margin: 0;
    padding: 0 1.1rem 1.1rem;
    line-height: 1.6;
    color: var(--text-muted);
  }
}
</style>
