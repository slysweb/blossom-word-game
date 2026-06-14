<template>
  <section class="hero">
    <h1 class="hero__title">Blossom Word Game</h1>
    <p class="hero__tagline">
      A free daily word hunt puzzle &mdash; just like Spelling Bee. Make as many
      words as you can from the hive and reach the Genius rank.
    </p>
  </section>
</template>

<style scoped lang="scss">
.hero {
  text-align: center;
  margin: 0.5rem auto 1.5rem;
  max-width: 680px;
  padding: 0 1rem;
}

.hero__title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.hero__tagline {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero__title {
    font-size: 1.6rem;
  }
}
</style>
