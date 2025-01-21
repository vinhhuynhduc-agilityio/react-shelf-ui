import { apiRequest } from '@/services/apiRequest';
import { TaskData } from '@/types';
import { API_BASE_URL } from '@/config';
import { API_ROUTES } from '@/constant';

export const fetchTasks = async (): Promise<{ data: TaskData[] | null; error: Error | null }> => {
  try {
    const data = await apiRequest<TaskData[], TaskData[]>(
      'GET',
      `${API_BASE_URL}${API_ROUTES.TASKS}`
    );

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);

    return {
      data: null,
      error: error as Error
    };
  }
};

export const updateTask = async (id: string, taskData: TaskData): Promise<{ data: TaskData | null; error: Error | null }> => {
  try {
    const data = await apiRequest<TaskData, TaskData>(
      'PUT',
      `${API_BASE_URL}${API_ROUTES.TASKS}/${id}`,
      taskData
    );

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error("Failed to update tasks:", error);

    return {
      data: null,
      error: error as Error
    };
  }
};

export const createTask = async (newTask: TaskData): Promise<{ data: TaskData | null; error: Error | null }> => {
  try {
    const data = await apiRequest<TaskData, TaskData>(
      'POST',
      `${API_BASE_URL}${API_ROUTES.TASKS}`,
      newTask
    );

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error("Failed to create tasks:", error);

    return {
      data: null,
      error: error as Error
    };
  }
};
