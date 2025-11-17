import { Layout } from "react-grid-layout";

// Constant
import { STATUS_TO_COLUMN } from "@/constant";

// Types
import { BoardColumn, Task } from "@/types";

export const generateLayout = (
  board: BoardColumn[],
  tasks: Record<string, Task>
): Layout[] => {
  const layout: Layout[] = [];
  board.forEach((column) => {
    const colIndex = STATUS_TO_COLUMN[column.progressStatus] ?? 0;
    const sortedTaskIds = [...column.taskIds].sort(
      (a, b) => (column.taskOrders[a] ?? 0) - (column.taskOrders[b] ?? 0)
    );
    sortedTaskIds.forEach((taskId, index) => {
      if (tasks[taskId]) {
        layout.push({
          i: taskId,
          x: colIndex,
          y: column.taskOrders[taskId] ?? index,
          w: 1,
          h: 1,
        });
      }
    });
  });
  return layout;
};

export const updateKanbanItems = (
  prevBoard: BoardColumn[],
  editingId: string,
  formData: { title: string; tags: string[]; progressStatus: string }
): BoardColumn[] => {
  const newBoard = [...prevBoard];
  const oldStatus = prevBoard.find((col) =>
    col.taskIds.includes(editingId)
  )?.progressStatus;
  const newStatus = formData.progressStatus;

  if (oldStatus && oldStatus !== newStatus) {
    // Remove from old column
    const oldColIndex = newBoard.findIndex(
      (col) => col.progressStatus === oldStatus
    );
    newBoard[oldColIndex].taskIds = newBoard[oldColIndex].taskIds.filter(
      (id) => id !== editingId
    );
    delete newBoard[oldColIndex].taskOrders[editingId];

    // Shift orders in old column
    newBoard[oldColIndex].taskIds.forEach((id, index) => {
      newBoard[oldColIndex].taskOrders[id] = index;
    });

    // Add to new column at end
    const newColIndex = newBoard.findIndex(
      (col) => col.progressStatus === newStatus
    );
    newBoard[newColIndex].taskIds.push(editingId);
    newBoard[newColIndex].taskOrders[editingId] =
      newBoard[newColIndex].taskIds.length - 1;
  }

  return newBoard;
};

export const syncLayoutToBoard = (
  newLayout: Layout[],
  currentBoard: BoardColumn[]
): BoardColumn[] => {
  const newBoard = [...currentBoard];
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

  return newBoard;
};

export const removeTaskFromBoard = (
  board: BoardColumn[],
  taskId: string
): BoardColumn[] => {
  const newBoard = [...board];
  const colIndex = newBoard.findIndex((col) => col.taskIds.includes(taskId));
  if (colIndex >= 0) {
    newBoard[colIndex].taskIds = newBoard[colIndex].taskIds.filter(
      (id) => id !== taskId
    );
    delete newBoard[colIndex].taskOrders[taskId];

    // Shift orders in column
    newBoard[colIndex].taskIds.forEach((id, idx) => {
      newBoard[colIndex].taskOrders[id] = idx;
    });
  }

  return newBoard;
};
