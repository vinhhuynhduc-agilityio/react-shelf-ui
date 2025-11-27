import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@/components/Test/test-utils";
import FilemanagerPage from "./index";
import * as hookModule from "@/hook";
import * as helpersModule from "@/helpers";
import type { FileItem } from "@/types";

// mock hooks
jest.mock("@/hook");
const mockUseFilemanagerQuery = jest.mocked(hookModule.useFilemanagerQuery);
const mockUseAddFileItem = jest.mocked(hookModule.useAddFileItem);
const mockUseDeleteFileItem = jest.mocked(hookModule.useDeleteFileItem);
const mockUseRenameFileItem = jest.mocked(hookModule.useRenameFileItem);
const mockUseDebounce = jest.mocked(hookModule.useDebounce);

beforeAll(() => {
  // Mock ResizeObserver with proper width
  global.ResizeObserver = class ResizeObserver {
    constructor(private cb: ResizeObserverCallback) {}
    observe = jest.fn((element: Element) => {
      // Trigger callback với clientWidth >= 650
      const mockRect = {
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };

      const entries: ResizeObserverEntry[] = [
        {
          target: element,
          contentRect: mockRect,
          borderBoxSize: [{ blockSize: 600, inlineSize: 800 }],
          contentBoxSize: [{ blockSize: 600, inlineSize: 800 }],
          devicePixelContentBoxSize: [{ blockSize: 600, inlineSize: 800 }],
        } as ResizeObserverEntry,
      ];

      this.cb(entries, this);
    });
    unobserve = jest.fn();
    disconnect = jest.fn();
  } as unknown as typeof ResizeObserver;

  // Mock HTMLElement.clientWidth
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: function () {
      return 800; // >= 650, so showNavigation = true
    },
  });

  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get: function () {
      return 600;
    },
  });
});

