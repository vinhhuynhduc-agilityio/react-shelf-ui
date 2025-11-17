import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";

// Components
import {
  Button,
  ErrorAlert,
  IconButton,
  Modal,
  MultiSelect,
  SingleSelect,
} from "@/components";

// Constants
import { QUERY_KEY_BOARD, QUERY_KEY_TASKS, STATUSES } from "@/constant";

// Hooks
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
import {
  generateLayout,
  removeTaskFromBoard,
  syncLayoutToBoard,
  updateKanbanItems,
  updateLayoutSafely,
} from "@/helpers";

// Services
import { saveKanbanBoard } from "@/services";

const KanbanPage = () => {
  const queryClient = useQueryClient();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canUpdateLayout = useRef(false);
  const skipSyncOnLayoutChange = useRef(false);
  const hasChangedRef = useRef(false);

  // State
  const [gridWidth, setGridWidth] = useState(0);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [board, setBoard] = useState<BoardColumn[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [hasChanged, setHasChanged] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    tags: [] as string[],
    progressStatus: "",
  });

  // API
  const {
    data: boardData = [],
    isFetching: isFetchingBoard,
    isError: isErrorBoard,
    error: boardError,
  } = useBoardQuery();

  const {
    data: tasksData = [],
    isFetching: isFetchingTasks,
    isError: isErrorTasks,
    error: tasksError,
  } = useTasksQuery();

  const { mutate: addTask } = useAddTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: updateBoardColumn } = useUpdateBoardColumn();

  const isFetching = isFetchingBoard || isFetchingTasks;
  const hasError = isErrorBoard || isErrorTasks;
  const isReady = !isFetching && !hasError;

  // Sync ref with state
  useEffect(() => {
    hasChangedRef.current = hasChanged;
  }, [hasChanged]);

  // Initialize data from API
  useEffect(() => {
    const newTasks = tasksData.reduce(
      (acc, task) => ({ ...acc, [task.id]: task }),
      {} as Record<string, Task>
    );
    setBoard(boardData);
    setTasks(newTasks);
    setLayout(generateLayout(boardData, newTasks));
  }, [boardData, tasksData]);

  // Invalidate queries on unmount if changed
  useEffect(() => {
    return () => {
      if (hasChangedRef.current) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY_BOARD });
        queryClient.invalidateQueries({ queryKey: QUERY_KEY_TASKS });
      }
    };
  }, [queryClient]);

  // Handle container resize
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

  // Layout change (drag & drop reordering)
  const handleLayoutChange = (newLayout: Layout[]) => {
    if (skipSyncOnLayoutChange.current) {
      skipSyncOnLayoutChange.current = false;
      return;
    }

    if (!canUpdateLayout.current) return;

    setLayout(newLayout);

    const newBoard = syncLayoutToBoard(newLayout, board);
    setBoard(newBoard);
    setHasChanged(true);
    saveKanbanBoard({ board: newBoard, updateBoardColumn });
  };

  const handleDragStop = () => {
    if (!canUpdateLayout.current) canUpdateLayout.current = true;
  };

  // Add new task
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
        setTasks(prevTasks);
        setBoard(prevBoard);
        setLayout(prevLayout);
      },
    });
  };

  // Edit task
  const handleEditItem = (id: string) => {
    const task = tasks[id];
    const status =
      board.find((col) => col.taskIds.includes(id))?.progressStatus || "";
    setEditingId(id);
    setFormData({ title: task.title, tags: task.tags, progressStatus: status });
    setIsModalOpen(true);
  };

  const handleFormChange = (
    field: keyof typeof formData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!editingId) return;

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
        setTasks(prevTasks);
        setBoard(prevBoard);
        setLayout(prevLayout);
      },
    });

    setIsModalOpen(false);
  };

  const handleRemove = () => {
    if (!editingId) return;

    const prevTasks = { ...tasks };
    const prevBoard = [...board];
    const prevLayout = [...layout];

    const newBoard = removeTaskFromBoard(board, editingId);

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
        setTasks(prevTasks);
        setBoard(prevBoard);
        setLayout(prevLayout);
      },
    });

    setIsModalOpen(false);
  };

  const renderHeaders = () => (
    <div className="flex mt-[10px] ml-[10px] mr-[10px] h-[42px] gap-[10px]">
      {STATUSES.map((status, idx) => (
        <div
          key={status}
          className="flex flex-1 items-center pl-[12px] text-base font-medium text-[#475466] tracking-normal leading-[42px] border border-[#DADEE0] bg-[#ffffff] truncate"
        >
          {idx === 0 && (
            <IconButton
              onClick={handleAddItem}
              iconStyles="fa-solid fa-circle-plus fa-sm text-gray-500 mr-2"
            />
          )}
          {status}
        </div>
      ))}
    </div>
  );

  const renderItem = (task: Task) => (
    <div
      key={task.id}
      className="bg-white border-l-3 border-l-[#1CA1C1] flex flex-col cursor-pointer item-drag-handle"
    >
      <div className="flex justify-between items-center min-h-[24px] overflow-hidden pt-[14px] pr-[8px] pb-[8px] pl-[12px] w-full">
        <p className="flex-1 min-w-0 text-[14px] font-medium leading-[20px] truncate pr-[48px]">
          {task.title}
        </p>
        <div className="flex justify-center items-center w-[32px] h-[32px] absolute right-[8px] hover:shadow-[0_0_2px_1px_#1CA1C1] bg-[rgba(228,230,240,0.8)] rounded-full">
          <i className="fa-solid fa-user fa-lg text-[#94a1b3]" />
        </div>
      </div>
      <div className="flex justify-between pl-[8px] pr-[8px] mb-[6px] items-center truncate">
        <div className="flex items-center gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[rgba(228,230,240,0.8)] text-[#475466] text-sm font-normal h-[26px] leading-[24px] px-2 py-0 rounded-[12px] mt-0 mr-1 mb-0.5 ml-0"
            >
              {tag}
            </span>
          ))}
        </div>
        <IconButton
          onMouseDown={() => handleEditItem(task.id)}
          iconStyles="fa-solid fa-pencil fa-xs text-[#94a1b3] hover:text-[#1CA1C1]"
        />
      </div>
    </div>
  );

  const renderModalBody = () => (
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

  const renderLoading = () => (
    <div className="w-full h-full flex justify-center items-center">
      <Spin spinning={isFetching} />
    </div>
  );

  const renderError = () => (
    <ErrorAlert
      title="Failed to load kanban data"
      centerScreen
      errors={[
        ...(isErrorBoard && boardError ? [boardError.message] : []),
        ...(isErrorTasks && tasksError ? [tasksError.message] : []),
      ]}
    />
  );

  const renderContent = () => (
    <div className="flex-1 overflow-x-hidden relative top-0">
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
        {Object.values(tasks).map(renderItem)}
      </GridLayout>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col bg-[#EBEDF0] overflow-hidden"
    >
      {renderHeaders()}
      {isFetching && renderLoading()}
      {hasError && renderError()}
      {isReady && renderContent()}

      <Modal
        isOpen={isModalOpen}
        title="Edit card"
        onClose={() => setIsModalOpen(false)}
      >
        {renderModalBody()}
      </Modal>
    </div>
  );
};

export default KanbanPage;
