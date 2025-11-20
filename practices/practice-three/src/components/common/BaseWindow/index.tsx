import { memo, ReactNode, useCallback, useLayoutEffect } from "react";

// component
import { DraggableWindow, WindowHeader } from "@/components";

// types
import type { WindowKey } from "@/types";

// hook
import { useWindowState, useWindowActions, useZIndex } from "@/hook";

// store
import { useWindowStore } from "@/stores";

// helpers
import { clampToViewport } from "@/helpers";

interface BaseWindowProps {
  windowKey: WindowKey;
  title: string;
  src: string;
  children: ReactNode;
}

export const BaseWindow = memo(
  ({ windowKey, title, src, children }: BaseWindowProps) => {
    const { frame, isMinimized, isMaximized } = useWindowState(windowKey);
    const { close, maximize, minimize, updateFrame } =
      useWindowActions(windowKey);
    const { zIndex, bringToFront } = useZIndex(windowKey);

    const handleMouseDown = useCallback(() => {
      const currentTopMost = useWindowStore.getState().zIndexOrder.at(-1);

      if (currentTopMost === windowKey) return;

      bringToFront();
    }, [bringToFront, windowKey]);

    useLayoutEffect(() => {
      if (isMaximized) return;

      const onResize = () => {
        const next = clampToViewport(frame);
        if (
          next.x !== frame.x ||
          next.y !== frame.y ||
          next.width !== frame.width ||
          next.height !== frame.height
        ) {
          requestAnimationFrame(() => updateFrame(windowKey, next));
        }
      };

      window.addEventListener("resize", onResize);

      return () => window.removeEventListener("resize", onResize);
    }, [isMaximized, frame, windowKey, updateFrame]);

    return (
      <DraggableWindow
        windowKey={windowKey}
        hidden={isMinimized}
        zIndex={zIndex}
        onMouseDown={handleMouseDown}
      >
        <div className="bg-white shadow-lg text-[#475466] w-full h-full flex flex-col overflow-hidden">
          <WindowHeader
            windowKey={windowKey}
            src={src}
            title={title}
            onClose={close}
            onMaximize={maximize}
            onMinimize={minimize}
          />
          {children}
        </div>
      </DraggableWindow>
    );
  },
  (prev, next) =>
    prev.windowKey === next.windowKey &&
    prev.title === next.title &&
    prev.src === next.src
);

BaseWindow.displayName = "BaseWindow";
