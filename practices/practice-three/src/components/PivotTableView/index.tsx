// PivotTable.tsViewx
import { useMemo } from "react";

// Helpers
import { generateDataSource, generatePivotTableColumns } from "@/helpers";

// Types
import { DataSourceItem, Pivot } from "@/types";

// Components
import { DataTable, ErrorAlert } from "@/components";

const PivotTableView = ({
  pivot,
  tableHeight,
  isLoading,
  isErrorPivot,
  pivotError,
}: {
  pivot: Pivot[];
  tableHeight: number;
  isLoading: boolean;
  isErrorPivot: boolean;
  pivotError?: Error | null;
}) => {
  const tableData: DataSourceItem[] = useMemo(
    () => generateDataSource(pivot),
    [pivot]
  );
  const tableColumns = useMemo(() => generatePivotTableColumns(pivot), [pivot]);

  const renderApiError = () => (
    <ErrorAlert
      title="Failed to load pivot data"
      centerScreen
      errors={[...(isErrorPivot && pivotError ? [pivotError.message] : [])]}
    />
  );

  const renderContent = () => (
    <DataTable
      columns={tableColumns}
      dataSource={tableData}
      tableHeight={tableHeight}
      isLoading={isLoading}
      isFetching={isLoading}
    />
  );

  return <>{isErrorPivot ? renderApiError() : renderContent()}</>;
};

export default PivotTableView;
