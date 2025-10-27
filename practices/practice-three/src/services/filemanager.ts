// constants
import { API_ENDPOINTS } from "@/constant";

// helpers
import { apiRequest } from "@/helpers";

// services
import { API_BASE_URL } from "@/services";

// Types
import { FileItem } from "@/types";

export const getFilemanagerData = async (): Promise<FileItem[]> =>
  apiRequest("GET", `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}`);

export const addFileItem = async (newItem: FileItem): Promise<FileItem> =>
  apiRequest("POST", `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}`, newItem);
