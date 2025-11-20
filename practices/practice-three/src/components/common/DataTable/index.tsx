import { Table } from "antd";
import { TableProps } from "antd/es/table";

interface CustomTableProps<T>
  extends Omit<TableProps<T>, "columns" | "dataSource"> {
  columns: TableProps<T>["columns"];
  dataSource: T[];
  tableHeight: number;
  isLoading?: boolean;
  isFetching?: boolean;
}

const DataTable = <T,>({
  columns,
  dataSource,
  tableHeight,
  isLoading = false,
  isFetching = false,
  ...rest
}: CustomTableProps<T>) => {
  const displayData = isFetching ? [] : dataSource;
  const shouldShowScroll =
    !isLoading && dataSource.length > 0 && tableHeight > 0;

  return (
    <Table<T>
      columns={columns}
      dataSource={displayData}
      pagination={false}
      bordered
      scroll={{
        x: "max-content",
        y: shouldShowScroll ? tableHeight : undefined,
      }}
      loading={isLoading}
      {...rest}
    />
  );
};

export default DataTable;
