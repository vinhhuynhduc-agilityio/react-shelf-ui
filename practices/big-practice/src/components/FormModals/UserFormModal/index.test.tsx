import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserData } from '@/types';
import UserFormModal from '.';

describe('UserFormModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockUsers: UserData[] = [
    { id: '1', fullName: 'User A', email: 'usera@example.com', avatarUrl: '', registered: '', lastUpdated: '', earnings: '' },
    { id: '2', fullName: 'User B', email: 'userb@example.com', avatarUrl: '', registered: '', lastUpdated: '', earnings: '' },
  ];
  const defaultValues: UserData = {
    id: '',
    fullName: '',
    email: '',
    avatarUrl: '',
    registered: '',
    lastUpdated: '',
    earnings: '',
  };

  it('renders correctly with title and UserForm', () => {
    render(
      <UserFormModal
        isEditUser={false}
        defaultValues={defaultValues}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        users={mockUsers}
      />
    );

    expect(screen.getByText('Add User')).toBeInTheDocument();

    expect(screen.getByTestId('user-form')).toBeInTheDocument();
  });

  it('renders the correct title for editing a user', () => {
    render(
      <UserFormModal
        isEditUser={true}
        defaultValues={mockUsers[0]}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        users={mockUsers}
      />
    );

    expect(screen.getByText('Edit User')).toBeInTheDocument();
  });

  it('calls onClose when the cancel button is clicked', async () => {
    render(
      <UserFormModal
        isEditUser={false}
        defaultValues={defaultValues}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        users={mockUsers}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when the form is submitted', async () => {
    render(
      <UserFormModal
        isEditUser={false}
        defaultValues={defaultValues}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        users={mockUsers}
      />
    );

    const inputFullName = screen.getByPlaceholderText('Enter full name');
    fireEvent.change(inputFullName, { target: { value: 'John Doe' } });
    const inputEmail = screen.getByPlaceholderText('Enter email');
    fireEvent.change(inputEmail, { target: { value: 'd4vMq@example.com' } });

    const submitButton = screen.getByLabelText('save-user');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        avatarUrl: "https://dummyimage.com/96x96/cccccc/ffffff&text=No+Avatar",
        fullName: 'John Doe',
        email: 'd4vMq@example.com'
      }));
  });
});
