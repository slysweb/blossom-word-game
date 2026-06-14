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
        <RouterLink to="/archive">{{ $t("Archive") }}</RouterLink>
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
  position: sticky;
  top: 0;
  z-index: 500;
  background: var(--header-bg);
  backdrop-filter: saturate(160%) blur(12px);
  -webkit-backdrop-filter: saturate(160%) blur(12px);
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 1rem;
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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
}

.brand__name {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav a {
  color: var(--text);
  text-decoration: none;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-soft);
    transform: translateY(-1px);
  }

  &.router-link-exact-active {
    color: #000;
    background: var(--primary);
    box-shadow: 0 2px 8px var(--primary-soft);
  }
}

.theme-toggle {
  width: 42px;
  height: 42px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 18px;
  line-height: 1;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-1px);
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
