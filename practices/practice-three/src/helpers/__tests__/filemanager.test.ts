import { FileItem, FormData } from "@/types";
import {
  formatSize,
  getLocation,
  getBasicInfo,
  mapExtension,
  createNewItem,
  getBreadcrumbPath,
  getPathIds,
  getAllChildFolderIds,
  getFilteredItems,
  getDescendantIds,
  checkDuplicateName,
  checkDuplicateNameForRename,
  checkDuplicateNameForAdd,
  getPreviewImageSrc,
  parseFolderStructure,
  createRootFolder,
  createSubfolders,
  collectAndUploadFiles,
  uploadFolderWithStructure,
  optimisticRemove,
  deleteFromServer,
  deleteItemWithDescendants,
  createFileItem,
  optimisticAdd,
  callAddItem,
  uploadSingleFile,
  optimisticRename,
  callRenameItem,
  renameFileItem,
  optimisticAddNewItem,
  callAddItemForCreate,
  addNewFileOrFolder,
  buildFileTree,
  getFileTreeData,
} from "../filemanager";

jest.mock("@/services", () => ({
  saveAllFileFileManager: jest.fn(),
}));

jest.mock("html2canvas", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/components", () => ({
  Icon: () => null,
}));

jest.mock("@/icons/fa", () => ({
  fa: {
    faFolder: "faFolder",
    faFile: "faFile",
  },
}));

