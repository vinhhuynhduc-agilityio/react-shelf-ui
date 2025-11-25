import { render, screen, fireEvent } from "@testing-library/react";
import PivotTreeView from ".";
import * as helpers from "@/helpers";
import { MOCK_PIVOT, MOCK_PIVOT_EMPTY } from "@/__mocks__";
import { ColumnsType } from "antd/es/table";
import { CustomExpandIconProps, DataSourceItem } from "@/types";

jest.mock("@/helpers", () => ({
  generateTreeData: jest.fn(),
  generatePivotTreeColumns: jest.fn(),
}));

jest.mock("@/components", () => ({
  DataTable: ({
    columns,
    dataSource,
    tableHeight,
    isLoading,
    isFetching,
    expandedRowKeys,
    onExpand,
    expandable,
  }: {
    columns: ColumnsType<DataSourceItem>;
    dataSource: DataSourceItem[];
    tableHeight: number;
    isLoading: boolean;
    isFetching: boolean;
    expandedRowKeys?: string[];
    onExpand?: (expanded: boolean, record: DataSourceItem) => void;
    expandable?: {
      expandIcon?: (props: CustomExpandIconProps) => React.ReactNode;
    };
  }) => (
    <div data-testid="data-table">
      <span data-testid="columns-count">Columns: {columns.length}</span>
      <span data-testid="data-count">Data: {dataSource.length}</span>
      <span data-testid="height">Height: {tableHeight}</span>
      <span data-testid="loading">Loading: {isLoading.toString()}</span>
      <span data-testid="fetching">Fetching: {isFetching.toString()}</span>
      <span data-testid="expanded-keys">
        Expanded: {expandedRowKeys?.join(",") || "none"}
      </span>

      {/* Render clickable expand buttons for rows that have children */}
      {dataSource.map((record) => {
        const hasChildren =
          Array.isArray(record.children) && record.children.length > 0;
        if (!hasChildren) return null;
        const isExpanded = expandedRowKeys?.includes(
          record.key as unknown as string
        );
        return (
          <button
            key={record.key as unknown as string}
            data-testid={`expand-icon-${record.key}`}
            onClick={() => onExpand?.(!isExpanded, record)}
          >
            {isExpanded ? "Expanded" : "Collapsed"} - {record.key}
          </button>
        );
      })}

      {/* Verify that custom expand icon is passed correctly */}
      {expandable?.expandIcon && (
        <div data-testid="custom-expand-icon">
          {expandable.expandIcon({
            expanded: true,
            onExpand: jest.fn(),
            record: {
              key: "test",
              name: "Test",
              children: [{ key: "child", name: "Child" }],
            },
          })}
        </div>
      )}
    </div>
  ),
  ErrorAlert: ({
    title,
    errors,
    centerScreen,
  }: {
    title: string;
    errors: string[];
    centerScreen?: boolean;
  }) => (
    <div data-testid="error-alert">
      {title}: {errors.join(", ")}
      {centerScreen && " (centered)"}
    </div>
  ),
}));

describe("PivotTreeView", () => {
  const mockTreeData = [
    {
      key: "asia",
      title: "Asia",
      children: [{ key: "vietnam", title: "Vietnam" }],
    },
    { key: "europe", title: "Europe" },
  ];
  const mockTreeColumns = [
    { title: "Region", dataIndex: "title", key: "title" },
    { title: "GDP", dataIndex: "gdp", key: "gdp" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (helpers.generateTreeData as jest.Mock).mockReturnValue(mockTreeData);
    (helpers.generatePivotTreeColumns as jest.Mock).mockReturnValue(
      mockTreeColumns
    );
  });

  it("renders DataTable with correct tree data and columns", () => {
    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={false}
        pivotError={null}
      />
    );

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByTestId("columns-count")).toHaveTextContent("Columns: 2");
    expect(screen.getByTestId("data-count")).toHaveTextContent("Data: 2");
    expect(screen.getByTestId("height")).toHaveTextContent("Height: 600");
    expect(helpers.generateTreeData).toHaveBeenCalledWith(MOCK_PIVOT);
    expect(helpers.generatePivotTreeColumns).toHaveBeenCalledWith(MOCK_PIVOT);
  });

  it("auto-expands all top-level nodes when data loads and not loading", () => {
    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={false}
      />
    );

    expect(screen.getByTestId("expanded-keys")).toHaveTextContent(
      "Expanded: asia,europe"
    );
  });

  it("does not auto-expand when isLoading is true", () => {
    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={true}
        isErrorPivot={false}
      />
    );

    expect(screen.getByTestId("expanded-keys")).toHaveTextContent(
      "Expanded: none"
    );
  });

  it("does not auto-expand when treeData is empty", () => {
    (helpers.generateTreeData as jest.Mock).mockReturnValue([]);

    render(
      <PivotTreeView
        pivot={MOCK_PIVOT_EMPTY}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={false}
      />
    );

    expect(screen.getByTestId("expanded-keys")).toHaveTextContent(
      "Expanded: none"
    );
  });

  it("toggles expanded keys correctly when clicking expand icon", () => {
    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={false}
      />
    );

    const asiaButton = screen.getByTestId("expand-icon-asia");
    expect(asiaButton).toHaveTextContent("Expanded - asia");

    fireEvent.click(asiaButton);
    expect(screen.getByTestId("expanded-keys")).toHaveTextContent(
      "Expanded: europe"
    );
  });

  it("renders expand icon only for rows with children", () => {
    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={false}
      />
    );

    expect(screen.getByTestId("expand-icon-asia")).toBeInTheDocument();
    expect(screen.queryByTestId("expand-icon-europe")).not.toBeInTheDocument();
  });

  it("passes custom expand icon correctly", () => {
    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={false}
      />
    );

    expect(screen.getByTestId("custom-expand-icon")).toBeInTheDocument();
  });

  it("renders ErrorAlert when there is an error", () => {
    const error = new Error("Network failed");

    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={true}
        pivotError={error}
      />
    );

    expect(screen.getByTestId("error-alert")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to load pivot data: Network failed (centered)")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
  });

  it("does not render ErrorAlert when pivotError is null", () => {
    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={true}
        pivotError={null}
      />
    );

    expect(screen.queryByTestId("error-alert")).not.toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes loading states correctly", () => {
    render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={true}
        isErrorPivot={false}
      />
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("Loading: true");
    expect(screen.getByTestId("fetching")).toHaveTextContent("Fetching: true");
  });

  it("matches snapshot", () => {
    const { container } = render(
      <PivotTreeView
        pivot={MOCK_PIVOT}
        tableHeight={600}
        isLoading={false}
        isErrorPivot={false}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
