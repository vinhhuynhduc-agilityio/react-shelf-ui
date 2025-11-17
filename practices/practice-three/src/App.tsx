import { useState, useLayoutEffect, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { QueryClientProvider } from "@tanstack/react-query";

// hook
import { useWindow } from "@/hook";

// constant
import { DESKTOP_ICONS, WINDOW_CONFIGS, WINDOW_KEYS } from "./constant";

// components
import { BaseWindow, DesktopIcon, SearchOverlay, Taskbar } from "./components";

// helpers
import { queryClient, rearrangeLayoutOnResize } from "@/helpers";

// types
import { WindowKey } from "@/types";

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

  const windows = {
    [SPREADSHEET]: useWindow(SPREADSHEET),
    [FILE_MANAGER]: useWindow(FILE_MANAGER),
    [PIVOT]: useWindow(PIVOT),
    [KANBAN]: useWindow(KANBAN),
  } as const;

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsSearchOpen(false);
    document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, [isSearchOpen]);

  useLayoutEffect(() => {
    const handleResize = () => {
      const newCols = Math.floor(window.innerWidth / fixedItemWidth);
      const newMaxRows = Math.floor((window.innerHeight - 44) / rowHeight);

      if (newCols < cols || newMaxRows < maxRows) {
        setLayout(rearrangeLayoutOnResize(layout, newCols, newMaxRows));
      }

      setCols(newCols);
      setMaxRows(newMaxRows);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [layout, cols, maxRows]);

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

    const win = windows[key];

    const topMost = win.zIndexOrder[win.zIndexOrder.length - 1];
    const isTop = topMost === key;

    if (!win.isOpen) {
      win.toggle();
      win.bringToFront();

      return;
    }

    if (win.isMinimized) {
      win.restore();
      win.bringToFront();

      return;
    }

    if (!isTop) {
      win.bringToFront();

      return;
    }
  };

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

  const renderWindows = () =>
    Object.entries(WINDOW_CONFIGS).map(([key, { title, src, Page }]) => {
      const win = windows[key as WindowKey];
      if (!win?.isOpen) return null;

      return (
        <BaseWindow
          key={key}
          windowKey={key as WindowKey}
          title={title}
          src={src}
        >
          <Page />
        </BaseWindow>
      );
    });

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
          {renderWindows()}
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
