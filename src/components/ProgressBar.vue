<script setup lang="ts">
import { ref } from "vue";
import { useGameStore } from "@/stores/game";
import BaseModal from "./BaseModal.vue";

const game = useGameStore();
const showRanking = ref(false);
</script>

<template>
  <div class="progress" @click="showRanking = true">
    <strong class="rank">{{ $t(`rank.${game.progressIndex}`) }}</strong>
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
  margin: 20px;
  cursor: pointer;
}

.rank {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bar__track {
  flex: 1;
  height: 20px;
  border-radius: 10px;
  background: var(--cell);
  overflow: hidden;
}

.bar__fill {
  height: 100%;
  background: var(--primary);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.bar__score {
  min-width: 2ch;
  font-weight: 600;
  color: var(--text);
}

.rank-list {
  text-align: left;
}

@media (max-width: 700px) {
  .progress {
    margin: 10px;
  }
}
</style>
