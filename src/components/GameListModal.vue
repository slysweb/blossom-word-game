<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import BaseModal from "@/components/BaseModal.vue";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [id: string];
  remove: [id: string];
  newGame: [];
}>();

const game = useGameStore();

function close(): void {
  emit("update:modelValue", false);
}

function select(id: string): void {
  emit("select", id);
  close();
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('Game List')"
    @update:model-value="emit('update:modelValue', $event)">
    <div class="game-list">
      <p class="game-list__note">
        Each row is a hive from the puzzle pool. Tap one to play it, or add
        another with + New game.
      </p>
      <button type="button" class="new-game" @click="emit('newGame')">
        + {{ $t("New game") }}
      </button>

      <ul v-if="game.unlimitedGames.length" class="rows">
        <li
          v-for="item in game.unlimitedGames"
          :key="item.id"
          class="row"
          :class="{ 'is-current': item.id === game.activeUnlimitedId }">
          <button type="button" class="row__main" @click="select(item.id)">
            <span class="letters">
              <span class="letters__center">{{ item.center }}</span>
              <span>{{ item.outer }}</span>
            </span>
            <span class="stats">
              <span class="stats__score">{{ item.score }}/{{ item.maxScore }}</span>
              <span class="stats__rank">{{ $t(`rank.${item.rankIndex}`) }}</span>
            </span>
          </button>
          <button
            type="button"
            class="row__remove"
            :aria-label="$t('Remove game')"
            @click="emit('remove', item.id)">
            &times;
          </button>
        </li>
      </ul>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.game-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
}

.game-list__note {
  margin: 0;
  text-align: center;
  line-height: 1.5;
  color: var(--text-muted);
}

.new-game {
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #1a1a22;
  background: var(--primary);
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1.25rem;
  box-shadow: 0 2px 8px var(--primary-soft);

  &:hover {
    background: var(--primary-dark);
  }
}

.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.35rem 0.35rem 0.85rem;
  background: var(--surface-alt);
  border: 2px solid transparent;
  border-radius: 14px;

  &.is-current {
    border-color: var(--primary);
    background: var(--primary-soft);
  }
}

.row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.45rem 0.35rem;
  background: none;
  border: none;
  color: inherit;
  text-align: left;
}

.letters {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.letters__center {
  color: #9a7209;
  margin-right: 0.45rem;
}

:global(html.dark) .letters__center {
  color: #f0c84a;
}

.stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
  flex-shrink: 0;
}

.stats__score {
  font-weight: 800;
}

.stats__rank {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.row__remove {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text-muted);
  font-size: 1.35rem;
  line-height: 1;

  &:hover {
    color: var(--text);
    background: var(--surface);
  }
}
</style>
