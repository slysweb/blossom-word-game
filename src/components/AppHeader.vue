<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { useSoundStore } from "@/stores/sound";
import { useGameStore } from "@/stores/game";
import StatsModal from "@/components/StatsModal.vue";

const theme = useThemeStore();
const sound = useSoundStore();
const game = useGameStore();
const route = useRoute();
const showStats = ref(false);

function openStats(): void {
  showStats.value = true;
  void game.ensureLoaded();
}
</script>

<template>
  <header class="header">
    <div class="header__inner layout">
      <RouterLink to="/" class="brand" aria-label="Blossom Word Game home">
        <img
          src="/icon-192.png"
          alt="Blossom Word Game logo"
          class="brand__logo"
          width="40"
          height="40" />
        <span class="brand__name">Blossom Word Game</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink to="/">{{ $t("Game") }}</RouterLink>
        <RouterLink
          to="/unlimited"
          :class="{ 'router-link-exact-active': route.path.startsWith('/unlimited') }">
          {{ $t("Unlimited") }}
        </RouterLink>
        <RouterLink to="/archive">{{ $t("Archive") }}</RouterLink>
        <RouterLink to="/solver">{{ $t("Blossom Solver") }}</RouterLink>
        <button type="button" class="nav-btn" @click="openStats">
          {{ $t("Stats") }}
        </button>
        <button
          class="theme-toggle"
          :aria-label="sound.enabled ? $t('sound.mute') : $t('sound.unmute')"
          :aria-pressed="sound.enabled"
          @click="sound.toggle()">
          <svg v-if="sound.enabled" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.96 8.96 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
          </svg>
        </button>
        <button
          class="theme-toggle"
          :aria-label="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="theme.toggle()">
          {{ theme.isDark ? "🌙" : "☀️" }}
        </button>
      </nav>
    </div>
  </header>
  <StatsModal v-model="showStats" />
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem 0.75rem;
  align-items: center;
}

.nav a,
.nav-btn {
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
}

.nav a.router-link-exact-active {
  color: #000;
  background: var(--primary);
  box-shadow: 0 2px 8px var(--primary-soft);
}

.nav-btn {
  background: transparent;
  border: none;
  line-height: inherit;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  color: var(--text);
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
