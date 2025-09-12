import { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Hook
import { useWindowActions, useWindowState } from "@/hook";

// Constant
import { DESKTOP_ICONS, WindowKeys } from "./constant";

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
  const { SPREADSHEET, FILE_MANAGER, PIVOT, KANBAN } = WindowKeys;
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

  const ss = useWindowState(SPREADSHEET);
  const pv = useWindowState(PIVOT);
  const kb = useWindowState(KANBAN);
  const fm = useWindowState(FILE_MANAGER);

  const ssAct = useWindowActions(SPREADSHEET);
  const pvAct = useWindowActions(PIVOT);
  const kbAct = useWindowActions(KANBAN);
  const fmAct = useWindowActions(FILE_MANAGER);

  const handleIconClick = (key: WindowKey) => {
    if (selectedIcon !== key) {
      setSelectedIcon(key);
    }

    // current state for each window
    const stateMap = {
      [SPREADSHEET]: ss,
      [PIVOT]: pv,
      [KANBAN]: kb,
      [FILE_MANAGER]: fm,
    } as const;

    // actions for each window
    const actionMap = {
      [SPREADSHEET]: ssAct,
      [PIVOT]: pvAct,
      [KANBAN]: kbAct,
      [FILE_MANAGER]: fmAct,
    } as const;

    const st = stateMap[key];
    const act = actionMap[key];

    const topMost = zIndexOrder[zIndexOrder.length - 1];
    const isTop = topMost === key;

    if (!st.isOpen) {
      // closed -> open
      act.toggle();
      setZIndexOrder(key);
      return;
    }

    if (st.isMinimized) {
      // open & minimized -> restore
      act.restore();
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
        {ss.isOpen && (
          <SpreadsheetPage
            onClose={ssAct.close}
            onMaximize={ssAct.maximize}
            onMinimize={ssAct.minimize}
            zIndex={zIndexFor(SPREADSHEET)}
          />
        )}
        {pv.isOpen && (
          <PivotPage
            onClose={pvAct.close}
            onMaximize={pvAct.maximize}
            onMinimize={pvAct.minimize}
            zIndex={zIndexFor(PIVOT)}
          />
        )}
        {kb.isOpen && (
          <KanbanPage
            onClose={kbAct.close}
            onMaximize={kbAct.maximize}
            onMinimize={kbAct.minimize}
            zIndex={zIndexFor(KANBAN)}
          />
        )}
        {fm.isOpen && (
          <FileManagerPage
            onClose={fmAct.close}
            onMaximize={fmAct.maximize}
            onMinimize={fmAct.minimize}
            zIndex={zIndexFor(FILE_MANAGER)}
          />
        )}
      </div>
      <Taskbar />
    </div>
  );
};

export default App;
