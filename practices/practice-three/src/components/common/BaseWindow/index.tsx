import { ReactNode, useCallback } from "react";

// Components
import { DraggableWindow } from "@/components";

// Hook
import { useWindow } from "@/hook";

// Types
import type { WindowKey } from "@/types";

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
  const { isMinimized, zIndexOrder, close, maximize, minimize, bringToFront } =
    useWindow(windowKey);

  const zIndex = zIndexOrder.indexOf(windowKey) + 1 || 1;

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
