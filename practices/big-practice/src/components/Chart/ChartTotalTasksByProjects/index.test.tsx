import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { formatDataForChartTotalTasksByProjects } from '@/components/Chart/helpers';
import { mockTasks, mockProjects } from '@/mocks';
import { ChartTotalTasksByProjects } from '.';

jest.mock('@/components/Chart/helpers', () => ({
  formatDataForChartTotalTasksByProjects: jest.fn(),
  renderTooltipProjectChart: jest.fn(),
}));

jest.mock('ag-charts-react', () => ({
  AgCharts: () => <div data-testid="mocked-chart"></div>,
}));

describe('ChartTotalTasksByProjects', () => {
  const mockFormattedData = {
    formattedData: [
      { projectName: 'Project A', 2023: 10, 2024: 20 },
      { projectName: 'Project B', 2023: 15, 2024: 25 },
    ],
    years: [2023, 2024],
  };

  beforeEach(() => {
    (formatDataForChartTotalTasksByProjects as jest.Mock).mockReturnValue(mockFormattedData);
  });

  it('matches snapshot for mocked chart', () => {
    const { container } = render(
      <ChartTotalTasksByProjects isLoading={false} tasks={mockTasks} projects={mockProjects} />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders the loading spinner when isLoading is true', () => {
    render(<ChartTotalTasksByProjects isLoading={true} tasks={mockTasks} projects={mockProjects} />);

    expect(screen.getByRole('figure', { name: /loading chart: total tasks by projects/i })).toBeInTheDocument();
  });

  it('renders the chart when isLoading is false', () => {
    render(<ChartTotalTasksByProjects isLoading={false} tasks={mockTasks} projects={mockProjects} />);

    expect(screen.getByRole('figure', { name: /chart showing total tasks by projects/i })).toBeInTheDocument();
    const mockedChart = screen.getByTestId('mocked-chart');
    expect(mockedChart).toBeInTheDocument();
  });

  it('calls formatDataForChartTotalTasksByProjects with the correct data', () => {
    render(<ChartTotalTasksByProjects isLoading={false} tasks={mockTasks} projects={mockProjects} />);

    expect(formatDataForChartTotalTasksByProjects).toHaveBeenCalledWith(mockTasks, mockProjects);
  });

  it('renders the correct aria-label for the chart', () => {
    render(<ChartTotalTasksByProjects isLoading={false} tasks={mockTasks} projects={mockProjects} />);

    const chart = screen.getByRole('figure', { name: /chart showing total tasks by projects/i });
    expect(chart).toBeInTheDocument();
  });

  it('does not render the chart when isLoading is true', () => {
    render(<ChartTotalTasksByProjects isLoading={true} tasks={mockTasks} projects={mockProjects} />);

    expect(screen.queryByRole('figure', { name: /chart showing total tasks by projects/i })).not.toBeInTheDocument();
  });
});
