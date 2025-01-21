import {
  useMemo,
  memo
} from 'react';
import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';

// helpers
import { formatDataForChartTotalTasksByProjects, renderTooltipProjectChart } from '@/components/Chart/helpers';

// component
import { Spinner } from '@/components/common';

// types
import { ProjectsData, TaskData } from '@/types';

interface ChartTotalTasksByProjectsProps {
  isLoading: boolean;
  tasks: TaskData[];
  projects: ProjectsData[];
}

export const ChartTotalTasksByProjects: React.FC<ChartTotalTasksByProjectsProps> = memo(
  ({ isLoading, tasks, projects }) => {
    const { formattedData, years } = useMemo(
      () => formatDataForChartTotalTasksByProjects(tasks, projects),
      [tasks, projects]
    );

    const memoizedOptions = useMemo(() => {
      const dynamicSeries = years.map((year) => ({
        type: 'bar',
        xKey: 'projectName',
        yKey: year.toString(),
        yName: year.toString(),
        direction: 'horizontal',
        tooltip: {
          renderer: renderTooltipProjectChart,
        },
      }));

      return {
        title: {
          text: 'Total tasks by projects',
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
      } as AgChartOptions;
    }, [formattedData, years]);

    if (isLoading) {
      return (
        <div
          className="flex-1 bg-white border border-customBorder"
          role="figure"
          aria-label="Loading chart: Total tasks by projects"
        >
          <Spinner />
        </div>
      );
    }

    return (
      <div
        id="chart-tasks-by-projects"
        role="figure"
        aria-label="Chart showing total tasks by projects"
        className="flex-1 bg-white border border-customBorder"
      >
        <AgCharts options={memoizedOptions} />
      </div>
    );
  }
);
