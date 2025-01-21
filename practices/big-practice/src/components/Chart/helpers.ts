import {
  FormattedDataTotalTasksByProjects,
  FormattedDataTotalTasksCompleted,
  ProjectsData,
  TaskData
} from '@/types';

// ag-grid
import {
  AgAreaSeriesOptions,
  AgBarSeriesTooltipRendererParams,
  AgChartOptions,
  AgTooltipRendererResult,
} from 'ag-charts-community';

/**
 * Formats the task data for the chart displaying total tasks completed.
 *
 * @param tasks - Array of TaskData containing information about completed tasks.
 * @returns An object containing:
 *   - formattedData: Array of objects representing months with task counts for each year.
 *   - years: Array of unique years extracted from the task data, sorted in ascending order.
 */
const formatDataForChartTotalTasks = (
  tasks: TaskData[]
): { formattedData: FormattedDataTotalTasksCompleted[]; years: number[] } => {
  // Set to store unique years present in the task data
  const yearsSet = new Set<number>();

  // Object to store task counts for each month
  const months: { [key: string]: FormattedDataTotalTasksCompleted } = {
    Jan: { month: 'Jan' },
    Feb: { month: 'Feb' },
    Mar: { month: 'Mar' },
    Apr: { month: 'Apr' },
    May: { month: 'May' },
    Jun: { month: 'Jun' },
    Jul: { month: 'Jul' },
    Aug: { month: 'Aug' },
    Sep: { month: 'Sep' },
    Oct: { month: 'Oct' },
    Nov: { month: 'Nov' },
    Dec: { month: 'Dec' },
  };

  // Process each task to extract the month and year, and update task counts
  tasks.forEach((task) => {
    const completedDate = task.completedDate;

    if (completedDate !== 'incomplete') {

      // Extract month and year from the completedDate
      const [, monthStr, yearStr] = completedDate.split(' ');
      const currentYear = new Date().getFullYear();
      const currentCentury = Math.floor(currentYear / 100);
      const year = parseInt(`${currentCentury}${yearStr}`, 10); // Convert yearStr to full year (e.g., "23" -> 2023)
      yearsSet.add(year);

      // Initialize the task count for the month and year if not already present
      if (!months[monthStr][year]) {
        months[monthStr][year] = 0;
      }

      // Increment the task count for the respective month and year
      months[monthStr][year]++;
    }
  });

  // Convert the set of years into a sorted array
  const years = Array.from(yearsSet).sort();

  const formattedData = Object.values(months).map((month) => {
    years.forEach((year) => {
      if (month[year] === undefined) {
        month[year] = 0;
      }
    });
    return month;
  });

  // Return the formatted data and list of years
  return { formattedData, years };
};

const formatDataForChartTotalTasksByProjects = (
  tasks: TaskData[],
  projects: ProjectsData[]
): { formattedData: FormattedDataTotalTasksByProjects[]; years: number[] } => {
  const yearsSet = new Set<number>();

  // Initialize the result with all projects, defaulting years to 0
  const result = projects.reduce((acc, project) => {
    acc[project.projectName] = {
      projectName: project.projectName,
    };
    return acc;
  }, {} as { [key: string]: FormattedDataTotalTasksByProjects });

  // Populate task data
  tasks.forEach((task) => {
    const { projectName, startDate } = task;
    const [, , yearStr] = startDate.split(' ');
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100);
    const year = parseInt(`${currentCentury}${yearStr}`, 10);

    yearsSet.add(year);

    if (!result[projectName][year]) {
      result[projectName][year] = 0; // Initialize year if not already present
    }

    result[projectName][year]++; // Increment the task count
  });

  // Ensure all projects have values for all years
  const years = Array.from(yearsSet).sort();
  const formattedData = Object.values(result).map((project) => {
    years.forEach((year) => {
      if (!project[year]) {
        project[year] = 0; // Default missing years to 0
      }
    });
    return project;
  });

  return { formattedData, years };
};

const formatDataForChartIndividualEmployee = (
  tasks: TaskData[],
  selectedUserId: string
) => {
  const months: Record<string, { month: string; totalTasksCompleted: number }> = {
    Jan: { month: 'Jan', totalTasksCompleted: 0 },
    Feb: { month: 'Feb', totalTasksCompleted: 0 },
    Mar: { month: 'Mar', totalTasksCompleted: 0 },
    Apr: { month: 'Apr', totalTasksCompleted: 0 },
    May: { month: 'May', totalTasksCompleted: 0 },
    Jun: { month: 'Jun', totalTasksCompleted: 0 },
    Jul: { month: 'Jul', totalTasksCompleted: 0 },
    Aug: { month: 'Aug', totalTasksCompleted: 0 },
    Sep: { month: 'Sep', totalTasksCompleted: 0 },
    Oct: { month: 'Oct', totalTasksCompleted: 0 },
    Nov: { month: 'Nov', totalTasksCompleted: 0 },
    Dec: { month: 'Dec', totalTasksCompleted: 0 },
  };

  tasks.forEach((task) => {
    const completedDate = task.completedDate;

    if (task.userId === selectedUserId && completedDate !== 'incomplete') {
      const [, monthStr] = completedDate.split(' ');

      months[monthStr as keyof typeof months].totalTasksCompleted++;
    }
  });

  return Object.values(months);
};

const renderTooltipChart = (
  params: AgBarSeriesTooltipRendererParams
): AgTooltipRendererResult => {
  const month = params.datum[params.xKey];
  const tasksCompleted = params.datum[params.yKey];

  return {
    title: `<div style='text-align: center; line-height: 1.5'>
              <div>${month}</div>
              <div>${tasksCompleted} tasks completed</div>
            </div>`,
    content: '',
    backgroundColor: '#181d1f',
  };
};

// Default chart configuration
const individualEmployeeProgressOptions: AgChartOptions = {
  title: {
    text: `Individual employee's progress`,
  },
  data: [],
  series: [
    {
      type: 'area',
      xKey: 'month',
      yKey: 'totalTasksCompleted',
      yName: 'Loading...',
      interpolation: { type: 'smooth' },
      tooltip: {
        renderer: renderTooltipChart,
      },
    } as AgAreaSeriesOptions,
  ],
  legend: {
    enabled: true,
    listeners: {
      legendItemClick: (event) => {
        event.preventDefault();
      },
    },
  },
};

const renderTooltipProjectChart = (
  params: AgBarSeriesTooltipRendererParams
): AgTooltipRendererResult => {
  const tasksCompleted = params.datum[params.yKey];

  return {
    title: tasksCompleted,
    content: '',
    backgroundColor: '#181d1f',
  };
};

export {
  formatDataForChartTotalTasks,
  formatDataForChartTotalTasksByProjects,
  formatDataForChartIndividualEmployee,
  renderTooltipProjectChart,
  renderTooltipChart,
  individualEmployeeProgressOptions,
};
