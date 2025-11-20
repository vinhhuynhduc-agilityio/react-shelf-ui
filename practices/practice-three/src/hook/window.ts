import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

// Store
import { useWindowStore } from "@/stores";

// Types
import type { WindowKey } from "@/types";

export const useWindowState = (windowKey: WindowKey) =>
  useWindowStore(
    useShallow((state) => ({
      isOpen: state.windows[windowKey].isOpen,
      isMinimized: state.windows[windowKey].isMinimized,
      isMaximized: state.windows[windowKey].isMaximized,
      frame: state.frames[windowKey],
    }))
  );

export const useWindowActions = (windowKey: WindowKey) => {
  const {
    toggleWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    setFrame,
  } = useWindowStore(
    useShallow((s) => ({
      toggleWindow: s.toggleWindow,
      closeWindow: s.closeWindow,
      minimizeWindow: s.minimizeWindow,
      maximizeWindow: s.maximizeWindow,
      restoreWindow: s.restoreWindow,
      setFrame: s.setFrame,
    }))
  );

  const close = useCallback(
    () => closeWindow(windowKey),
    [windowKey, closeWindow]
  );
  const minimize = useCallback(
    () => minimizeWindow(windowKey),
    [windowKey, minimizeWindow]
  );
  const maximize = useCallback(
    () => maximizeWindow(windowKey),
    [windowKey, maximizeWindow]
  );
  const restore = useCallback(
    () => restoreWindow(windowKey),
    [windowKey, restoreWindow]
  );
  const toggle = useCallback(
    () => toggleWindow(windowKey),
    [windowKey, toggleWindow]
  );
  const updateFrame = useCallback(
    (
      windowKey: WindowKey,
      rect: { x: number; y: number; width: number; height: number }
    ) => setFrame(windowKey, rect),
    [setFrame]
  );

  return {
    toggle,
    close,
    minimize,
    maximize,
    restore,
    updateFrame,
  };
};

export const useZIndex = (windowKey: WindowKey) => {
  const { zIndexOrder, setZIndexOrder } = useWindowStore(
    useShallow((s) => ({
      zIndexOrder: s.zIndexOrder,
      setZIndexOrder: s.setZIndexOrder,
    }))
  );

  const zIndex = zIndexOrder.indexOf(windowKey) + 1;
  const bringToFront = useCallback(() => {
    if (zIndexOrder[zIndexOrder.length - 1] !== windowKey) {
      setZIndexOrder(windowKey);
    }
  }, [windowKey, zIndexOrder, setZIndexOrder]);

  return { zIndex, bringToFront };
};
