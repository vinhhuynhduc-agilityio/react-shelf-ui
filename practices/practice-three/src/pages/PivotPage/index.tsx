import { useShallow } from "zustand/react/shallow";

// Components
import { DraggableWindow } from "@/components";

// Constant
import { WINDOW_KEYS } from "@/constant";

// Store
import { useWindowStore } from "@/stores";

const PivotPage = ({
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
  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.PIVOT].isMinimized,
    }))
  );

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.PIVOT) {
      setZIndexOrder(WINDOW_KEYS.PIVOT);
    }
  };

  return (
    <DraggableWindow
      windowKey={WINDOW_KEYS.PIVOT}
      src="/images/pivot.png"
      title="Pivot"
      hidden={isMinimized}
      zIndex={zIndex}
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      onMouseDown={handleMouseDown}
    >
      <h2>Pivot Content</h2>
    </DraggableWindow>
  );
};

export default PivotPage;
