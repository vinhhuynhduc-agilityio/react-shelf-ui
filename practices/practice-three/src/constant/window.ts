export const WindowKeys = {
  SPREADSHEET: "spreadsheet",
  FILE_MANAGER: "fileManager",
  PIVOT: "pivot",
  KANBAN: "kanban",
} as const;

export const DESKTOP_ICONS = [
  {
    key: WindowKeys.SPREADSHEET,
    image: "images/spreadsheet.png",
    title: "Spreadsheet",
  },
  {
    key: WindowKeys.FILE_MANAGER,
    image: "images/file-manager.png",
    title: "File Manager",
  },
  { key: WindowKeys.PIVOT, image: "images/pivot.png", title: "Pivot" },
  { key: WindowKeys.KANBAN, image: "images/kanban.png", title: "Kanban" },
];
