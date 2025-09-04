import { useShallow } from "zustand/react/shallow";

// components
import { DraggableWindow } from "@/components";

// Constant
import { WindowKeys } from "@/constant";

// Store
import { useWindowStore } from "@/stores";

const FileManagerPage = ({
  onClose,
  onMaximize,
  onMinimize,
  zIndex,
}: {
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
  zIndex: number;
}) => {
  const { setZIndexOrder } = useWindowStore(
    useShallow((state) => ({
      setZIndexOrder: state.setZIndexOrder,
    }))
  );

  const handleMouseDown = () => {
    setZIndexOrder(WindowKeys.FILE_MANAGER);
  };

  return (
    <DraggableWindow
      src="/images/file-manager.png"
      title="File Manager"
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      zIndex={zIndex}
      onMouseDown={handleMouseDown}
    >
      <h2>File Manager Content</h2>
    </DraggableWindow>
  );
};

export default FileManagerPage;
