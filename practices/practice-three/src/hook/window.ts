import { useShallow } from "zustand/react/shallow";

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
  } = useWindowStore(
    useShallow((s) => ({
      toggleWindow: s.toggleWindow,
      closeWindow: s.closeWindow,
      minimizeWindow: s.minimizeWindow,
      maximizeWindow: s.maximizeWindow,
      restoreWindow: s.restoreWindow,
    }))
  );

  return {
    toggle: () => toggleWindow(windowKey),
    close: () => closeWindow(windowKey),
    minimize: () => minimizeWindow(windowKey),
    maximize: () => maximizeWindow(windowKey),
    restore: () => restoreWindow(windowKey),
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
  const bringToFront = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== windowKey) {
      setZIndexOrder(windowKey);
    }
  };

  return { zIndex, bringToFront };
};
