import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { WindowKey, Windows } from "@/types";

type Rect = { x: number; y: number; width: number; height: number };

export interface WindowStore {
  windows: Windows;
  zIndexOrder: WindowKey[];
  frames: Record<WindowKey, Rect>;

  // actions
  setFrame: (windowKey: WindowKey, rect: Rect) => void;
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

const defaultFrame = (): Rect => ({
  x: Math.max(0, (window.innerWidth - 800) / 2),
  y: Math.max(0, (window.innerHeight - 44 - 450) / 2),
  width: 800,
  height: 450,
});

export const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: {
      spreadsheet: { ...DEFAULT_WINDOW },
      fileManager: { ...DEFAULT_WINDOW },
      pivot: { ...DEFAULT_WINDOW },
      kanban: { ...DEFAULT_WINDOW },
    },
    zIndexOrder: [],

    frames: {
      spreadsheet: defaultFrame(),
      fileManager: defaultFrame(),
      pivot: defaultFrame(),
      kanban: defaultFrame(),
    },

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

    setFrame: (windowKey, rect) =>
      set((state) => {
        const w = state.windows[windowKey];

        if (!w.isMaximized) {
          state.frames[windowKey] = rect;
        }
      }),

    maximizeWindow: (windowKey) =>
      set((state) => {
        const w = state.windows[windowKey];

        if (!w.isMaximized) {
          w.isMaximized = true;
        } else {
          w.isMaximized = false;
        }

        // trigger resize event to make content adapt to new size
        requestAnimationFrame(() =>
          requestAnimationFrame(() => window.dispatchEvent(new Event("resize")))
        );
      }),

    minimizeWindow: (windowKey) =>
      set((state) => {
        const w = state.windows[windowKey];
        w.isMinimized = true;
      }),

    restoreWindow: (windowKey) =>
      set((state) => {
        state.windows[windowKey].isMinimized = false;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        state.windows[windowKey] = { ...DEFAULT_WINDOW };
        state.zIndexOrder = state.zIndexOrder.filter((k) => k !== windowKey);

        // reset of frames on close
        state.frames[windowKey] = defaultFrame();
      }),
  }))
);
