import { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Hook
import { useWindowActions, useWindowState } from "@/hook";

// Constant
import { DESKTOP_ICONS, WINDOW_KEYS } from "./constant";

// Types
import type { WindowKey } from "@/types";

// Components
import { DesktopIcon, Taskbar } from "./components";

// Pages
import {
  FileManagerPage,
  KanbanPage,
  PivotPage,
  SpreadsheetPage,
} from "./pages";

const App = () => {
  const { SPREADSHEET, FILE_MANAGER, PIVOT, KANBAN } = WINDOW_KEYS;
  const rowHeight = 110;
  const cols = Math.floor(window.innerWidth / 110);
  const maxRows = Math.floor(window.innerHeight / rowHeight);

  // State
  const [selectedIcon, setSelectedIcon] = useState<WindowKey | null>(null);
  const [layout, setLayout] = useState<Layout[]>(
    DESKTOP_ICONS.map((icon, idx) => ({
      i: icon.key,
      x: 0,
      y: idx,
      w: 1,
      h: 1,
    }))
  );

  const { zIndexOrder, setZIndexOrder } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
    }))
  );

  const spreadsheetState = useWindowState(SPREADSHEET);
  const pivotState = useWindowState(PIVOT);
  const kanbanState = useWindowState(KANBAN);
  const fileManagerState = useWindowState(FILE_MANAGER);

  const spreadsheetActions = useWindowActions(SPREADSHEET);
  const pivotActions = useWindowActions(PIVOT);
  const kanbanActions = useWindowActions(KANBAN);
  const fileManagerActions = useWindowActions(FILE_MANAGER);

  const handleIconClick = (key: WindowKey) => {
    if (selectedIcon !== key) {
      setSelectedIcon(key);
    }

    // current state for each window
    const stateMap = {
      [SPREADSHEET]: spreadsheetState,
      [PIVOT]: pivotState,
      [KANBAN]: kanbanState,
      [FILE_MANAGER]: fileManagerState,
    } as const;

    // actions for each window
    const actionMap = {
      [SPREADSHEET]: spreadsheetActions,
      [PIVOT]: pivotActions,
      [KANBAN]: kanbanActions,
      [FILE_MANAGER]: fileManagerActions,
    } as const;

    const currentWindowState = stateMap[key];
    const currentWindowActions = actionMap[key];

    const topMost = zIndexOrder[zIndexOrder.length - 1];
    const isTop = topMost === key;

    if (!currentWindowState.isOpen) {
      // closed -> open
      currentWindowActions.toggle();
      setZIndexOrder(key);
      return;
    }

    if (currentWindowState.isMinimized) {
      // open & minimized -> restore
      currentWindowActions.restore();
      setZIndexOrder(key);
      return;
    }

    if (!isTop) {
      // open & not minimized & not top-most -> bring to front
      setZIndexOrder(key);
      return;
    }
  };

  const zIndexFor = (key: WindowKey) =>
    (zIndexOrder.indexOf(key) >= 0 ? zIndexOrder.indexOf(key) : -1) + 1;

  const handleBackgroundMouseDown: React.MouseEventHandler<HTMLDivElement> = (
    e
  ) => {
    const t = e.target as HTMLElement;
    if (t !== e.currentTarget && t.closest(".desktop-icon")) return;
    setSelectedIcon(null);
  };

  return (
    <div
      className="w-screen min-h-screen p-2 relative bg-cover bg-center overflow-hidden h-screen"
      style={{ backgroundImage: `url('/images/background-desktop.jpg')` }}
      onMouseDown={handleBackgroundMouseDown}
    >
      <div className="absolute inset-x-0 top-0 bottom-[44px]">
        <GridLayout
          className="layout"
          layout={layout}
          rowHeight={rowHeight}
          width={window.innerWidth}
          isDraggable
          isResizable={false}
          margin={[10, 10]}
          containerPadding={[20, 20]}
          onLayoutChange={setLayout}
          compactType={null}
          allowOverlap={false}
          preventCollision
          draggableHandle=".drag-handle"
          verticalCompact
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
                isSelected={selectedIcon === icon.key}
              />
            </div>
          ))}
        </GridLayout>
        {spreadsheetState.isOpen && (
          <SpreadsheetPage
            onClose={spreadsheetActions.close}
            onMaximize={spreadsheetActions.maximize}
            onMinimize={spreadsheetActions.minimize}
            zIndex={zIndexFor(SPREADSHEET)}
          />
        )}
        {pivotState.isOpen && (
          <PivotPage
            onClose={pivotActions.close}
            onMaximize={pivotActions.maximize}
            onMinimize={pivotActions.minimize}
            zIndex={zIndexFor(PIVOT)}
          />
        )}
        {kanbanState.isOpen && (
          <KanbanPage
            onClose={kanbanActions.close}
            onMaximize={kanbanActions.maximize}
            onMinimize={kanbanActions.minimize}
            zIndex={zIndexFor(KANBAN)}
          />
        )}
        {fileManagerState.isOpen && (
          <FileManagerPage
            onClose={fileManagerActions.close}
            onMaximize={fileManagerActions.maximize}
            onMinimize={fileManagerActions.minimize}
            zIndex={zIndexFor(FILE_MANAGER)}
          />
        )}
      </div>
      <Taskbar />
    </div>
  );
};

export default App;
