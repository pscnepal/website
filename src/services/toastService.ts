import type {
  ToastAction,
  ToastItem,
  ToastOptions,
  ToastVariant,
} from '../types/common';

export type { ToastAction, ToastItem, ToastOptions, ToastVariant };

const MAX_ACTIVE_TOASTS = 4;

const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 4000,
  info: 4200,
  warning: 5500,
  error: 7000,
};

let toasts: ToastItem[] = [];
let seqCounter = 0;
const listeners = new Set<(snapshot: ToastItem[]) => void>();

function emit() {
  const snapshot = [...toasts];
  listeners.forEach((listener) => listener(snapshot));
}

function pushToast(
  variant: ToastVariant,
  message: string,
  options: ToastOptions = {}
): string {
  const cleanMessage = message.trim();
  if (!cleanMessage) return '';

  const id = options.id ?? `toast-${Date.now()}-${++seqCounter}`;
  const duration =
    typeof options.duration === 'number'
      ? Math.max(0, options.duration)
      : DEFAULT_DURATIONS[variant];

  const nextItem: ToastItem = {
    id,
    variant,
    title: options.title?.trim() || undefined,
    message: cleanMessage,
    duration,
    action: options.action,
    createdAt: Date.now(),
  };

  const existingIndex = toasts.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    const updated = [...toasts];
    updated[existingIndex] = nextItem;
    toasts = updated;
  } else {
    toasts = [...toasts, nextItem].slice(-MAX_ACTIVE_TOASTS);
  }

  emit();
  return id;
}

export const toast = {
  success(message: string, options?: ToastOptions): string {
    return pushToast('success', message, options);
  },
  error(message: string, options?: ToastOptions): string {
    return pushToast('error', message, options);
  },
  warning(message: string, options?: ToastOptions): string {
    return pushToast('warning', message, options);
  },
  info(message: string, options?: ToastOptions): string {
    return pushToast('info', message, options);
  },
  dismiss(id: string): void {
    const next = toasts.filter((item) => item.id !== id);
    if (next.length !== toasts.length) {
      toasts = next;
      emit();
    }
  },
  clear(): void {
    if (toasts.length > 0) {
      toasts = [];
      emit();
    }
  },
  subscribe(listener: (snapshot: ToastItem[]) => void): () => void {
    listeners.add(listener);
    listener([...toasts]);
    return () => {
      listeners.delete(listener);
    };
  },
};
