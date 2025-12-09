import { render, screen } from "@testing-library/react";
import PivotTableView from ".";

// Mock helpers
import * as helpers from "@/helpers";
import { MOCK_PIVOT } from "@/__mocks__";
import { ColumnsType } from "antd/es/table";
import { DataSourceItem } from "@/types";
jest.mock("@/helpers", () => ({
  generateDataSource: jest.fn(),
  generatePivotTableColumns: jest.fn(),
}));

// Mock components
jest.mock("@/components", () => ({
  DataTable: ({
    columns,
    dataSource,
    tableHeight,
    isLoading,
    isFetching,
  }: {
    columns: ColumnsType<DataSourceItem>;
    dataSource: DataSourceItem[];
    tableHeight: number;
    isLoading: boolean;
    isFetching: boolean;
  }) => (
    <div data-testid="data-table">
      <span>Columns: {columns.length}</span>
      <span>Data: {dataSource.length}</span>
      <span>Height: {tableHeight}</span>
      <span>Loading: {isLoading.toString()}</span>
      <span>Fetching: {isFetching.toString()}</span>
    </div>
  ),
  ErrorAlert: ({ title, errors }: { title: string; errors: string[] }) => (
    <div data-testid="error-alert">
      {title}: {errors.join(", ")}
    </div>
  ),
}));

describe("PivotTableView", () => {
  const mockColumns = [{ key: "col1" }, { key: "col2" }];
  const mockDataSource = [{ id: 1 }, { id: 2 }];

  beforeEach(() => {
    jest.clearAllMocks();
    (helpers.generateDataSource as jest.Mock).mockReturnValue(mockDataSource);
    (helpers.generatePivotTableColumns as jest.Mock).mockReturnValue(
      mockColumns
    );
  });

  it("renders DataTable with correct props when no error", () => {
    render(
      <PivotTableView
        pivot={MOCK_PIVOT}
        tableHeight={500}
        isLoading={false}
        isErrorPivot={false}
        pivotError={null}
      />
    );
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByText("Columns: 2")).toBeInTheDocument();
    expect(screen.getByText("Data: 2")).toBeInTheDocument();
    expect(screen.getByText("Height: 500")).toBeInTheDocument();
    expect(screen.getByText("Loading: false")).toBeInTheDocument();
    expect(screen.getByText("Fetching: false")).toBeInTheDocument();
    expect(helpers.generateDataSource).toHaveBeenCalledWith(MOCK_PIVOT);
    expect(helpers.generatePivotTableColumns).toHaveBeenCalledWith(MOCK_PIVOT);
  });

  it("renders ErrorAlert when isErrorPivot is true and pivotError exists", () => {
    const mockError = new Error("Test error");
    render(
      <PivotTableView
        pivot={MOCK_PIVOT}
        tableHeight={500}
        isLoading={false}
        isErrorPivot={true}
        pivotError={mockError}
      />
    );
    expect(screen.getByTestId("error-alert")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to load pivot data: Test error")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
  });

  it("does not render ErrorAlert when isErrorPivot is true but pivotError is null", () => {
    render(
      <PivotTableView
        pivot={MOCK_PIVOT}
        tableHeight={500}
        isLoading={false}
        isErrorPivot={true}
        pivotError={null}
      />
    );
    expect(screen.queryByTestId("error-alert")).not.toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("passes isLoading and isFetching to DataTable when loading", () => {
    render(
      <PivotTableView
        pivot={MOCK_PIVOT}
        tableHeight={500}
        isLoading={true}
        isErrorPivot={false}
        pivotError={null}
      />
    );
    expect(screen.getByText("Loading: true")).toBeInTheDocument();
    expect(screen.getByText("Fetching: true")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <PivotTableView
        pivot={MOCK_PIVOT}
        tableHeight={500}
        isLoading={false}
        isErrorPivot={false}
        pivotError={null}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
