import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Types
import { WindowKey, Windows } from "@/types";

export const useWindowState = (windowKey: WindowKey) => {
  return useWindowStore(
    useShallow((state) => ({
      isOpen: state.windows[windowKey].isOpen,
      isMaximized: state.windows[windowKey].isMaximized,
      isMinimized: state.windows[windowKey].isMinimized,
    }))
  );
};

export const useWindowActions = (windowKey: keyof Windows) => {
  const { toggleWindow, maximizeWindow, minimizeWindow, closeWindow } =
    useWindowStore();

  // Return actions for the specific window
  return {
    toggle: () => toggleWindow(windowKey),
    maximize: () => maximizeWindow(windowKey),
    minimize: () => minimizeWindow(windowKey),
    close: () => closeWindow(windowKey),
  };
};
