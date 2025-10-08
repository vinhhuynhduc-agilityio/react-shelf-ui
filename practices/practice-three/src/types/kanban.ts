export interface KanbanItem {
  id: string;
  text: string;
  tags: string[];
  progressStatus: string;
  order: number;
}

export interface KanbanColumn {
  text: string;
  tags: string[];
  progressStatus: string;
}
