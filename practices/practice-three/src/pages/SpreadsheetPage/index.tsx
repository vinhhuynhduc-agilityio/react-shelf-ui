import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Spreadsheet, { RangeSelection, Selection } from "react-spreadsheet";

// Components
import { DraggableWindow } from "@/components";

// Constant
import { WindowKeys } from "@/constant";

// Store
import { useWindowStore } from "@/stores";

// Helpers
import { removeSelectedClass } from "./helpers";

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
  const [previousSelectedCell, setPreviousSelectedCell] = useState<{
    row: number;
    column: number;
  } | null>(null);

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

  const handleSelectCell = (selected: Selection) => {
    if (selected instanceof RangeSelection) {
      const rowIndex = selected?.range?.start?.row;
      const colIndex = selected?.range?.start?.column + 1;

      const columnHeader = document.querySelector(
        `.Spreadsheet__header:nth-child(${colIndex + 1})`
      );
      const rowHeader = document.querySelector(`tr[row="${rowIndex}"] th`);

      // Remove "selected" class from previous cell
      if (previousSelectedCell) {
        removeSelectedClass(
          previousSelectedCell.row,
          previousSelectedCell.column
        );
      }

      // Using setTimeout to ensure the DOM is updated before adding the class
      // This is necessary when clicking on the intersection of column and row headers,
      // and then clicking on a cell. This causes the DOM to change, so we need to wait
      // until the DOM is fully updated before adding the class.
      setTimeout(() => {
        columnHeader?.classList.add("header_selected");
        rowHeader?.classList.add("header_selected");
      }, 0);

      setPreviousSelectedCell({ row: rowIndex, column: colIndex });
    } else {
      // Remove the selection class if no selection
      if (previousSelectedCell) {
        removeSelectedClass(
          previousSelectedCell.row,
          previousSelectedCell.column
        );
      }
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
      <Spreadsheet
        data={data}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
        onChange={(newData) => console.log(newData)}
        onSelect={handleSelectCell}
      />
    </DraggableWindow>
  );
};

export default SpreadsheetPage;
