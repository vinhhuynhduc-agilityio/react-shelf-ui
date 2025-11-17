import type { ComponentType } from "react";

// pages
import {
  SpreadsheetPage,
  PivotPage,
  KanbanPage,
  FilemanagerPage,
} from "@/pages";

// types
import type { WindowKey } from "@/types";

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

export interface WindowConfig {
  title: string;
  src: string;
  Page: ComponentType;
}

export const WINDOW_CONFIGS: Record<WindowKey, WindowConfig> = {
  spreadsheet: {
    title: "Spreadsheet",
    src: "/images/spreadsheet.png",
    Page: SpreadsheetPage,
  },
  pivot: {
    title: "Pivot",
    src: "/images/pivot.png",
    Page: PivotPage,
  },
  kanban: {
    title: "Kanban",
    src: "/images/kanban.png",
    Page: KanbanPage,
  },
  filemanager: {
    title: "File Manager",
    src: "/images/file-manager.png",
    Page: FilemanagerPage,
  },
};
