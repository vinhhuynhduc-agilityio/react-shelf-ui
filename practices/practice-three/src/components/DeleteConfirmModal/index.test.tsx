import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteConfirmModal } from ".";
import type { FileItem } from "@/types";

jest.mock("@/components", () => ({
  Button: ({
    onClick,
    disabled,
    children,
    variant,
  }: {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={`btn-${variant}`}
    >
      {children}
    </button>
  ),
  Modal: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
  }) =>
    isOpen && (
      <div data-testid="modal" role="dialog">
        <h2>{title}</h2>
        {children}
      </div>
    ),
}));

describe("DeleteConfirmModal", () => {
  const sampleItem: FileItem = {
    id: "1",
    name: "document.pdf",
    size: 1024,
    type: "file",
    parentId: "0",
  };

  const defaultProps = {
    isOpen: true,
    item: sampleItem,
    isDeleting: false,
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when item is null", () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        item={null}
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should render modal with item name when isOpen is true", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Delete files")).toBeInTheDocument();
    const nameDocument = screen.getByText("● document.pdf");
    expect(nameDocument).toBeInTheDocument();
  });

  it("should call onConfirm when OK button clicked", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("btn-primary"));

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when Cancel button clicked", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("btn-success"));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should show loading state when isDeleting is true", () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={true} />);

    expect(screen.getByText(/Deleting\.\.\./)).toBeInTheDocument();
    expect(screen.getByTestId("btn-primary")).toBeDisabled();
    expect(screen.getByTestId("btn-success")).toBeDisabled();
  });

  it("should not show loading state when isDeleting is false", () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={false} />);

    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.queryByText(/Deleting\.\.\./)).not.toBeInTheDocument();
  });

  it("should not render modal when isOpen is false", () => {
    render(<DeleteConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should display correct confirmation message", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(
      screen.getByText("Are you sure you want to delete this item:")
    ).toBeInTheDocument();
  });
});
