import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Spreadsheet from "react-spreadsheet";

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
  const { zIndexOrder, setZIndexOrder } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
    }))
  );

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WindowKeys.SPREADSHEET) {
      setZIndexOrder(WindowKeys.SPREADSHEET);
    }
  };

  const data = useMemo(
    () =>
      Array.from({ length: 24 }, () =>
        Array.from({ length: 12 }, () => ({ value: "" }))
      ),
    []
  );

  const columnLabels = useMemo(
    () => ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    []
  );

  const rowLabels = useMemo(
    () => Array.from({ length: 24 }, (_, index) => `${index + 1}`),
    []
  );

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
      <Spreadsheet
        data={data}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
        onChange={(newData) => console.log(newData)}
      />
    </DraggableWindow>
  );
};

export default SpreadsheetPage;
