import { useState, useLayoutEffect, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { useShallow } from "zustand/react/shallow";
import { QueryClientProvider } from "@tanstack/react-query";

// Store
import { useWindowStore } from "@/stores";

// Hook
import { useWindowActions, useWindowState } from "@/hook";

// Constant
import { DESKTOP_ICONS, WINDOW_KEYS } from "./constant";

// Types
import type { WindowKey } from "@/types";

// Components
import { DesktopIcon, SearchOverlay, Taskbar } from "./components";

// Helpers
import { queryClient, rearrangeLayoutOnResize } from "@/helpers";

// Pages
import {
  FilemanagerPage,
  KanbanPage,
  PivotPage,
  SpreadsheetPage,
} from "./pages";

const App = () => {
  const { SPREADSHEET, FILE_MANAGER, PIVOT, KANBAN } = WINDOW_KEYS;
  const rowHeight = 110;
  const fixedItemWidth = 100;

  const [cols, setCols] = useState(
    Math.floor(window.innerWidth / fixedItemWidth)
  );
  const [maxRows, setMaxRows] = useState(
    Math.floor((window.innerHeight - 44) / rowHeight)
  );
  const gridWidth = cols * fixedItemWidth;

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isSearchOpen]);

  useLayoutEffect(() => {
    const handleResize = () => {
      const newCols = Math.floor(window.innerWidth / fixedItemWidth);
      const newMaxRows = Math.floor((window.innerHeight - 44) / rowHeight);

      let updatedLayout = layout;
      if (newCols < cols || newMaxRows < maxRows) {
        updatedLayout = rearrangeLayoutOnResize(layout, newCols, newMaxRows);
        setLayout(updatedLayout);
      }

      setCols(newCols);
      setMaxRows(newMaxRows);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [layout, cols, maxRows]);

  // Windows state & actions
  const windows = {
    [SPREADSHEET]: {
      state: useWindowState(SPREADSHEET),
      actions: useWindowActions(SPREADSHEET),
    },
    [PIVOT]: {
      state: useWindowState(PIVOT),
      actions: useWindowActions(PIVOT),
    },
    [KANBAN]: {
      state: useWindowState(KANBAN),
      actions: useWindowActions(KANBAN),
    },
    [FILE_MANAGER]: {
      state: useWindowState(FILE_MANAGER),
      actions: useWindowActions(FILE_MANAGER),
    },
  };

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setSearchQuery("");
    }
  };

  const handleIconClick = (key: WindowKey) => {
    if (selectedIcon !== key) {
      setSelectedIcon(key);
    }

    const currentWindow = windows[key];

    const topMost = zIndexOrder[zIndexOrder.length - 1];
    const isTop = topMost === key;

    if (!currentWindow.state.isOpen) {
      currentWindow.actions.toggle();
      setZIndexOrder(key);
      return;
    }

    if (currentWindow.state.isMinimized) {
      // open & minimized -> restore
      currentWindow.actions.restore();
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

  const renderDesktopIcons = () =>
    DESKTOP_ICONS.map((icon) => (
      <div key={icon.key}>
        <DesktopIcon
          image={icon.image}
          title={icon.title}
          keyIcon={icon.key}
          onIconClick={handleIconClick}
          isSelected={selectedIcon === icon.key}
        />
      </div>
    ));

  const renderPages = () => {
    const pages = [];

    if (windows[SPREADSHEET]?.state.isOpen) {
      pages.push(
        <SpreadsheetPage
          key={SPREADSHEET}
          onClose={windows[SPREADSHEET]?.actions.close}
          onMaximize={windows[SPREADSHEET]?.actions.maximize}
          onMinimize={windows[SPREADSHEET]?.actions.minimize}
          zIndex={zIndexFor(SPREADSHEET)}
        />
      );
    }

    if (windows[PIVOT]?.state.isOpen) {
      pages.push(
        <PivotPage
          key={PIVOT}
          onClose={windows[PIVOT]?.actions.close}
          onMaximize={windows[PIVOT]?.actions.maximize}
          onMinimize={windows[PIVOT]?.actions.minimize}
          zIndex={zIndexFor(PIVOT)}
        />
      );
    }

    if (windows[KANBAN]?.state.isOpen) {
      pages.push(
        <KanbanPage
          key={KANBAN}
          onClose={windows[KANBAN]?.actions.close}
          onMaximize={windows[KANBAN]?.actions.maximize}
          onMinimize={windows[KANBAN]?.actions.minimize}
          zIndex={zIndexFor(KANBAN)}
        />
      );
    }

    if (windows[FILE_MANAGER]?.state.isOpen) {
      pages.push(
        <FilemanagerPage
          key={FILE_MANAGER}
          onClose={windows[FILE_MANAGER]?.actions.close}
          onMaximize={windows[FILE_MANAGER]?.actions.maximize}
          onMinimize={windows[FILE_MANAGER]?.actions.minimize}
          zIndex={zIndexFor(FILE_MANAGER)}
        />
      );
    }

    return pages;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="w-screen min-h-screen relative bg-cover bg-center overflow-hidden h-screen"
        style={{ backgroundImage: `url('/images/background-desktop.jpg')` }}
        onMouseDown={handleBackgroundMouseDown}
      >
        <div className="absolute inset-x-0 top-0 bottom-[44px]">
          <GridLayout
            className="layout select-none"
            layout={layout}
            rowHeight={rowHeight}
            width={gridWidth}
            isDraggable
            isResizable={false}
            margin={[0, 0]}
            onLayoutChange={setLayout}
            compactType={null}
            allowOverlap={false}
            preventCollision
            draggableHandle=".grid-drag-handle"
            verticalCompact
            cols={cols}
            maxRows={maxRows}
          >
            {renderDesktopIcons()}
          </GridLayout>
          {renderPages()}
          {/* Search Overlay */}
          {isSearchOpen && (
            <SearchOverlay
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAppSelect={(key) => {
                handleIconClick(key);
                setIsSearchOpen(false);
              }}
              onClose={() => setIsSearchOpen(false)}
            />
          )}
        </div>
        <Taskbar onToggleSearch={handleToggleSearch} />
      </div>
    </QueryClientProvider>
  );
};

export default App;
