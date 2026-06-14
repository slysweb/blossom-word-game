<template>
  <section class="hero">
    <span class="hero__eyebrow">🌸 New puzzle every day</span>
    <h1 class="hero__title">
      Blossom <span class="hero__accent">Word Game</span>
    </h1>
    <p class="hero__tagline">
      A free daily word hunt puzzle &mdash; just like Spelling Bee. Make as many
      words as you can from the hive and reach the Genius rank.
    </p>
    <ul class="hero__features">
      <li>✓ Free to play</li>
      <li>✓ No sign-up</li>
      <li>✓ Daily challenge</li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.hero {
  text-align: center;
  margin: 0.5rem auto 2rem;
  max-width: 700px;
  padding: 0 1rem;
}

.hero__eyebrow {
  display: inline-block;
  padding: 0.3rem 0.85rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
  background: var(--primary-soft);
  border: 1px solid var(--primary);
  border-radius: 999px;
}

.hero__title {
  font-size: 2.6rem;
  line-height: 1.1;
  margin-bottom: 0.75rem;
}

.hero__accent {
  color: var(--primary-dark);
}

.hero__tagline {
  margin: 0 auto;
  max-width: 540px;
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.hero__features {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.25rem;
  margin: 1.25rem 0 0;
  padding: 0;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text);
}

@media (max-width: 768px) {
  .hero__title {
    font-size: 2rem;
  }
  .hero__tagline {
    font-size: 1rem;
  }
}
</style>
