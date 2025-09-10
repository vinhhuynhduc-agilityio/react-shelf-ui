import { useShallow } from "zustand/react/shallow";

// FortuneSheet
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

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
  // store
  const { zIndexOrder, setZIndexOrder } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
    }))
  );

  const data = [
    {
      name: "Sheet1",
      celldata: [],
      row: 50,
      column: 20,
    },
  ];

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WindowKeys.SPREADSHEET) {
      setZIndexOrder(WindowKeys.SPREADSHEET);
    }
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
      <div
        style={{
          width: "2300px",
          height: "1200px",
        }}
      >
        <Workbook data={data} showToolbar showFormulaBar showSheetTabs />
      </div>
    </DraggableWindow>
  );
};

export default SpreadsheetPage;
