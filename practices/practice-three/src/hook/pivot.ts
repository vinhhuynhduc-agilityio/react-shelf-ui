import { useQuery } from "@tanstack/react-query";

// constant
import { ERROR_MESSAGE, QUERY_KEY_PIVOT } from "@/constant";

// services
import { getPivotData } from "@/services";

export const usePivotQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY_PIVOT,
    queryFn: getPivotData,
    meta: { errorMessage: ERROR_MESSAGE.PIVOT_FETCH_ERROR },
  });
};
