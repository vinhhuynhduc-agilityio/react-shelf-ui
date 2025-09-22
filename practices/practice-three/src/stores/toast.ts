import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type ToastVariant = "info" | "success" | "error" | "warning";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  showToast: (message: string, variant: ToastVariant) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, variant) => {
    const id = uuidv4();

    set((state) => {
      let newToasts = [...state.toasts, { id, message, variant }];

      if (newToasts.length > 2) {
        newToasts = newToasts.slice(newToasts.length - 2);
      }

      return { toasts: newToasts };
    });

    // Auto-remove after 3s
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
