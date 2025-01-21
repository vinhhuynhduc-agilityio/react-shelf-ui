import { createContext } from 'react';

import {
  TaskData,
} from '@/types';

interface TasksContextType {
  tasks: TaskData[];
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>;
}

export const TasksContext = createContext<TasksContextType | null>(null);
