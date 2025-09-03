import { useWindowStore, Windows } from "@/stores";
import { useShallow } from "zustand/react/shallow";

export const useWindowState = (windowName: keyof Windows) => {
  return useWindowStore(
    useShallow((state) => ({
      isOpen: state.windows[windowName].isOpen,
      isMaximized: state.windows[windowName].isMaximized,
      isMinimized: state.windows[windowName].isMinimized,
    }))
  );
};

export const useWindowActions = (windowName: keyof Windows) => {
  const { toggleWindow, maximizeWindow, minimizeWindow, closeWindow } =
    useWindowStore();

  // Return actions for the specific window
  return {
    toggle: () => toggleWindow(windowName),
    maximize: () => maximizeWindow(windowName),
    minimize: () => minimizeWindow(windowName),
    close: () => closeWindow(windowName),
  };
};
