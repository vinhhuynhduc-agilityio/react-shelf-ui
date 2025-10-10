// helpers
import { apiRequest } from "@/helpers";

// services
import { API_BASE_URL } from "@/services";

// Types
import { BoardColumn, Task } from "@/types";

/* Tasks */
export const getTasks = async (): Promise<Task[]> =>
  apiRequest("GET", `${API_BASE_URL}/tasks`);

export const addTask = async (task: Omit<Task, "id">): Promise<Task> =>
  apiRequest("POST", `${API_BASE_URL}/tasks`, task);

export const updateTask = async (task: Task): Promise<Task> =>
  apiRequest("PUT", `${API_BASE_URL}/tasks/${task.id}`, task);

export const deleteTask = async (id: string): Promise<void> =>
  apiRequest("DELETE", `${API_BASE_URL}/tasks/${id}`);

/* Board */
export const getBoard = async (): Promise<BoardColumn[]> =>
  apiRequest("GET", `${API_BASE_URL}/board`);

export const updateBoardColumn = async (
  column: BoardColumn
): Promise<BoardColumn> =>
  apiRequest("PUT", `${API_BASE_URL}/board/${column.id}`, column);
