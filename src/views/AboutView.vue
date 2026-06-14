<template>
  <article class="prose layout">
    <h1>About Blossom Word Game</h1>
    <span class="prose__updated">A free daily word puzzle</span>

    <p>
      Blossom Word Game is a free online word hunt puzzle inspired by the
      New York Times Spelling Bee. Every day there is a new hive of seven
      letters, and your goal is to make as many words as possible &mdash; each
      at least four letters long and always including the center letter.
    </p>

    <h2>How it works</h2>
    <p>
      A brand new puzzle is generated every day, and everyone plays the same
      hive. You can also visit the
      <RouterLink to="/archive">Archive</RouterLink> to replay any past puzzle,
      or use the <RouterLink to="/solver">Blossom Solver</RouterLink> to find
      every possible word when you are stuck. Your progress is saved locally in
      your browser, so there is no sign-up and nothing to install.
    </p>

    <h2>Scoring</h2>
    <ul>
      <li>Four-letter words are worth 1 point.</li>
      <li>Longer words earn 1 point per letter.</li>
      <li>
        A pangram uses all seven letters and earns its length plus 7 bonus
        points.
      </li>
    </ul>

    <h2>Credits</h2>
    <ul>
      <li>
        Inspired by the
        <a
          rel="nofollow noopener"
          target="_blank"
          href="https://www.nytimes.com/puzzles/spelling-bee"
          >NYT Spelling Bee</a
        >.
      </li>
      <li>
        Based on the open-source
        <a
          rel="nofollow noopener"
          target="_blank"
          href="https://github.com/ConorSheehan1/spelling-bee"
          >Spelling Bee</a
        >
        project.
      </li>
      <li>
        Word list:
        <a
          rel="nofollow noopener"
          target="_blank"
          href="https://github.com/en-wl/wordlist/blob/master/alt12dicts/2of4brif.txt"
          >12 dicts</a
        >.
      </li>
    </ul>

    <h2>Contact</h2>
    <p>
      Questions or feedback? Email us at
      <a href="mailto:support@blossomword.com">support@blossomword.com</a>.
    </p>
  </article>
</template>
