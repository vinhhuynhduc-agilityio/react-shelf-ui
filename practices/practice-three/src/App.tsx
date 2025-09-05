import { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { useShallow } from "zustand/react/shallow";

// Components
import { DesktopIcon } from "./components";

// Constant
import { DESKTOP_ICONS, WindowKeys } from "./constant";

// Store
import { useWindowStore } from "@/stores";

// Custom hooks to get state and actions for each window
import { useWindowActions, useWindowState } from "@/hook";

// Types
import { WindowKey } from "@/types";

// Pages
import {
  FileManagerPage,
  KanbanPage,
  PivotPage,
  SpreadsheetPage,
} from "./pages";

const App = () => {
  const { SPREADSHEET, FILE_MANAGER, PIVOT, KANBAN } = WindowKeys;

  // Layout state for react-grid-layout
  const [layout, setLayout] = useState<Layout[]>([
    { i: SPREADSHEET, x: 0, y: 0, w: 1, h: 1 },
    { i: FILE_MANAGER, x: 0, y: 1, w: 1, h: 1 },
    { i: PIVOT, x: 0, y: 2, w: 1, h: 1 },
    { i: KANBAN, x: 0, y: 3, w: 1, h: 1 },
  ]);

  // Get window states using the custom hook for each window
  const {
    isOpen: isSpreadsheetOpen,
    // isMaximized: isSpreadsheetMaximized,
    // isMinimized: isSpreadsheetMinimized,
  } = useWindowState(SPREADSHEET);
  const {
    isOpen: isPivotOpen,
    // isMaximized: isPivotMaximized,
    // isMinimized: isPivotMinimized,
  } = useWindowState(PIVOT);
  const {
    isOpen: isKanbanOpen,
    // isMaximized: isKanbanMaximized,
    // isMinimized: isKanbanMinimized,
  } = useWindowState(KANBAN);
  const {
    isOpen: isFileManagerOpen,
    // isMaximized: isFileManagerMaximized,
    // isMinimized: isFileManagerMinimized,
  } = useWindowState(FILE_MANAGER);

  // Get window actions using the custom hook for each window
  const {
    toggle: toggleSpreadsheet,
    maximize: maximizeSpreadsheet,
    minimize: minimizeSpreadsheet,
    close: closeSpreadsheet,
  } = useWindowActions(SPREADSHEET);
  const {
    toggle: togglePivot,
    maximize: maximizePivot,
    minimize: minimizePivot,
    close: closePivot,
  } = useWindowActions(PIVOT);
  const {
    toggle: toggleKanban,
    maximize: maximizeKanban,
    minimize: minimizeKanban,
    close: closeKanban,
  } = useWindowActions(KANBAN);
  const {
    toggle: toggleFileManager,
    maximize: maximizeFileManager,
    minimize: minimizeFileManager,
    close: closeFileManager,
  } = useWindowActions(FILE_MANAGER);

  // zIndexOrder to manage window stacking
  const { zIndexOrder, setZIndexOrder } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
    }))
  );

  const rowHeight = 120;
  const maxRows = Math.floor(window.innerHeight / rowHeight);
  const cols = Math.floor(window.innerWidth / 120);

  const handleIconClick = (keyIcon: WindowKey) => {
    setZIndexOrder(keyIcon);

    const toggleWindowIfClosed = (isOpen: boolean, toggle: () => void) => {
      if (!isOpen) {
        toggle();
      }
    };

    const windowActions: Record<
      WindowKey,
      { isOpen: boolean; toggle: () => void }
    > = {
      [SPREADSHEET]: { isOpen: isSpreadsheetOpen, toggle: toggleSpreadsheet },
      [PIVOT]: { isOpen: isPivotOpen, toggle: togglePivot },
      [KANBAN]: { isOpen: isKanbanOpen, toggle: toggleKanban },
      [FILE_MANAGER]: { isOpen: isFileManagerOpen, toggle: toggleFileManager },
    };

    const { isOpen, toggle } = windowActions[keyIcon];
    toggleWindowIfClosed(isOpen, toggle);
  };

  return (
    <div
      className="w-screen min-h-screen p-2 relative bg-cover bg-center overflow-hidden h-screen"
      style={{
        backgroundImage: `url('/images/background-desktop.jpg')`,
      }}
    >
      <GridLayout
        className="layout"
        layout={layout}
        rowHeight={rowHeight}
        width={window.innerWidth}
        isDraggable={true}
        isResizable={false}
        margin={[10, 10]}
        containerPadding={[20, 20]}
        onLayoutChange={setLayout}
        compactType={null}
        allowOverlap={false}
        preventCollision={true}
        draggableHandle=".drag-handle"
        verticalCompact={true}
        maxRows={maxRows}
        cols={cols}
      >
        {DESKTOP_ICONS.map((icon) => (
          <div key={icon.key}>
            <DesktopIcon
              image={icon.image}
              title={icon.title}
              keyIcon={icon.key}
              onIconClick={handleIconClick}
            />
          </div>
        ))}
      </GridLayout>
      {isSpreadsheetOpen && (
        <SpreadsheetPage
          onClose={closeSpreadsheet}
          onMaximize={maximizeSpreadsheet}
          onMinimize={minimizeSpreadsheet}
          zIndex={zIndexOrder.indexOf(SPREADSHEET) + 1}
        />
      )}
      {isPivotOpen && (
        <PivotPage
          onClose={closePivot}
          onMaximize={maximizePivot}
          onMinimize={minimizePivot}
          zIndex={zIndexOrder.indexOf(PIVOT) + 1}
        />
      )}
      {isKanbanOpen && (
        <KanbanPage
          onClose={closeKanban}
          onMaximize={maximizeKanban}
          onMinimize={minimizeKanban}
          zIndex={zIndexOrder.indexOf(KANBAN) + 1}
        />
      )}
      {isFileManagerOpen && (
        <FileManagerPage
          onClose={closeFileManager}
          onMaximize={maximizeFileManager}
          onMinimize={minimizeFileManager}
          zIndex={zIndexOrder.indexOf(FILE_MANAGER) + 1}
        />
      )}
    </div>
  );
};

export default App;
