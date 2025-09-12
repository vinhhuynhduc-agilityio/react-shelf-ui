import { memo } from "react";
import { Rnd } from "react-rnd";

import WindowHeader from "../WindowHeader";

interface DraggableWindowProps {
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

const DraggableWindow = memo(
  ({
    src,
    title,
    children,
    zIndex,
    hidden = false,
    onClose,
    onMaximize,
    onMinimize,
    onMouseDown,
  }: DraggableWindowProps) => {
    const availH = Math.max(0, window.innerHeight - 44);

    return (
      <Rnd
        default={{
          x: (window.innerWidth - 800) / 2,
          y: (availH - 450) / 2,
          width: 800,
          height: 450,
        }}
        minWidth={300}
        minHeight={200}
        bounds="parent"
        dragHandleClassName="drag-handle"
        style={{
          position: "absolute",
          zIndex,
          border: "1px solid #DADEE0",
          display: hidden ? "none" : "block",
        }}
        onMouseDown={onMouseDown}
        onResizeStop={() => window.dispatchEvent(new Event("resize"))}
      >
        <div className="bg-white shadow-lg text-[#475466] w-full h-full flex flex-col overflow-hidden">
          <WindowHeader
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
  }
);

export default DraggableWindow;
