import { Rnd } from "react-rnd";

// Components
import WindowHeader from "../WindowHeader";

interface DraggableWindowProps {
  src: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
}

const DraggableWindow = ({
  src,
  title,
  children,
  onClose,
  onMaximize,
  onMinimize,
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
        zIndex: 9999,
      }}
    >
      <div className="bg-white shadow-lg overflow-hidden text-[#475466] w-full h-full">
        <WindowHeader
          src={src}
          title={title}
          onClose={onClose}
          onMaximize={onMaximize}
          onMinimize={onMinimize}
        />
        <div className="mt-4 p-2">{children}</div>
      </div>
    </Rnd>
  );
};

export default DraggableWindow;
