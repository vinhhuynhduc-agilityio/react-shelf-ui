import { memo } from "react";
import { Rnd } from "react-rnd";
import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Types
import type { WindowKey } from "@/types";

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

  return (
    <Rnd
      size={
        isMaximized
          ? { width: "100%", height: "100%" }
          : { width: frame.width, height: frame.height }
      }
      position={isMaximized ? { x: 0, y: 0 } : { x: frame.x, y: frame.y }}
      minWidth={300}
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
      onResizeStop={(_, __, ref, ___, position) => {
        if (isMaximized) return;

        setFrame(windowKey, {
          x: position.x,
          y: position.y,
          width: ref.getBoundingClientRect().width,
          height: ref.getBoundingClientRect().height,
        });

        window.dispatchEvent(new Event("resize"));
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