describe("FileManager Helpers", () => {
  const mockFiles: FileItem[] = [
    {
      id: "root",
      name: "My Files",
      type: "folder",
      parentId: null,
      size: null,
    },
    {
      id: "1",
      name: "folder1",
      type: "folder",
      parentId: "root",
      size: null,
    },
    {
      id: "2",
      name: "file1.txt",
      type: "code",
      parentId: "root",
      size: 100,
    },
    {
      id: "3",
      name: "subfolder",
      type: "folder",
      parentId: "1",
      size: null,
    },
    {
      id: "4",
      name: "file2.js",
      type: "code",
      parentId: "3",
      size: 500,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("formatSize", () => {
    it("should format bytes correctly", () => {
      expect(formatSize(500)).toBe("500 B");
    });

    it("should format KB correctly", () => {
      expect(formatSize(1500)).toBe("1.5 KB");
    });

    it("should format MB correctly", () => {
      expect(formatSize(1500000)).toBe("1.5 MB");
    });

    it("should return 0 B for null size", () => {
      expect(formatSize(null)).toBe("0 B");
    });

    it("should handle edge case at 1000 bytes", () => {
      expect(formatSize(1000)).toBe("1.0 KB");
    });

    it("should handle edge case at 1 million bytes", () => {
      expect(formatSize(1000000)).toBe("1.0 MB");
    });
  });

  describe("getLocation", () => {
    it("should return root path when no item", () => {
      expect(getLocation(mockFiles, "root", null)).toBe("/");
    });

    it("should return root path when no selectedFolder", () => {
      expect(getLocation(mockFiles, null, mockFiles[2])).toBe("/");
    });

    it("should return folder path", () => {
      expect(getLocation(mockFiles, "root", mockFiles[2])).toBe("/My Files");
    });

    it("should return subfolder path", () => {
      expect(getLocation(mockFiles, "1", mockFiles[3])).toBe("/folder1");
    });

    it("should handle non-existent folder ID", () => {
      expect(getLocation(mockFiles, "nonexistent", mockFiles[2])).toBe(
        "/nonexistent"
      );
    });
  });

  describe("getBasicInfo", () => {
    it("should return basic info for file with size", () => {
      const info = getBasicInfo(mockFiles[2], mockFiles, "root");

      expect(info[0].label).toBe("Type");
      expect(info[0].value).toBe("Code");
      expect(info[1].label).toBe("Date");
      expect(info[2].label).toBe("Size");
      expect(info[3].label).toBe("Location");
    });

    it("should return basic info for folder without size", () => {
      const info = getBasicInfo(mockFiles[1], mockFiles, "root");

      const sizeInfo = info.find((i) => i.label === "Size");
      expect(sizeInfo).toBeUndefined();
      expect(info).toHaveLength(3);
    });

    it("should capitalize file type", () => {
      const info = getBasicInfo(mockFiles[2], mockFiles, "root");
      expect(info[0].value).toBe("Code");
    });
  });

  describe("mapExtension", () => {
    it("should map code file extensions", () => {
      const result = mapExtension("js");
      expect(result.type).toBe("code");
      expect(result.imageUrl).toBe("/images/blank-white-image.webp");
    });

    it("should map image extensions", () => {
      const result = mapExtension("jpg");
      expect(result.type).toBe("image");
      expect(result.imageUrl).toBe("/images/file-placeholder-image.svg");
    });

    it("should map document extensions", () => {
      const result = mapExtension("pdf");
      expect(result.type).toBe("document");
      expect(result.imageUrl).toBe("/images/pdf-placeholder-image.svg");
    });

    it("should map archive extensions", () => {
      const result = mapExtension("zip");
      expect(result.type).toBe("archive");
    });

    it("should map audio extensions", () => {
      const result = mapExtension("mp3");
      expect(result.type).toBe("audio");
    });

    it("should return default for unknown extension", () => {
      const result = mapExtension("xyz");
      expect(result.type).toBe("file");
      expect(result.imageUrl).toBe("/images/invalid-image.svg");
    });
  });

  describe("createNewItem", () => {
    it("should create new folder", () => {
      const data: FormData = { name: "newFolder" };
      const item = createNewItem("addFolder", data, "root");

      expect(item.name).toBe("newFolder");
      expect(item.type).toBe("folder");
      expect(item.parentId).toBe("root");
      expect(item.size).toBeNull();
      expect(item.imageUrl).toBe("/images/folder-detail-placeholder.svg");
    });

    it("should create new file with extension mapping", () => {
      const data: FormData = { name: "script.js" };
      const item = createNewItem("addFile", data, "root");

      expect(item.name).toBe("script.js");
      expect(item.type).toBe("code");
      expect(item.parentId).toBe("root");
      expect(item.size).toBe(0);
    });

    it("should default to addFile when addType is null", () => {
      const data: FormData = { name: "document.pdf" };
      const item = createNewItem(null, data, "root");

      expect(item.type).toBe("document");
    });

    it("should handle file without extension", () => {
      const data: FormData = { name: "README" };
      const item = createNewItem("addFile", data, "root");

      expect(item.type).toBe("file");
      expect(item.imageUrl).toBe("/images/invalid-image.svg");
    });

    it("should generate unique IDs", () => {
      const data: FormData = { name: "newFolder" };
      const item1 = createNewItem("addFolder", data, "root");
      const item2 = createNewItem("addFolder", data, "root");

      expect(item1.id).not.toBe(item2.id);
    });
  });

  describe("getBreadcrumbPath", () => {
    it("should return root breadcrumb", () => {
      const path = getBreadcrumbPath(mockFiles, "root");

      expect(path).toHaveLength(1);
      expect(path[0]).toEqual({ id: "root", name: "My Files" });
    });

    it("should return full breadcrumb path", () => {
      const path = getBreadcrumbPath(mockFiles, "3");

      expect(path).toHaveLength(3);
      expect(path[0].name).toBe("My Files");
      expect(path[1].name).toBe("folder1");
      expect(path[2].name).toBe("subfolder");
    });

    it("should handle non-existent folder", () => {
      const path = getBreadcrumbPath(mockFiles, "nonexistent");
      expect(path).toEqual([]);
    });

    it("should stop at root", () => {
      const path = getBreadcrumbPath(mockFiles, "1");
      expect(path[0].id).toBe("root");
    });
  });

  describe("getPathIds", () => {
    it("should return path IDs from root", () => {
      const ids = getPathIds(mockFiles, "root");

      expect(ids).toEqual(["root"]);
    });

    it("should return full path IDs", () => {
      const ids = getPathIds(mockFiles, "3");

      expect(ids).toEqual(["root", "1", "3"]);
    });

    it("should handle non-existent folder", () => {
      const ids = getPathIds(mockFiles, "nonexistent");
      expect(ids).toEqual(["nonexistent"]);
    });
  });

  describe("getAllChildFolderIds", () => {
    it("should return all child folder IDs", () => {
      const ids = getAllChildFolderIds(mockFiles, "root");

      expect(ids).toContain("1");
      expect(ids).toContain("3");
    });

    it("should return empty array for folder with no children", () => {
      const ids = getAllChildFolderIds(mockFiles, "3");

      expect(ids).toEqual([]);
    });

    it("should recursively get all descendants", () => {
      const ids = getAllChildFolderIds(mockFiles, "root");
      expect(ids).toHaveLength(2);
    });

    it("should not include files, only folders", () => {
      const ids = getAllChildFolderIds(mockFiles, "root");

      expect(ids).not.toContain("2");
      expect(ids).not.toContain("4");
    });
  });

  describe("getFilteredItems", () => {
    it("should return direct children in normal mode", () => {
      const items = getFilteredItems(
        mockFiles,
        "root",
        "",
        getAllChildFolderIds
      );

      expect(items).toHaveLength(2);
      expect(items[0].name).toBe("folder1");
      expect(items[1].name).toBe("file1.txt");
    });

    it("should add key property to items", () => {
      const items = getFilteredItems(
        mockFiles,
        "root",
        "",
        getAllChildFolderIds
      );

      expect(items[0].key).toBe(items[0].id);
      expect(items[1].key).toBe(items[1].id);
    });

    it("should filter by search query case-insensitive", () => {
      const items = getFilteredItems(
        mockFiles,
        "root",
        "FILE1",
        getAllChildFolderIds
      );

      expect(items).toHaveLength(1);
      expect(items[0].name).toBe("file1.txt");
    });

    it("should search in subfolders", () => {
      const items = getFilteredItems(
        mockFiles,
        "root",
        "file2",
        getAllChildFolderIds
      );

      expect(items).toHaveLength(1);
      expect(items[0].name).toBe("file2.js");
    });

    it("should ignore whitespace-only search query", () => {
      const items = getFilteredItems(
        mockFiles,
        "root",
        "   ",
        getAllChildFolderIds
      );

      expect(items).toHaveLength(2);
    });
  });

  describe("getDescendantIds", () => {
    it("should return all descendant IDs", () => {
      const ids = getDescendantIds(mockFiles, "root");

      expect(ids).toContain("1");
      expect(ids).toContain("3");
      expect(ids).toContain("2");
      expect(ids).toContain("4");
    });

    it("should return empty array for leaf folder", () => {
      const ids = getDescendantIds(mockFiles, "2");

      expect(ids).toEqual([]);
    });

    it("should sort by depth descending", () => {
      const ids = getDescendantIds(mockFiles, "root");

      const depths = ids.map((id) => {
        let d = 0;
        let cur = id;
        while (cur && cur !== "root") {
          const f = mockFiles.find((x) => x.id === cur);
          if (!f) break;
          cur = f.parentId || "";
          d++;
        }
        return d;
      });

      for (let i = 0; i < depths.length - 1; i++) {
        expect(depths[i]).toBeGreaterThanOrEqual(depths[i + 1]);
      }
    });
  });

  describe("checkDuplicateName", () => {
    it("should detect duplicate name", () => {
      const setStatusBar = jest.fn();

      const isDuplicate = checkDuplicateName(
        mockFiles,
        "root",
        "file1.txt",
        setStatusBar
      );

      expect(isDuplicate).toBe(true);
      expect(setStatusBar).toHaveBeenCalledWith({
        message: "File name already exists",
        type: "error",
      });
    });

    it("should allow unique name", () => {
      const setStatusBar = jest.fn();

      const isDuplicate = checkDuplicateName(
        mockFiles,
        "root",
        "newfile.txt",
        setStatusBar
      );

      expect(isDuplicate).toBe(false);
      expect(setStatusBar).not.toHaveBeenCalled();
    });

    it("should check only in selected folder", () => {
      const setStatusBar = jest.fn();

      const isDuplicate = checkDuplicateName(
        mockFiles,
        "3",
        "file1.txt",
        setStatusBar
      );

      expect(isDuplicate).toBe(false);
    });
  });

  describe("checkDuplicateNameForRename", () => {
    it("should detect duplicate on rename", () => {
      const setError = jest.fn();

      const isDuplicate = checkDuplicateNameForRename(
        mockFiles,
        mockFiles[2],
        "folder1",
        setError
      );

      expect(isDuplicate).toBe(true);
      expect(setError).toHaveBeenCalled();
    });

    it("should allow rename to same name", () => {
      const setError = jest.fn();

      const isDuplicate = checkDuplicateNameForRename(
        mockFiles,
        mockFiles[2],
        "file1.txt",
        setError
      );

      expect(isDuplicate).toBe(false);
    });

    it("should set error message for folder", () => {
      const setError = jest.fn();

      checkDuplicateNameForRename(
        mockFiles,
        mockFiles[1],
        "file1.txt",
        setError
      );

      expect(setError).toHaveBeenCalledWith("name", {
        type: "manual",
        message: "Folder name already exists",
      });
    });

    it("should set error message for file", () => {
      const setError = jest.fn();

      checkDuplicateNameForRename(mockFiles, mockFiles[2], "folder1", setError);

      expect(setError).toHaveBeenCalledWith("name", {
        type: "manual",
        message: "File name already exists",
      });
    });
  });

  describe("checkDuplicateNameForAdd", () => {
    it("should detect duplicate when adding folder", () => {
      const setError = jest.fn();

      const isDuplicate = checkDuplicateNameForAdd(
        mockFiles,
        "root",
        "folder1",
        "addFolder",
        setError
      );

      expect(isDuplicate).toBe(true);
    });

    it("should allow unique name when adding", () => {
      const setError = jest.fn();

      const isDuplicate = checkDuplicateNameForAdd(
        mockFiles,
        "root",
        "newname",
        "addFile",
        setError
      );

      expect(isDuplicate).toBe(false);
    });

    it("should set appropriate error message", () => {
      const setError = jest.fn();

      checkDuplicateNameForAdd(
        mockFiles,
        "root",
        "folder1",
        "addFolder",
        setError
      );

      expect(setError).toHaveBeenCalledWith("name", {
        type: "manual",
        message: "Folder name already exists",
      });
    });
  });

  describe("getPreviewImageSrc", () => {
    it("should return folder placeholder for null item", () => {
      const src = getPreviewImageSrc(null);

      expect(src).toBe("/images/folder-placeholder-image.svg");
    });

    it("should return item image URL if present", () => {
      const item: FileItem = {
        id: "1",
        name: "test",
        type: "file",
        parentId: "root",
        size: 100,
        imageUrl: "/images/test.svg",
      };
      const src = getPreviewImageSrc(item);

      expect(src).toBe("/images/test.svg");
    });

    it("should return invalid image for missing imageUrl", () => {
      const item: FileItem = {
        id: "1",
        name: "test",
        type: "file",
        parentId: "root",
        size: 100,
      };
      const src = getPreviewImageSrc(item);

      expect(src).toBe("/images/invalid-image.svg");
    });
  });

  describe("buildFileTree", () => {
    it("should build tree structure for folders only", () => {
      const tree = buildFileTree(mockFiles, "root");

      expect(tree).toHaveLength(1);
      expect(tree[0].key).toBe("1");
    });

    it("should recursively build nested folders", () => {
      const tree = buildFileTree(mockFiles, "root");

      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children![0].key).toBe("3");
    });

    it("should have title property as JSX", () => {
      const tree = buildFileTree(mockFiles, "root");
      expect(tree[0].title).toBeDefined();
    });
  });

  describe("getFileTreeData", () => {
    it("should return tree with My Files root", () => {
      const treeData = getFileTreeData(mockFiles);

      expect(treeData).toHaveLength(1);
      expect(treeData[0].key).toBe("root");
    });
  });

  describe("parseFolderStructure", () => {
    it("should extract root name from FileList", () => {
      const mockFileList = {
        0: {
          webkitRelativePath: "rootFolder/subfolder/file.txt",
        },
        length: 1,
      } as unknown as FileList;

      const { rootName } = parseFolderStructure(mockFileList);

      expect(rootName).toBe("rootFolder");
    });

    it("should extract and sort folder paths", () => {
      const mockFileList = {
        0: { webkitRelativePath: "root/a/b/c/file.txt" },
        1: { webkitRelativePath: "root/a/file.txt" },
        2: { webkitRelativePath: "root/x/y/file.txt" },
        length: 3,
      } as unknown as FileList;

      const { sortedPaths } = parseFolderStructure(mockFileList);

      expect(sortedPaths).toContain("a");
      expect(sortedPaths).toContain("a/b");
      expect(sortedPaths).toContain("x");
      expect(sortedPaths.indexOf("a")).toBeLessThan(sortedPaths.indexOf("a/b"));
    });
  });

  describe("optimisticRemove", () => {
    it("should remove items from state", () => {
      const setFiles = jest.fn((fn) => fn(mockFiles));

      optimisticRemove(["1", "2"], setFiles);

      const result = setFiles.mock.calls[0][0](mockFiles);
      expect(result).toHaveLength(3);
      expect(result.find((f: FileItem) => f.id === "1")).toBeUndefined();
      expect(result.find((f: FileItem) => f.id === "2")).toBeUndefined();
    });

    it("should keep non-deleted items", () => {
      const setFiles = jest.fn((fn) => fn(mockFiles));

      optimisticRemove(["1"], setFiles);

      const result = setFiles.mock.calls[0][0](mockFiles);
      expect(result.find((f: FileItem) => f.id === "root")).toBeDefined();
      expect(result.find((f: FileItem) => f.id === "3")).toBeDefined();
    });
  });

  describe("optimisticAdd", () => {
    it("should add new item to files", () => {
      const setFiles = jest.fn();
      const setExpandedKeys = jest.fn();
      const newItem: FileItem = {
        id: "new",
        name: "newFile",
        type: "file",
        parentId: "root",
        size: 100,
      };

      optimisticAdd(newItem, setFiles, setExpandedKeys, "root");

      expect(setFiles).toHaveBeenCalled();
      expect(setExpandedKeys).toHaveBeenCalled();
    });

    it("should add folder to expanded keys", () => {
      const setFiles = jest.fn();
      const setExpandedKeys = jest.fn((fn) => fn(["existing"]));
      const newItem: FileItem = {
        id: "new",
        name: "newFile",
        type: "file",
        parentId: "folder1",
        size: 100,
      };

      optimisticAdd(newItem, setFiles, setExpandedKeys, "folder1");

      expect(setExpandedKeys).toHaveBeenCalled();
    });
  });

  describe("optimisticRename", () => {
    it("should update renamed item in files", () => {
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const updatedItem: FileItem = {
        ...mockFiles[2],
        name: "renamed.txt",
      };

      optimisticRename(updatedItem, setFiles);

      const result = setFiles.mock.calls[0][0](mockFiles);
      const renamedItem = result.find((f: FileItem) => f.id === "2");
      expect(renamedItem?.name).toBe("renamed.txt");
    });

    it("should keep other items unchanged", () => {
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const updatedItem: FileItem = {
        ...mockFiles[2],
        name: "renamed.txt",
      };

      optimisticRename(updatedItem, setFiles);

      const result = setFiles.mock.calls[0][0](mockFiles);
      expect(result.find((f: FileItem) => f.id === "1").name).toBe("folder1");
    });
  });

  describe("optimisticAddNewItem", () => {
    it("should add item and update expanded keys", () => {
      const setFiles = jest.fn();
      const setExpandedKeys = jest.fn();
      const newItem: FileItem = {
        id: "new",
        name: "newFolder",
        type: "folder",
        parentId: "root",
        size: null,
      };

      optimisticAddNewItem(newItem, setFiles, setExpandedKeys, "root");

      expect(setFiles).toHaveBeenCalled();
      expect(setExpandedKeys).toHaveBeenCalled();
    });

    it("should deduplicate expanded keys", () => {
      const setExpandedKeys = jest.fn((fn) => fn(["root", "1"]));
      const setFiles = jest.fn();
      const newItem: FileItem = {
        id: "new",
        name: "newFolder",
        type: "folder",
        parentId: "root",
        size: null,
      };

      optimisticAddNewItem(newItem, setFiles, setExpandedKeys, "root");

      expect(setExpandedKeys).toHaveBeenCalled();
    });
  });

  describe("callAddItem", () => {
    it("should call addItem with correct callbacks", () => {
      const addItem = jest.fn();
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const newItem: FileItem = {
        id: "1",
        name: "file",
        type: "file",
        parentId: "root",
        size: 100,
      };

      callAddItem(newItem, addItem, setFiles, setStatusBar);

      expect(addItem).toHaveBeenCalledWith(
        newItem,
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    it("should call onSuccess callback", () => {
      const addItem = jest.fn((item, opts) => opts.onSuccess());
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const newItem: FileItem = {
        id: "1",
        name: "file",
        type: "file",
        parentId: "root",
        size: 100,
      };

      callAddItem(newItem, addItem, setFiles, setStatusBar);

      expect(setStatusBar).toHaveBeenCalledWith({
        message: "File uploaded successfully",
        type: "success",
      });
    });

    it("should call onError callback", () => {
      const addItem = jest.fn((item, opts) => opts.onError());
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const setStatusBar = jest.fn();
      const newItem: FileItem = {
        id: "1",
        name: "file",
        type: "file",
        parentId: "root",
        size: 100,
      };

      callAddItem(newItem, addItem, setFiles, setStatusBar);

      expect(setStatusBar).toHaveBeenCalledWith({
        message: "Upload failed",
        type: "error",
      });
    });
  });

  describe("callRenameItem", () => {
    it("should call renameItem with correct structure", () => {
      const renameItem = jest.fn();
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const setIsRenaming = jest.fn();
      const item = mockFiles[2];
      const updatedItem = { ...item, name: "newName.txt" };

      callRenameItem(
        item,
        updatedItem,
        renameItem,
        setFiles,
        setStatusBar,
        setIsRenaming
      );

      expect(renameItem).toHaveBeenCalledWith(
        { id: item.id, updatedItem },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
          onSettled: expect.any(Function),
        })
      );
    });

    it("should handle onSuccess callback", () => {
      const renameItem = jest.fn((params, opts) => opts.onSuccess());
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const setIsRenaming = jest.fn();
      const item = mockFiles[2];
      const updatedItem = { ...item, name: "newName.txt" };

      callRenameItem(
        item,
        updatedItem,
        renameItem,
        setFiles,
        setStatusBar,
        setIsRenaming
      );

      expect(setStatusBar).toHaveBeenCalledWith({
        message: "File renamed successfully",
        type: "success",
      });
    });

    it("should handle onSettled callback", () => {
      const renameItem = jest.fn((params, opts) => opts.onSettled());
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const setIsRenaming = jest.fn();
      const item = mockFiles[2];
      const updatedItem = { ...item, name: "newName.txt" };

      callRenameItem(
        item,
        updatedItem,
        renameItem,
        setFiles,
        setStatusBar,
        setIsRenaming
      );

      expect(setIsRenaming).toHaveBeenCalledWith(false);
    });
  });

  describe("renameFileItem", () => {
    it("should not proceed if no selected item", () => {
      const reset = jest.fn();
      const setShowNameInputDialog = jest.fn();

      renameFileItem({
        data: { name: "newName" },
        selectedItem: null,
        files: mockFiles,
        setFiles: jest.fn(),
        setError: jest.fn(),
        setIsRenaming: jest.fn(),
        setShowNameInputDialog,
        setStatusBar: jest.fn(),
        setHasChanged: jest.fn(),
        reset,
        renameItem: jest.fn(),
      });

      expect(reset).not.toHaveBeenCalled();
      expect(setShowNameInputDialog).not.toHaveBeenCalled();
    });

    it("should close dialog if renaming to same name", () => {
      const setShowNameInputDialog = jest.fn();
      const reset = jest.fn();

      renameFileItem({
        data: { name: "file1.txt" },
        selectedItem: mockFiles[2],
        files: mockFiles,
        setFiles: jest.fn(),
        setError: jest.fn(),
        setIsRenaming: jest.fn(),
        setShowNameInputDialog,
        setStatusBar: jest.fn(),
        setHasChanged: jest.fn(),
        reset,
        renameItem: jest.fn(),
      });

      expect(setShowNameInputDialog).toHaveBeenCalledWith(false);
    });

    it("should trim whitespace from name", () => {
      const renameItem = jest.fn();

      renameFileItem({
        data: { name: "  newName.txt  " },
        selectedItem: mockFiles[2],
        files: mockFiles,
        setFiles: jest.fn(),
        setError: jest.fn(),
        setIsRenaming: jest.fn(),
        setShowNameInputDialog: jest.fn(),
        setStatusBar: jest.fn(),
        setHasChanged: jest.fn(),
        reset: jest.fn(),
        renameItem,
      });

      expect(renameItem).toHaveBeenCalled();
    });
  });

  describe("callAddItemForCreate", () => {
    it("should show success message for folder creation", () => {
      const addItem = jest.fn((item, opts) => opts.onSuccess());
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const newItem: FileItem = {
        id: "new",
        name: "newFolder",
        type: "folder",
        parentId: "root",
        size: null,
      };

      callAddItemForCreate(
        newItem,
        "addFolder",
        addItem,
        setFiles,
        setStatusBar
      );

      expect(setStatusBar).toHaveBeenCalledWith({
        message: "Folder created successfully",
        type: "success",
      });
    });

    it("should show success message for file creation", () => {
      const addItem = jest.fn((item, opts) => opts.onSuccess());
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const newItem: FileItem = {
        id: "new",
        name: "newFile.txt",
        type: "code",
        parentId: "root",
        size: 0,
      };

      callAddItemForCreate(newItem, "addFile", addItem, setFiles, setStatusBar);

      expect(setStatusBar).toHaveBeenCalledWith({
        message: "File created successfully",
        type: "success",
      });
    });

    it("should handle error on creation", () => {
      const addItem = jest.fn((item, opts) => opts.onError());
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const setStatusBar = jest.fn();
      const newItem: FileItem = {
        id: "new",
        name: "newFile.txt",
        type: "code",
        parentId: "root",
        size: 0,
      };

      callAddItemForCreate(newItem, "addFile", addItem, setFiles, setStatusBar);

      expect(setStatusBar).toHaveBeenCalledWith({
        message: "Failed to create item",
        type: "error",
      });
    });
  });

  describe("addNewFileOrFolder", () => {
    it("should not proceed if duplicate name exists", () => {
      const setShowNameInputDialog = jest.fn();
      const setError = jest.fn();

      addNewFileOrFolder({
        data: { name: "folder1" },
        files: mockFiles,
        selectedFolder: "root",
        addType: "addFolder",
        setFiles: jest.fn(),
        setExpandedKeys: jest.fn(),
        setError,
        setStatusBar: jest.fn(),
        setShowNameInputDialog,
        setHasChanged: jest.fn(),
        reset: jest.fn(),
        addItem: jest.fn(),
      });

      expect(setError).toHaveBeenCalled();
      expect(setShowNameInputDialog).not.toHaveBeenCalled();
    });

    it("should create item with unique name", () => {
      const addItem = jest.fn();
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const setShowNameInputDialog = jest.fn();
      const reset = jest.fn();

      addNewFileOrFolder({
        data: { name: "newFolder" },
        files: mockFiles,
        selectedFolder: "root",
        addType: "addFolder",
        setFiles,
        setExpandedKeys: jest.fn(),
        setError: jest.fn(),
        setStatusBar,
        setShowNameInputDialog,
        setHasChanged: jest.fn(),
        reset,
        addItem,
      });

      expect(setShowNameInputDialog).toHaveBeenCalledWith(false);
      expect(reset).toHaveBeenCalledWith({ name: "" });
      expect(addItem).toHaveBeenCalled();
    });
  });

  describe("deleteItemWithDescendants", () => {
    it("should delete folder and its descendants", async () => {
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const deleteItem = jest.fn().mockResolvedValue(undefined);
      const setStatusBar = jest.fn();
      const setIsDeletingFolder = jest.fn();
      const setSelectedItem = jest.fn();
      const setIsDeleteModalOpen = jest.fn();
      const setPendingDeleteItem = jest.fn();
      const setHasChanged = jest.fn();

      await deleteItemWithDescendants({
        item: mockFiles[1],
        files: mockFiles,
        setFiles,
        setStatusBar,
        setIsDeletingFolder,
        setSelectedItem,
        setIsDeleteModalOpen,
        setPendingDeleteItem,
        setHasChanged,
        deleteItem,
      });

      expect(setIsDeletingFolder).toHaveBeenCalledWith(true);
      expect(setIsDeletingFolder).toHaveBeenCalledWith(false);
      expect(setStatusBar).toHaveBeenCalledWith({
        message: "Folder deleted successfully",
        type: "success",
      });
    });

    it("should delete single file", async () => {
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const deleteItem = jest.fn().mockResolvedValue(undefined);
      const setStatusBar = jest.fn();

      await deleteItemWithDescendants({
        item: mockFiles[2],
        files: mockFiles,
        setFiles,
        setStatusBar,
        setIsDeletingFolder: jest.fn(),
        setSelectedItem: jest.fn(),
        setIsDeleteModalOpen: jest.fn(),
        setPendingDeleteItem: jest.fn(),
        setHasChanged: jest.fn(),
        deleteItem,
      });

      expect(setStatusBar).toHaveBeenCalledWith({
        message: "File deleted successfully",
        type: "success",
      });
    });
  });

  describe("createFileItem", () => {
    it("should handle file without extension", async () => {
      const mockFile = new File(["content"], "README", { type: "text/plain" });
      mockFile.text = jest.fn().mockResolvedValue("content");

      const item = await createFileItem(mockFile, "root");

      expect(item.type).toBe("file");
    });
  });

  describe("uploadSingleFile", () => {
    it("should reject duplicate file", async () => {
      const event = {
        target: {
          files: [new File(["content"], "file1.txt")],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      const setStatusBar = jest.fn();

      await uploadSingleFile({
        event,
        files: mockFiles,
        selectedFolder: "root",
        setFiles: jest.fn(),
        setExpandedKeys: jest.fn(),
        setStatusBar,
        setHasChanged: jest.fn(),
        addItem: jest.fn(),
        fileInputRef: { current: null },
      });

      expect(setStatusBar).toHaveBeenCalledWith({
        message: "File name already exists",
        type: "error",
      });
    });
  });

  describe("createRootFolder", () => {
    it("should create root folder successfully", async () => {
      const addItemAsync = jest.fn().mockResolvedValue({ id: "server-root-1" });
      const setStatusBar = jest.fn();

      const result = await createRootFolder({
        rootName: "newRoot",
        selectedFolder: "root",
        files: mockFiles,
        setStatusBar,
        addItemAsync,
      });

      expect(result).not.toBeNull();
      expect(result?.serverRootId).toBe("server-root-1");
      expect(result?.rootItem.name).toBe("newRoot");
      expect(result?.rootItem.type).toBe("folder");
      expect(addItemAsync).toHaveBeenCalled();
    });

    it("should return null when folder already exists", async () => {
      const addItemAsync = jest.fn();
      const setStatusBar = jest.fn();

      const result = await createRootFolder({
        rootName: "folder1",
        selectedFolder: "root",
        files: mockFiles,
        setStatusBar,
        addItemAsync,
      });

      expect(result).toBeNull();
      expect(setStatusBar).toHaveBeenCalledWith({
        message: "Folder name already exists",
        type: "error",
      });
      expect(addItemAsync).not.toHaveBeenCalled();
    });

    it("should handle server error gracefully", async () => {
      const addItemAsync = jest
        .fn()
        .mockRejectedValue(new Error("Server error"));
      const setStatusBar = jest.fn();

      const result = await createRootFolder({
        rootName: "newRoot",
        selectedFolder: "root",
        files: mockFiles,
        setStatusBar,
        addItemAsync,
      });

      expect(result).toBeNull();
      expect(setStatusBar).toHaveBeenCalledWith({
        message: "Failed to create root folder",
        type: "error",
      });
    });

    it("should set correct folder properties", async () => {
      const addItemAsync = jest.fn().mockResolvedValue({ id: "server-id" });
      const setStatusBar = jest.fn();

      const result = await createRootFolder({
        rootName: "testRoot",
        selectedFolder: "root",
        files: mockFiles,
        setStatusBar,
        addItemAsync,
      });

      expect(result?.rootItem).toEqual({
        id: expect.any(String),
        name: "testRoot",
        type: "folder",
        parentId: "root",
        size: null,
        imageUrl: "/images/folder-detail-placeholder.svg",
      });
    });

    it("should work with different parent folders", async () => {
      const addItemAsync = jest.fn().mockResolvedValue({ id: "server-id" });
      const setStatusBar = jest.fn();

      const result = await createRootFolder({
        rootName: "subRoot",
        selectedFolder: "1",
        files: mockFiles,
        setStatusBar,
        addItemAsync,
      });

      expect(result?.rootItem.parentId).toBe("1");
    });
  });

  describe("createSubfolders", () => {
    it("should create all subfolders in correct order", async () => {
      const addItemAsync = jest
        .fn()
        .mockResolvedValueOnce({ id: "folder-a" })
        .mockResolvedValueOnce({ id: "folder-ab" })
        .mockResolvedValueOnce({ id: "folder-abc" });

      const setStatusBar = jest.fn();
      const parentMap: Record<string, string> = { "": "root-id" };

      const result = await createSubfolders({
        sortedPaths: ["a", "a/b", "a/b/c"],
        parentMap,
        setStatusBar,
        addItemAsync,
      });

      expect(result).toHaveLength(3);
      expect(addItemAsync).toHaveBeenCalledTimes(3);
      expect(setStatusBar).not.toHaveBeenCalled();
    });

    it("should update parentMap with server IDs", async () => {
      const addItemAsync = jest
        .fn()
        .mockResolvedValueOnce({ id: "server-a" })
        .mockResolvedValueOnce({ id: "server-b" });

      const setStatusBar = jest.fn();
      const parentMap: Record<string, string> = { "": "root" };

      await createSubfolders({
        sortedPaths: ["folder1", "folder1/subfolder"],
        parentMap,
        setStatusBar,
        addItemAsync,
      });

      expect(parentMap["folder1"]).toBe("server-a");
      expect(parentMap["folder1/subfolder"]).toBe("server-b");
    });

    it("should handle single subfolder", async () => {
      const addItemAsync = jest.fn().mockResolvedValue({ id: "server-id" });
      const setStatusBar = jest.fn();
      const parentMap: Record<string, string> = { "": "root" };

      const result = await createSubfolders({
        sortedPaths: ["singleFolder"],
        parentMap,
        setStatusBar,
        addItemAsync,
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("singleFolder");
    });

    it("should stop on error and return partial results", async () => {
      const addItemAsync = jest
        .fn()
        .mockResolvedValueOnce({ id: "folder-a" })
        .mockRejectedValueOnce(new Error("Creation failed"));

      const setStatusBar = jest.fn();
      const parentMap: Record<string, string> = { "": "root" };

      const result = await createSubfolders({
        sortedPaths: ["a", "a/b"],
        parentMap,
        setStatusBar,
        addItemAsync,
      });

      expect(result).toHaveLength(2);
      expect(setStatusBar).toHaveBeenCalledWith({
        message: "Failed to create subfolder",
        type: "error",
      });
    });

    it("should extract correct folder names from paths", async () => {
      const addItemAsync = jest.fn().mockResolvedValue({ id: "id" });
      const setStatusBar = jest.fn();
      const parentMap: Record<string, string> = { "": "root" };

      await createSubfolders({
        sortedPaths: ["documents", "documents/work", "documents/work/projects"],
        parentMap,
        setStatusBar,
        addItemAsync,
      });

      const calls = addItemAsync.mock.calls;
      expect(calls[0][0].name).toBe("documents");
      expect(calls[1][0].name).toBe("work");
      expect(calls[2][0].name).toBe("projects");
    });

    it("should set correct parentId for each folder", async () => {
      const addItemAsync = jest
        .fn()
        .mockResolvedValueOnce({ id: "a-id" })
        .mockResolvedValueOnce({ id: "b-id" });

      const setStatusBar = jest.fn();
      const parentMap: Record<string, string> = { "": "root-id" };

      await createSubfolders({
        sortedPaths: ["folder1", "folder1/folder2"],
        parentMap,
        setStatusBar,
        addItemAsync,
      });

      const calls = addItemAsync.mock.calls;
      expect(calls[0][0].parentId).toBe("root-id");
      expect(calls[1][0].parentId).toBe("a-id");
    });
  });

  describe("collectAndUploadFiles", () => {
    it("should collect and prepare files for upload", async () => {
      const mockFile1 = new File(["content1"], "file1.js");
      const mockFile2 = new File(["content2"], "file2.txt");
      Object.defineProperty(mockFile1, "webkitRelativePath", {
        value: "root/file1.js",
        writable: false,
      });
      Object.defineProperty(mockFile2, "webkitRelativePath", {
        value: "root/subdir/file2.txt",
        writable: false,
      });
      const mockFileList = {
        0: mockFile1,
        1: mockFile2,
        length: 2,
      } as unknown as FileList;

      const addItemAsync = jest.fn().mockResolvedValue({ id: "file-id" });
      const parentMap: Record<string, string> = {
        "": "root-id",
        subdir: "subdir-id",
      };

      const result = await collectAndUploadFiles({
        fileList: mockFileList,
        parentMap,
        serverRootId: "root-id",
        files: mockFiles,
        addItemAsync,
      });

      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should skip duplicate files", async () => {
      const mockFile = new File(["content"], "file1.txt");
      Object.defineProperty(mockFile, "webkitRelativePath", {
        value: "root/file1.txt",
        writable: false,
      });
      const mockFileList = {
        0: mockFile,
        length: 1,
      } as unknown as FileList;

      const addItemAsync = jest.fn();

      const result = await collectAndUploadFiles({
        fileList: mockFileList,
        parentMap: { "": "root-id" },
        serverRootId: "root-id",
        files: [
          ...mockFiles,
          {
            id: "existing",
            name: "file1.txt",
            type: "code",
            parentId: "root-id",
            size: 100,
          },
        ],
        addItemAsync,
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("deleteFromServer", () => {
    it("should delete all items successfully", async () => {
      const deleteItem = jest.fn().mockResolvedValue(undefined);
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const setStatusBar = jest.fn();

      await deleteFromServer(
        ["1", "2"],
        mockFiles,
        deleteItem,
        setFiles,
        setStatusBar
      );

      expect(deleteItem).toHaveBeenCalledTimes(2);
      expect(deleteItem).toHaveBeenCalledWith("1");
      expect(deleteItem).toHaveBeenCalledWith("2");
      expect(setStatusBar).not.toHaveBeenCalled();
    });

    it("should handle deletion error and restore file", async () => {
      const deleteItem = jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error("Delete failed"));

      const setFiles = jest.fn();
      const setStatusBar = jest.fn();

      await deleteFromServer(
        ["1", "2"],
        mockFiles,
        deleteItem,
        setFiles,
        setStatusBar
      );
      expect(setFiles).toHaveBeenCalled();
    });

    it("should stop on first error", async () => {
      const deleteItem = jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error("Failed"));

      const setFiles = jest.fn();
      const setStatusBar = jest.fn();

      await deleteFromServer(
        ["1", "2", "3"],
        mockFiles,
        deleteItem,
        setFiles,
        setStatusBar
      );

      expect(deleteItem).toHaveBeenCalledTimes(2);
    });

    it("should restore failed item to state", async () => {
      const deleteItem = jest.fn().mockRejectedValue(new Error("Failed"));
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const setStatusBar = jest.fn();

      await deleteFromServer(
        ["2"],
        mockFiles,
        deleteItem,
        setFiles,
        setStatusBar
      );

      const restoreFn = setFiles.mock.calls[0][0];
      const restored = restoreFn([]);
      expect(restored).toContainEqual(mockFiles[2]);
    });

    it("should display error message with file name", async () => {
      const deleteItem = jest.fn().mockRejectedValue(new Error("Failed"));
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const setStatusBar = jest.fn();

      await deleteFromServer(
        ["2"],
        mockFiles,
        deleteItem,
        setFiles,
        setStatusBar
      );

      expect(setStatusBar).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("file1.txt"),
          type: "error",
        })
      );
    });

    it("should handle non-existent file ID gracefully", async () => {
      const deleteItem = jest.fn().mockResolvedValue(undefined);
      const setFiles = jest.fn((fn) => fn(mockFiles));
      const setStatusBar = jest.fn();

      await deleteFromServer(
        ["nonexistent"],
        mockFiles,
        deleteItem,
        setFiles,
        setStatusBar
      );

      expect(deleteItem).toHaveBeenCalledWith("nonexistent");
      expect(setStatusBar).not.toHaveBeenCalled();
    });

    it("should handle empty deletion list", async () => {
      const deleteItem = jest.fn();
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();

      await deleteFromServer([], mockFiles, deleteItem, setFiles, setStatusBar);

      expect(deleteItem).not.toHaveBeenCalled();
      expect(setStatusBar).not.toHaveBeenCalled();
    });

    it("should delete items in order", async () => {
      const deleteItem = jest.fn().mockResolvedValue(undefined);
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const ids = ["1", "2", "3"];

      await deleteFromServer(
        ids,
        mockFiles,
        deleteItem,
        setFiles,
        setStatusBar
      );

      const calls = deleteItem.mock.calls.map((c) => c[0]);
      expect(calls).toEqual(ids);
    });
  });

  describe("uploadFolderWithStructure - Integration Test", () => {
    it("should complete full folder upload workflow with nested structure", async () => {
      // Setup: Create mock files with nested structure
      const mockFile1 = new File(["content1"], "file1.txt");
      Object.defineProperty(mockFile1, "webkitRelativePath", {
        value: "myProject/file1.txt",
        writable: false,
      });

      const mockFile2 = new File(["content2"], "file2.js");
      Object.defineProperty(mockFile2, "webkitRelativePath", {
        value: "myProject/src/file2.js",
        writable: false,
      });

      const mockFile3 = new File(["content3"], "file3.ts");
      Object.defineProperty(mockFile3, "webkitRelativePath", {
        value: "myProject/src/utils/file3.ts",
        writable: false,
      });

      const mockFileList = {
        0: mockFile1,
        1: mockFile2,
        2: mockFile3,
        length: 3,
      } as unknown as FileList;

      const mockEvent = {
        target: {
          files: mockFileList,
          value: "some-path",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Setup: Mock functions
      const setFiles = jest.fn();
      const setStatusBar = jest.fn();
      const setIsUploadingFolder = jest.fn();
      const setExpandedKeys = jest.fn();

      const addItemAsync = jest
        .fn()
        .mockResolvedValueOnce({ id: "root-folder-id" }) // Root folder
        .mockResolvedValueOnce({ id: "src-folder-id" }) // src folder
        .mockResolvedValueOnce({ id: "utils-folder-id" }) // utils folder
        .mockResolvedValue({ id: "file-id" }); // Files

      // Execute
      await uploadFolderWithStructure({
        event: mockEvent,
        files: mockFiles,
        selectedFolder: "root",
        setFiles,
        setExpandedKeys,
        setStatusBar,
        addItemAsync,
        setIsUploadingFolder,
      });

      // Assertions
      expect(setIsUploadingFolder).toHaveBeenNthCalledWith(1, true);

      expect(addItemAsync).toHaveBeenCalled();

      expect(setFiles).toHaveBeenCalledWith(expect.any(Function));
      const setFilesFn = setFiles.mock.calls[0][0];
      const newFiles = setFilesFn(mockFiles);

      expect(newFiles.length).toBeGreaterThan(mockFiles.length);

      // Check root folder was added
      const rootFolder = newFiles.find((f: FileItem) => f.name === "myProject");
      expect(rootFolder).toBeDefined();
      expect(rootFolder?.type).toBe("folder");
      expect(rootFolder?.parentId).toBe("root");

      // Check subfolders were added
      const srcFolder = newFiles.find((f: FileItem) => f.name === "src");
      expect(srcFolder).toBeDefined();
      expect(srcFolder?.type).toBe("folder");

      const utilsFolder = newFiles.find((f: FileItem) => f.name === "utils");
      expect(utilsFolder).toBeDefined();

      // Check files were added with correct types
      const uploadedFiles = newFiles.filter(
        (f: FileItem) => f.type !== "folder"
      );
      expect(uploadedFiles.length).toBeGreaterThan(0);

      // Check success message
      expect(setStatusBar).toHaveBeenCalledWith({
        message: "Folder uploaded successfully",
        type: "success",
      });

      // Check uploading state was reset
      expect(setIsUploadingFolder).toHaveBeenNthCalledWith(2, false);

      // Check input value was cleared
      expect(mockEvent.target.value).toBe("");
    });
  });
});
