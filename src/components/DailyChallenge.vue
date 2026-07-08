<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";
import type { ChallengeGroup } from "@/utils/dailyChallenge";

const game = useGameStore();

const challenge = computed(() => game.dailyChallenge);

function petalAngles(group: ChallengeGroup): number[] {
  const step = 360 / group.petalCount;
  return Array.from({ length: group.petalCount }, (_, i) => step * i);
}
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
          :class="{
            'flower--lit': slot.lit,
          }"
          :title="slot.lit ? slot.word : undefined">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <ellipse
              v-for="(angle, i) in petalAngles(group)"
              :key="i"
              class="flower__petal"
              cx="16"
              cy="8"
              :rx="group.petalCount >= 7 ? 4 : 5"
              :ry="group.petalCount >= 7 ? 6 : 7"
              :style="{
                '--petal-color': slot.lit ? group.petalColors[i] : '',
              }"
              :transform="`rotate(${angle} 16 16)`" />
            <circle
              class="flower__center"
              cx="16"
              cy="16"
              r="3.5"
              stroke-width="1.2" />
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
  flex: 0 0 320px;
  min-width: 320px;
  max-width: 340px;
  padding: 1.25rem 1.15rem;
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
  margin-bottom: 1.4rem;

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
  flex-wrap: nowrap;
  gap: 0.4rem;
}

.flower {
  display: inline-flex;
  width: 48px;
  height: 48px;

  svg {
    width: 100%;
    height: 100%;
  }

  .flower__petal {
    fill: var(--petal-color, var(--border-strong));
    opacity: 0.35;
    transition:
      fill 0.25s ease,
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  .flower__center {
    fill: var(--border-strong);
    stroke: transparent;
    opacity: 0.4;
    transition: fill 0.25s ease, stroke 0.25s ease, opacity 0.25s ease;
  }

  &--lit {
    .flower__petal {
      opacity: 1;
    }

    .flower__center {
      fill: #fff8e7;
      stroke: #6d4c2a;
      opacity: 1;
    }

    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.14));
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
    flex: none;
    width: 100%;
    min-width: 0;
    max-width: none;
    margin: 0;
  }
}
</style>
