// PivotTable.tsViewx
import { useMemo } from "react";

// Helpers
import { generateDataSource, generatePivotTableColumns } from "@/helpers";

// Types
import { DataSourceItem, Pivot } from "@/types";

// Components
import { DataTable } from "@/components";

const PivotTableView = ({
  pivot,
  tableHeight,
  isLoading,
}: {
  pivot: Pivot[];
  tableHeight: number;
  isLoading: boolean;
}) => {
  const tableData: DataSourceItem[] = useMemo(
    () => generateDataSource(pivot),
    [pivot]
  );
  const tableColumns = useMemo(() => generatePivotTableColumns(pivot), [pivot]);

  return (
    <DataTable
      columns={tableColumns}
      dataSource={tableData}
      tableHeight={tableHeight}
      isLoading={isLoading}
    />
  );
};

export default PivotTableView;
