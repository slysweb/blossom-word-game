<template>
  <section class="rules layout">
    <h2 class="section-heading">How to play Blossom Word Game</h2>
    <p>
      Blossom Word Game is a word hunt puzzle, just like Spelling Bee. Each day
      you get a hive of seven letters and your goal is to combine them into as
      many valid words as possible.
    </p>

    <h3>Create words from the hive</h3>
    <ul>
      <li>Words must contain at least <strong>4 letters</strong>.</li>
      <li>Every word must include the <strong>center letter</strong>.</li>
      <li>Letters can be used more than once.</li>
      <li>Type with your keyboard or tap letters, then press Enter.</li>
    </ul>

    <h3>Score points to increase your rating</h3>
    <ul>
      <li>4-letter words are worth 1 point each.</li>
      <li>Longer words earn 1 point per letter.</li>
      <li>
        Each puzzle includes at least one &ldquo;pangram&rdquo; that uses every
        letter &mdash; worth its length plus 7 bonus points!
      </li>
    </ul>

    <table class="score-table">
      <caption>
        Scoring examples
      </caption>
      <thead>
        <tr>
          <th scope="col">Word</th>
          <th scope="col">Length</th>
          <th scope="col">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>mint</td>
          <td>4</td>
          <td>1</td>
        </tr>
        <tr>
          <td>saint</td>
          <td>5</td>
          <td>5</td>
        </tr>
        <tr>
          <td>matins</td>
          <td>6</td>
          <td>6</td>
        </tr>
        <tr class="pangram-row">
          <td>antlims (pangram)</td>
          <td>7</td>
          <td>14</td>
        </tr>
      </tbody>
    </table>

    <h3>Today's Challenge</h3>
    <ul>
      <li>
        The <strong>Today's Challenge</strong> panel beside the hive shows a garden
        of flowers to bloom as you play.
      </li>
      <li>
        Find up to <strong>5 four-letter words</strong>, <strong>4 five-letter words</strong>,
        <strong>3 six-letter words</strong>, and <strong>2 seven-letter words</strong>
        to bloom those rows. When the puzzle includes a pangram, find it to bloom the
        <strong>seven-color flower</strong>. Rows show fewer flowers when the puzzle has
        fewer answers at that length.
      </li>
      <li>
        Each flower has one petal per letter — four petals for 4-letter words, five
        for 5-letter words, and so on. Flowers bloom in the order you discover
        matching words.
      </li>
      <li>Bloom every flower to complete the challenge.</li>
    </ul>

    <h3>Ranking rules</h3>
    <ul>
      <li>Ranks are based on the percentage of possible points in a puzzle.</li>
      <li>Tap the progress bar to see the score needed for each rank today.</li>
    </ul>

    <h3>Sharing your result</h3>
    <p>
      Tap <strong>Share your result</strong> to copy a spoiler-free summary, similar
      to Wordle. The 🌸 and 🌱 on the second line show your <strong>rank progress</strong>
      toward Genius &mdash; not the Today's Challenge flowers beside the hive.
    </p>
    <pre class="share-example" aria-label="Example share text">🌸 Blossom Word Game #1650
🌸🌸🌱🌱🌱🌱🌱🌱🌱🌱 Good Start
3/40 words · 7 pts
https://blossomword.com</pre>
    <ul>
      <li>
        <strong>Line 1</strong> &mdash; the puzzle number for that day.
      </li>
      <li>
        <strong>Line 2</strong> &mdash; ten slots from Beginner to Genius.
        Each 🌸 is one step of rank progress; each 🌱 is a step still to go.
        In the example, <em>Good Start</em> (20% progress) fills 2 of 10 slots with 🌸.
        At Genius, all ten are 🌸.
      </li>
      <li>
        <strong>Line 3</strong> &mdash; how many words you found, out of the total
        in the puzzle, and your score in points.
      </li>
      <li>
        <strong>Line 4</strong> &mdash; a link back to the game.
      </li>
      <li>
        If you complete <strong>Today's Challenge</strong>, the share text also
        mentions how many challenge flowers you bloomed.
      </li>
    </ul>

    <h3>Tips &amp; strategy</h3>
    <ul>
      <li>Look for the pangram early &mdash; it is the biggest single score boost.</li>
      <li>Try common prefixes and suffixes such as <em>-ing</em>, <em>-ed</em> and <em>-s</em>.</li>
      <li>Reuse letters: long words from few letters score the most.</li>
      <li>Stuck? Open the <strong>Blossom Solver</strong> to reveal every answer.</li>
    </ul>

    <h3>About the game</h3>
    <ul>
      <li>A new puzzle is released every day; everyone plays the same hive.</li>
      <li>Free to play, unlimited puzzles, no account or download needed.</li>
      <li>Your progress is saved in your browser.</li>
      <li>
        We use the 12 dicts
        <a
          rel="nofollow noopener"
          target="_blank"
          href="https://github.com/en-wl/wordlist/blob/master/alt12dicts/2of4brif.txt">
          word list</a
        >.
      </li>
      <li>
        Based on the open-source
        <a
          rel="nofollow noopener"
          target="_blank"
          href="https://github.com/ConorSheehan1/spelling-bee">
          Spelling Bee</a
        >
        project.
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.rules {
  margin-top: 2.5rem;
  text-align: left;
}

h2 {
  text-align: left;
  color: var(--text);
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

.score-table {
  width: 100%;
  max-width: 420px;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.95rem;

  caption {
    text-align: left;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
  }

  th,
  td {
    border: 1px solid var(--border);
    padding: 0.5rem 0.75rem;
    text-align: left;
    color: var(--text);
  }

  th {
    background: var(--surface-alt);
  }

  .pangram-row td {
    font-weight: 700;
    color: var(--primary);
  }
}

.share-example {
  margin: 0.75rem 0 1rem;
  padding: 0.85rem 1rem;
  font-family: ui-monospace, "Cascadia Code", "Segoe UI Mono", monospace;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--text);
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  white-space: pre-wrap;
  overflow-x: auto;
}

html:not(.dark) .score-table .pangram-row td {
  color: #000;
  background: rgba(252, 227, 3, 0.18);
}
</style>
