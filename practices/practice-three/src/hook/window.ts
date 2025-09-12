import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Types
import type { WindowKey, Windows } from "@/types";

export const useWindowState = (windowKey: WindowKey) =>
  useWindowStore(
    useShallow((state) => ({
      isOpen: state.windows[windowKey].isOpen,
      isMaximized: state.windows[windowKey].isMaximized,
      isMinimized: state.windows[windowKey].isMinimized,
    }))
  );

export const useWindowActions = (windowKey: keyof Windows) => {
  const {
    toggleWindow,
    maximizeWindow,
    minimizeWindow,
    restoreWindow,
    closeWindow,
  } = useWindowStore();

  return {
    toggle: () => toggleWindow(windowKey),
    maximize: () => maximizeWindow(windowKey),
    minimize: () => minimizeWindow(windowKey),
    restore: () => restoreWindow(windowKey),
    close: () => closeWindow(windowKey),
  };
};
