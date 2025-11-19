import { memo, ReactNode, useCallback } from "react";

// component
import { DraggableWindow } from "@/components";

// types
import type { WindowKey } from "@/types";

// hook
import { useWindowState, useWindowActions, useZIndex } from "@/hook";

// store
import { useWindowStore } from "@/stores";

interface BaseWindowProps {
  windowKey: WindowKey;
  title: string;
  src: string;
  children: ReactNode;
}

export const BaseWindow = memo(
  ({ windowKey, title, src, children }: BaseWindowProps) => {
    const { isMinimized } = useWindowState(windowKey);
    const { close, maximize, minimize } = useWindowActions(windowKey);
    const { zIndex, bringToFront } = useZIndex(windowKey);

    const handleMouseDown = useCallback(() => {
      const currentTopMost = useWindowStore.getState().zIndexOrder.at(-1);

      if (currentTopMost === windowKey) {
        return;
      }

      bringToFront();
    }, [bringToFront, windowKey]);

    console.log("Render BaseWindow:");
    return (
      <DraggableWindow
        windowKey={windowKey}
        src={src}
        title={title}
        hidden={isMinimized}
        zIndex={zIndex}
        onClose={close}
        onMaximize={maximize}
        onMinimize={minimize}
        onMouseDown={handleMouseDown}
      >
        {children}
      </DraggableWindow>
    );
  },
  (prev, next) =>
    prev.windowKey === next.windowKey &&
    prev.title === next.title &&
    prev.src === next.src
);

BaseWindow.displayName = "BaseWindow";
