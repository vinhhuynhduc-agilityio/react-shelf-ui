// constant
import { API_ENDPOINTS } from "@/constant";

// helpers
import { apiRequest } from "@/helpers";

// services
import { API_BASE_URL } from "@/services";

// types
import { KanbanItem } from "@/types";

export const getKanbanData = async (): Promise<KanbanItem[]> => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.KANBANS}`;
  return apiRequest<null, KanbanItem[]>("GET", url);
};

export const addKanbanItem = async (item: KanbanItem) => {
  return apiRequest<KanbanItem, KanbanItem>(
    "POST",
    `${API_BASE_URL}${API_ENDPOINTS.KANBANS}`,
    item
  );
};
