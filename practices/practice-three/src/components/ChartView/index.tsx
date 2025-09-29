import { useMemo } from "react";
import { Column } from "@ant-design/plots";

// Helpers
import { generateChartData } from "@/helpers";

// Types
import { Pivot } from "@/types";

interface ChartViewProps {
  pivot: Pivot[];
  height: number;
}

const ChartView = ({ pivot, height }: ChartViewProps) => {
  const data = useMemo(() => generateChartData(pivot), [pivot]);
  const config = {
    data,
    xField: "year",
    yField: "value",
    seriesField: "type",
    colorField: "type",
    height,
  };
  return <Column {...config} />;
};

export default ChartView;
