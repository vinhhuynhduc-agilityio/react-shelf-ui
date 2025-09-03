import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface WindowState {
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
}

export type WindowName = "spreadsheet" | "fileManager" | "pivot" | "kanban";

export interface Windows {
  spreadsheet: WindowState;
  fileManager: WindowState;
  pivot: WindowState;
  kanban: WindowState;
}

export interface WindowStore {
  windows: Windows;
  toggleWindow: (windowName: WindowName) => void;
  maximizeWindow: (windowName: WindowName) => void;
  minimizeWindow: (windowName: WindowName) => void;
  closeWindow: (windowName: WindowName) => void;
}

export const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: {
      spreadsheet: { isOpen: false, isMaximized: false, isMinimized: false },
      fileManager: { isOpen: false, isMaximized: false, isMinimized: false },
      pivot: { isOpen: false, isMaximized: false, isMinimized: false },
      kanban: { isOpen: false, isMaximized: false, isMinimized: false },
    },
    toggleWindow: (windowName) =>
      set((state) => {
        state.windows[windowName].isOpen = true;
      }),
    maximizeWindow: (windowName) =>
      set((state) => {
        state.windows[windowName].isMaximized = true;
        state.windows[windowName].isMinimized = false;
      }),
    minimizeWindow: (windowName) =>
      set((state) => {
        state.windows[windowName].isMinimized = true;
        state.windows[windowName].isMaximized = false;
      }),
    closeWindow: (windowName) =>
      set((state) => {
        state.windows[windowName].isOpen = false;
      }),
  }))
);
