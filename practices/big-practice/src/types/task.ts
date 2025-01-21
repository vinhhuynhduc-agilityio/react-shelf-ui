import { ProjectsData } from "@/types/project";
import { UserData } from "@/types/user";

interface optionDropdown {
  id: string;
  value: string;
};

export interface TaskFormValues {
  currency: number;
  taskName: string;
  project: optionDropdown;
  user: optionDropdown;
};

export interface TaskData {
  id: string;
  userId: string;
  projectId: string;
  taskName: string;
  startDate: string;
  completedDate: string;
  currency: number;
  status: boolean;
  projectName: string;
  fullName: string;
  tooltipShowDelay?: number;
};

export type StatusWithDate = {
  status: boolean;
  completedDate: string;
};

export type FieldValue =
  | string
  | number
  | boolean
  | ProjectsData
  | UserData
  | StatusWithDate;
