interface WindowState {
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
}

export type WindowKey = "spreadsheet" | "filemanager" | "pivot" | "kanban";

export interface Windows {
  spreadsheet: WindowState;
  filemanager: WindowState;
  pivot: WindowState;
  kanban: WindowState;
}
