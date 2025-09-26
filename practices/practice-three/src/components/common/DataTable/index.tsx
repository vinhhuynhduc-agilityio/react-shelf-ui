import { Table } from "antd";
import { TableProps } from "antd/es/table";

interface CustomTableProps<T>
  extends Omit<TableProps<T>, "columns" | "dataSource"> {
  columns: TableProps<T>["columns"];
  dataSource: T[];
  tableHeight: number;
}

// Reusable DataTable component
const DataTable = <T,>({
  columns,
  dataSource,
  tableHeight,
  ...rest
}: CustomTableProps<T>) => {
  return (
    <Table<T>
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered
      scroll={{
        x: "max-content",
        y: tableHeight > 0 ? tableHeight : undefined,
      }}
      defaultExpandAllRows
      {...rest}
    />
  );
};

export default DataTable;
