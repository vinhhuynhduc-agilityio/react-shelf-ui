import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { formatDataForChartIndividualEmployee } from '@/components/Chart/helpers';
import { TaskData, UserData } from '@/types';
import { ChartIndividualEmployeeProgress } from '.';

// Mock AgCharts component to simulate its rendering
jest.mock('ag-charts-react', () => ({
  AgCharts: () => <div data-testid="employee-progress-chart"></div>,
}));

// Mock helper functions
jest.mock('@/components/Chart/helpers', () => ({
  ...jest.requireActual('@/components/Chart/helpers'),
  formatDataForChartIndividualEmployee: jest.fn(),
}));

describe('ChartIndividualEmployeeProgress Component', () => {
  const mockTasks: TaskData[] = [
    {
      id: '71e564f4-7c18-47f7-89f2-abe4b7ec2854',
      userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      projectId: 'f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb',
      taskName: 'Build test',
      startDate: '10 Aug 24',
      completedDate: '15 Nov 24',
      currency: 2000,
      status: true,
      projectName: 'Support',
      fullName: 'John Doe',
    },
    {
      id: '0f9fd8b0-8f5c-4a25-b301-eebc6d5700d5',
      userId: '123e4567-e89b-12d3-a456-426614174001',
      projectId: 'e38e56a2-4d3c-469d-8345-45d6b5fae9f9',
      taskName: 'Develop Backend',
      startDate: '01 Sep 24',
      completedDate: '15 Nov 24',
      currency: 5000,
      status: true,
      projectName: 'Quality Management',
      fullName: 'Bob White',
    },
  ];

  const mockUsers: UserData[] = [
    {
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      fullName: 'John Doe',
      earnings: '$11500',
      email: 'john@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      registered: 'May 21, 2020 17:02:06',
      lastUpdated: 'Nov 11, 2024 14:34:21',
    },
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      fullName: 'Jane Smith',
      earnings: '$36911',
      email: 'jane@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      registered: 'June 10, 2021 09:20:15',
      lastUpdated: 'Nov 18, 2024 17:33:37',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the chart component', () => {
    const { container } = render(
      <ChartIndividualEmployeeProgress
        selectedUserId={null}
        isLoading={false}
        users={mockUsers}
        tasks={mockTasks}
      />
    );

    // Check if AgCharts component is rendered
    expect(screen.getByTestId('employee-progress-chart')).toBeInTheDocument();

    // Verify snapshot
    expect(container).toMatchSnapshot();
  });

  it('calls formatDataForChartIndividualEmployee when selectedUserId changes', () => {
    const { rerender } = render(
      <ChartIndividualEmployeeProgress
        selectedUserId="d290f1ee-6c54-4b01-90e6-d701748f0851"
        isLoading={false}
        users={mockUsers}
        tasks={mockTasks}
      />
    );

    // Ensure the function is called with initial user ID
    expect(formatDataForChartIndividualEmployee).toHaveBeenCalledWith(
      mockTasks,
      'd290f1ee-6c54-4b01-90e6-d701748f0851'
    );

    jest.clearAllMocks();

    // Rerender with a new selectedUserId
    rerender(
      <ChartIndividualEmployeeProgress
        selectedUserId="f47ac10b-58cc-4372-a567-0e02b2c3d479"
        isLoading={false}
        users={mockUsers}
        tasks={mockTasks}
      />
    );

    // Ensure the function is called with the new user ID
    expect(formatDataForChartIndividualEmployee).toHaveBeenCalledWith(
      mockTasks,
      'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    );
  });

  it('does not crash if there are no users', () => {
    const { container } = render(
      <ChartIndividualEmployeeProgress
        selectedUserId={null}
        isLoading={false}
        users={[]}
        tasks={mockTasks}
      />
    );

    // Ensure the employee-progress-chart component still renders
    expect(screen.getByTestId('employee-progress-chart')).toBeInTheDocument();
    expect(formatDataForChartIndividualEmployee).not.toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });

  it('renders a spinner when isLoading is true', () => {
    const { container } = render(
      <ChartIndividualEmployeeProgress
        selectedUserId={null}
        isLoading={true}
        users={mockUsers}
        tasks={mockTasks}
      />
    );

    const spinner = container.querySelector(
      '.w-12.h-12.border-4.border-gray-300.border-t-blue-500.rounded-full.animate-spin'
    );
    expect(spinner).toBeInTheDocument();

    const mockedChart = screen.queryByTestId('employee-progress-chart');
    expect(mockedChart).not.toBeInTheDocument();
  });
});
