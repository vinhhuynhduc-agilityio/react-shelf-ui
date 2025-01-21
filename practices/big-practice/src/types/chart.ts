
export interface FormattedDataTotalTasksCompleted {
  month: string;
  [year: number]: number;
};

export interface FormattedDataTotalTasksByProjects {
  projectName: string;
  [year: number]: number;
};
