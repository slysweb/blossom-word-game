import { computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useThemeStore = defineStore("theme", () => {
  const theme = useStorage<"light" | "dark">("theme", "light");
  const isDark = computed(() => theme.value === "dark");

  function apply(): void {
    document.documentElement.classList.toggle("dark", isDark.value);
  }

  function toggle(): void {
    theme.value = isDark.value ? "light" : "dark";
    apply();
  }

  return { theme, isDark, toggle, apply };
});
