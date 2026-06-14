<template>
  <section class="rules layout">
    <h3>What is Blossom Word Game?</h3>
    <p>Blossom word game is a word hunt puzzle game, just like Spelling Bee.</p>
    <p>
      The gameplay requires you to combine as many words as possible from the
      letters given.
    </p>

    <h3>Create words using letters from the hive</h3>
    <ul>
      <li>Words must contain at least 4 letters.</li>
      <li>Words must include the center letter.</li>
      <li>Letters can be used more than once.</li>
    </ul>

    <h3>Score points to increase your rating</h3>
    <ul>
      <li>4-letter words are worth 1 point each.</li>
      <li>Longer words earn 1 point per letter.</li>
      <li>
        Each puzzle includes at least one &ldquo;pangram&rdquo; which uses every
        letter. These are worth 7 extra points!
      </li>
    </ul>

    <h3>Ranking Rules</h3>
    <ul>
      <li>Ranks are based on a percentage of possible points in a puzzle.</li>
      <li>Please click the 'progress bar' to view today's ranking rules.</li>
    </ul>

    <h3>About the game</h3>
    <ul>
      <li>
        There is a new puzzle every day. Follow the instructions above to reach
        the genius rank.
      </li>
      <li>This game is a free online spelling bee game.</li>
      <li>Unlimited number of uses. Usage data is saved in your browser.</li>
      <li>Click the 'Yesterday' button to view the previous day's answers.</li>
      <li>
        We use the 12 dicts
        <a
          rel="nofollow"
          target="_blank"
          href="https://github.com/en-wl/wordlist/blob/master/alt12dicts/2of4brif.txt">
          Wordlist</a
        >.
      </li>
      <li>
        This game is based on
        <a
          rel="nofollow"
          target="_blank"
          href="https://github.com/ConorSheehan1/spelling-bee">
          Spelling Bee</a
        >.
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.rules {
  margin-top: 2.5rem;
  text-align: left;
}

h3 {
  margin-top: 1.5rem;
  color: var(--text);
}

ul li {
  line-height: 1.6;
  margin-bottom: 0.4rem;
  color: var(--text);
}
</style>
