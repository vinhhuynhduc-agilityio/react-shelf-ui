import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// Types
import { WindowKey, Windows } from "@/types";

export interface WindowStore {
  windows: Windows;
  zIndexOrder: WindowKey[];
  toggleWindow: (windowKey: WindowKey) => void;
  maximizeWindow: (windowKey: WindowKey) => void;
  minimizeWindow: (windowKey: WindowKey) => void;
  closeWindow: (windowKey: WindowKey) => void;
  setZIndexOrder: (windowKey: WindowKey) => void;
}

export const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: {
      spreadsheet: { isOpen: false, isMaximized: false, isMinimized: false },
      fileManager: { isOpen: false, isMaximized: false, isMinimized: false },
      pivot: { isOpen: false, isMaximized: false, isMinimized: false },
      kanban: { isOpen: false, isMaximized: false, isMinimized: false },
    },
    zIndexOrder: [],
    toggleWindow: (windowKey) =>
      set((state) => {
        state.windows[windowKey].isOpen = true;
      }),
    maximizeWindow: (windowKey) =>
      set((state) => {
        state.windows[windowKey].isMaximized = true;
        state.windows[windowKey].isMinimized = false;
      }),
    minimizeWindow: (windowKey) =>
      set((state) => {
        state.windows[windowKey].isMinimized = true;
        state.windows[windowKey].isMaximized = false;
      }),
    closeWindow: (windowKey) =>
      set((state) => {
        state.windows[windowKey].isOpen = false;
      }),
    setZIndexOrder: (windowKey) =>
      set((state) => {
        const newOrder: WindowKey[] = [
          ...state.zIndexOrder.filter((item: WindowKey) => item !== windowKey),
          windowKey,
        ];
        state.zIndexOrder = newOrder;
      }),
  }))
);
