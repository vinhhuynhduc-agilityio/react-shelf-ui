import { useCallback, useRef, useState } from "react";
import { WorkbookInstance } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

// constant
import { WINDOW_KEYS } from "@/constant";

// hook
import { useWindowActions } from "@/hook";

// components
import {
  WindowHeader,
  UnsavedChangesModal,
  SpreadsheetWorkbook,
} from "@/components";

// helper
import { exportToXLSX } from "@/helpers";

// types
import { FortuneSheetData } from "@/types";

const SpreadsheetPage = () => {
  const { close, maximize, minimize } = useWindowActions(
    WINDOW_KEYS.SPREADSHEET
  );
  const workbookRef = useRef<WorkbookInstance>(null);

  // State to track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  //  Export a single FortuneSheet to a real .xlsx file
  const exportToXLSX = async (sheet: FortuneSheetData) => {
    // Create a new Excel workbook in memory
    const workbook = new ExcelJS.Workbook();

    // Add a worksheet – use the original sheet name if available
    const ws = workbook.addWorksheet(sheet.name || "Sheet1");

    sheet.data.forEach((row: FortuneSheetRow, rowIndex: number) => {
      if (!Array.isArray(row)) return;

      row.forEach((cell: FortuneSheetCell | null, colIndex: number) => {
        if (!cell) return;

        const excelCell = ws.getCell(rowIndex + 1, colIndex + 1);
        applyFortuneSheetCellToExcel(excelCell, cell);
      });
    });

    // Apply all borders in one clean call
    applyBordersFromConfig(ws, sheet.config, colorToArgb);

    // Convert the entire workbook to a binary buffer (the actual .xlsx file)
    const buffer = await workbook.xlsx.writeBuffer();

    // Wrap the buffer in a Blob with correct MIME type
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Trigger browser download with a nice filename
    saveAs(blob, "spreadsheet.xlsx");
  };

  const handleClose = () => {
    if (hasChanges) {
      setIsSaveModalOpen(true);
    } else {
      close();
    }
  };

  const handleYes = async () => {
    if (workbookRef.current) {
      const sheets = workbookRef.current.getAllSheets();
      if (sheets[0] && sheets[0].data) {
        await exportToXLSX(sheets[0] as FortuneSheetData);
      }
    }

    setIsSaveModalOpen(false);
    close();
  };

  const handleNo = () => {
    setIsSaveModalOpen(false);
    close();
  };

  const handleCancel = () => {
    setIsSaveModalOpen(false);
  };

  const handleUserEdit = useCallback(() => {
    hasUserEdited.current = true;
  }, []);

  return (
    <>
      <WindowHeader
        windowKey={WINDOW_KEYS.SPREADSHEET}
        src="/images/spreadsheet.webp"
        title="Spreadsheet"
        onClose={handleClose}
        onMaximize={maximize}
        onMinimize={minimize}
      />
      <SpreadsheetWorkbook ref={workbookRef} onUserEdit={handleUserEdit} />

      {/* Save Modal */}
      <UnsavedChangesModal
        isOpen={isSaveModalOpen}
        fileName="Untitled spreadsheet"
        onSave={handleYes}
        onDiscard={handleNo}
        onCancel={handleCancel}
      />
    </>
  );
};

export default SpreadsheetPage;
