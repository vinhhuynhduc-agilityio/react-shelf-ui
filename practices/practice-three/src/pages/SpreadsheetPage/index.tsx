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
  const hasUserEdited = useRef(false);

  // State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleClose = () => {
    if (hasUserEdited.current) {
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
