import { useState } from "react";
import GridLayout from "react-grid-layout";

// Components
import { DesktopIcon } from "./components";

// Constant
import { DESKTOP_ICONS } from "./constant";

// Pages
import {
  FileManagerPage,
  KanbanPage,
  PivotPage,
  SpreadsheetPage,
} from "./pages";

// Store
import { WindowName } from "@/stores";

// Custom hooks to get state and actions for each window
import { useWindowActions, useWindowState } from "@/hook";

const App = () => {
  const [layout, setLayout] = useState([
    { i: "spreadsheetIcon", x: 0, y: 0, w: 1, h: 1 },
    { i: "fileManagerIcon", x: 0, y: 1, w: 1, h: 1 },
    { i: "pivotIcon", x: 0, y: 2, w: 1, h: 1 },
    { i: "kanbanIcon", x: 0, y: 3, w: 1, h: 1 },
  ]);

  // Get window states using the custom hook for each window
  const {
    isOpen: isSpreadsheetOpen,
    // isMaximized: isSpreadsheetMaximized,
    // isMinimized: isSpreadsheetMinimized,
  } = useWindowState("spreadsheet");
  const {
    isOpen: isPivotOpen,
    // isMaximized: isPivotMaximized,
    // isMinimized: isPivotMinimized,
  } = useWindowState("pivot");
  const {
    isOpen: isKanbanOpen,
    // isMaximized: isKanbanMaximized,
    // isMinimized: isKanbanMinimized,
  } = useWindowState("kanban");
  const {
    isOpen: isFileManagerOpen,
    // isMaximized: isFileManagerMaximized,
    // isMinimized: isFileManagerMinimized,
  } = useWindowState("fileManager");

  // Get window actions using the custom hook for each window
  const {
    toggle: toggleSpreadsheet,
    maximize: maximizeSpreadsheet,
    minimize: minimizeSpreadsheet,
    close: closeSpreadsheet,
  } = useWindowActions("spreadsheet");
  const {
    toggle: togglePivot,
    maximize: maximizePivot,
    minimize: minimizePivot,
    close: closePivot,
  } = useWindowActions("pivot");
  const {
    toggle: toggleKanban,
    maximize: maximizeKanban,
    minimize: minimizeKanban,
    close: closeKanban,
  } = useWindowActions("kanban");
  const {
    toggle: toggleFileManager,
    maximize: maximizeFileManager,
    minimize: minimizeFileManager,
    close: closeFileManager,
  } = useWindowActions("fileManager");

  const rowHeight = 120;
  const maxRows = Math.floor(window.innerHeight / rowHeight);
  const cols = Math.floor(window.innerWidth / 120);

  const handleIconClick = (keyIcon: WindowName) => {
    switch (keyIcon) {
      case "spreadsheet":
        toggleSpreadsheet();
        break;
      case "pivot":
        togglePivot();
        break;
      case "kanban":
        toggleKanban();
        break;
      case "fileManager":
        toggleFileManager();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="w-screen min-h-screen p-2 relative"
      style={{
        backgroundImage: `url('/images/background-desktop.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        height: "100vh",
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
              keyIcon={icon.key as WindowName}
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
        />
      )}
      {isPivotOpen && (
        <PivotPage
          onClose={closePivot}
          onMaximize={maximizePivot}
          onMinimize={minimizePivot}
        />
      )}
      {isKanbanOpen && (
        <KanbanPage
          onClose={closeKanban}
          onMaximize={maximizeKanban}
          onMinimize={minimizeKanban}
        />
      )}
      {isFileManagerOpen && (
        <FileManagerPage
          onClose={closeFileManager}
          onMaximize={maximizeFileManager}
          onMinimize={minimizeFileManager}
        />
      )}
    </div>
  );
};

export default App;
