import { useMutation, useQuery } from "@tanstack/react-query";

// constant
import { ERROR_MESSAGE, QUERY_KEY_KANBAN } from "@/constant";

// services
import { addKanbanItem, getKanbanData } from "@/services";

export const useKanbanQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY_KANBAN,
    queryFn: getKanbanData,
    meta: { errorMessage: ERROR_MESSAGE.KANBAN_FETCH_ERROR },
  });
};

export const useAddKanbanItem = () => {
  return useMutation({
    mutationFn: addKanbanItem,
  });
};
