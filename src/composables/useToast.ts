import { reactive, readonly } from "vue";

export type ToastType = "info" | "success";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const toasts = reactive<Toast[]>([]);
const DURATION = 2000;
let nextId = 0;

function remove(id: number): void {
  const index = toasts.findIndex((t) => t.id === id);
  if (index !== -1) toasts.splice(index, 1);
}

function show(message: string, type: ToastType = "info"): void {
  // Group identical messages so spamming a key doesn't stack duplicates.
  const existing = toasts.find((t) => t.message === message && t.type === type);
  if (existing) {
    remove(existing.id);
  }
  const id = nextId++;
  toasts.push({ id, message, type });
  window.setTimeout(() => remove(id), DURATION);
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    show,
    remove,
  };
}
