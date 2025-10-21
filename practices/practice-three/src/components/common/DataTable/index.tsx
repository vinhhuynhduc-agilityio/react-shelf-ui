import { Table } from "antd";
import { TableProps } from "antd/es/table";

interface CustomTableProps<T>
  extends Omit<TableProps<T>, "columns" | "dataSource"> {
  columns: TableProps<T>["columns"];
  dataSource: T[];
  tableHeight: number;
  isLoading?: boolean;
}

const DataTable = <T,>({
  columns,
  dataSource,
  tableHeight,
  isLoading = false,
  ...rest
}: CustomTableProps<T>) => {
  return (
    <Table<T>
      columns={columns}
      rowClassName="select-none"
      dataSource={dataSource}
      pagination={false}
      bordered
      scroll={{
        x: "max-content",
        y: tableHeight > 0 ? tableHeight : undefined,
      }}
      loading={isLoading}
      {...rest}
    />
  );
};

export default DataTable;
