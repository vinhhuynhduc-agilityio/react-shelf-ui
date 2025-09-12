import { useShallow } from "zustand/react/shallow";

// Components
import { DraggableWindow } from "@/components";

// Constant
import { WindowKeys } from "@/constant";

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
      isMinimized: state.windows[WindowKeys.PIVOT].isMinimized,
    }))
  );

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WindowKeys.PIVOT) {
      setZIndexOrder(WindowKeys.PIVOT);
    }
  };

  return (
    <DraggableWindow
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
