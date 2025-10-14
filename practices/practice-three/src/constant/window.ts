export const WINDOW_KEYS = {
  SPREADSHEET: "spreadsheet",
  FILE_MANAGER: "filemanager",
  PIVOT: "pivot",
  KANBAN: "kanban",
} as const;

export const DESKTOP_ICONS = [
  {
    key: WINDOW_KEYS.SPREADSHEET,
    image: "images/spreadsheet.png",
    title: "Spreadsheet",
  },
  {
    key: WINDOW_KEYS.FILE_MANAGER,
    image: "images/file-manager.png",
    title: "File Manager",
  },
  { key: WINDOW_KEYS.PIVOT, image: "images/pivot.png", title: "Pivot" },
  { key: WINDOW_KEYS.KANBAN, image: "images/kanban.png", title: "Kanban" },
];
