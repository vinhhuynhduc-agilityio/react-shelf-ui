import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectForm from '.';
import { mockProjects } from '@/mocks/data';

describe('ProjectForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const setup = () => {
    return render(
      <ProjectForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projects={mockProjects}
      />
    );
  };

  it('matches snapshot for default state', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('should render the project form correctly', () => {
    setup();

    expect(screen.getByText('Project Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter project name')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should call onClose when the cancel button is clicked', () => {
    setup();
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display an error when submitting with an empty project name', async () => {
    setup();

    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Project name is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display an error when a duplicate project name is entered', async () => {
    setup();

    const input = screen.getByPlaceholderText('Enter project name');
    fireEvent.change(input, { target: { value: 'Support' } }); // 'Support' exists in mockProjects
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Project name already exists')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with a new project name when valid input is provided', async () => {
    setup();

    const input = screen.getByPlaceholderText('Enter project name');
    fireEvent.change(input, { target: { value: 'New Project' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('New Project');
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
