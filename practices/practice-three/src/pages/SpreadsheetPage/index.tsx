import { useShallow } from "zustand/react/shallow";

// Components
import { DraggableWindow } from "@/components";

// Constant
import { WindowKeys } from "@/constant";

// Store
import { useWindowStore } from "@/stores";

const SpreadsheetPage = ({
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
    setZIndexOrder(WindowKeys.SPREADSHEET);
  };

  return (
    <DraggableWindow
      src="/images/spreadsheet.png"
      title="Spreadsheet"
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      zIndex={zIndex}
      onMouseDown={handleMouseDown}
    >
      <h2>Spreadsheet Content</h2>
    </DraggableWindow>
  );
};

export default SpreadsheetPage;
