// constant
import { API_ENDPOINTS } from "@/constant";

// helpers
import { apiRequest } from "@/helpers";

// services
import { API_BASE_URL } from "@/services";

// types
import { Pivot } from "@/types";

export const getPivotData = async (): Promise<Pivot[]> => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.PIVOT}`;
  return apiRequest<null, Pivot[]>("GET", url);
};
