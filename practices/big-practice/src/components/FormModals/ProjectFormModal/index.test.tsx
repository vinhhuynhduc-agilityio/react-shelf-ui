import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectsData } from '@/types';
import ProjectFormModal from '@/components/FormModals/ProjectFormModal';

describe('ProjectFormModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockProjects: ProjectsData[] = [
    { id: '1', projectName: 'Project A' },
    { id: '2', projectName: 'Project B' },
  ];

  it('renders correctly with title and ProjectForm', () => {
    render(
      <ProjectFormModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projects={mockProjects}
      />
    );

    expect(screen.getByText('Add Project')).toBeInTheDocument();

    expect(screen.getByTestId('project-form')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    render(
      <ProjectFormModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projects={mockProjects}
      />
    );

    const closeButton = screen.getByRole('button', { name: /cancel/i });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when the form is submitted', async () => {
    render(
      <ProjectFormModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        projects={mockProjects}
      />
    );

    const input = screen.getByPlaceholderText('Enter project name');
    fireEvent.change(input, { target: { value: 'New Project Name' } });

    const submitButton = screen.getByRole('button', { name: /save/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith('New Project Name');
  });
});
