import { memo } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

// constant
import { SPREADSHEET_DATA, toolbarItems } from "@/constant";

const MemoizedWorkbook = memo(Workbook);

const SpreadsheetPage = () => (
  <div className="flex-1">
    <MemoizedWorkbook data={SPREADSHEET_DATA} toolbarItems={toolbarItems} />
  </div>
);

export default SpreadsheetPage;