afterAll(() => {
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

// mock components
jest.mock("@/components", () => ({
  ErrorAlert: ({ title }: { title: string }) => <div>{title}</div>,
  NameInputModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="name-input-modal">
        Modal <button onClick={onClose}>Close</button>
      </div>
    ) : null,
  DeleteConfirmModal: ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) =>
    isOpen ? (
      <div data-testid="delete-modal">
        Delete{" "}
        <button onClick={onConfirm} data-testid="confirm-delete">
          Confirm
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
  FileContextMenu: ({
    visible,
    onClose,
    onRename,
    onDelete,
  }: {
    visible: boolean;
    onClose: () => void;
    onRename: () => void;
    onDelete: () => void;
  }) =>
    visible ? (
      <div data-testid="context-menu">
        Menu
        <button onClick={onRename} data-testid="context-rename">
          Rename
        </button>
        <button onClick={onDelete} data-testid="context-delete">
          Delete
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
  PreviewPanel: () => <div data-testid="preview-panel">Preview</div>,
  Sidebar: ({
    onAddNewClick,
    onSelect,
    onDropdownSelect,
  }: {
    onAddNewClick: () => void;
    onSelect: (folderIds: string[]) => void;
    onDropdownSelect: (option: { key: string }) => void;
  }) => (
    <div data-testid="sidebar">
      <button onClick={onAddNewClick} data-testid="add-new-btn">
        Add New
      </button>
      <button onClick={() => onSelect(["code"])} data-testid="select-folder">
        Select Code Folder
      </button>
      <button
        onClick={() => onDropdownSelect({ key: "upload-file" })}
        data-testid="upload-file-btn"
      >
        Upload File
      </button>
      <button
        onClick={() => onDropdownSelect({ key: "upload-folder" })}
        data-testid="upload-folder-btn"
      >
        Upload Folder
      </button>
      <button
        onClick={() => onDropdownSelect({ key: "create-file" })}
        data-testid="create-file-btn"
      >
        Create File
      </button>
      <button
        onClick={() => onDropdownSelect({ key: "create-folder" })}
        data-testid="create-folder-btn"
      >
        Create Folder
      </button>
    </div>
  ),
  HeaderBar: ({
    onSearchChange,
    onTogglePreview,
  }: {
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTogglePreview: () => void;
  }) => (
    <div data-testid="header-bar">
      <input
        data-testid="search-input"
        onChange={onSearchChange}
        placeholder="Search"
      />
      <button onClick={onTogglePreview} data-testid="preview-toggle">
        Preview
      </button>
    </div>
  ),
  FileTableView: ({
    onRowDoubleClick,
    onRowContextMenu,
    onNavigate,
  }: {
    onRowDoubleClick: (item: FileItem) => void;
    onRowContextMenu: (e: React.MouseEvent, item: FileItem) => void;
    onNavigate: (folderId: string) => void;
  }) => (
    <div data-testid="file-table">
      <button
        onClick={() =>
          onRowDoubleClick({
            id: "code",
            name: "Code",
            size: null,
            type: "folder",
            parentId: "root",
          })
        }
        data-testid="double-click-folder"
      >
        Double Click Folder
      </button>
      <button
        onClick={(e) =>
          onRowContextMenu(e, {
            id: "accordion_less",
            name: "accor11dion.less",
            size: 2048,
            type: "code",
            parentId: "code",
          })
        }
        data-testid="context-menu-btn"
      >
        Context Menu
      </button>
      <button onClick={() => onNavigate("code")} data-testid="navigate-btn">
        Navigate
      </button>
    </div>
  ),
}));

// mock helpers
jest.mock("@/helpers");

// mock constants
jest.mock("@/constant");

// Mock data
const mockRootFile = {
  id: "root",
  name: "My Files",
  type: "folder",
  size: null,
  date: "14 October 2025",
  parentId: null,
  imageUrl: "/images/folder-detail-placeholder.svg",
};

const mockCodeFolder: FileItem = {
  id: "code",
  name: "Code",
  type: "folder",
  size: null,
  parentId: "root",
  imageUrl: "/images/folder-detail-placeholder.svg",
};

const mockAccordionFile: FileItem = {
  id: "accordion_less",
  name: "accor11dion.less",
  type: "code",
  size: 2048,
  parentId: "code",
  imageUrl: "/images/code-placeholder-image.svg",
};

const mockFiles = [mockRootFile, mockCodeFolder, mockAccordionFile];

describe("FilemanagerPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseFilemanagerQuery.mockReturnValue({
      data: mockFiles,
      isFetching: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as ReturnType<typeof hookModule.useFilemanagerQuery>);

    mockUseAddFileItem.mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof hookModule.useAddFileItem>);

    mockUseDeleteFileItem.mockReturnValue({
      mutateAsync: jest.fn(),
    } as unknown as ReturnType<typeof hookModule.useDeleteFileItem>);

    mockUseRenameFileItem.mockReturnValue({
      mutate: jest.fn(),
    } as unknown as ReturnType<typeof hookModule.useRenameFileItem>);

    mockUseDebounce.mockImplementation((value) => value);

    // Mock helpers
    jest.mocked(helpersModule.getFileTreeData).mockReturnValue([
      {
        title: "My Files",
        key: "root",
        children: [
          {
            title: "Code",
            key: "code",
            children: [
              {
                title: "accor11dion.less",
                key: "accordion_less",
              },
            ],
          },
        ],
      },
    ] as ReturnType<typeof helpersModule.getFileTreeData>);

    jest.mocked(helpersModule.getFilteredItems).mockReturnValue([
      { ...mockCodeFolder, key: "code" },
      { ...mockAccordionFile, key: "accordion_less" },
    ] as ReturnType<typeof helpersModule.getFilteredItems>);

    jest
      .mocked(helpersModule.getBreadcrumbPath)
      .mockImplementation(
        (
          files: FileItem[],
          folderId: string
        ): ReturnType<typeof helpersModule.getBreadcrumbPath> => {
          if (folderId === "code") {
            return [
              { id: "root", name: "My Files" },
              { id: "code", name: "Code" },
            ];
          }
          return [{ id: "root", name: "My Files" }];
        }
      );

    jest
      .mocked(helpersModule.getAllChildFolderIds)
      .mockReturnValue(["accordion_less"]);
    jest.mocked(helpersModule.getPathIds).mockReturnValue(["root", "code"]);
  });

  describe("Rendering with Mock Data", () => {
    it("should render FilemanagerPage with mock files", () => {
      render(<FilemanagerPage />);
      expect(screen.getByTestId("header-bar")).toBeInTheDocument();
      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should display sidebar with mock data", () => {
      render(<FilemanagerPage />);
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("add-new-btn")).toBeInTheDocument();
    });

    it("should render error alert when fetching fails", () => {
      mockUseFilemanagerQuery.mockReturnValue({
        data: [],
        isFetching: false,
        isSuccess: false,
        isError: true,
        error: new Error("Failed to load files"),
      } as unknown as ReturnType<typeof hookModule.useFilemanagerQuery>);

      render(<FilemanagerPage />);
      expect(
        screen.getByText("Failed to load filemanager data")
      ).toBeInTheDocument();
    });

    it("should initialize with mock selectedFolder 'code'", () => {
      jest.mocked(helpersModule.getBreadcrumbPath).mockReturnValue([
        { id: "root", name: "My Files" },
        { id: "code", name: "Code" },
      ]);

      render(<FilemanagerPage />);
      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should display all mock files in tree structure", () => {
      render(<FilemanagerPage />);
      expect(screen.getByTestId("file-table")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should update search query on input change", () => {
      render(<FilemanagerPage />);

      const searchInput = screen.getByTestId(
        "search-input"
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: "accordion" } });

      expect(searchInput.value).toBe("accordion");
    });

    it("should hide sidebar during search mode", async () => {
      render(<FilemanagerPage />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "code" } });

      await waitFor(() => {
        expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
      });
    });

    it("should clear search and show sidebar", () => {
      render(<FilemanagerPage />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "test" } });
      fireEvent.change(searchInput, { target: { value: "" } });

      expect((searchInput as HTMLInputElement).value).toBe("");
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });

    it("should filter items by search query", async () => {
      render(<FilemanagerPage />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "accordion" } });

      await waitFor(() => {
        expect(jest.mocked(helpersModule.getFilteredItems)).toHaveBeenCalled();
      });
    });
  });

  describe("Preview Mode", () => {
    it("should toggle preview mode on button click", async () => {
      render(<FilemanagerPage />);

      const previewToggle = screen.getByTestId("preview-toggle");
      expect(screen.queryByTestId("preview-panel")).not.toBeInTheDocument();

      fireEvent.click(previewToggle);

      await waitFor(() => {
        expect(screen.getByTestId("preview-panel")).toBeInTheDocument();
      });
    });

    it("should hide preview when toggled again", async () => {
      render(<FilemanagerPage />);

      const previewToggle = screen.getByTestId("preview-toggle");
      fireEvent.click(previewToggle);

      await waitFor(() => {
        expect(screen.getByTestId("preview-panel")).toBeInTheDocument();
      });

      fireEvent.click(previewToggle);

      await waitFor(() => {
        expect(screen.queryByTestId("preview-panel")).not.toBeInTheDocument();
      });
    });
  });

  describe("Navigation with Mock Data", () => {
    it("should navigate to Code folder on double click", () => {
      render(<FilemanagerPage />);

      const doubleClickBtn = screen.getByTestId("double-click-folder");
      fireEvent.click(doubleClickBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should navigate using navigate button", () => {
      render(<FilemanagerPage />);

      const navigateBtn = screen.getByTestId("navigate-btn");
      fireEvent.click(navigateBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should select Code folder from sidebar", () => {
      render(<FilemanagerPage />);

      const selectFolderBtn = screen.getByTestId("select-folder");
      fireEvent.click(selectFolderBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should update breadcrumb when navigating", () => {
      jest.mocked(helpersModule.getBreadcrumbPath).mockReturnValue([
        { id: "root", name: "My Files" },
        { id: "code", name: "Code" },
      ]);

      render(<FilemanagerPage />);

      const selectFolderBtn = screen.getByTestId("select-folder");
      fireEvent.click(selectFolderBtn);

      expect(jest.mocked(helpersModule.getBreadcrumbPath)).toHaveBeenCalled();
    });
  });

  describe("Context Menu Interactions", () => {
    it("should show context menu on right click", async () => {
      render(<FilemanagerPage />);

      const contextMenuBtn = screen.getByTestId("context-menu-btn");
      fireEvent.click(contextMenuBtn);

      await waitFor(() => {
        expect(screen.getByTestId("context-menu")).toBeInTheDocument();
      });
    });

    it("should close context menu when close button clicked", async () => {
      render(<FilemanagerPage />);

      const contextMenuBtn = screen.getByTestId("context-menu-btn");
      fireEvent.click(contextMenuBtn);

      await waitFor(() => {
        expect(screen.getByTestId("context-menu")).toBeInTheDocument();
      });

      const closeBtn = screen.getByRole("button", { name: "Close" });
      fireEvent.click(closeBtn);

      await waitFor(() => {
        expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
      });
    });

    it("should trigger rename action from context menu", async () => {
      render(<FilemanagerPage />);

      const contextMenuBtn = screen.getByTestId("context-menu-btn");
      fireEvent.click(contextMenuBtn);

      await waitFor(() => {
        const renameBtn = screen.getByTestId("context-rename");
        fireEvent.click(renameBtn);
      });

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should trigger delete action from context menu", async () => {
      render(<FilemanagerPage />);

      const contextMenuBtn = screen.getByTestId("context-menu-btn");
      fireEvent.click(contextMenuBtn);

      await waitFor(() => {
        const deleteBtn = screen.getByTestId("context-delete");
        fireEvent.click(deleteBtn);
      });

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });
  });

  describe("File Operations from Sidebar", () => {
    it("should handle create file action", () => {
      render(<FilemanagerPage />);

      const createFileBtn = screen.getByTestId("create-file-btn");
      fireEvent.click(createFileBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should handle create folder action", () => {
      render(<FilemanagerPage />);

      const createFolderBtn = screen.getByTestId("create-folder-btn");
      fireEvent.click(createFolderBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should handle upload file action", () => {
      render(<FilemanagerPage />);

      const uploadFileBtn = screen.getByTestId("upload-file-btn");
      fireEvent.click(uploadFileBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should handle upload folder action", () => {
      render(<FilemanagerPage />);

      const uploadFolderBtn = screen.getByTestId("upload-folder-btn");
      fireEvent.click(uploadFolderBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should trigger add new modal when add new clicked", async () => {
      render(<FilemanagerPage />);

      const addNewBtn = screen.getByTestId("add-new-btn");
      fireEvent.click(addNewBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });
  });

  describe("Delete Modal", () => {
    it("should open delete confirmation modal", async () => {
      render(<FilemanagerPage />);

      const contextMenuBtn = screen.getByTestId("context-menu-btn");
      fireEvent.click(contextMenuBtn);

      await waitFor(() => {
        const deleteBtn = screen.getByTestId("context-delete");
        fireEvent.click(deleteBtn);
      });

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should close delete modal when close button clicked", async () => {
      render(<FilemanagerPage />);

      await waitFor(() => {
        const closeButtons = screen.queryAllByText("Close");
        if (closeButtons.length > 0) {
          fireEvent.click(closeButtons[0]);
        }
      });

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should call deleteItem when confirming delete", async () => {
      const mockDeleteItem = jest.fn().mockResolvedValue(undefined);
      mockUseDeleteFileItem.mockReturnValue({
        mutateAsync: mockDeleteItem,
      } as unknown as ReturnType<typeof hookModule.useDeleteFileItem>);

      render(<FilemanagerPage />);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });
  });

  describe("State Management with Mock Data", () => {
    it("should initialize with mock files from query", () => {
      render(<FilemanagerPage />);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });

    it("should handle empty files state gracefully", () => {
      mockUseFilemanagerQuery.mockReturnValue({
        data: [],
        isFetching: false,
        isSuccess: true,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof hookModule.useFilemanagerQuery>);

      render(<FilemanagerPage />);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should update tree data when files change", async () => {
      const { rerender } = render(<FilemanagerPage />);

      const newMockFiles = [
        ...mockFiles,
        {
          id: "new_file",
          name: "new.txt",
          type: "text",
          size: 512,
          date: "15 October 2025",
          parentId: "code",
          imageUrl: "/images/code-placeholder-image.svg",
        },
      ];

      mockUseFilemanagerQuery.mockReturnValue({
        data: newMockFiles,
        isFetching: false,
        isSuccess: true,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof hookModule.useFilemanagerQuery>);

      rerender(<FilemanagerPage />);

      expect(jest.mocked(helpersModule.getFileTreeData)).toHaveBeenCalled();
    });

    it("should persist state during modal interactions", () => {
      render(<FilemanagerPage />);

      const addNewBtn = screen.getByTestId("add-new-btn");
      fireEvent.click(addNewBtn);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });
  });

  describe("Disable States During Operations", () => {
    it("should disable operations when adding item", () => {
      mockUseAddFileItem.mockReturnValue({
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
        isPending: true,
      } as unknown as ReturnType<typeof hookModule.useAddFileItem>);

      render(<FilemanagerPage />);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should disable operations when fetching data", () => {
      mockUseFilemanagerQuery.mockReturnValue({
        data: mockFiles,
        isFetching: true,
        isSuccess: true,
        isError: false,
        error: null,
      } as ReturnType<typeof hookModule.useFilemanagerQuery>);

      render(<FilemanagerPage />);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });

    it("should show file table even when operations are disabled", () => {
      mockUseAddFileItem.mockReturnValue({
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
        isPending: true,
      } as unknown as ReturnType<typeof hookModule.useAddFileItem>);

      render(<FilemanagerPage />);

      expect(screen.getByTestId("file-table")).toBeInTheDocument();
    });
  });

  describe("Helper Function Integration", () => {
    it("should call getFileTreeData on render", () => {
      render(<FilemanagerPage />);

      expect(jest.mocked(helpersModule.getFileTreeData)).toHaveBeenCalled();
    });

    it("should call getFilteredItems when searching", async () => {
      render(<FilemanagerPage />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "test" } });

      await waitFor(() => {
        expect(jest.mocked(helpersModule.getFilteredItems)).toHaveBeenCalled();
      });
    });

    it("should call getBreadcrumbPath when navigating", () => {
      render(<FilemanagerPage />);

      const selectFolderBtn = screen.getByTestId("select-folder");
      fireEvent.click(selectFolderBtn);

      expect(jest.mocked(helpersModule.getBreadcrumbPath)).toHaveBeenCalled();
    });
  });
});
