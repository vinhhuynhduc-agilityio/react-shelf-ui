import { ReactNode, useCallback } from "react";

// Components
import { DraggableWindow } from "@/components";

// Types
import type { WindowKey } from "@/types";

// Hook
import { useWindowActions, useWindowState, useZIndex } from "@/hook";

interface BaseWindowProps {
  windowKey: WindowKey;
  title: string;
  src: string;
  children: ReactNode;
}

export const BaseWindow = ({
  windowKey,
  title,
  src,
  children,
}: BaseWindowProps) => {
  const { isMinimized } = useWindowState(windowKey);
  const { close, maximize, minimize } = useWindowActions(windowKey);
  const { zIndex, bringToFront } = useZIndex(windowKey);

  const handleMouseDown = useCallback(() => {
    bringToFront();
  }, [bringToFront]);

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
};
