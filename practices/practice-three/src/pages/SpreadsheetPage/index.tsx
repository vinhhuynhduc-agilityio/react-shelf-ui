import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Spreadsheet, {
  RangeSelection,
  Selection,
  Point,
  CellBase,
} from "react-spreadsheet";

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
  // State
  const [previousSelectedCell, setPreviousSelectedCell] = useState<{
    row: number;
    column: number;
  } | null>(null);
  const [data, setData] = useState(() =>
    Array.from({ length: 24 }, () =>
      Array.from({ length: 12 }, () => ({ value: "" }))
    )
  );
  const [undoStack, setUndoStack] = useState<(typeof data)[]>([]);
  const [redoStack, setRedoStack] = useState<(typeof data)[]>([]);
  const [pendingUndo, setPendingUndo] = useState<typeof data | null>(null);

  // store
  const { zIndexOrder, setZIndexOrder } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
    }))
  );

  const columnLabels = useMemo(
    () => ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    []
  );

  const rowLabels = useMemo(
    () => Array.from({ length: 24 }, (_, index) => `${index + 1}`),
    []
  );

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WindowKeys.SPREADSHEET) {
      setZIndexOrder(WindowKeys.SPREADSHEET);
    }
  };

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

  const cloneData = (dataToClone: typeof data) =>
    JSON.parse(JSON.stringify(dataToClone));

  const handleChange = (newData: typeof data) => {
    setData(newData);
  };

  const handleModeChange = (newMode: "view" | "edit") => {
    if (newMode === "edit") {
      setPendingUndo(cloneData(data));
    }
  };

  const handleCellCommit = (
    prevCell: CellBase | null,
    nextCell: CellBase | null,
    coords: Point | null
  ) => {
    if (pendingUndo && coords) {
      setUndoStack((prev) => [...prev, pendingUndo]);
      setRedoStack([]);
      setPendingUndo(null);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousData = cloneData(undoStack[undoStack.length - 1]);
      setRedoStack((prev) => [...prev, cloneData(data)]);
      setData(previousData);
      setUndoStack((prev) => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextData = cloneData(redoStack[redoStack.length - 1]);
      setUndoStack((prev) => [...prev, cloneData(data)]);
      setData(nextData);
      setRedoStack((prev) => prev.slice(0, -1));
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
      <div className="flex flex-col">
        <div className="flex items-center border-b border-gray-300 p-1 space-x-1">
          <button
            onClick={handleUndo}
            className="p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer"
            title="Undo"
          >
            <i className="fa-solid fa-arrow-rotate-left"></i>
          </button>
          <button
            onClick={handleRedo}
            className="p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer"
            title="Redo"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <Spreadsheet
          data={data}
          columnLabels={columnLabels}
          rowLabels={rowLabels}
          onChange={handleChange}
          onSelect={handleSelectCell}
          onModeChange={handleModeChange}
          onCellCommit={handleCellCommit}
        />
      </div>
    </DraggableWindow>
  );
};

export default SpreadsheetPage;
