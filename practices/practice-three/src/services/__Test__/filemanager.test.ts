import {
  getFilemanagerData,
  addFileItem,
  saveAllFileFileManager,
  renameFileItem,
  deleteFileItem,
} from "../filemanager";
import { apiRequest } from "@/helpers";
import { API_BASE_URL } from "@/services";
import { API_ENDPOINTS } from "@/constant";
import { FileItem } from "@/types";

jest.mock("@/helpers");

describe("FileManager Services", () => {
  const mockFileItem: FileItem = {
    id: "1",
    name: "test.txt",
    type: "code",
    parentId: "root",
    size: 100,
    imageUrl: "/images/code.svg",
  };

  const mockFileItems: FileItem[] = [
    mockFileItem,
    {
      id: "2",
      name: "folder",
      type: "folder",
      parentId: "root",
      size: null,
      imageUrl: "/images/folder.svg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFilemanagerData", () => {
    it("should call apiRequest with correct params and return file list", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockFileItems);

      // Act
      const result = await getFilemanagerData();

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}`
      );
      expect(result).toEqual(mockFileItems);
    });

    it("should return empty array if no files", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await getFilemanagerData();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("addFileItem", () => {
    it("should call apiRequest with POST and return new file item", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockFileItem);

      // Act
      const result = await addFileItem(mockFileItem);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}`,
        mockFileItem
      );
      expect(result).toEqual(mockFileItem);
    });

    it("should handle adding folder", async () => {
      // Arrange
      const folderItem: FileItem = {
        id: "folder-1",
        name: "new-folder",
        type: "folder",
        parentId: "root",
        size: null,
        imageUrl: "/images/folder.svg",
      };
      (apiRequest as jest.Mock).mockResolvedValue(folderItem);

      // Act
      const result = await addFileItem(folderItem);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        expect.stringContaining(API_ENDPOINTS.FILE_MANAGER),
        folderItem
      );
      expect(result.type).toBe("folder");
      expect(result.size).toBeNull();
    });
  });

  describe("saveAllFileFileManager", () => {
    it("should call addItem for each file in list", async () => {
      // Arrange
      const mockAddItem = jest.fn().mockResolvedValue(undefined);

      // Act
      await saveAllFileFileManager({
        listFile: mockFileItems,
        addItem: mockAddItem,
      });

      // Assert
      expect(mockAddItem).toHaveBeenCalledTimes(2);
      expect(mockAddItem).toHaveBeenCalledWith(mockFileItems[0]);
      expect(mockAddItem).toHaveBeenCalledWith(mockFileItems[1]);
    });

    it("should handle empty list", async () => {
      // Arrange
      const mockAddItem = jest.fn();

      // Act
      await saveAllFileFileManager({
        listFile: [],
        addItem: mockAddItem,
      });

      // Assert
      expect(mockAddItem).not.toHaveBeenCalled();
    });

    it("should handle multiple files concurrently", async () => {
      // Arrange
      const mockAddItem = jest.fn().mockResolvedValue(undefined);
      const largeFileList = Array.from({ length: 5 }, (_, i) => ({
        ...mockFileItem,
        id: `file-${i}`,
        name: `file-${i}.txt`,
      }));

      // Act
      await saveAllFileFileManager({
        listFile: largeFileList,
        addItem: mockAddItem,
      });

      // Assert
      expect(mockAddItem).toHaveBeenCalledTimes(5);
    });
  });

  describe("renameFileItem", () => {
    it("should call apiRequest with PUT and return updated file", async () => {
      // Arrange
      const updatedItem: FileItem = {
        ...mockFileItem,
        name: "renamed.txt",
      };
      (apiRequest as jest.Mock).mockResolvedValue(updatedItem);

      // Act
      const result = await renameFileItem("1", updatedItem);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "PUT",
        `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}/1`,
        updatedItem
      );
      expect(result.name).toBe("renamed.txt");
    });

    it("should preserve other properties when renaming", async () => {
      // Arrange
      const updatedItem = { ...mockFileItem, name: "newname.txt" };
      (apiRequest as jest.Mock).mockResolvedValue(updatedItem);

      // Act
      const result = await renameFileItem("1", updatedItem);

      // Assert
      expect(result.id).toBe("1");
      expect(result.type).toBe("code");
      expect(result.size).toBe(100);
      expect(result.name).toBe("newname.txt");
    });

    it("should handle renaming folder", async () => {
      // Arrange
      const folder = mockFileItems[1];
      const updatedFolder = { ...folder, name: "new-folder-name" };
      (apiRequest as jest.Mock).mockResolvedValue(updatedFolder);

      // Act
      const result = await renameFileItem(folder.id, updatedFolder);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "PUT",
        expect.stringContaining(`/${folder.id}`),
        updatedFolder
      );
      expect(result.type).toBe("folder");
    });
  });

  describe("deleteFileItem", () => {
    it("should call apiRequest with DELETE", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(undefined);

      // Act
      await deleteFileItem("1");

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "DELETE",
        `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}/1`
      );
    });

    it("should handle deleting file", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(undefined);

      // Act
      await deleteFileItem(mockFileItem.id);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "DELETE",
        expect.stringContaining(mockFileItem.id)
      );
    });

    it("should handle deleting folder", async () => {
      // Arrange
      const folderId = "folder-1";
      (apiRequest as jest.Mock).mockResolvedValue(undefined);

      // Act
      await deleteFileItem(folderId);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "DELETE",
        expect.stringContaining(folderId)
      );
    });
  });

  describe("Error Handling", () => {
    it("getFilemanagerData should throw error on API failure", async () => {
      // Arrange
      const error = new Error("API Error");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(getFilemanagerData()).rejects.toThrow("API Error");
    });

    it("addFileItem should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to add");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(addFileItem(mockFileItem)).rejects.toThrow("Failed to add");
    });

    it("deleteFileItem should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to delete");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(deleteFileItem("1")).rejects.toThrow("Failed to delete");
    });
  });

  describe("URL Construction", () => {
    it("should construct correct URLs for all operations", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockFileItem);
      const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.FILE_MANAGER}`;

      // Act
      await getFilemanagerData();
      await addFileItem(mockFileItem);
      await renameFileItem("1", mockFileItem);
      await deleteFileItem("1");

      // Assert
      expect(apiRequest).toHaveBeenNthCalledWith(1, "GET", baseUrl);
      expect(apiRequest).toHaveBeenNthCalledWith(
        2,
        "POST",
        baseUrl,
        mockFileItem
      );
      expect(apiRequest).toHaveBeenNthCalledWith(
        3,
        "PUT",
        `${baseUrl}/1`,
        mockFileItem
      );
      expect(apiRequest).toHaveBeenNthCalledWith(4, "DELETE", `${baseUrl}/1`);
    });
  });
});
