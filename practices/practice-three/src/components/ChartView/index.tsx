import { useMemo } from "react";
import { Column, ColumnConfig } from "@ant-design/plots";
import { Spin } from "antd";

// Helpers
import { generateChartData } from "@/helpers";

// Types
import { Pivot } from "@/types";

// Components
import { ErrorAlert } from "@/components/common";

interface ItemMarkerFill {
  label: string;
  color: string;
  id: string;
}

interface ChartViewProps {
  pivot: Pivot[];
  height: number;
  isErrorPivot: boolean;
  pivotError?: Error | null;
  isLoading: boolean;
}

const ChartView = ({
  pivot,
  height,
  isErrorPivot,
  pivotError,
  isLoading,
}: ChartViewProps) => {
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
      fill: (d: { type: keyof typeof colorMap }) => colorMap[d.type],
    },
    height,
  };

  const isReady = !isLoading && !isErrorPivot;

  const renderLoading = () => (
    <div className="w-full h-full flex justify-center items-center">
      <Spin spinning={isLoading} />
    </div>
  );

  const renderApiError = () => (
    <ErrorAlert
      title="Failed to load pivot data"
      centerScreen
      errors={[...(isErrorPivot && pivotError ? [pivotError.message] : [])]}
    />
  );

  const renderChart = () => <Column {...config} />;

  return (
    <>
      {isLoading && renderLoading()}
      {isErrorPivot && renderApiError()}
      {isReady && renderChart()}
    </>
  );
};

export default ChartView;
