import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersTable from '.';
import { mockUsers } from '@/mocks';

describe('UsersTable component', () => {
  const defaultProps = {
    selectedUserId: null,
    onUserSelected: jest.fn(),
    sourceComponent: '',
    registerGridApi: jest.fn(),
    onUserDoubleClicked: jest.fn(),
    isLoading: false,
    isSavingUser: false,
    users: mockUsers,
  };

  const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props };
    return render(<UsersTable {...setupProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot for default state', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('renders user data correctly', () => {
    setup();

    // Check if the user names are rendered inside the ag-grid
    expect(screen.getByText('Joe Bloggs')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders the selected row with a special class', () => {
    setup({ selectedUserId: 'd290f1ee-6c54-4b01-90e6-d701748f0851' });

    // Check if the row for Joe Bloggs is selected
    expect(screen.getByText('Joe Bloggs').closest('.ag-row')).toHaveClass('ag-row-selected');
  });

  it('calls registerGridApi when the grid is ready', async () => {
    const mockRegisterGridApi = jest.fn();
    setup({ registerGridApi: mockRegisterGridApi });

    // Verify that the `registerGridApi` function was called
    await waitFor(() => expect(mockRegisterGridApi).toHaveBeenCalled());
  });

  it('calls onUserSelected when a row is clicked', async () => {
    const mockOnUserSelected = jest.fn();
    setup({ onUserSelected: mockOnUserSelected });

    // Simulate a click on the row for Joe Bloggs
    const row = screen.getByText('Joe Bloggs');
    if (row) {
      fireEvent.click(row);
    }

    // Check that the onUserSelected function was called with the correct user ID
    await waitFor(() => expect(mockOnUserSelected).toHaveBeenCalledWith('d290f1ee-6c54-4b01-90e6-d701748f0851'));
  });

  it('calls onUserDoubleClicked when a row is double-clicked', async () => {
    const mockOnUserDoubleClicked = jest.fn();
    setup({ onUserDoubleClicked: mockOnUserDoubleClicked });

    const rowElement = screen.getByText('Joe Bloggs').closest('.ag-row');

    if (!rowElement) {
      throw new Error('Row not found');
    }

    // Simulate a double-click event
    fireEvent.doubleClick(rowElement);

    // Check if the onUserDoubleClicked function was called with the correct user data
    await waitFor(() =>
      expect(mockOnUserDoubleClicked).toHaveBeenCalledWith(
        expect.objectContaining({
          "avatarUrl": "https://i.pravatar.cc/150?img=1",
          "earnings": "$11500",
          "email": "john@example.com",
          "fullName": "Joe Bloggs",
          "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
          "lastUpdated": "Nov 11, 2024 14:34:21",
          "registered": "May 21, 2024 17:02:06"
        })
      )
    );
  });
});
