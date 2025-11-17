import { useState, useLayoutEffect, useRef } from "react";

// Components
import { Button, ChartView, PivotTableView, PivotTreeView } from "@/components";

// Hook
import { usePivotQuery } from "@/hook";

const PivotPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // state
  const [currentView, setCurrentView] = useState<string>("tree");
  const [tableHeight, setTableHeight] = useState<number>(0);

  // hook
  const {
    data: pivot = [],
    isLoading,
    isError: isErrorPivot,
    error: pivotError,
  } = usePivotQuery();

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
    if (containerElement) observer.observe(containerElement);
    updateHeight();

    return () => {
      if (containerElement) observer.unobserve(containerElement);
    };
  }, []);

  return (
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
          isErrorPivot={isErrorPivot}
          pivotError={pivotError}
        />
      )}
      {currentView === "tree" && (
        <PivotTreeView
          pivot={pivot}
          tableHeight={tableHeight}
          isLoading={isLoading}
          isErrorPivot={isErrorPivot}
          pivotError={pivotError}
        />
      )}
      {currentView === "chart" && (
        <ChartView
          pivot={pivot}
          height={tableHeight + 74}
          isErrorPivot={isErrorPivot}
          pivotError={pivotError}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default PivotPage;
