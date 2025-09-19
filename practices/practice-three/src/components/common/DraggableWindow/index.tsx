import { memo, useLayoutEffect } from "react";
import { Rnd } from "react-rnd";
import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Types
import type { WindowKey } from "@/types";

// Helpers
import { clampToViewport, updateFrame } from "@/helpers";

// Components
import WindowHeader from "../WindowHeader";

interface DraggableWindowProps {
  windowKey: WindowKey;
  src: string;
  title: string;
  children: React.ReactNode;
  zIndex: number;
  hidden?: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
  onMouseDown: () => void;
}

const DraggableWindow = memo((props: DraggableWindowProps) => {
  const {
    windowKey,
    src,
    title,
    children,
    zIndex,
    hidden = false,
    onClose,
    onMaximize,
    onMinimize,
    onMouseDown,
  } = props;

  const { win, frame, setFrame } = useWindowStore(
    useShallow((state) => ({
      win: state.windows[windowKey],
      frame: state.frames[windowKey],
      setFrame: state.setFrame,
    }))
  );

  const isMaximized = !!win?.isMaximized;

  useLayoutEffect(() => {
    const onResize = () => {
      if (isMaximized) return;

      const next = clampToViewport(frame);
      if (
        next.x !== frame.x ||
        next.y !== frame.y ||
        next.width !== frame.width ||
        next.height !== frame.height
      ) {
        requestAnimationFrame(() => setFrame(windowKey, next));
      }
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [isMaximized, frame, windowKey, setFrame]);

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
      dragHandleClassName="drag-handle"
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
      <div className="bg-white shadow-lg text-[#475466] w-full h-full flex flex-col overflow-hidden">
        <WindowHeader
          windowKey={windowKey}
          src={src}
          title={title}
          onClose={onClose}
          onMaximize={onMaximize}
          onMinimize={onMinimize}
        />
        <div className="flex-1">{children}</div>
      </div>
    </Rnd>
  );
});

export default DraggableWindow;
