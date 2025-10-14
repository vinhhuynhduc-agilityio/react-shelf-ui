import { UseMutateFunction } from "@tanstack/react-query";

interface SaveKanbanBoardParams {
  board: BoardColumn[];
  updateBoardColumn: UseMutateFunction<
    BoardColumn,
    Error,
    BoardColumn,
    unknown
  >;
}

// helpers
import { apiRequest } from "@/helpers";

// services
import { API_BASE_URL } from "@/services";

// Types
import { BoardColumn, Task } from "@/types";

// constant
import { API_ENDPOINTS } from "@/constant";

/* Tasks */
export const getTasks = async (): Promise<Task[]> =>
  apiRequest("GET", `${API_BASE_URL}${API_ENDPOINTS.TASKS}`);

export const addTask = async (task: Omit<Task, "id">): Promise<Task> =>
  apiRequest("POST", `${API_BASE_URL}${API_ENDPOINTS.TASKS}`, task);

export const updateTask = async (task: Task): Promise<Task> =>
  apiRequest("PUT", `${API_BASE_URL}${API_ENDPOINTS.TASKS}/${task.id}`, task);

export const deleteTask = async (id: string): Promise<void> =>
  apiRequest("DELETE", `${API_BASE_URL}${API_ENDPOINTS.TASKS}/${id}`);

/* Board */
export const getBoard = async (): Promise<BoardColumn[]> =>
  apiRequest("GET", `${API_BASE_URL}${API_ENDPOINTS.BOARD}`);

export const updateBoardColumn = async (
  column: BoardColumn
): Promise<BoardColumn> =>
  apiRequest(
    "PUT",
    `${API_BASE_URL}${API_ENDPOINTS.BOARD}/${column.id}`,
    column
  );

export const saveKanbanBoard = async ({
  board,
  updateBoardColumn,
}: SaveKanbanBoardParams) => {
  await Promise.all(board.map((col) => updateBoardColumn(col)));
};
