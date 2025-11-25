import { render, screen, fireEvent } from "@testing-library/react";
import { FileTableView } from ".";
import type { FileItem, BreadcrumbItem } from "@/types";
import type { ColumnsType } from "antd/es/table";

jest.mock("@/components", () => ({
  DataTable: ({
    dataSource,
    isLoading,
    isFetching,
    onRow,
  }: {
    dataSource: (FileItem & { key: string })[];
    isLoading: boolean;
    isFetching: boolean;
    onRow: (record: FileItem & { key: string }) => {
      onClick: () => void;
      onDoubleClick: () => void;
      onContextMenu: (e: React.MouseEvent) => void;
      className: string;
    };
  }) => (
    <div data-testid="data-table">
      {isLoading && <div>Loading...</div>}
      {isFetching && <div>Fetching...</div>}
      <table>
        <tbody>
          {dataSource.map((item) => {
            const rowProps = onRow(item);
            return (
              <tr
                key={item.key}
                onClick={rowProps.onClick}
                onDoubleClick={rowProps.onDoubleClick}
                onContextMenu={rowProps.onContextMenu}
                className={rowProps.className}
                data-testid={`row-${item.id}`}
              >
                <td>{item.name}</td>
                <td>{item.type}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ),
  Breadcrumb: ({
    path,
    onNavigate,
    currentFolderId,
  }: {
    path: BreadcrumbItem[];
    onNavigate: (id: string) => void;
    currentFolderId: string;
  }) => (
    <nav data-testid="breadcrumb">
      {path.map((item, index) => (
        <div key={item.id}>
          {index > 0 && <span> {">"} </span>}
          {item.id === currentFolderId ? (
            <span aria-current="page">{item.name}</span>
          ) : (
            <button onClick={() => onNavigate(item.id)}>{item.name}</button>
          )}
        </div>
      ))}
    </nav>
  ),
  IconButton: ({
    onClick,
    iconStyles,
  }: {
    onClick?: (e: React.MouseEvent) => void;
    iconStyles?: string;
  }) => (
    <button
      onClick={onClick}
      data-testid={`icon-btn-${iconStyles}`}
      aria-label="back"
    />
  ),
}));

describe("FileTableView", () => {
  const sampleFolder: FileItem & { key: string } = {
    id: "folder-001",
    name: "Documents",
    size: null,
    type: "folder",
    parentId: "root",
    key: "folder-001",
  };

  const sampleFile: FileItem & { key: string } = {
    id: "file-001",
    name: "document.pdf",
    size: 2048,
    type: "application/pdf",
    parentId: "folder-001",
    extraInfo: { author: "John Doe" },
    key: "file-001",
  };

  const sampleFile2: FileItem & { key: string } = {
    id: "file-002",
    name: "image.png",
    size: 1024,
    type: "image/png",
    parentId: "folder-001",
    imageUrl: "https://example.com/image.png",
    key: "file-002",
  };

  const defaultColumns: ColumnsType<FileItem> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
  ];

  const defaultBreadcrumbPath: BreadcrumbItem[] = [
    { id: "root", name: "Root" },
    { id: "folder-001", name: "Documents" },
  ];

  const defaultProps = {
    filteredItems: [sampleFolder, sampleFile, sampleFile2],
    columns: defaultColumns,
    tableHeight: 400,
    isFetching: false,
    isLoading: false,
    isSearchMode: false,
    debouncedSearch: "",
    searchPath: "",
    breadcrumbPath: defaultBreadcrumbPath,
    selectedFolder: "folder-001",
    selectedItem: null,
    onNavigate: jest.fn(),
    onRowClick: jest.fn(),
    onRowDoubleClick: jest.fn(),
    onRowContextMenu: jest.fn(),
    onClearSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render table with filtered items sorted (folders first, then alphabetically)", () => {
    render(<FileTableView {...defaultProps} />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    const rows = screen.getAllByTestId(/^row-/);

    expect(rows[0]).toHaveTextContent("Documents");
    expect(rows[1]).toHaveTextContent("document.pdf");
    expect(rows[2]).toHaveTextContent("image.png");
  });

  it("should render breadcrumb in normal mode", () => {
    render(<FileTableView {...defaultProps} isSearchMode={false} />);

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Root")).toBeInTheDocument();

    const breadcrumb = screen.getByTestId("breadcrumb");
    expect(breadcrumb).toHaveTextContent("Documents");
  });

  it("should render search result header in search mode", () => {
    render(
      <FileTableView
        {...defaultProps}
        isSearchMode={true}
        debouncedSearch="pdf"
        searchPath="/Documents"
      />
    );

    expect(
      screen.getByText(/Search results in \/Documents/)
    ).toBeInTheDocument();
    expect(screen.queryByTestId("breadcrumb")).not.toBeInTheDocument();
  });

  it("should call onClearSearch when back button clicked in search mode", () => {
    render(
      <FileTableView
        {...defaultProps}
        isSearchMode={true}
        debouncedSearch="pdf"
        searchPath="/Documents"
      />
    );

    const backBtn = screen.getByTestId(
      "icon-btn-fa-solid fa-chevron-left fa-sm text-[#94A1B3]"
    );
    fireEvent.click(backBtn);

    expect(defaultProps.onClearSearch).toHaveBeenCalledTimes(1);
  });

  it("should call onRowClick when row clicked", () => {
    render(<FileTableView {...defaultProps} />);

    fireEvent.click(screen.getByTestId("row-file-001"));

    expect(defaultProps.onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "file-001", name: "document.pdf" })
    );
  });

  it("should call onRowDoubleClick when row double clicked", () => {
    render(<FileTableView {...defaultProps} />);

    fireEvent.doubleClick(screen.getByTestId("row-file-001"));

    expect(defaultProps.onRowDoubleClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "file-001", name: "document.pdf" })
    );
  });

  it("should call onRowContextMenu with event and record when row right clicked", () => {
    render(<FileTableView {...defaultProps} />);

    fireEvent.contextMenu(screen.getByTestId("row-file-001"));

    expect(defaultProps.onRowContextMenu).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ id: "file-001", name: "document.pdf" })
    );
  });

  it("should highlight selected row with correct className", () => {
    render(<FileTableView {...defaultProps} selectedItem={sampleFile} />);

    const selectedRow = screen.getByTestId("row-file-001");
    expect(selectedRow).toHaveClass("ant-table-row-selected");
  });

  it("should not highlight non-selected rows", () => {
    render(<FileTableView {...defaultProps} selectedItem={sampleFile} />);

    const otherRow = screen.getByTestId("row-file-002");
    expect(otherRow).not.toHaveClass("ant-table-row-selected");
  });

  it("should call onNavigate when breadcrumb item clicked", () => {
    render(<FileTableView {...defaultProps} />);

    fireEvent.click(screen.getByText("Root"));

    expect(defaultProps.onNavigate).toHaveBeenCalledWith("root");
  });

  it("should hide table when in search mode with empty results", () => {
    const { container } = render(
      <FileTableView
        {...defaultProps}
        isSearchMode={true}
        debouncedSearch="xyz"
        filteredItems={[]}
      />
    );

    const tableContainer = container.querySelector(".hidden");
    expect(tableContainer).toBeInTheDocument();
  });

  it("should show table when in search mode with results", () => {
    const { container } = render(
      <FileTableView
        {...defaultProps}
        isSearchMode={true}
        debouncedSearch="pdf"
        filteredItems={[sampleFile]}
      />
    );

    const hiddenContainer = container.querySelector(".hidden");
    expect(hiddenContainer).not.toBeInTheDocument();
  });

  it("should pass correct props to DataTable", () => {
    render(<FileTableView {...defaultProps} tableHeight={600} />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("should sort files alphabetically within same type", () => {
    const unsortedItems: (FileItem & { key: string })[] = [
      {
        id: "file-003",
        name: "zebra.txt",
        size: 512,
        type: "text/plain",
        parentId: "folder-001",
        key: "file-003",
      },
      {
        id: "file-004",
        name: "apple.txt",
        size: 256,
        type: "text/plain",
        parentId: "folder-001",
        key: "file-004",
      },
      sampleFolder,
    ];

    render(<FileTableView {...defaultProps} filteredItems={unsortedItems} />);

    const rows = screen.getAllByTestId(/^row-/);
    expect(rows[0]).toHaveTextContent("Documents");
    expect(rows[1]).toHaveTextContent("apple.txt");
    expect(rows[2]).toHaveTextContent("zebra.txt");
  });
});
