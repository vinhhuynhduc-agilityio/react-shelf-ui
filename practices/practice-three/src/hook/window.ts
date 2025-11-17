import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Types
import type { WindowKey } from "@/types";

export const useWindow = (windowKey: WindowKey) => {
  const {
    isOpen,
    isMinimized,
    isMaximized,
    zIndexOrder,
    toggleWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    setZIndexOrder,
  } = useWindowStore(
    useShallow((s) => ({
      isOpen: s.windows[windowKey].isOpen,
      isMinimized: s.windows[windowKey].isMinimized,
      isMaximized: s.windows[windowKey].isMaximized,
      zIndexOrder: s.zIndexOrder,
      toggleWindow: s.toggleWindow,
      closeWindow: s.closeWindow,
      minimizeWindow: s.minimizeWindow,
      maximizeWindow: s.maximizeWindow,
      restoreWindow: s.restoreWindow,
      setZIndexOrder: s.setZIndexOrder,
    }))
  );

  return {
    isOpen,
    isMinimized,
    isMaximized,
    zIndexOrder,

    toggle: useCallback(
      () => toggleWindow(windowKey),
      [toggleWindow, windowKey]
    ),
    open: useCallback(
      () => !isOpen && toggleWindow(windowKey),
      [isOpen, toggleWindow, windowKey]
    ),
    close: useCallback(() => closeWindow(windowKey), [closeWindow, windowKey]),
    minimize: useCallback(
      () => minimizeWindow(windowKey),
      [minimizeWindow, windowKey]
    ),
    maximize: useCallback(
      () => maximizeWindow(windowKey),
      [maximizeWindow, windowKey]
    ),
    restore: useCallback(
      () => restoreWindow(windowKey),
      [restoreWindow, windowKey]
    ),
    bringToFront: useCallback(() => {
      if (zIndexOrder[zIndexOrder.length - 1] !== windowKey) {
        setZIndexOrder(windowKey);
      }
    }, [zIndexOrder, windowKey, setZIndexOrder]),
  };
};
