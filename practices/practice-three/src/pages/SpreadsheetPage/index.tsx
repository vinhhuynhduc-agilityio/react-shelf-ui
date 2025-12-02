import { memo } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

// constant
import { SPREADSHEET_DATA, toolbarItems, WINDOW_KEYS } from "@/constant";

// hook
import { useWindowActions } from "@/hook";

// components
import { WindowHeader } from "@/components";

const MemoizedWorkbook = memo(Workbook);

const SpreadsheetPage = () => {
  const { close, maximize, minimize } = useWindowActions(
    WINDOW_KEYS.SPREADSHEET
  );

  const handleClose = () => {
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
        <MemoizedWorkbook data={SPREADSHEET_DATA} toolbarItems={toolbarItems} />
      </div>
    </>
  );
};

export default SpreadsheetPage;
