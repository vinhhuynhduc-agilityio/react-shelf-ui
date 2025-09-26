import { useEffect, useMemo, useState } from "react";

// Helpers
import { generateTreeData, generatePivotTreeColumns } from "@/helpers";

// Types
import { Pivot, TreeData } from "@/types";

// Components
import { DataTable } from "@/components";

const PivotTreeView = ({
  pivot,
  tableHeight,
  isLoading,
}: {
  pivot: Pivot[];
  tableHeight: number;
  isLoading: boolean;
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

  return (
    <DataTable
      columns={treeColumns}
      dataSource={treeData}
      tableHeight={tableHeight}
      loading={isLoading}
      expandedRowKeys={expandedKeys}
      onExpand={(expanded, record) => {
        if (expanded) {
          setExpandedKeys((prev) => [...prev, record.key]);
        } else {
          setExpandedKeys((prev) => prev.filter((key) => key !== record.key));
        }
      }}
    />
  );
};

export default PivotTreeView;
