<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useGameStore } from "@/stores/game";
import { useToast } from "@/composables/useToast";
import { renderShareCard } from "@/utils/shareCard";

const props = defineProps<{
  modelValue: boolean;
  /** Override share text for copy link / social posts. */
  text?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const game = useGameStore();
const toast = useToast();
const { t } = useI18n();

const cardUrl = ref<string | null>(null);
const cardBlob = ref<Blob | null>(null);
const loading = ref(false);
const linkCopied = ref(false);

const hasNativeShare = computed(
  () => typeof navigator !== "undefined" && typeof navigator.share === "function",
);

const shareText = computed(() => props.text ?? game.shareText);

const subtitle = computed(() => {
  const total = game.answers.length;
  const found = game.correctGuessesList.length;
  return t("share.subtitle", {
    found,
    total,
    score: game.userScore,
  });
});

const socialLinks = computed(() => {
  const text = shareText.value;
  const url = game.shareUrl;
  return [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(text)}`,
      className: "share-social--whatsapp",
      icon: "W",
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      className: "share-social--telegram",
      icon: "T",
    },
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      className: "share-social--x",
      icon: "𝕏",
    },
    {
      id: "reddit",
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text.split("\n")[0] ?? "Blossom Word Game")}`,
      className: "share-social--reddit",
      icon: "R",
    },
  ];
});

function close(): void {
  emit("update:modelValue", false);
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === "Escape") close();
}

async function buildCard(): Promise<void> {
  loading.value = true;
  try {
    const challenge = game.dailyChallenge;
    if (!challenge) return;

    const blob = await renderShareCard({
      puzzleNo: game.puzzleNo,
      dateString: game.gameDateString,
      middleLetter: game.middleLetter,
      outerLetters: game.sortedOuterLetters,
      challenge,
      shareLines: shareText.value.split("\n"),
      shareUrl: game.shareUrl,
    });

    if (cardUrl.value) URL.revokeObjectURL(cardUrl.value);
    cardBlob.value = blob;
    cardUrl.value = URL.createObjectURL(blob);
  } catch {
    toast.show(t("share.cardError"));
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      window.addEventListener("keydown", onKeydown);
      void buildCard();
    } else {
      window.removeEventListener("keydown", onKeydown);
      if (cardUrl.value) {
        URL.revokeObjectURL(cardUrl.value);
        cardUrl.value = null;
      }
      cardBlob.value = null;
      linkCopied.value = false;
    }
  },
);

watch(shareText, () => {
  if (props.modelValue) void buildCard();
});

async function copyLink(): Promise<void> {
  try {
    await navigator.clipboard.writeText(shareText.value);
    linkCopied.value = true;
    toast.show(t("Copied to clipboard"), "success");
    setTimeout(() => (linkCopied.value = false), 2000);
  } catch {
    toast.show(shareText.value);
  }
}

async function copyImage(): Promise<void> {
  if (!cardBlob.value) return;

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": cardBlob.value }),
    ]);
    toast.show(t("share.imageCopied"), "success");
    return;
  } catch {
    // Fall back to download when clipboard image is unavailable.
  }

  const url = URL.createObjectURL(cardBlob.value);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `blossom-${game.gameDateString}.png`;
  anchor.click();
  URL.revokeObjectURL(url);
  toast.show(t("share.imageDownloaded"), "success");
}

function shareNative(): void {
  if (!navigator.share) return;
  void navigator.share({
    title: "Blossom Word Game",
    text: shareText.value,
    url: game.shareUrl,
  });
}
</script>

<template>
  <Teleport to="body">
    <Transition name="share-modal">
      <div v-if="modelValue" class="share-overlay" @click.self="close">
        <div class="share-dialog" role="dialog" aria-modal="true">
          <button class="share-dialog__close" type="button" aria-label="Close" @click="close">
            &times;
          </button>

          <header class="share-dialog__header">
            <h2 class="share-dialog__title">{{ game.rankLabel }}</h2>
            <p class="share-dialog__subtitle">{{ subtitle }}</p>
          </header>

          <div class="share-dialog__card-wrap">
            <p v-if="loading" class="share-dialog__loading">{{ $t("share.generating") }}</p>
            <img
              v-else-if="cardUrl"
              :src="cardUrl"
              class="share-dialog__card"
              :alt="$t('share.cardAlt')" />
          </div>

          <p class="share-dialog__post-label">{{ $t("share.postTo") }}</p>
          <div class="share-socials">
            <a
              v-for="item in socialLinks"
              :key="item.id"
              :href="item.href"
              class="share-social"
              :class="item.className"
              target="_blank"
              rel="noopener noreferrer">
              <span class="share-social__icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="share-social__label">{{ item.label }}</span>
            </a>
            <button
              v-if="hasNativeShare"
              type="button"
              class="share-social share-social--more"
              @click="shareNative">
              <span class="share-social__icon" aria-hidden="true">⋯</span>
              <span class="share-social__label">{{ $t("share.more") }}</span>
            </button>
          </div>

          <div class="share-actions">
            <button
              type="button"
              class="share-action"
              :disabled="!cardBlob || loading"
              @click="copyImage">
              <span aria-hidden="true">🖼</span>
              {{ $t("share.copyImage") }}
            </button>
            <button type="button" class="share-action" @click="copyLink">
              <span aria-hidden="true">{{ linkCopied ? "✓" : "🔗" }}</span>
              {{ linkCopied ? $t("Copied to clipboard") : $t("share.copyLink") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.share-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem 1rem;
  background: var(--overlay);
  overflow-y: auto;
}

.share-dialog {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: auto;
  padding: 1.35rem 1.25rem 1.15rem;
  background: var(--surface);
  border-radius: calc(var(--radius) + 4px);
  box-shadow: var(--shadow-lg);
}

.share-dialog__close {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  background: none;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;

  &:hover {
    color: var(--text);
  }
}

.share-dialog__header {
  text-align: center;
  padding: 0 1.5rem 0.75rem;
}

.share-dialog__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.65rem;
  line-height: 1.15;
  color: var(--text);
}

.share-dialog__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  color: var(--text-muted);
}

.share-dialog__card-wrap {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
}

.share-dialog__loading {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.share-dialog__card {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.share-dialog__post-label {
  margin: 0 0 0.55rem;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.share-socials {
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin-bottom: 0.95rem;
}

.share-social {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 58px;
  padding: 0;
  background: none;
  border: none;
  text-decoration: none;
  cursor: pointer;
  color: inherit;
}

.share-social__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 800;
  color: #fff;
}

.share-social__label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
}

.share-social--whatsapp .share-social__icon {
  background: #25d366;
}

.share-social--telegram .share-social__icon {
  background: #26a5e4;
}

.share-social--x .share-social__icon {
  background: #111;
}

.share-social--reddit .share-social__icon {
  background: #ff4500;
}

.share-social--more .share-social__icon {
  background: #8e8e96;
  font-size: 1.2rem;
}

.share-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.share-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    background: var(--primary-soft);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.share-modal-enter-active,
.share-modal-leave-active {
  transition: opacity 0.2s ease;
}

.share-modal-enter-from,
.share-modal-leave-to {
  opacity: 0;
}
</style>
