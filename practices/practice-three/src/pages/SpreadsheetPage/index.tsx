import { memo, useRef } from "react";
import { Workbook, WorkbookInstance } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

// constant
import { SPREADSHEET_DATA, toolbarItems, WINDOW_KEYS } from "@/constant";

// hook
import { useWindowActions } from "@/hook";

// components
import { WindowHeader } from "@/components";

type FortuneSheetRow = Array<FortuneSheetCell | null>;

interface FortuneSheetCell {
  m?: string;
  v?: string | number | boolean | null;
  bl?: number;
  ct?: {
    s: Array<{
      v: string;
      bl: number;
      it: number;
    }>;
  };
  it?: number;
}

interface FortuneSheetData {
  name?: string;
  data: FortuneSheetRow[];
}

const MemoizedWorkbook = memo(Workbook);

const SpreadsheetPage = () => {
  const { close, maximize, minimize } = useWindowActions(
    WINDOW_KEYS.SPREADSHEET
  );
  const workbookRef = useRef<WorkbookInstance>(null);

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

        // Use the displayed value (m) if present, otherwise fall back to raw value (v)
        // Convert v to string when needed – Excel accepts string | number
        excelCell.value =
          cell.m ?? ((cell.v != null ? String(cell.v) : "") as string | number);

        // === RICH TEXT & BASIC FORMATTING ===
        // Use cell.ct.s for per-character formatting (bold, italic, color, etc.)
        // Fallback to cell-level properties (bl, it, fc, etc.) when rich text is not present
        if (cell.ct && cell.ct.s) {
          const richText = cell.ct.s.map((segment) => ({
            text: segment.v,
            font: {
              bold: segment.bl === 1,
              italic: segment.it === 1,
            },
          }));
          excelCell.value = { richText };
        } else {
          // Fallback for cells without rich text
          if (cell.bl === 1) excelCell.font = { bold: true };
          if (cell.it === 1)
            excelCell.font = {
              ...(excelCell.font || {}),
              italic: true,
            };
        }
      });
    });

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
    const shouldSave = window.confirm(
      "Do you want to save changes before closing?"
    );

    if (shouldSave && workbookRef.current) {
      const sheets = workbookRef.current.getAllSheets();
      if (sheets[0] && sheets[0].data) {
        exportToXLSX(sheets[0] as FortuneSheetData);
      }
    }

    close();
  };

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
      <div className="flex-1">
        <MemoizedWorkbook
          data={SPREADSHEET_DATA}
          ref={workbookRef}
          showSheetTabs={false}
          toolbarItems={toolbarItems}
          cellContextMenu={[]}
        />
      </div>
    </>
  );
};

export default SpreadsheetPage;
