<script setup lang="ts">
import { ref } from "vue";
import { useGameStore } from "@/stores/game";
import BaseModal from "./BaseModal.vue";

const game = useGameStore();
const showRanking = ref(false);
</script>

<template>
  <div class="progress" @click="showRanking = true" title="View ranking">
    <span class="rank">{{ $t(`rank.${game.progressIndex}`) }}</span>
    <div class="bar">
      <div class="bar__track">
        <div class="bar__fill" :style="{ width: `${game.progressPercentage}%` }" />
      </div>
      <span class="bar__score">{{ game.userScore }}</span>
    </div>
  </div>

  <BaseModal v-model="showRanking" :title="$t('Ranking')">
    <p>{{ $t("RankMSG") }}:</p>
    <ul class="rank-list">
      <li v-for="(level, index) in game.scoreLevels" :key="`rank-${index}`">
        {{ $t(`rank.${index}`) }} ({{ level }})
      </li>
    </ul>
  </BaseModal>
</template>

<style scoped lang="scss">
.progress {
  margin: 20px 10px 10px;
  cursor: pointer;
}

.rank {
  display: inline-block;
  margin-bottom: 0.6rem;
  padding: 0.25rem 0.85rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1a22;
  background: var(--primary);
  border-radius: 999px;
  box-shadow: 0 2px 8px var(--primary-soft);
}

.bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bar__track {
  flex: 1;
  height: 22px;
  border-radius: 999px;
  background: var(--cell);
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
}

.bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  border-radius: 999px;
  transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.bar__score {
  min-width: 2ch;
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--text);
}

.rank-list {
  text-align: left;
  line-height: 1.8;
}

@media (max-width: 700px) {
  .progress {
    margin: 10px;
  }
}
</style>
