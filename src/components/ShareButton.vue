<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useGameStore } from "@/stores/game";
import { useToast } from "@/composables/useToast";

const game = useGameStore();
const toast = useToast();
const { t } = useI18n();

const copied = ref(false);

/** Touch/phone devices benefit from the native share sheet; desktop prefers copy. */
function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;
  return (
    navigator.maxTouchPoints > 0 &&
    typeof matchMedia !== "undefined" &&
    matchMedia("(pointer: coarse)").matches
  );
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    toast.show(t("Copied to clipboard"), "success");
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    toast.show(text);
  }
}

async function share(): Promise<void> {
  const text = game.shareText;

  // Native share sheet on mobile; straight clipboard copy on desktop.
  if (isMobileDevice() && navigator.share) {
    try {
      await navigator.share({ title: "Blossom Word Game", text });
      return;
    } catch (err) {
      // User dismissed the share sheet - don't fall through to copy.
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
  }

  await copyToClipboard(text);
}
</script>

<template>
  <button class="share-btn" type="button" @click="share">
    <span class="share-btn__icon" aria-hidden="true">{{ copied ? "✓" : "🔗" }}</span>
    {{ copied ? $t("Copied to clipboard") : $t("Share your result") }}
  </button>
</template>

<style scoped lang="scss">
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem auto 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  color: #1a1a22;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  box-shadow: 0 4px 14px var(--primary-soft);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px var(--primary-soft);
  }

  &:active {
    transform: translateY(0);
  }
}

.share-btn__icon {
  font-size: 1.05rem;
}
</style>
