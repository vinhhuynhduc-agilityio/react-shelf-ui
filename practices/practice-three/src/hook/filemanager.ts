import { useQuery } from "@tanstack/react-query";

// constant
import { ERROR_MESSAGE, QUERY_KEY_FILE_MANAGER } from "@/constant";

// services
import { getFilemanagerData } from "@/services";

export const useFilemanagerQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY_FILE_MANAGER,
    queryFn: getFilemanagerData,
    meta: { errorMessage: ERROR_MESSAGE.FILE_MANAGER_FETCH_ERROR },
  });
};
