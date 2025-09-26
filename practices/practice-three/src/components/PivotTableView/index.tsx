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
}: {
  pivot: Pivot[];
  tableHeight: number;
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
    />
  );
};

export default PivotTableView;
