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
  const { setZIndexOrder } = useWindowStore(
    useShallow((state) => ({
      setZIndexOrder: state.setZIndexOrder,
    }))
  );

  const handleMouseDown = () => {
    setZIndexOrder(WindowKeys.PIVOT);
  };

  return (
    <DraggableWindow
      src="/images/pivot.png"
      title="Pivot"
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      zIndex={zIndex}
      onMouseDown={handleMouseDown}
    >
      <h2>Pivot Content</h2>
    </DraggableWindow>
  );
};

export default PivotPage;
