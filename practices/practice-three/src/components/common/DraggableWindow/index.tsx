import { memo } from "react";
import { Rnd } from "react-rnd";

import WindowHeader from "../WindowHeader";

interface DraggableWindowProps {
  src: string;
  title: string;
  children: React.ReactNode;
  zIndex: number;
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
    onClose,
    onMaximize,
    onMinimize,
    onMouseDown,
  }: DraggableWindowProps) => {
    return (
      <Rnd
        default={{
          x: (window.innerWidth - 800) / 2,
          y: (window.innerHeight - 450) / 2,
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
        }}
        onMouseDown={onMouseDown}
      >
        <div className="bg-white shadow-lg overflow-auto text-[#475466] w-full h-full">
          <WindowHeader
            src={src}
            title={title}
            onClose={onClose}
            onMaximize={onMaximize}
            onMinimize={onMinimize}
          />
          {children}
        </div>
      </Rnd>
    );
  }
);

export default DraggableWindow;
