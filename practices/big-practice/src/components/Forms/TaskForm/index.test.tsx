import {
  render,
  screen,
  fireEvent
} from '@testing-library/react';
import TaskForm from '.';
import { mockUsers, mockProjects, mockTasks } from '@/mocks';

describe('TaskForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const setup = () =>
    render(
      <TaskForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        users={mockUsers}
        projects={mockProjects}
        tasks={mockTasks}
      />
    );

  it('matches snapshot for default state', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('should render all input fields and buttons', () => {
    setup();

    expect(screen.getByText('Task Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task name')).toBeInTheDocument();
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter currency')).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('Assignee')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', () => {
    setup();

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display an error when Task Name is empty and Save button is clicked', async () => {
    setup();

    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Task name is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display an error when Task Name is a duplicate', async () => {
    setup();

    const taskNameInput = screen.getByPlaceholderText('Enter task name');
    fireEvent.change(taskNameInput, { target: { value: 'Build test' } });
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Task name already exists')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display an error when Currency is invalid', async () => {
    setup();

    const currencyInput = screen.getByPlaceholderText('Enter currency');
    fireEvent.change(currencyInput, { target: { value: '0123' } });
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Currency must be a number not starting with 0')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display an error when Project is not selected', async () => {
    setup();

    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Project is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display an error when Assignee is not selected', async () => {
    setup();

    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Assignee is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with valid data when all fields are filled correctly', async () => {
    setup();

    const taskNameInput = screen.getByPlaceholderText('Enter task name');
    fireEvent.change(taskNameInput, { target: { value: 'New Task' } });

    const currencyInput = screen.getByPlaceholderText('Enter currency');
    fireEvent.change(currencyInput, { target: { value: '2000' } });

    const projectDropdown = screen.getByPlaceholderText('Select a project');
    fireEvent.click(projectDropdown);
    fireEvent.click(screen.getByText('Support'));

    const assigneeDropdown = screen.getByPlaceholderText('Select an assignee');
    fireEvent.click(assigneeDropdown);
    fireEvent.click(screen.getByText('Joe Bloggs'));

    fireEvent.click(screen.getByText('Save'));

    await screen.findByDisplayValue('Joe Bloggs');

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      taskName: 'New Task',
      currency: '2000',
      project: { id: 'f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb', value: 'Support' },
      user: { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', value: 'Joe Bloggs' },
    });
  });
});
