export interface WindowState {
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
}

export type WindowKey = "spreadsheet" | "fileManager" | "pivot" | "kanban";

export interface Windows {
  spreadsheet: WindowState;
  fileManager: WindowState;
  pivot: WindowState;
  kanban: WindowState;
}
