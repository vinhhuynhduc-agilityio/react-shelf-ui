import { useState, useLayoutEffect, useRef } from "react";

// Components
import { Button, ChartView, PivotTableView, PivotTreeView } from "@/components";

// Hook
import { usePivotQuery } from "@/hook";

// Types
import { ViewType } from "@/types";

// Constant
import { VIEW } from "@/constant";

const PivotPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // state
  const [currentView, setCurrentView] = useState<ViewType>(VIEW.TREE);
  const [tableHeight, setTableHeight] = useState<number>(0);

  // hook
  const {
    data: pivot = [],
    isLoading,
    isError: isErrorPivot,
    error: pivotError,
  } = usePivotQuery();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      const buttonBarHeight = 44;
      const headerHeight = 74;
      const available = container.clientHeight - buttonBarHeight - headerHeight;
      setTableHeight(Math.max(available, 100));
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(container);
    updateHeight();

    return () => observer.disconnect();
  }, []);

  const renderViewButtons = () => (
    <div className="flex justify-end items-center space-x-2 mr-[10px] h-[44px]">
      {Object.values(VIEW).map((view) => (
        <Button
          key={view}
          variant="segment"
          active={currentView === view}
          onClick={() => setCurrentView(view)}
          className="w-[80px]"
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </Button>
      ))}
    </div>
  );

  const renderCurrentView = () => {
    const commonProps = {
      pivot,
      isLoading,
      isErrorPivot,
      pivotError,
    };

    switch (currentView) {
      case VIEW.TABLE:
        return <PivotTableView {...commonProps} tableHeight={tableHeight} />;
      case VIEW.TREE:
        return <PivotTreeView {...commonProps} tableHeight={tableHeight} />;
      case VIEW.CHART:
        return <ChartView {...commonProps} height={tableHeight + 74} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 h-full w-full overflow-hidden" ref={containerRef}>
      {renderViewButtons()}
      {renderCurrentView()}
    </div>
  );
};

export default PivotPage;
