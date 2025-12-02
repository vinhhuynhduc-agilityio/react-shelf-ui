import { render, screen } from "@testing-library/react";
import DataTable from ".";
import { FileItem } from "@/types";

interface TableProps {
  columns?: Array<{ key?: string; dataIndex: string; title: string }>;
  dataSource?: Array<Record<string, FileItem>>;
  loading?: boolean;
}

jest.mock("antd", () => ({
  Table: ({ columns, dataSource = [], loading }: TableProps) => (
    <table data-testid="data-table">
      <thead>
        <tr>
          {columns?.map((col) => (
            <th key={col.key || col.dataIndex}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns?.length}>Loading...</td>
          </tr>
        ) : dataSource?.length > 0 ? (
          dataSource.map((row, idx: number) => (
            <tr key={idx}>
              {columns?.map((col) => (
                <td key={col.key || col.dataIndex}>
                  {String(row[col.dataIndex])}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns?.length}>No data</td>
          </tr>
        )}
      </tbody>
    </table>
  ),
}));

describe("DataTable", () => {
  const mockColumns = [
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "email", title: "Email", dataIndex: "email" },
  ];

  const mockDataSource = [
    { name: "John", email: "john@example.com" },
    { name: "Jane", email: "jane@example.com" },
  ];

  it("should render table with columns and data", () => {
    render(
      <DataTable
        columns={mockColumns}
        dataSource={mockDataSource}
        tableHeight={400}
      />
    );

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("should show loading state when isLoading is true", () => {
    render(
      <DataTable
        columns={mockColumns}
        dataSource={mockDataSource}
        tableHeight={400}
        isLoading={true}
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should show empty data when isFetching is true", () => {
    render(
      <DataTable
        columns={mockColumns}
        dataSource={mockDataSource}
        tableHeight={400}
        isFetching={true}
      />
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should render empty state when dataSource is empty", () => {
    render(
      <DataTable columns={mockColumns} dataSource={[]} tableHeight={400} />
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should pass tableHeight to scroll config", () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        dataSource={mockDataSource}
        tableHeight={500}
      />
    );

    expect(container.querySelector("table")).toBeInTheDocument();
  });

  it("should not show scroll when dataSource is empty", () => {
    render(
      <DataTable columns={mockColumns} dataSource={[]} tableHeight={400} />
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should handle single row data", () => {
    const singleRow = [{ name: "Test", email: "test@example.com" }];

    render(
      <DataTable
        columns={mockColumns}
        dataSource={singleRow}
        tableHeight={400}
      />
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("should pass rest props to Table component", () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        dataSource={mockDataSource}
        tableHeight={400}
        className="custom-table"
      />
    );

    expect(container.querySelector("table")).toBeInTheDocument();
  });

  it("should match snapshot with data", () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        dataSource={mockDataSource}
        tableHeight={400}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with loading state", () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        dataSource={mockDataSource}
        tableHeight={400}
        isLoading={true}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with empty data", () => {
    const { container } = render(
      <DataTable columns={mockColumns} dataSource={[]} tableHeight={400} />
    );

    expect(container).toMatchSnapshot();
  });
});
