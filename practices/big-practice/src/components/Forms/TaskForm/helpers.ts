// types
import {
  TaskData,
} from '@/types';

const formatDropdownOptions = <T extends { id: string }>(
  data: T[],
  valueKey: keyof T
) =>
  data.map((item) => ({
    id: item.id,
    value: item[valueKey],
  }));

/**
 * Checks if a task name already exists in the task list.
 *
 * @param tasks - Array of existing tasks
 * @param value - New task name to check
 * @returns True if the task name already exists, otherwise false
 */
const isTaskDuplicate = (
  tasks: TaskData[],
  value: string
): boolean => {
  return tasks.some(
    task => task.taskName.toUpperCase() === value.toUpperCase()
  );
};

export {
  formatDropdownOptions,
  isTaskDuplicate
};
