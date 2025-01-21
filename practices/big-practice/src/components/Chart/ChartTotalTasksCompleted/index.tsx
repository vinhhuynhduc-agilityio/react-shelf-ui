import React, { useMemo, memo } from 'react';
import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';

// Component
import { Spinner } from '@/components/common';

// Helpers
import { formatDataForChartTotalTasks, renderTooltipChart } from '@/components/Chart/helpers';

// Types
import { TaskData } from '@/types';

interface ChartTotalTasksCompletedProps {
  isLoading: boolean;
  tasks: TaskData[];
};

export const ChartTotalTasksCompleted: React.FC<ChartTotalTasksCompletedProps> = memo(
  ({ isLoading, tasks }) => {
    const { formattedData, years } = useMemo(
      () => formatDataForChartTotalTasks(tasks),
      [tasks]
    );

    const memoizedOptions = useMemo(() => {
      const dynamicSeries = years.map((year) => ({
        type: 'line',
        xKey: 'month',
        yKey: year.toString(),
        yName: year.toString(),
        tooltip: {
          renderer: renderTooltipChart,
        },
      }));

      return {
        title: {
          text: 'Total tasks completed',
        },
        data: formattedData,
        series: dynamicSeries,
        legend: {
          enabled: true,
          position: 'bottom',
          item: {
            marker: {
              size: 10,
            },
            label: {
              fontWeight: 'bold',
            },
          },
        },
      } as AgChartOptions;;
    }, [formattedData, years]);

    if (isLoading) {
      return (
        <div
          className="flex-1 bg-white border border-customBorder h-[302px]"
          role="figure"
          aria-label="Loading chart: Total tasks completed"
        >
          <Spinner />
        </div>
      );
    }

    return (
      <div
        id="chart-total-tasks-completed"
        role="figure"
        aria-label="Chart showing total tasks completed"
        className="flex-1 bg-white border border-customBorder h-[302px]"
      >
        <AgCharts options={memoizedOptions} />
      </div>
    );
  }
);
