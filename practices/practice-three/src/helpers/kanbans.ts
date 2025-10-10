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
