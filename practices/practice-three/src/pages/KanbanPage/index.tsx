import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { useShallow } from "zustand/react/shallow";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

// Components
import { DraggableWindow, IconButton } from "@/components";

// Constant
import {
  QUERY_KEY_KANBAN,
  STATUS_TO_COLUMN,
  STATUSES,
  WINDOW_KEYS,
} from "@/constant";

// Store
import { useWindowStore } from "@/stores";

// Hook
import { useAddKanbanItem, useKanbanQuery } from "@/hook";

// Types
import type { KanbanItem } from "@/types";

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
  const queryClient = useQueryClient();

  // Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const canUpdateLayout = useRef(false);

  // State
  const [gridWidth, setGridWidth] = useState(0);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [kanbans, setKanbans] = useState<KanbanItem[]>([]);
  const [kanbansChanged, setKanbansChanged] = useState(false);

  // Store
  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.KANBAN].isMinimized,
    }))
  );

  // API
  const { data: kanbanData = [], isFetching, isSuccess } = useKanbanQuery();
  const { mutate: addKanbanItem } = useAddKanbanItem();

  // Initialize layout when data is available
  useEffect(() => {
    if (isSuccess) {
      setKanbans(kanbanData);
      const newLayout = kanbanData.map((item) => ({
        i: item.id,
        x: STATUS_TO_COLUMN[item.progressStatus],
        y: item.order,
        w: 1,
        h: 1,
      }));
      setLayout(newLayout);
    }
  }, [kanbanData, isSuccess]);

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

  useEffect(() => {
    return () => {
      // Invalidate the kanbans query if there are changes
      // when the component unmounts or dependencies change
      if (kanbansChanged) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY_KANBAN,
        });
      }
    };
  }, [kanbansChanged, queryClient]);

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.KANBAN) {
      setZIndexOrder(WINDOW_KEYS.KANBAN);
    }
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (canUpdateLayout.current) {
      setLayout(newLayout);
    }
  };

  const handleDragStop = () => {
    if (!canUpdateLayout.current) canUpdateLayout.current = true;
  };

  // Add new Kanban Item
  const handleAddItem = () => {
    const maxYInBacklog = layout
      .filter((item) => item.x === 0)
      .reduce((max, item) => Math.max(max, item.y), -1);
    const newY = maxYInBacklog + 1;
    const newItem: KanbanItem = {
      id: uuidv4(),
      text: `New Task ${newY + 1}`,
      tags: [],
      progressStatus: "New",
      order: newY,
    };

    setKanbans((prevKanbans) => [...prevKanbans, newItem]);
    setLayout((prevLayout) => [
      ...prevLayout,
      { i: newItem.id, x: 0, y: newY, w: 1, h: 1 },
    ]);
    setKanbansChanged(true);

    addKanbanItem(newItem);
  };

  // Render Headers (for each status)
  const renderHeaders = () => (
    <div className="flex mt-[10px] ml-[10px] mr-[10px] h-[42px]">
      {STATUSES.map((status, idx) => (
        <div
          key={status}
          className={`
          flex flex-1 items-center pl-[12px] text-base font-medium text-[#475466] tracking-normal leading-[42px] border border-[#DADEE0] bg-[#ffffff]
          ${idx < STATUSES.length - 1 ? "mr-[10px]" : ""}
        `}
        >
          {idx === 0 && (
            <IconButton
              icon="fa-solid fa-circle-plus fa-sm"
              onClick={handleAddItem}
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
      className="bg-white border-l-3 border-l-[#1CA1C1] flex flex-col cursor-pointer item-drag-handle"
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
            className="bg-[rgba(228,230,240,0.8)] text-[#475466] text-sm font-normal h-[26px] leading-[24px] px-2 py-0 rounded-[12px] mt-0 mr-2 mb-0.5 ml-0"
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
        {isFetching ? (
          <p>Loading...</p>
        ) : (
          <div className="flex-1 overflow-auto relative top-0">
            <GridLayout
              className="layout select-none"
              layout={layout}
              cols={STATUSES.length}
              rowHeight={80}
              width={gridWidth}
              margin={[10, 10]}
              isDraggable
              isResizable={false}
              compactType="vertical"
              preventCollision={false}
              onLayoutChange={handleLayoutChange}
              onDragStop={handleDragStop}
              draggableHandle=".item-drag-handle"
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
