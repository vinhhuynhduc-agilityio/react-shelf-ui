import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { useShallow } from "zustand/react/shallow";

// Components
import { DraggableWindow, IconButton } from "@/components";

// Constant
import { STATUSES, WINDOW_KEYS } from "@/constant";

// Store
import { useWindowStore } from "@/stores";

// Hook
import { useKanbanQuery } from "@/hook";

// Types
import type { KanbanItem } from "@/types";

const rowHeight = 80;
const cols = STATUSES.length;

const KanbanPage = ({
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

  const [gridWidth, setGridWidth] = useState(0);
  const [layout, setLayout] = useState<Layout[]>([]);

  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.KANBAN].isMinimized,
    }))
  );

  // hook
  const { data: kanbans = [], isLoading } = useKanbanQuery();

  // Set layout from kanbans' status and order
  useEffect(() => {
    setLayout(
      kanbans.map((item) => ({
        i: item.id,
        x: STATUSES.indexOf(item.status),
        y: item.order,
        w: 1,
        h: 1,
      }))
    );
  }, [kanbans]);

  // Responsive width
  useLayoutEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setGridWidth(containerRef.current.clientWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.KANBAN) {
      setZIndexOrder(WINDOW_KEYS.KANBAN);
    }
  };

  const renderHeaders = () => (
    <div className="flex mt-[10px] ml-[10px] mr-[10px] h-[42px]">
      {STATUSES.map((status, idx) => (
        <div
          key={status}
          className={`
          flex flex-1 items-center pl-[12px] text-base font-medium text-[#475466] tracking-normal leading-[42px] cursor-pointer border border-[#DADEE0] bg-[#ffffff]
          ${idx < STATUSES.length - 1 ? "mr-[10px]" : ""}
        `}
        >
          {idx === 0 && (
            <IconButton
              icon="fa-solid fa-circle-plus fa-sm"
              onClick={() => {}}
              iconStyles="text-gray-500 mr-2"
            />
          )}
          {status}
        </div>
      ))}
    </div>
  );

  const renderItem = (item: KanbanItem) => (
    <div
      key={item.id}
      className="bg-white border-l-3 border-l-[#1CA1C1] flex flex-col cursor-pointer"
    >
      <div className="flex justify-between items-center min-h-[24px] overflow-hidden pt-[14px] pr-[8px] pb-[8px] pl-[12px]">
        <span className="text-[14px] font-medium leading-[20px]">
          {item.text}
        </span>
        <div className="flex justify-center items-center w-[32px] h-[32px] hover:shadow-[0_0_2px_1px_#1CA1C1] bg-[rgba(228,230,240,0.8)] rounded-full">
          <i className="fa-solid fa-user fa-lg text-[#94a1b3]" />
        </div>
      </div>
      <div className="flex justify-between pl-[8px] pr-[8px] mb-[6px] items-center">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
        <IconButton
          icon="fa-solid fa-pencil fa-xs"
          onClick={() => {}}
          iconStyles="text-[#94a1b3] hover:text-[#1CA1C1]"
        />
      </div>
    </div>
  );

  return (
    <DraggableWindow
      windowKey={WINDOW_KEYS.KANBAN}
      src="/images/kanban.png"
      title="Kanban"
      hidden={isMinimized}
      zIndex={zIndex}
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col bg-[#EBEDF0] overflow-hidden"
      >
        {renderHeaders()}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex-1 overflow-auto">
            <GridLayout
              className="layout"
              layout={layout}
              cols={cols}
              rowHeight={rowHeight}
              width={gridWidth}
              margin={[10, 10]}
              isDraggable
              isResizable={false}
              compactType="vertical"
              preventCollision={false}
              onLayoutChange={setLayout}
            >
              {kanbans.map((item) => renderItem(item))}
            </GridLayout>
          </div>
        )}
      </div>
    </DraggableWindow>
  );
};

export default KanbanPage;
