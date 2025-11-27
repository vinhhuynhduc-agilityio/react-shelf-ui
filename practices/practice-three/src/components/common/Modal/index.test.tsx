import { render, screen, fireEvent } from "@testing-library/react";
import Modal from ".";

jest.mock("@/components/common/IconButton", () => {
  return function MockIconButton({ onClick }: { onClick?: () => void }) {
    return (
      <button data-testid="close-button" onClick={onClick}>
        Close
      </button>
    );
  };
});

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    title: "Test Modal",
    onClose: jest.fn(),
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  it("should render modal with title and content", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("should render overlay and close button", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("close-button")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    render(<Modal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("close-button"));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should apply custom className and header height", () => {
    render(<Modal {...defaultProps} className="w-[500px]" headerHeight={50} />);

    const modalContent = screen.getByTestId("modal-content");
    const header = screen.getByTestId("modal-header");

    expect(modalContent).toHaveClass("w-[500px]");
    expect(header).toHaveStyle({ height: "50px" });
  });

  it("should hide close button and apply inset shadow when hideCloseButton is true", () => {
    render(<Modal {...defaultProps} hideCloseButton={true} />);

    const header = screen.getByTestId("modal-header");

    expect(screen.queryByTestId("close-button")).not.toBeInTheDocument();
    expect(header).toHaveClass("shadow-[inset_0_4px_0_0_#1CA1C1]");
  });
});
