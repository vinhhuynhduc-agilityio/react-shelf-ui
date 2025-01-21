import {
  memo,
  useMemo,
} from 'react';

// ag-grid
import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';

// helpers
import { formatDataForChartIndividualEmployee, individualEmployeeProgressOptions } from '@/components/Chart/helpers';

// component
import { Spinner } from '@/components/common';

// types
import { TaskData, UserData } from '@/types';

interface ChartIndividualEmployeeProgressProps {
  selectedUserId: string | null;
  isLoading: boolean;
  users: UserData[];
  tasks: TaskData[];
};

export const ChartIndividualEmployeeProgress: React.FC<ChartIndividualEmployeeProgressProps> = memo(
  ({
    selectedUserId,
    isLoading,
    users,
    tasks
  }) => {

    const selectedUser = useMemo(() => {
      if (users.length === 0) return null;
      if (!selectedUserId) return users[0];
      return users.find((user) => user.id === selectedUserId) || null;
    }, [users, selectedUserId]);

    const memoizedOptions = useMemo(() => {
      const formattedData = selectedUser
        ? formatDataForChartIndividualEmployee(tasks, selectedUser.id)
        : [];

      return {
        ...individualEmployeeProgressOptions,
        data: formattedData,
        series: [
          {
            ...(individualEmployeeProgressOptions.series?.[0] || {}),
            yName: selectedUser?.fullName,
          },
        ],
      } as AgChartOptions;
    }, [tasks, selectedUser]);

    if (isLoading) {
      return (
        <div
          className="flex-1 mr-4 bg-white border border-customBorder"
          role="figure"
          aria-label="Loading chart: Individual employee progress"
        >
          <Spinner />
        </div>
      );
    }

    return (
      <div
        id={`chart-employee-progress-${selectedUser?.id || "unknown"}`}
        role="figure"
        aria-label={`Chart showing progress of ${selectedUser?.fullName || "unknown employee"}`}
        className="flex-1 mr-4 bg-white border border-customBorder"
      >
        <AgCharts options={memoizedOptions} />
      </div>
    );
  }
);
