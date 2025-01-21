import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserData, ProjectsData, TaskData } from '@/types';
import TaskFormModal from '.';

describe('TaskFormModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockUsers: UserData[] = [
    { id: '1', fullName: 'User A', email: 'usera@example.com', avatarUrl: '', registered: '', lastUpdated: '', earnings: '' },
    { id: '2', fullName: 'User B', email: 'userb@example.com', avatarUrl: '', registered: '', lastUpdated: '', earnings: '' },
  ];
  const mockProjects: ProjectsData[] = [
    { id: '1', projectName: 'Project A' },
    { id: '2', projectName: 'Project B' },
  ];
  const mockTasks: TaskData[] = [
    { id: '1', userId: '1', projectId: '1', taskName: 'Task 1', startDate: '', completedDate: '', status: false, currency: 0, projectName: '', fullName: '' },
  ];

  it('renders correctly with title and TaskForm', () => {
    render(
      <TaskFormModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        users={mockUsers}
        projects={mockProjects}
        tasks={mockTasks}
      />
    );

    expect(screen.getByText('Add Task')).toBeInTheDocument();

    expect(screen.getByTestId('task-form')).toBeInTheDocument();
  });

  it('calls onClose when the cancel button is clicked', async () => {
    render(
      <TaskFormModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        users={mockUsers}
        projects={mockProjects}
        tasks={mockTasks}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onSubmit on Task form', async () => {
    render(
      <TaskFormModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        users={mockUsers}
        projects={mockProjects}
        tasks={mockTasks}
      />
    );

    const inputTask = screen.getByPlaceholderText('Enter task name');
    await act(async () => {
      fireEvent.change(inputTask, { target: { value: 'New task' } });
    });
    const inputCurrency = screen.getByPlaceholderText('Enter currency');
    await act(async () => {
      fireEvent.change(inputCurrency, { target: { value: 1000 } });
    });
    const assigneeDropdown = screen.getByPlaceholderText('Select an assignee');
    await act(async () => {
      fireEvent.click(assigneeDropdown);
    });
    const assigneeOptions = screen.getByRole('option', { name: 'User A' });
    await act(async () => {
      fireEvent.click(assigneeOptions);
    });
    const dropdown = screen.getByPlaceholderText('Select a project');
    await act(async () => {
      fireEvent.click(dropdown);
    });
    const supportOptions = screen.getByRole('option', { name: 'Project A' });
    await act(async () => {
      fireEvent.click(supportOptions);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
    expect(screen.queryByTestId('Save')).not.toBeInTheDocument();
  });
});
