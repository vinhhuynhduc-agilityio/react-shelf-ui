import { useShallow } from "zustand/react/shallow";

// FortuneSheet
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

// Components
import { DraggableWindow } from "@/components";

// Constant
import { WINDOW_KEYS } from "@/constant";

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
  // store
  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.SPREADSHEET].isMinimized,
    }))
  );

  const data = [
    {
      name: "Sheet1",
      celldata: [],
      row: 50,
      column: 26,
    },
  ];

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.SPREADSHEET) {
      setZIndexOrder(WINDOW_KEYS.SPREADSHEET);
    }
  };

  return (
    <DraggableWindow
      src="/images/spreadsheet.png"
      title="Spreadsheet"
      hidden={isMinimized}
      zIndex={zIndex}
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      onMouseDown={handleMouseDown}
    >
      <Workbook data={data} />
    </DraggableWindow>
  );
};

export default SpreadsheetPage;
