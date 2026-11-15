import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { playSound, type SoundName } from "@/utils/sounds";

export const useSoundStore = defineStore("sound", () => {
  const enabled = useStorage("sound", true);

  function play(name: SoundName): void {
    if (!enabled.value) return;
    playSound(name);
  }

  function toggle(): void {
    enabled.value = !enabled.value;
    if (enabled.value) playSound("correct");
  }

  return { enabled, play, toggle };
});
