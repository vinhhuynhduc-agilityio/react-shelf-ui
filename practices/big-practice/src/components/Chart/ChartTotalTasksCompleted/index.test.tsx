import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { formatDataForChartTotalTasks } from '@/components/Chart/helpers';
import { mockTasks } from '@/mocks';
import { ChartTotalTasksCompleted } from '.';

jest.mock('@/components/Chart/helpers', () => ({
  formatDataForChartTotalTasks: jest.fn(),
  renderTooltipChart: jest.fn(),
}));

jest.mock('ag-charts-react', () => ({
  AgCharts: () => <div data-testid="mocked-chart"></div>,
}));

describe('ChartTotalTasksCompleted', () => {
  const mockFormattedData = {
    formattedData: [
      { month: 'Jan', 2023: 5, 2024: 10 },
      { month: 'Feb', 2023: 15, 2024: 20 },
    ],
    years: [2023, 2024],
  };

  beforeEach(() => {
    (formatDataForChartTotalTasks as jest.Mock).mockReturnValue(mockFormattedData);
  });

  it('matches snapshot for mocked chart', () => {
    const { container } = render(
      <ChartTotalTasksCompleted isLoading={false} tasks={mockTasks} />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders the loading spinner when isLoading is true', () => {
    render(<ChartTotalTasksCompleted isLoading={true} tasks={mockTasks} />);

    expect(screen.getByRole('figure', { name: /loading chart: total tasks completed/i })).toBeInTheDocument();
  });

  it('renders the chart when isLoading is false', () => {
    render(<ChartTotalTasksCompleted isLoading={false} tasks={mockTasks} />);

    expect(screen.getByRole('figure', { name: /chart showing total tasks completed/i })).toBeInTheDocument();
    const mockedChart = screen.getByTestId('mocked-chart');
    expect(mockedChart).toBeInTheDocument();
  });

  it('calls formatDataForChartTotalTasks with the correct tasks', () => {
    render(<ChartTotalTasksCompleted isLoading={false} tasks={mockTasks} />);

    expect(formatDataForChartTotalTasks).toHaveBeenCalledWith(mockTasks);
  });

  it('renders the correct aria-label for the chart', () => {
    render(<ChartTotalTasksCompleted isLoading={false} tasks={mockTasks} />);

    const chart = screen.getByRole('figure', { name: /chart showing total tasks completed/i });
    expect(chart).toBeInTheDocument();
  });

  it('does not render the chart when isLoading is true', () => {
    render(<ChartTotalTasksCompleted isLoading={true} tasks={mockTasks} />);

    expect(screen.queryByRole('figure', { name: /chart showing total tasks completed/i })).not.toBeInTheDocument();
  });
});
