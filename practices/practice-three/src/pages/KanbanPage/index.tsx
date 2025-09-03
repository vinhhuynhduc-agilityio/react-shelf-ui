// components
import { DraggableWindow } from "@/components";

const KanbanPage = ({
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
      src="/images/kanban.png"
      title="Kanban"
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
    >
      <h2>Kanban Content</h2>
    </DraggableWindow>
  );
};

export default KanbanPage;
