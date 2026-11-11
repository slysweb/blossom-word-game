<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";
import { buildHintChart } from "@/utils/hintChart";
import BaseModal from "@/components/BaseModal.vue";
import HintChart from "@/components/HintChart.vue";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const game = useGameStore();

const chart = computed(() =>
  buildHintChart(game.answers, game.middleLetter, game.availableLetters),
);

function close(): void {
  emit("update:modelValue", false);
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('hint.chartTitle')"
    @update:model-value="emit('update:modelValue', $event)">
    <HintChart v-if="chart.wordCount" :chart="chart" />
    <p class="learn">
      <RouterLink to="/hints" @click="close">{{ $t("hint.learn") }}</RouterLink>
    </p>
  </BaseModal>
</template>

<style scoped lang="scss">
.learn {
  margin: 1.25rem 0 0;
  text-align: center;
}

.learn a {
  font-weight: 700;
  color: var(--text);
}
</style>
