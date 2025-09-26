// PivotTree.tsx
import { useMemo } from "react";

// Helpers
import { generateTreeData, generatePivotTreeColumns } from "@/helpers";

// Types
import { Pivot, TreeData } from "@/types";

// Components
import { DataTable } from "@/components";

const PivotTree = ({
  pivot,
  tableHeight,
}: {
  pivot: Pivot[];
  tableHeight: number;
}) => {
  const treeData: TreeData[] = useMemo(() => generateTreeData(pivot), [pivot]);
  const treeColumns = useMemo(() => generatePivotTreeColumns(pivot), [pivot]);

  return (
    <DataTable
      columns={treeColumns}
      dataSource={treeData}
      tableHeight={tableHeight}
    />
  );
};

export default PivotTree;
