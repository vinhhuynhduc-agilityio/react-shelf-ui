import { memo } from "react";
import { Rnd } from "react-rnd";
import { useShallow } from "zustand/shallow";

// Types
import type { WindowKey } from "@/types";

// Helpers
import { updateFrame } from "@/helpers";

// Store
import { useWindowStore } from "@/stores";

interface DraggableWindowProps {
  windowKey: WindowKey;
  children: React.ReactNode;
  zIndex: number;
  hidden?: boolean;
  onMouseDown: () => void;
}

const DraggableWindow = memo((props: DraggableWindowProps) => {
  const { windowKey, children, zIndex, hidden = false, onMouseDown } = props;

  const { setFrame, frame, isMaximized } = useWindowStore(
    useShallow((state) => ({
      frame: state.frames[windowKey],
      isMaximized: state.windows[windowKey].isMaximized,
      setFrame: state.setFrame,
    }))
  );

  return (
    <Rnd
      size={
        isMaximized
          ? { width: "100%", height: "100%" }
          : { width: frame.width, height: frame.height }
      }
      position={isMaximized ? { x: 0, y: 0 } : { x: frame.x, y: frame.y }}
      minWidth={200}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      enableResizing={!isMaximized}
      disableDragging={isMaximized}
      style={{
        position: "absolute",
        zIndex,
        border: "1px solid #DADEE0",
        display: hidden ? "none" : "block",
      }}
      onMouseDown={onMouseDown}
      onDragStop={(_, d) => {
        if (isMaximized) return;
        setFrame(windowKey, { ...frame, x: d.x, y: d.y });
      }}
      onResize={(_, __, ref, ___, pos) => {
        if (isMaximized) return;
        updateFrame(setFrame, windowKey, ref as HTMLElement, pos);
      }}
      onResizeStop={(_, __, ref, ___, pos) => {
        if (isMaximized) return;
        updateFrame(setFrame, windowKey, ref as HTMLElement, pos);
      }}
    >
      {children}
    </Rnd>
  );
});

export default DraggableWindow;
