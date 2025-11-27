import {
  getPreviewImageSrc,
  formatSize,
  getLocation,
  getBasicInfo,
  mapExtension,
  createNewItem,
  getBreadcrumbPath,
  getPathIds,
  buildFileTree,
  getFileTreeData,
  getAllChildFolderIds,
  getFilteredItems,
  parseFolderStructure,
  getDescendantIds,
  checkDuplicateName,
  checkDuplicateNameForRename,
  checkDuplicateNameForAdd,
  createFileItem,
  generateBase64Image,
} from "../filemanager";
import type { FileItem, FormData } from "@/types";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";

jest.mock("uuid");
jest.mock("html2canvas");

const mockFiles: FileItem[] = [
  {
    id: "root",
    name: "My Files",
    type: "folder",
    size: null,
    parentId: null,
    imageUrl: "/images/folder-detail-placeholder.svg",
  },
  {
    id: "code",
    name: "Code",
    type: "folder",
    size: null,
    parentId: "root",
    imageUrl: "/images/folder-detail-placeholder.svg",
  },
  {
    id: "file1",
    name: "index.js",
    type: "code",
    size: 1024,
    parentId: "code",
    imageUrl: "/images/code-placeholder-image.svg",
  },
  {
    id: "file2",
    name: "image.jpg",
    type: "image",
    size: 2048,
    parentId: "code",
    imageUrl: "/images/file-placeholder-image.svg",
  },
];

