import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { useShallow } from "zustand/react/shallow";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

// Components
import {
  Button,
  DraggableWindow,
  IconButton,
  Modal,
  MultiSelect,
  SingleSelect,
} from "@/components";

// Constant
import {
  QUERY_KEY_BOARD,
  QUERY_KEY_TASKS,
  STATUSES,
  STATUS_TO_COLUMN,
  WINDOW_KEYS,
} from "@/constant";

// Store
import { useWindowStore } from "@/stores";

// Hook
import {
  useAddTask,
  useDeleteTask,
  useUpdateTask,
  useBoardQuery,
  useTasksQuery,
  useUpdateBoardColumn,
} from "@/hook";

// Types
import type { BoardColumn, Task } from "@/types";

// Helpers
import { generateLayout, updateKanbanItems } from "@/helpers";

// Services
import { saveKanbanBoard } from "@/services";

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

  // Refs for layout and drag handling
  const containerRef = useRef<HTMLDivElement>(null);
  const canUpdateLayout = useRef(false);
  const skipSyncOnLayoutChange = useRef(false);

  // State management for grid and data
  const [gridWidth, setGridWidth] = useState(0);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [board, setBoard] = useState<BoardColumn[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [hasChanged, setHasChanged] = useState(false);

  // Modal state for editing tasks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    tags: string[];
    progressStatus: string;
  }>({
    title: "",
    tags: [],
    progressStatus: "",
  });

  // Refs for unmount cleanup and flags
  const hasChangedRef = useRef(hasChanged);

  // Store for window management
  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.KANBAN].isMinimized,
    }))
  );

  // API hooks for data fetching and mutations
  const { data: boardData = [], isFetching: isFetchingBoard } = useBoardQuery();
  const { data: tasksData = [], isFetching: isFetchingTasks } = useTasksQuery();
  const { mutate: addTask } = useAddTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: updateBoardColumn } = useUpdateBoardColumn();

  // Update refs when state changes
  useEffect(() => {
    hasChangedRef.current = hasChanged;
  }, [hasChanged]);

  // Initialize state from fetched data
  useEffect(() => {
    const newTasks = tasksData.reduce(
      (acc, task) => ({ ...acc, [task.id]: task }),
      {}
    );
    setBoard(boardData);
    setTasks(newTasks);
    setLayout(generateLayout(boardData, newTasks));
  }, [boardData, tasksData]);

  // Invalidate queries on unmount if changes occurred
  useEffect(() => {
    return () => {
      if (hasChangedRef.current) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY_BOARD });
        queryClient.invalidateQueries({ queryKey: QUERY_KEY_TASKS });
      }
    };
  }, [queryClient]);

  // Handle window resize for responsive grid width
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

  // Bring window to front on mouse down
  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.KANBAN) {
      setZIndexOrder(WINDOW_KEYS.KANBAN);
    }
  };

  // Handle layout changes from drag and drop
  const handleLayoutChange = (newLayout: Layout[]) => {
    // Skip if change is from add/edit/remove actions
    if (skipSyncOnLayoutChange.current) {
      skipSyncOnLayoutChange.current = false;

      return;
    }

    // Update only for reordering (drag & drop)
    if (canUpdateLayout.current) {
      setLayout(newLayout);

      // Sync board with new layout
      const newBoard = [...board];
      const groups: Record<number, { id: string; y: number }[]> = {};

      newLayout.forEach((item) => {
        if (!groups[item.x]) groups[item.x] = [];
        groups[item.x].push({ id: item.i, y: item.y });
      });

      Object.entries(groups).forEach(([colStr, items]) => {
        const col = parseInt(colStr);
        const sortedItems = items.sort((a, b) => a.y - b.y);
        const sortedIds = sortedItems.map((i) => i.id);
        const colIndex = newBoard.findIndex(
          (c) => STATUS_TO_COLUMN[c.progressStatus] === col
        );
        if (colIndex >= 0) {
          newBoard[colIndex].taskIds = sortedIds;
          newBoard[colIndex].taskOrders = {};
          sortedIds.forEach((id, index) => {
            newBoard[colIndex].taskOrders[id] = index;
          });
        }
      });

      // Clear empty columns
      newBoard.forEach((col, colIndex) => {
        const colNum = STATUS_TO_COLUMN[col.progressStatus];
        if (!(colNum in groups)) {
          newBoard[colIndex].taskIds = [];
          newBoard[colIndex].taskOrders = {};
        }
      });

      setBoard(newBoard);
      setHasChanged(true);

      // only update api when drag & drop
      saveKanbanBoard({
        board: newBoard,
        updateBoardColumn,
      });
    }
  };

  // Enable layout update after drag stop
  const handleDragStop = () => {
    if (!canUpdateLayout.current) canUpdateLayout.current = true;
  };

  // Add new task to board
  const handleAddItem = () => {
    const newId = uuidv4();
    const newTask: Task = {
      id: newId,
      title: `New Task ${board[0].taskIds.length + 1}`,
      tags: [],
    };

    const prevTasks = { ...tasks };
    const prevBoard = [...board];
    const prevLayout = [...layout];

    setTasks((prev) => ({ ...prev, [newId]: newTask }));
    setBoard((prev) => {
      const newBoard = [...prev];
      newBoard[0].taskIds.push(newId);
      newBoard[0].taskOrders[newId] = newBoard[0].taskIds.length - 1;
      const updatedTasks = { ...tasks, [newId]: newTask };
      skipSyncOnLayoutChange.current = true;

      setLayout(generateLayout(newBoard, updatedTasks));
      setHasChanged(true);

      return newBoard;
    });

    addTask(newTask, {
      onError: () => {
        // Revert on error
        setTasks(prevTasks);
        setBoard(prevBoard);
        setLayout(prevLayout);
      },
    });
  };

  // Open modal for task editing
  const handleEditItem = (id: string) => {
    const task = tasks[id];
    const status =
      board.find((col) => col.taskIds.includes(id))?.progressStatus || "";
    setEditingId(id);
    setFormData({
      title: task.title,
      tags: task.tags,
      progressStatus: status,
    });
    setIsModalOpen(true);
  };

  // Handle form input changes in modal
  const handleFormChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save edited task
  const handleSave = () => {
    if (editingId) {
      const updatedTask: Task = {
        ...tasks[editingId],
        title: formData.title,
        tags: formData.tags as string[],
      };

      const prevTasks = { ...tasks };
      const prevBoard = [...board];
      const prevLayout = [...layout];

      setTasks((prev) => ({ ...prev, [editingId]: updatedTask }));
      setBoard((prev) => {
        const newBoard = updateKanbanItems(prev, editingId, formData);
        const updatedTasks = { ...tasks, [editingId]: updatedTask };
        skipSyncOnLayoutChange.current = true;

        setLayout(generateLayout(newBoard, updatedTasks));
        setHasChanged(true);

        return newBoard;
      });

      updateTask(updatedTask, {
        onError: () => {
          // Revert on error
          setTasks(prevTasks);
          setBoard(prevBoard);
          setLayout(prevLayout);
        },
      });
    }
    setIsModalOpen(false);
  };

  // Remove task
  const handleRemove = () => {
    if (editingId) {
      const prevTasks = { ...tasks };
      const prevBoard = [...board];
      const prevLayout = [...layout];

      const newBoard = [...board];
      const colIndex = newBoard.findIndex((col) =>
        col.taskIds.includes(editingId)
      );
      if (colIndex >= 0) {
        newBoard[colIndex].taskIds = newBoard[colIndex].taskIds.filter(
          (id) => id !== editingId
        );
        delete newBoard[colIndex].taskOrders[editingId];

        // Shift orders in column
        newBoard[colIndex].taskIds.forEach((id, index) => {
          newBoard[colIndex].taskOrders[id] = index;
        });
      }

      setBoard(newBoard);
      setHasChanged(true);

      setTasks((prev) => {
        const newTasks = { ...prev };
        delete newTasks[editingId];
        skipSyncOnLayoutChange.current = true;

        setLayout(generateLayout(newBoard, newTasks));

        return newTasks;
      });

      deleteTask(editingId, {
        onError: () => {
          // Revert on error
          setTasks(prevTasks);
          setBoard(prevBoard);
          setLayout(prevLayout);
        },
      });
    }
    setIsModalOpen(false);
  };

  // Render column headers
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

  // Render individual task item
  const renderItem = (task: Task) => (
    <div
      key={task.id}
      className="bg-white border-l-3 border-l-[#1CA1C1] flex flex-col cursor-pointer item-drag-handle"
    >
      <div className="flex justify-between items-center min-h-[24px] overflow-hidden pt-[14px] pr-[8px] pb-[8px] pl-[12px]">
        <span className="text-[14px] font-medium leading-[20px]">
          {task.title}
        </span>
        <div className="flex justify-center items-center w-[32px] h-[32px] hover:shadow-[0_0_2px_1px_#1CA1C1] bg-[rgba(228,230,240,0.8)] rounded-full">
          <i className="fa-solid fa-user fa-lg text-[#94a1b3]" />
        </div>
      </div>
      <div className="flex justify-between pl-[8px] pr-[8px] mb-[6px] items-center">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="bg-[rgba(228,230,240,0.8)] text-[#475466] text-sm font-normal h-[26px] leading-[24px] px-2 py-0 rounded-[12px] mt-0 mr-2 mb-0.5 ml-0"
          >
            {tag}
          </span>
        ))}
        <IconButton
          icon="fa-solid fa-pencil fa-xs"
          onMouseDown={() => handleEditItem(task.id)}
          iconStyles="text-[#94a1b3] hover:text-[#1CA1C1]"
        />
      </div>
    </div>
  );

  // Modal content
  const modalBody = (
    <div className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <textarea
          value={formData.title}
          onChange={(e) => handleFormChange("title", e.target.value)}
          className="w-full border border-[#DADEE0] rounded-[2px] px-2 py-1 text-sm text-[#475466] h-[70px] focus:outline-none focus:border-[#1CA1C1]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <MultiSelect
          options={["webix", "jet", "easy"]}
          selected={formData.tags}
          onChange={(tags) => handleFormChange("tags", tags)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <SingleSelect
          options={["New", "Work", "Test", "Done"]}
          value={formData.progressStatus}
          onChange={(status) => handleFormChange("progressStatus", status)}
          className="h-[32px]"
        />
      </div>
      <div className="flex justify-between">
        <Button variant="success" onClick={handleRemove}>
          Remove
        </Button>
        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );

  const isFetching = isFetchingBoard || isFetchingTasks;

  return (
    <>
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
                {Object.values(tasks).map((task) => renderItem(task))}
              </GridLayout>
            </div>
          )}
        </div>
      </DraggableWindow>
      <Modal
        isOpen={isModalOpen}
        title="Edit card"
        onClose={() => setIsModalOpen(false)}
      >
        {modalBody}
      </Modal>
    </>
  );
};

export default KanbanPage;
