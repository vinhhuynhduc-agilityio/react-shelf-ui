import { useLayoutEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";

// Components
import { DraggableWindow, PivotTableView, PivotTreeView } from "@/components";

// Constant
import { WINDOW_KEYS } from "@/constant";

// Store
import { useWindowStore } from "@/stores";

// Hook
import { usePivotQuery } from "@/hook";

const PivotPage = ({
  onClose,
  onMaximize,
  onMinimize,
  zIndex,
}: {
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
  zIndex: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // state
  const [currentView, setCurrentView] = useState<string>("table");
  const [tableHeight, setTableHeight] = useState<number>(0);

  // store
  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.PIVOT].isMinimized,
    }))
  );

  // hook
  const { data: pivot = [] } = usePivotQuery();

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.PIVOT) {
      setZIndexOrder(WINDOW_KEYS.PIVOT);
    }
  };

  useLayoutEffect(() => {
    const containerElement = containerRef.current;

    const updateHeight = () => {
      if (containerElement) {
        const buttonBarHeight = 44;
        const tableHeaderHeight = 109;
        const availableHeight =
          containerElement.clientHeight - buttonBarHeight - tableHeaderHeight;
        setTableHeight(Math.max(availableHeight, 100));
      }
    };

    const observer = new ResizeObserver(updateHeight);
    if (containerElement) {
      observer.observe(containerElement);
    }

    updateHeight();

    return () => {
      if (containerElement) {
        observer.unobserve(containerElement);
      }
    };
  }, []);

  return (
    <DraggableWindow
      windowKey={WINDOW_KEYS.PIVOT}
      src="/images/pivot.png"
      title="Pivot"
      hidden={isMinimized}
      zIndex={zIndex}
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      onMouseDown={handleMouseDown}
    >
      <div className="flex-1 h-full w-full overflow-hidden" ref={containerRef}>
        <div className="flex justify-end items-center space-x-2 mr-[10px] h-[44px]">
          <button
            onClick={() => setCurrentView("table")}
            className={clsx(
              currentView === "table"
                ? "bg-[#1ca1c1] text-white"
                : "bg-transparent text-[#475466]",
              "text-sm rounded-md h-[26px] w-[80px] font-medium cursor-pointer"
            )}
          >
            Table
          </button>
          <button
            onClick={() => setCurrentView("tree")}
            className={clsx(
              currentView === "tree"
                ? "bg-[#1ca1c1] text-white"
                : "bg-transparent text-[#475466]",
              "text-sm rounded-md h-[26px] w-[80px] font-medium cursor-pointer"
            )}
          >
            Tree
          </button>
          <button
            onClick={() => setCurrentView("chart")}
            className={clsx(
              currentView === "chart"
                ? "bg-[#1ca1c1] text-white"
                : "bg-transparent text-[#475466]",
              "text-sm rounded-md h-[26px] w-[80px] font-medium cursor-pointer"
            )}
          >
            Chart
          </button>
        </div>
        {currentView === "table" && (
          <PivotTableView pivot={pivot} tableHeight={tableHeight} />
        )}
        {currentView === "tree" && (
          <PivotTreeView pivot={pivot} tableHeight={tableHeight} />
        )}
        {currentView === "chart" && <div>Chart View Content</div>}
      </div>
    </DraggableWindow>
  );
};

export default PivotPage;
