import { useLayoutEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

// Components
import {
  Button,
  ChartView,
  DraggableWindow,
  PivotTableView,
  PivotTreeView,
} from "@/components";

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
  const [currentView, setCurrentView] = useState<string>("tree");
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
  const { data: pivot = [], isLoading } = usePivotQuery();

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
        const tableHeaderHeight = 74;
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
          <Button
            variant="segment"
            active={currentView === "table"}
            onClick={() => setCurrentView("table")}
            className="w-[80px]"
          >
            Table
          </Button>
          <Button
            variant="segment"
            active={currentView === "tree"}
            onClick={() => setCurrentView("tree")}
            className="w-[80px]"
          >
            Tree
          </Button>
          <Button
            variant="segment"
            active={currentView === "chart"}
            onClick={() => setCurrentView("chart")}
            className="w-[80px]"
          >
            Chart
          </Button>
        </div>
        {currentView === "table" && (
          <PivotTableView
            pivot={pivot}
            tableHeight={tableHeight}
            isLoading={isLoading}
          />
        )}
        {currentView === "tree" && (
          <PivotTreeView
            pivot={pivot}
            tableHeight={tableHeight}
            isLoading={isLoading}
          />
        )}
        {currentView === "chart" && (
          <ChartView pivot={pivot} height={tableHeight + 74} />
        )}
      </div>
    </DraggableWindow>
  );
};

export default PivotPage;
