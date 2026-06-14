<script setup lang="ts">
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
</script>

<template>
  <header class="header">
    <div class="header__inner layout">
      <RouterLink to="/" class="brand" aria-label="Blossom Word Game home">
        <img
          src="/logo.png"
          alt="Blossom Word Game logo"
          class="brand__logo"
          width="40"
          height="40" />
        <span class="brand__name">Blossom Word Game</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink to="/">{{ $t("Game") }}</RouterLink>
        <RouterLink to="/solver">{{ $t("Blossom Solver") }}</RouterLink>
        <button
          class="theme-toggle"
          :aria-label="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="theme.toggle()">
          {{ theme.isDark ? "🌙" : "☀️" }}
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--text);
}

.brand__logo {
  width: 40px;
  height: 40px;
  display: block;
}

.brand__name {
  font-size: 1.5rem;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav a {
  color: var(--text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(127, 127, 127, 0.15);
    transform: translateY(-1px);
  }

  &.router-link-exact-active {
    color: #000;
    background: var(--primary);
  }
}

.theme-toggle {
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  border-radius: 4px;
  font-size: 20px;
  line-height: 1;

  &:hover {
    background: rgba(127, 127, 127, 0.15);
  }
}

@media (max-width: 768px) {
  .header__inner {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .brand__name {
    font-size: 1.3rem;
  }
}
</style>
