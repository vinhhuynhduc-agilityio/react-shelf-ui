import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { WindowKey, Windows } from "@/types";

export interface WindowStore {
  windows: Windows;
  zIndexOrder: WindowKey[];
  setZIndexOrder: (windowKey: WindowKey) => void;
  toggleWindow: (windowKey: WindowKey) => void; // desktop icon behavior
  maximizeWindow: (windowKey: WindowKey) => void;
  minimizeWindow: (windowKey: WindowKey) => void;
  restoreWindow: (windowKey: WindowKey) => void;
  closeWindow: (windowKey: WindowKey) => void;
}

const DEFAULT_WINDOW = {
  isOpen: false,
  isMaximized: false,
  isMinimized: false,
};

export const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: {
      spreadsheet: { ...DEFAULT_WINDOW },
      fileManager: { ...DEFAULT_WINDOW },
      pivot: { ...DEFAULT_WINDOW },
      kanban: { ...DEFAULT_WINDOW },
    },
    zIndexOrder: [],

    setZIndexOrder: (windowKey) =>
      set((state) => {
        state.zIndexOrder = [
          ...state.zIndexOrder.filter((k) => k !== windowKey),
          windowKey,
        ];
      }),

    toggleWindow: (windowKey) =>
      set((state) => {
        const w = state.windows[windowKey];

        if (!w.isOpen) {
          w.isOpen = true;
          w.isMinimized = false;
          return;
        }

        if (w.isMinimized) {
          w.isMinimized = false;
          return;
        }
      }),

    maximizeWindow: (windowKey) =>
      set((state) => {
        const w = state.windows[windowKey];
        w.isMaximized = true;
        w.isMinimized = false;
      }),

    minimizeWindow: (windowKey) =>
      set((state) => {
        const w = state.windows[windowKey];
        w.isMinimized = true;
        w.isMaximized = false;
      }),

    restoreWindow: (windowKey) =>
      set((state) => {
        state.windows[windowKey].isMinimized = false;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        state.windows[windowKey] = { ...DEFAULT_WINDOW };
        state.zIndexOrder = state.zIndexOrder.filter((k) => k !== windowKey);
      }),
  }))
);
