import { useQuery, useMutation } from "@tanstack/react-query";

// services
import {
  getBoard,
  updateBoardColumn,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "@/services";

// constants
import { QUERY_KEY_BOARD, QUERY_KEY_TASKS } from "@/constant";

export const useBoardQuery = () =>
  useQuery({ queryKey: QUERY_KEY_BOARD, queryFn: getBoard });

export const useTasksQuery = () =>
  useQuery({ queryKey: QUERY_KEY_TASKS, queryFn: getTasks });

export const useAddTask = () => {
  return useMutation({
    mutationFn: addTask,
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: updateTask,
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: deleteTask,
  });
};

export const useUpdateBoardColumn = () => {
  return useMutation({
    mutationFn: updateBoardColumn,
  });
};
