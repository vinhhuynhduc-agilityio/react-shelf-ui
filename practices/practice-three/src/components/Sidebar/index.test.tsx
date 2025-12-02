import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from ".";
import type { DataNode } from "antd/es/tree";
import type { DropdownOption } from "@/types";

jest.mock("antd", () => ({
  Tree: ({
    treeData,
    onSelect,
  }: {
    treeData: DataNode[];
    onSelect: (keys: React.Key[]) => void;
    onExpand: (keys: React.Key[]) => void;
    selectedKeys: React.Key[];
    expandedKeys: React.Key[];
    defaultExpandedKeys: React.Key[];
    height: number;
    style: React.CSSProperties;
  }) => (
    <div data-testid="tree">
      {treeData.map((node) => (
        <div
          key={node.key}
          data-testid={`tree-node-${node.key}`}
          onClick={() => onSelect([node.key!])}
          style={{ paddingLeft: "20px" }}
        >
          {typeof node.title === "function" ? node.title(node) : node.title}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components", () => ({
  Icon: ({ className }: { className?: string }) => (
    <svg data-testid="icon-svg" className={className} />
  ),
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    ref?: React.Ref<HTMLButtonElement>;
  } & Record<string, unknown>) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="add-new-button"
      {...props}
    >
      {children}
    </button>
  ),
  Dropdown: ({
    options,
    onSelect,
    isOpen,
    setIsOpen,
  }: {
    options: DropdownOption[];
    onSelect: (option: DropdownOption) => void;
    isOpen: boolean;
    setIsOpen: () => void;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
  }) => (
    <div data-testid="dropdown">
      {isOpen && (
        <div data-testid="dropdown-menu">
          {options.map((option) => (
            <div
              key={option.key}
              data-testid={`dropdown-option-${option.key}`}
              onClick={() => {
                onSelect(option);
                setIsOpen();
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
  StatusBar: ({
    message,
    onClear,
  }: {
    message: string | null;
    type: "success" | "error";
    onClear: () => void;
  }) => (
    <div data-testid="status-bar">
      {message && (
        <div>
          <span>{message}</span>
          <button onClick={onClear} data-testid="status-bar-clear">
            Clear
          </button>
        </div>
      )}
    </div>
  ),
}));

jest.mock("@/constant", () => ({
  dropdownOptions: [
    { label: "New Folder", value: "new_folder", key: "create-folder" },
    { label: "Upload Folder", value: "upload_folder", key: "upload-folder" },
    { label: "Delete Folder", value: "delete_folder", key: "delete-folder" },
  ],
}));

describe("Sidebar", () => {
  const mockTreeData: DataNode[] = [
    { key: "root", title: "Root", children: [] },
    { key: "folder1", title: "Folder 1", children: [] },
    { key: "folder2", title: "Folder 2", children: [] },
  ];

  const mockOnExpand = jest.fn();
  const mockOnSelect = jest.fn();
  const mockOnAddNewClick = jest.fn();
  const mockOnDropdownSelect = jest.fn();
  const mockOnDropdownClose = jest.fn();
  const mockOnStatusBarClear = jest.fn();
  const buttonRef = { current: null };

  const defaultProps = {
    treeData: mockTreeData,
    expandedKeys: ["root"],
    selectedKey: "root",
    treeHeight: 400,
    isDropdownOpen: false,
    isDisabled: false,
    isUploadingFolder: false,
    isDeletingFolder: false,
    isRenaming: false,
    isFetching: false,
    statusBar: null,
    buttonRef,
    onExpand: mockOnExpand,
    onSelect: mockOnSelect,
    onAddNewClick: mockOnAddNewClick,
    onDropdownSelect: mockOnDropdownSelect,
    onDropdownClose: mockOnDropdownClose,
    onStatusBarClear: mockOnStatusBarClear,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render sidebar with all tree nodes on initial load", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText("Root")).toBeInTheDocument();
    expect(screen.getByText("Folder 1")).toBeInTheDocument();
    expect(screen.getByText("Folder 2")).toBeInTheDocument();
    expect(screen.getByTestId("add-new-button")).toBeInTheDocument();
  });

  it("should match snapshot on initial load", () => {
    const { container } = render(<Sidebar {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it("should call onAddNewClick when add new button is clicked", () => {
    render(<Sidebar {...defaultProps} />);

    const addButton = screen.getByTestId("add-new-button");
    fireEvent.click(addButton);

    expect(mockOnAddNewClick).toHaveBeenCalled();
  });

  it("should disable add new button when isDisabled is true", () => {
    render(<Sidebar {...defaultProps} isDisabled={true} />);

    const addButton = screen.getByTestId("add-new-button");

    expect(addButton).toBeDisabled();
    expect(screen.getByText(/Creating.../i)).toBeInTheDocument();
  });

  it("should show uploading status when isUploadingFolder is true", () => {
    render(
      <Sidebar {...defaultProps} isDisabled={true} isUploadingFolder={true} />
    );

    expect(screen.getByText("Uploading folder...")).toBeInTheDocument();
  });

  it("should show deleting status when isDeletingFolder is true", () => {
    render(
      <Sidebar {...defaultProps} isDisabled={true} isDeletingFolder={true} />
    );

    expect(screen.getByText("Deleting folder...")).toBeInTheDocument();
  });

  it("should show renaming status when isRenaming is true", () => {
    render(<Sidebar {...defaultProps} isDisabled={true} isRenaming={true} />);

    expect(screen.getByText("Renaming...")).toBeInTheDocument();
  });

  it("should call onSelect when tree node is clicked", () => {
    render(<Sidebar {...defaultProps} />);

    const treeNode = screen.getByTestId("tree-node-folder1");
    fireEvent.click(treeNode);

    expect(mockOnSelect).toHaveBeenCalledWith(["folder1"]);
  });

  it("should call onDropdownSelect when dropdown option is clicked", () => {
    render(<Sidebar {...defaultProps} isDropdownOpen={true} />);

    const option = screen.getByTestId("dropdown-option-create-folder");
    fireEvent.click(option);

    expect(mockOnDropdownSelect).toHaveBeenCalledWith({
      label: "New Folder",
      value: "new_folder",
      key: "create-folder",
    });
  });

  it("should call onDropdownClose when dropdown option is selected", () => {
    render(<Sidebar {...defaultProps} isDropdownOpen={true} />);

    const option = screen.getByTestId("dropdown-option-upload-folder");
    fireEvent.click(option);

    expect(mockOnDropdownClose).toHaveBeenCalled();
  });

  it("should display status bar message when provided", () => {
    render(
      <Sidebar
        {...defaultProps}
        statusBar={{ message: "Folder created successfully", type: "success" }}
      />
    );

    expect(screen.getByText("Folder created successfully")).toBeInTheDocument();
  });

  it("should call onStatusBarClear when clear button is clicked", () => {
    render(
      <Sidebar
        {...defaultProps}
        statusBar={{ message: "Error occurred", type: "error" }}
      />
    );

    const clearButton = screen.getByTestId("status-bar-clear");
    fireEvent.click(clearButton);

    expect(mockOnStatusBarClear).toHaveBeenCalled();
  });

  it("should match snapshot with status bar visible", () => {
    const { container } = render(
      <Sidebar
        {...defaultProps}
        statusBar={{ message: "Operation completed", type: "success" }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with dropdown open", () => {
    const { container } = render(
      <Sidebar {...defaultProps} isDropdownOpen={true} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should render tree with selected key highlighted", () => {
    render(<Sidebar {...defaultProps} selectedKey="folder2" />);

    expect(screen.getByTestId("tree")).toBeInTheDocument();
  });

  it("should match snapshot with different tree structure", () => {
    const complexTreeData: DataNode[] = [
      {
        key: "root",
        title: "Root",
        children: [
          { key: "sub1", title: "Sub Folder 1" },
          { key: "sub2", title: "Sub Folder 2" },
        ],
      },
    ];

    const { container } = render(
      <Sidebar {...defaultProps} treeData={complexTreeData} />
    );

    expect(container).toMatchSnapshot();
  });
});
