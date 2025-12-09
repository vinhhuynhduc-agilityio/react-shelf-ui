import { useEffect, useMemo, useState } from "react";

// Helpers
import { generateTreeData, generatePivotTreeColumns } from "@/helpers";

// Types
import { CustomExpandIconProps, Pivot } from "@/types";

// Components
import { DataTable, ErrorAlert, Icon } from "@/components";

// Icons
import { fa } from "@/icons/fa";

interface PivotTreeViewProps {
  pivot: Pivot[];
  tableHeight: number;
  isLoading: boolean;
  isErrorPivot: boolean;
  pivotError?: Error | null;
}

const PivotTreeView = ({
  pivot,
  tableHeight,
  isLoading,
  isErrorPivot,
  pivotError,
}: PivotTreeViewProps) => {
  // state
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const treeData = useMemo(() => generateTreeData(pivot), [pivot]);
  const treeColumns = useMemo(() => generatePivotTreeColumns(pivot), [pivot]);

  // Auto-expand all nodes when data is loaded
  useEffect(() => {
    if (!isLoading && treeData.length > 0) {
      const allKeys = treeData.map((item) => item.key);
      setExpandedKeys(allKeys);
    }
  }, [isLoading, treeData]);

  // Custom expand/collapse icon for tree rows
  const customExpandIcon = ({
    expanded,
    onExpand,
    record,
  }: CustomExpandIconProps) => {
    const hasChildren = record.children && record.children.length > 0;
    if (!hasChildren) return null;

    return (
      <span
        className="ml-[10px] cursor-pointer"
        onClick={(e) => onExpand(record, e)}
      >
        {expanded ? (
          <Icon icon={fa.faSortDown} className="text-[#94A1B3]" />
        ) : (
          <Icon icon={fa.faCaretRight} className="text-[#94A1B3]" />
        )}
      </span>
    );
  };

  const renderError = () =>
    isErrorPivot && pivotError ? (
      <ErrorAlert
        title="Failed to load pivot data"
        centerScreen
        errors={[pivotError.message]}
      />
    ) : null;

  const renderTreeTable = () => (
    <DataTable
      columns={treeColumns}
      dataSource={treeData}
      tableHeight={tableHeight}
      isLoading={isLoading}
      isFetching={isLoading}
      expandedRowKeys={expandedKeys}
      onExpand={(expanded, record) => {
        setExpandedKeys((prev) =>
          expanded
            ? [...prev, record.key]
            : prev.filter((key) => key !== record.key)
        );
      }}
      expandable={{
        expandIcon: customExpandIcon,
      }}
    />
  );

  // Main return – clean and readable
  return <>{renderError() ?? renderTreeTable()}</>;
};

export default PivotTreeView;
