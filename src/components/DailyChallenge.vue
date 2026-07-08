<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";

const game = useGameStore();

const challenge = computed(() => game.dailyChallenge);
</script>

<template>
  <aside v-if="challenge" class="daily-challenge">
    <h3 class="daily-challenge__title">{{ $t("challenge.title") }}</h3>
    <p class="daily-challenge__desc">{{ $t("challenge.desc") }}</p>

    <div
      v-for="group in challenge.groups"
      :key="group.category"
      class="challenge-group">
      <span class="challenge-group__label">{{ $t(group.labelKey) }}</span>
      <div class="challenge-group__flowers">
        <span
          v-for="slot in group.slots"
          :key="slot.id"
          class="flower"
          :class="{ 'flower--lit': slot.lit }"
          :style="{ '--flower-color': slot.color }"
          :title="slot.lit ? slot.word : undefined">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <circle class="flower__center" cx="16" cy="16" r="4" />
            <ellipse
              v-for="i in 5"
              :key="i"
              class="flower__petal"
              cx="16"
              cy="8"
              rx="5"
              ry="7"
              :transform="`rotate(${(i - 1) * 72} 16 16)`" />
          </svg>
        </span>
      </div>
    </div>

    <p v-if="challenge.complete" class="daily-challenge__done">
      {{ $t("challenge.complete") }}
    </p>
    <p v-else class="daily-challenge__progress">
      {{
        $t("challenge.progress", {
          litCount: challenge.litCount,
          totalCount: challenge.totalCount,
        })
      }}
    </p>
  </aside>
</template>

<style scoped lang="scss">
.daily-challenge {
  flex: 0 0 240px;
  min-width: 200px;
  max-width: 260px;
  padding: 1.25rem 1.1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}

.daily-challenge__title {
  margin: 0 0 0.35rem;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  text-align: center;
}

.daily-challenge__desc {
  margin: 0 0 1rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--text-muted);
  text-align: center;
}

.challenge-group {
  margin-bottom: 0.85rem;

  &:last-of-type {
    margin-bottom: 0.65rem;
  }
}

.challenge-group__label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.challenge-group__flowers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.flower {
  display: inline-flex;
  width: 28px;
  height: 28px;

  svg {
    width: 100%;
    height: 100%;
  }

  .flower__petal {
    fill: var(--border-strong);
    opacity: 0.35;
    transition: fill 0.25s ease, opacity 0.25s ease;
  }

  .flower__center {
    fill: var(--border-strong);
    opacity: 0.4;
    transition: fill 0.25s ease, opacity 0.25s ease;
  }

  &--lit {
    .flower__petal {
      fill: var(--flower-color);
      opacity: 1;
    }

    .flower__center {
      fill: #fff8dc;
      opacity: 1;
    }
  }
}

.daily-challenge__progress,
.daily-challenge__done {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  text-align: center;
}

.daily-challenge__progress {
  color: var(--text-muted);
}

.daily-challenge__done {
  color: var(--primary-dark);
}

@media (max-width: 768px) {
  .daily-challenge {
    flex: 1 1 auto;
    max-width: 720px;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
