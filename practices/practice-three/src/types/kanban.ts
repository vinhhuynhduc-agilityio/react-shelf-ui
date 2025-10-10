export interface Task {
  id: string;
  title: string;
  tags: string[];
}

export interface BoardColumn {
  id: string;
  progressStatus: string;
  taskIds: string[];
  taskOrders: Record<string, number>;
}

export interface KanbanItem extends Task {
  id: string;
  progressStatus: string;
  order: number;
}
