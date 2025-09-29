import { useMemo } from "react";
import { Column, ColumnConfig } from "@ant-design/plots";

// Helpers
import { generateChartData } from "@/helpers";

// Types
import { Pivot } from "@/types";

interface ChartData {
  year: number | string;
  type: string;
  value: number;
}

interface ItemMarkerFill {
  label: string;
  color: string;
  id: string;
}

interface ChartViewProps {
  pivot: Pivot[];
  height: number;
}

const ChartView = ({ pivot, height }: ChartViewProps) => {
  const data = useMemo(() => generateChartData(pivot), [pivot]);
  const colorMap: { [key: string]: string } = {
    "oil (min)": "#ff4d4f",
    "oil (sum)": "#722ed1",
  };
  const config: ColumnConfig = {
    data,
    xField: "year",
    yField: "value",
    seriesField: "type",
    colorField: "type",
    legend: {
      color: {
        position: "right",
        layout: {
          justifyContent: "center",
        },
        itemMarkerFill: (type: ItemMarkerFill) => colorMap[type.label],
      },
    },
    style: {
      fill: (datum: ChartData) => colorMap[datum.type],
    },
    height,
  };
  return <Column {...config} />;
};

export default ChartView;
