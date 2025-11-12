import { useEffect, useMemo, useState } from "react";

// Helpers
import { generateTreeData, generatePivotTreeColumns } from "@/helpers";

// Types
import { CustomExpandIconProps, Pivot, TreeData } from "@/types";

// Components
import { DataTable, ErrorAlert } from "@/components";

const PivotTreeView = ({
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
  // state
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const treeData: TreeData[] = useMemo(() => generateTreeData(pivot), [pivot]);
  const treeColumns = useMemo(() => generatePivotTreeColumns(pivot), [pivot]);

  useEffect(() => {
    if (!isLoading) {
      const allKeys = treeData.map((item) => item.key);
      setExpandedKeys(allKeys);
    }
  }, [isLoading, treeData]);

  const customExpandIcon = ({
    expanded,
    onExpand,
    record,
  }: CustomExpandIconProps) => {
    const isParent = record.children && record.children.length > 0;

    if (!isParent) {
      return null;
    }

    // Render the icon for parent rows
    return (
      <span
        className="ml-[10px] cursor-pointer"
        onClick={(e) => onExpand(record, e)}
      >
        {expanded ? (
          <i className="fa-solid fa-sort-down" style={{ color: "#94A1B3" }}></i>
        ) : (
          <i
            className="fa-solid fa-caret-right"
            style={{ color: "#94A1B3" }}
          ></i>
        )}
      </span>
    );
  };

  const renderApiError = () => (
    <ErrorAlert
      title="Failed to load pivot data"
      centerScreen
      errors={[...(isErrorPivot && pivotError ? [pivotError.message] : [])]}
    />
  );

  const renderContent = () => (
    <DataTable
      columns={treeColumns}
      dataSource={treeData}
      tableHeight={tableHeight}
      isLoading={isLoading}
      isFetching={isLoading}
      expandedRowKeys={expandedKeys}
      onExpand={(expanded, record) => {
        if (expanded) {
          setExpandedKeys((prev) => [...prev, record.key]);
        } else {
          setExpandedKeys((prev) => prev.filter((key) => key !== record.key));
        }
      }}
      expandable={{
        expandIcon: customExpandIcon,
      }}
    />
  );

  return <>{isErrorPivot ? renderApiError() : renderContent()}</>;
};

export default PivotTreeView;
