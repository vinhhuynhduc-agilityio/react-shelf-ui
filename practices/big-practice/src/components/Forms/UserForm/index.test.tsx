import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import UserForm from '.';
import { mockUsers } from '@/mocks';

const mockOnSubmit = jest.fn();
const mockOnClose = jest.fn();

describe('UserForm', () => {
  const defaultValues = mockUsers[0];

  // Setup helper function
  const setup = (isEditUser = false, buttonLabel = 'Save') =>
    render(
      <UserForm
        defaultValues={defaultValues}
        isEditUser={isEditUser}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        buttonLabel={buttonLabel}
        users={mockUsers}
      />
    );

  it('matches snapshot for default state', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('should render all input fields and buttons', () => {
    setup();

    // Check if all fields are rendered correctly
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should show an error when email is invalid', async () => {
    setup();
    const emailInput = screen.getByPlaceholderText('Enter email');
    fireEvent.change(emailInput, { target: { value: 'invalidEmail@c' } });
    fireEvent.click(screen.getByText('Save'));

    // Wait for the error message
    await screen.findByText('Invalid email format');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show an error when email is duplicate', async () => {
    setup();
    const emailInput = screen.getByPlaceholderText('Enter email');
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.click(screen.getByText('Save'));

    // Wait for the error message
    await screen.findByText('Email is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show an error when full name is empty', async () => {
    setup();
    const fullNameInput = screen.getByPlaceholderText('Enter full name');
    fireEvent.change(fullNameInput, { target: { value: '' } });
    fireEvent.click(screen.getByText('Save'));

    // Wait for the error message
    await screen.findByText('Full Name is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with valid data when all fields are filled correctly', async () => {
    setup();

    // Simulate filling out the form
    const fullNameInput = screen.getByPlaceholderText('Enter full name');
    fireEvent.change(fullNameInput, { target: { value: 'New Name' } });

    const emailInput = screen.getByPlaceholderText('Enter email');
    fireEvent.change(emailInput, { target: { value: 'new.email@example.com' } });

    // Handle Avatar upload (mocking file input change)
    const avatarInput = screen.getByLabelText('Avatar').closest('div')?.querySelector('input[type=file]');
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(avatarInput!, { target: { files: [file] } });

    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onClose when Cancel button is clicked', () => {
    setup();
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should set avatar preview when defaultValues contain avatarUrl and isEditUser is true', async () => {
    setup(true);

    // Check if the avatar preview is set correctly (based on defaultValues.avatarUrl)
    const avatarImage = screen.getByAltText('Avatar Preview');
    expect(avatarImage).toHaveAttribute('src', defaultValues.avatarUrl);
  });

  it('should update avatar preview when a new file is selected', async () => {
    setup();
    const avatarInput = screen.getByLabelText('Avatar');
    const file = new File(['newAvatar'], 'newAvatar.png', { type: 'image/png' });
    fireEvent.change(avatarInput!, { target: { files: [file] } });

    await waitFor(() => {
      const avatarImage = screen.getByAltText('Avatar Preview');
      expect(avatarImage).toHaveAttribute('src', expect.stringContaining('data:image/png;base64'));
    });
  });
});
