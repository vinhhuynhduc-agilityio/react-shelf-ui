// components
import { DraggableWindow } from "@/components";

const FileManagerPage = ({
  onClose,
  onMaximize,
  onMinimize,
}: {
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
}) => {
  return (
    <DraggableWindow
      src="/images/file-manager.png"
      title="File Manager"
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
    >
      <h2>File Manager Content</h2>
    </DraggableWindow>
  );
};

export default FileManagerPage;
