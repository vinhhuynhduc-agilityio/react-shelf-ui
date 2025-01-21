import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from '.';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  const modalTitle = 'Test Modal Title';
  const modalContent = <p>Test Modal Content</p>;

  const renderModalDialog = (props = {}) => {
    return render(
      <Modal
        title={modalTitle}
        onClose={mockOnClose}
        content={modalContent}
        {...props}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot for default state', () => {
    const { container } = renderModalDialog();
    expect(container).toMatchSnapshot();
  });

  it('renders the modal with title and content', () => {
    renderModalDialog();

    expect(screen.getByText(modalTitle)).toBeInTheDocument();
    expect(screen.getByText('Test Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when clicking on the overlay', () => {
    renderModalDialog();
    fireEvent.click(screen.getByTestId('modal-overlay'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal content', () => {
    renderModalDialog();
    fireEvent.click(screen.getByTestId('modal-content'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders correctly with no content', () => {
    renderModalDialog({ content: null });

    // Check if title is rendered but no content
    expect(screen.getByText(modalTitle)).toBeInTheDocument();
    expect(screen.queryByText('Test Modal Content')).not.toBeInTheDocument();
  });
});
