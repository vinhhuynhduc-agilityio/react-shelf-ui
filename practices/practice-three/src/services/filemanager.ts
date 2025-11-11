import { UseMutateFunction } from "@tanstack/react-query";

// constants
import { API_ENDPOINTS } from "@/constant";

// helpers
import { apiRequest } from "@/helpers";

// services
import { API_BASE_URL } from "@/services";

// Types
import { FileItem } from "@/types";

interface SaveAllFileFileManagerParams {
  listFile: FileItem[];
  addItem: UseMutateFunction<FileItem, Error, FileItem, unknown>;
  setFiles: (updater: (prev: FileItem[]) => FileItem[]) => void;
}

export const getFilemanagerData = async (): Promise<FileItem[]> =>
  apiRequest("GET", `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}`);

export const addFileItem = async (newItem: FileItem): Promise<FileItem> =>
  apiRequest("POST", `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}`, newItem);

export const saveAllFileFileManager = async ({
  listFile,
  addItem,
  setFiles,
}: SaveAllFileFileManagerParams) => {
  const results = await Promise.allSettled(
    listFile.map((file) => addItem(file))
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const failedId = listFile[index].id;
      setFiles((prev) => prev.filter((f) => f.id !== failedId));
      console.error(`Upload failed: ${listFile[index].name}`, result.reason);
    }
  });
};

export const renameFileItem = async (
  id: string,
  updatedItem: FileItem
): Promise<FileItem> =>
  apiRequest(
    "PUT",
    `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}/${id}`,
    updatedItem
  );

export const deleteFileItem = async (id: string): Promise<void> =>
  apiRequest("DELETE", `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}/${id}`);
