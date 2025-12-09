import { useMemo } from "react";

// Helpers
import { generateDataSource, generatePivotTableColumns } from "@/helpers";

// Types
import { Pivot } from "@/types";

// Components
import { DataTable, ErrorAlert } from "@/components";

interface PivotTableViewProps {
  pivot: Pivot[];
  tableHeight: number;
  isLoading: boolean;
  isErrorPivot: boolean;
  pivotError?: Error | null;
}

const PivotTableView = ({
  pivot,
  tableHeight,
  isLoading,
  isErrorPivot,
  pivotError,
}: PivotTableViewProps) => {
  const tableData = useMemo(() => generateDataSource(pivot), [pivot]);
  const tableColumns = useMemo(() => generatePivotTableColumns(pivot), [pivot]);

  const renderError = () =>
    isErrorPivot && pivotError ? (
      <ErrorAlert
        title="Failed to load pivot data"
        centerScreen
        errors={[pivotError.message]}
      />
    ) : null;

  const renderTable = () => (
    <DataTable
      columns={tableColumns}
      dataSource={tableData}
      tableHeight={tableHeight}
      isLoading={isLoading}
      isFetching={isLoading}
    />
  );

  return <>{renderError() ?? renderTable()}</>;
};

export default PivotTableView;
