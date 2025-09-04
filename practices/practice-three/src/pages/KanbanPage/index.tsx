import { useShallow } from "zustand/react/shallow";

// components
import { DraggableWindow } from "@/components";

// Constant
import { WindowKeys } from "@/constant";

// Store
import { useWindowStore } from "@/stores";

const KanbanPage = ({
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
    setZIndexOrder(WindowKeys.KANBAN);
  };

  return (
    <DraggableWindow
      src="/images/kanban.png"
      title="Kanban"
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      zIndex={zIndex}
      onMouseDown={handleMouseDown}
    >
      <h2>Kanban Content</h2>
    </DraggableWindow>
  );
};

export default KanbanPage;