describe("filemanager helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPreviewImageSrc", () => {
    it("returns placeholder when item is null", () => {
      const result = getPreviewImageSrc(null);
      expect(result).toBe("/images/folder-placeholder-image.svg");
    });

    it("returns imageUrl from item", () => {
      const result = getPreviewImageSrc(mockFiles[2]);
      expect(result).toBe("/images/code-placeholder-image.svg");
    });

    it("returns invalid image when item has no imageUrl", () => {
      const item: FileItem = { ...mockFiles[0], imageUrl: "" };
      const result = getPreviewImageSrc(item);
      expect(result).toBe("/images/invalid-image.svg");
    });
  });

  describe("formatSize", () => {
    it("returns 0 B when size is null", () => {
      expect(formatSize(null)).toBe("0 B");
    });

    it("formats bytes correctly", () => {
      expect(formatSize(512)).toBe("512 B");
    });

    it("formats kilobytes correctly", () => {
      expect(formatSize(2048)).toBe("2.0 KB");
    });

    it("formats megabytes correctly", () => {
      expect(formatSize(1024 * 1024)).toBe("1.0 MB");
    });

    it("handles edge case at KB boundary", () => {
      expect(formatSize(1000)).toBe("1.0 KB");
    });
  });

  describe("getLocation", () => {
    it("returns root path when no item", () => {
      const result = getLocation(mockFiles, "code", null);
      expect(result).toBe("/");
    });

    it("returns root path when no selectedFolder", () => {
      const result = getLocation(mockFiles, null, mockFiles[2]);
      expect(result).toBe("/");
    });

    it("returns correct location path", () => {
      const result = getLocation(mockFiles, "code", mockFiles[2]);
      expect(result).toBe("/Code");
    });
  });

  describe("getBasicInfo", () => {
    it("returns basic info array with type and date", () => {
      const result = getBasicInfo(mockFiles[2], mockFiles, "code");

      expect(result).toContainEqual(expect.objectContaining({ label: "Type" }));
      expect(result).toContainEqual(expect.objectContaining({ label: "Date" }));
      expect(result).toContainEqual(expect.objectContaining({ label: "Size" }));
      expect(result).toContainEqual(
        expect.objectContaining({ label: "Location" })
      );
    });

    it("excludes size when file has no size", () => {
      const result = getBasicInfo(mockFiles[0], mockFiles, "root");
      expect(result).not.toContainEqual(
        expect.objectContaining({ label: "Size" })
      );
    });
  });

  describe("mapExtension", () => {
    it("maps code extensions correctly", () => {
      expect(mapExtension("js")).toEqual({
        type: "code",
        imageUrl: "/images/blank-white-image.webp",
      });
    });

    it("maps image extensions correctly", () => {
      const result = mapExtension("jpg");
      expect(result.type).toBe("image");
    });

    it("maps pdf extension correctly", () => {
      const result = mapExtension("pdf");
      expect(result.type).toBe("document");
      expect(result.imageUrl).toBe("/images/pdf-placeholder-image.svg");
    });

    it("returns default for unknown extension", () => {
      const result = mapExtension("unknown");
      expect(result.type).toBe("file");
      expect(result.imageUrl).toBe("/images/invalid-image.svg");
    });
  });

  describe("createNewItem", () => {
    it("creates folder item", () => {
      (uuidv4 as jest.Mock).mockReturnValue("new-id");

      const data: FormData = {
        name: "New Folder",
      };
      const result = createNewItem("addFolder", data, "code");

      expect(result).toEqual({
        id: "new-id",
        name: "New Folder",
        type: "folder",
        parentId: "code",
        size: null,
        imageUrl: "/images/folder-detail-placeholder.svg",
      });
    });

    it("creates file item with extension mapping", () => {
      (uuidv4 as jest.Mock).mockReturnValue("new-file-id");

      const data: FormData = {
        name: "script.js",
      };
      const result = createNewItem("addFile", data, "code");

      expect(result.type).toBe("code");
      expect(result.name).toBe("script.js");
    });

    it("defaults to addFile when addType is null", () => {
      (uuidv4 as jest.Mock).mockReturnValue("default-id");

      const data: FormData = { name: "file.txt" };
      const result = createNewItem(null, data, "code");

      expect(result.type).not.toBe("folder");
    });
  });

  describe("getBreadcrumbPath", () => {
    it("returns breadcrumb path from file to root", () => {
      const result = getBreadcrumbPath(mockFiles, "code");

      expect(result).toEqual([
        { id: "root", name: "My Files" },
        { id: "code", name: "Code" },
      ]);
    });

    it("returns root path for root folder", () => {
      const result = getBreadcrumbPath(mockFiles, "root");

      expect(result).toEqual([{ id: "root", name: "My Files" }]);
    });
  });

  describe("getPathIds", () => {
    it("returns path IDs from folder to root", () => {
      const result = getPathIds(mockFiles, "code");

      expect(result).toEqual(["root", "code"]);
    });

    it("returns only root for root folder", () => {
      const result = getPathIds(mockFiles, "root");

      expect(result).toEqual(["root"]);
    });
  });

  describe("buildFileTree", () => {
    it("builds tree structure with folder children", () => {
      const result = buildFileTree(mockFiles, "root");

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe("code");
      expect(result[0].children).toHaveLength(0);
    });

    it("returns empty array when no folders", () => {
      const result = buildFileTree(mockFiles, "nonexistent");

      expect(result).toEqual([]);
    });
  });

  describe("getFileTreeData", () => {
    it("returns tree with My Files root node", () => {
      const result = getFileTreeData(mockFiles);

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe("root");
      expect(result[0].children).toBeDefined();
    });
  });

  describe("getAllChildFolderIds", () => {
    it("returns all descendant folder IDs", () => {
      const result = getAllChildFolderIds(mockFiles, "root");

      expect(result).toContain("code");
    });

    it("returns empty array when no descendants", () => {
      const result = getAllChildFolderIds(mockFiles, "file1");

      expect(result).toEqual([]);
    });
  });

  describe("getFilteredItems", () => {
    it("returns direct children without search query", () => {
      const result = getFilteredItems(
        mockFiles,
        "code",
        "",
        getAllChildFolderIds
      );

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(
        expect.objectContaining({ id: "file1", key: "file1" })
      );
      expect(result).toContainEqual(
        expect.objectContaining({ id: "file2", key: "file2" })
      );
    });

    it("filters items by search query", () => {
      const result = getFilteredItems(
        mockFiles,
        "code",
        "index",
        getAllChildFolderIds
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("index.js");
    });

    it("searches case-insensitively", () => {
      const result = getFilteredItems(
        mockFiles,
        "code",
        "IMAGE",
        getAllChildFolderIds
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("image.jpg");
    });
  });

  describe("parseFolderStructure", () => {
    it("parses folder structure from FileList", () => {
      const mockFileList = [
        { webkitRelativePath: "root/subfolder/file.js" },
        { webkitRelativePath: "root/subfolder/sub2/file2.js" },
      ] as unknown as FileList;

      const result = parseFolderStructure(mockFileList);

      expect(result.rootName).toBe("root");
      expect(result.sortedPaths).toContain("subfolder");
      expect(result.sortedPaths).toContain("subfolder/sub2");
    });
  });

  describe("getDescendantIds", () => {
    it("returns all descendant IDs sorted by depth", () => {
      const result = getDescendantIds(mockFiles, "root");

      expect(result).toContain("code");
      expect(result).toContain("file1");
      expect(result).toContain("file2");
    });

    it("returns empty array when no descendants", () => {
      const result = getDescendantIds(mockFiles, "file1");

      expect(result).toEqual([]);
    });
  });

  describe("checkDuplicateName", () => {
    it("returns true when name exists in folder", () => {
      const setStatusBar = jest.fn();

      const result = checkDuplicateName(
        mockFiles,
        "code",
        "index.js",
        setStatusBar
      );

      expect(result).toBe(true);
      expect(setStatusBar).toHaveBeenCalledWith({
        message: "File name already exists",
        type: "error",
      });
    });

    it("returns false when name does not exist", () => {
      const setStatusBar = jest.fn();

      const result = checkDuplicateName(
        mockFiles,
        "code",
        "new.js",
        setStatusBar
      );

      expect(result).toBe(false);
      expect(setStatusBar).not.toHaveBeenCalled();
    });
  });

  describe("checkDuplicateNameForRename", () => {
    it("returns true when duplicate name exists", () => {
      const setError = jest.fn();

      const result = checkDuplicateNameForRename(
        mockFiles,
        mockFiles[2],
        "image.jpg",
        setError
      );

      expect(result).toBe(true);
      expect(setError).toHaveBeenCalledWith("name", {
        type: "manual",
        message: expect.stringContaining("already exists"),
      });
    });

    it("returns false when name is unique", () => {
      const setError = jest.fn();

      const result = checkDuplicateNameForRename(
        mockFiles,
        mockFiles[2],
        "new.js",
        setError
      );

      expect(result).toBe(false);
      expect(setError).not.toHaveBeenCalled();
    });
  });

  describe("checkDuplicateNameForAdd", () => {
    it("returns true when name exists for addFolder", () => {
      const setError = jest.fn();

      const result = checkDuplicateNameForAdd(
        mockFiles,
        "root",
        "Code",
        "addFolder",
        setError
      );

      expect(result).toBe(true);
      expect(setError).toHaveBeenCalledWith("name", {
        type: "manual",
        message: expect.stringContaining("Folder"),
      });
    });

    it("returns false when name is unique", () => {
      const setError = jest.fn();

      const result = checkDuplicateNameForAdd(
        mockFiles,
        "root",
        "NewFolder",
        "addFolder",
        setError
      );

      expect(result).toBe(false);
    });
  });

  describe("createFileItem", () => {
    it("creates file item from File object", async () => {
      (uuidv4 as jest.Mock).mockReturnValue("file-id");

      const mockFile = new File(["content"], "document.pdf", {
        type: "application/pdf",
      });
      Object.defineProperty(mockFile, "size", { value: 2048 });
      (mockFile.text as jest.Mock) = jest.fn().mockResolvedValue("content");

      const mockCanvas = {
        toDataURL: jest.fn().mockReturnValue("data:image/png;base64,mock"),
      };
      (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);

      const result: FileItem = await createFileItem(mockFile, "code");

      expect(result.id).toBe("file-id");
      expect(result.name).toBe("document.pdf");
      expect(result.type).toBe("document");
      expect(result.parentId).toBe("code");
    });
  });

  describe("generateBase64Image", () => {
    it("converts image file to base64", async () => {
      const mockFile = new File(["fake-image-data"], "image.jpg", {
        type: "image/jpeg",
      });

      const mockReader = {
        readAsDataURL: jest.fn(),
        onloadend: null as unknown as (() => void) | null,
        result: "data:image/jpeg;base64,/9j/",
        onerror: null,
      };

      global.FileReader = jest.fn(
        () => mockReader
      ) as unknown as typeof FileReader;

      const promise = generateBase64Image(mockFile);
      (mockReader.onloadend as (() => void) | null)?.();

      const result = await promise;
      expect(result).toBe("data:image/jpeg;base64,/9j/");
    });

    it("returns empty string for unsupported file type", async () => {
      const mockFile = new File(["content"], "file.unknown", {
        type: "application/octet-stream",
      });

      const result = await generateBase64Image(mockFile);

      expect(result).toBe("");
    });
  });
});
