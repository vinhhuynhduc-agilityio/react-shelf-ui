import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// constant
import { ERROR_MESSAGE, QUERY_KEY_FILE_MANAGER } from "@/constant";

// services
import { addFileItem, getFilemanagerData } from "@/services";

export const useFilemanagerQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY_FILE_MANAGER,
    queryFn: getFilemanagerData,
    meta: { errorMessage: ERROR_MESSAGE.FILE_MANAGER_FETCH_ERROR },
  });
};

export const useAddFileItem = () => {
  return useMutation({
    mutationFn: addFileItem,
  });
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
