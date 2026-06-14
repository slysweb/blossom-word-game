<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="footer__inner layout">
      <div class="footer__brand">
        <img src="/logo.png" alt="Blossom Word Game logo" width="32" height="32" />
        <span>Blossom Word Game</span>
      </div>

      <nav class="footer__links" aria-label="Footer">
        <RouterLink to="/">{{ $t("Game") }}</RouterLink>
        <RouterLink to="/solver">{{ $t("Blossom Solver") }}</RouterLink>
        <a
          rel="nofollow noopener"
          target="_blank"
          href="https://github.com/ConorSheehan1/spelling-bee">
          Spelling Bee
        </a>
        <a
          rel="nofollow noopener"
          target="_blank"
          href="https://github.com/en-wl/wordlist/blob/master/alt12dicts/2of4brif.txt">
          Word list
        </a>
      </nav>

      <p class="footer__copy">
        &copy; {{ year }} Blossom Word Game. A free daily word puzzle.
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: 3rem;
  padding: 2rem 0;
  background: var(--surface-alt);
  border-top: 1px solid var(--border);
}

.footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: var(--text);
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.5rem;

  a {
    color: var(--text-muted);
    text-decoration: none;

    &:hover {
      color: var(--primary);
    }
  }
}

.footer__copy {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
