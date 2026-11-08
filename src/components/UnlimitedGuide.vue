<template>
  <section class="guide layout">
    <h2 class="section-heading">How Unlimited mode works</h2>
    <p>
      Daily gives everyone the same hive until midnight US Eastern Time.
      Unlimited is for when you want another puzzle. Each game is one hive
      from the same puzzle pool, and it keeps its own words, score, rank, and
      flower challenge. Nothing expires, and the list stays in this browser.
    </p>

    <h3>View your games</h3>
    <p>
      Tap <strong>Games</strong> above the hive. Every hive you have opened
      is listed there. The gold letter is the center letter. The numbers are
      your score out of that puzzle's maximum, with your rank underneath.
      Tap a row to switch to that hive. The &times; on the right removes the
      game and the words you found in it.
    </p>

    <h3>Add a game</h3>
    <ul>
      <li>
        Tap <strong>+ New game</strong> above the hive, or
        <strong>+ New game</strong> inside the list. A hive you do not
        already have is drawn from the pool and added to the top.
      </li>
      <li>
        A new game skips today's daily hive, so playing here does not reveal
        today's puzzle.
      </li>
      <li>
        Share the page link to play the same hive with someone else. Opening
        the link adds that hive to their list.
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.guide {
  max-width: 720px;
  margin: 2.5rem auto 0;
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

p,
li {
  line-height: 1.65;
  color: var(--text);
}

li {
  margin-bottom: 0.4rem;
}
</style>
