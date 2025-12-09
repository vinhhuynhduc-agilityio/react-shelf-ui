import { memo, forwardRef, useCallback } from "react";
import { Workbook, WorkbookInstance } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

import { SPREADSHEET_DATA, toolbarItems } from "@/constant";

interface Props {
  onUserEdit: () => void;
}

const SpreadsheetWorkbook = forwardRef<WorkbookInstance, Props>(
  ({ onUserEdit }, ref) => {
    const handleOp = useCallback(() => {
      onUserEdit();
    }, [onUserEdit]);

    return (
      <div className="flex-1">
        <Workbook
          ref={ref}
          data={SPREADSHEET_DATA}
          showSheetTabs={false}
          toolbarItems={toolbarItems}
          cellContextMenu={[]}
          onOp={handleOp}
        />
      </div>
    );
  }
);

SpreadsheetWorkbook.displayName = "SpreadsheetWorkbook";

export default memo(SpreadsheetWorkbook);
