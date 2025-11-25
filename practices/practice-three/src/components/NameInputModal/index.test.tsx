import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NameInputModal } from "@/components/NameInputModal";
import { useForm } from "react-hook-form";
import type { FormData } from "@/types";

jest.mock("@/components", () => ({
  Modal: ({
    isOpen,
    title,
    onClose,
    children,
  }: {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div data-testid="modal" role="dialog">
        <h2>{title}</h2>
        {children}
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
      </div>
    ) : null,
  Button: ({
    variant,
    type,
    disabled,
    onClick,
    children,
    className,
  }: {
    variant?: string;
    type?: string;
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      type={type as "button" | "submit" | "reset"}
      disabled={disabled}
      onClick={onClick}
      data-testid={`btn-${variant}`}
      className={className}
    >
      {children}
    </button>
  ),
}));

const NameInputModalWrapper = (
  props: Omit<
    React.ComponentProps<typeof NameInputModal>,
    "control" | "errors" | "handleSubmit"
  >
) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "" },
  });

  return (
    <NameInputModal
      {...props}
      control={control}
      errors={errors}
      handleSubmit={handleSubmit}
    />
  );
};

describe("NameInputModal", () => {
  const defaultProps = {
    isOpen: true,
    mode: "add" as const,
    addType: "addFolder" as const,
    isDisabled: false,
    onSubmit: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(<NameInputModalWrapper {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should render modal with correct title when isOpen is true", () => {
    render(<NameInputModalWrapper {...defaultProps} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Enter a new name")).toBeInTheDocument();
  });

  it("should render input with folder name placeholder in add mode", () => {
    render(
      <NameInputModalWrapper {...defaultProps} mode="add" addType="addFolder" />
    );

    const input = screen.getByPlaceholderText("Enter folder name");
    expect(input).toBeInTheDocument();
  });

  it("should render input with file name placeholder in add file mode", () => {
    render(
      <NameInputModalWrapper {...defaultProps} mode="add" addType="addFile" />
    );

    const input = screen.getByPlaceholderText("Enter file name");
    expect(input).toBeInTheDocument();
  });

  it("should render input with rename placeholder in rename mode", () => {
    render(<NameInputModalWrapper {...defaultProps} mode="rename" />);

    const input = screen.getByPlaceholderText("Enter new name");
    expect(input).toBeInTheDocument();
  });

  it("should have autoFocus on input", () => {
    render(<NameInputModalWrapper {...defaultProps} />);

    const input = screen.getByPlaceholderText(
      "Enter folder name"
    ) as HTMLInputElement;
    expect(input).toHaveFocus();
  });

  it("should render Add button in add mode", () => {
    render(<NameInputModalWrapper {...defaultProps} mode="add" />);

    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("should render Rename button in rename mode", () => {
    render(<NameInputModalWrapper {...defaultProps} mode="rename" />);

    expect(screen.getByText("Rename")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<NameInputModalWrapper {...defaultProps} />);

    const submitBtn = screen.getByTestId("btn-primary");
    expect(submitBtn).toBeInTheDocument();
  });

  it("should enable submit button when input has value", () => {
    render(<NameInputModalWrapper {...defaultProps} />);

    const input = screen.getByPlaceholderText(
      "Enter folder name"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "New Folder" } });

    const submitBtn = screen.getByTestId("btn-primary");
    expect(submitBtn).not.toBeDisabled();
  });

  it("should call onSubmit when form submitted with valid data", async () => {
    const onSubmit = jest.fn();
    render(<NameInputModalWrapper {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(
      "Enter folder name"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "My Folder" } });

    const form = input.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      const firstCall = onSubmit.mock.calls[0];
      expect(firstCall[0]).toEqual({ name: "My Folder" });
    });
  });

  it("should accept special characters in folder name", async () => {
    const onSubmit = jest.fn();
    render(<NameInputModalWrapper {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(
      "Enter folder name"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Folder-@#$%" } });

    const form = input.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      const firstCall = onSubmit.mock.calls[0];
      expect(firstCall[0]).toEqual({ name: "Folder-@#$%" });
    });
  });

  it("should accept long folder name", async () => {
    const onSubmit = jest.fn();
    const longName = "A".repeat(100);
    render(<NameInputModalWrapper {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(
      "Enter folder name"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: longName } });

    const form = input.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      const firstCall = onSubmit.mock.calls[0];
      expect(firstCall[0]).toEqual({ name: longName });
    });
  });

  it("should preserve whitespace in input", async () => {
    const onSubmit = jest.fn();
    render(<NameInputModalWrapper {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(
      "Enter folder name"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "  Folder Name  " } });

    const form = input.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      const firstCall = onSubmit.mock.calls[0];
      expect(firstCall[0]).toEqual({ name: "  Folder Name  " });
    });
  });

  it("should handle multiple input changes", () => {
    render(<NameInputModalWrapper {...defaultProps} />);

    const input = screen.getByPlaceholderText(
      "Enter folder name"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "First" } });
    expect(input.value).toBe("First");

    fireEvent.change(input, { target: { value: "Second" } });
    expect(input.value).toBe("Second");

    fireEvent.change(input, { target: { value: "Third" } });
    expect(input.value).toBe("Third");
  });

  it("should disable input when isDisabled is true", () => {
    render(<NameInputModalWrapper {...defaultProps} isDisabled={true} />);

    const input = screen.getByPlaceholderText(
      "Enter folder name"
    ) as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("should disable submit button when isDisabled is true", () => {
    render(<NameInputModalWrapper {...defaultProps} isDisabled={true} />);

    const submitBtn = screen.getByTestId("btn-primary");
    expect(submitBtn).toBeDisabled();
  });

  it("should call onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(<NameInputModalWrapper {...defaultProps} onClose={onClose} />);

    const closeBtn = screen.getByTestId("close-modal");
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should have correct input styling", () => {
    render(<NameInputModalWrapper {...defaultProps} />);

    const input = screen.getByPlaceholderText("Enter folder name");
    expect(input).toHaveClass(
      "flex-1",
      "border-b",
      "border-[#1CA1C1]",
      "px-4",
      "py-1"
    );
  });

  it("should have correct button styling", () => {
    render(<NameInputModalWrapper {...defaultProps} />);

    const submitBtn = screen.getByTestId("btn-primary");
    expect(submitBtn).toHaveClass("w-[96px]", "h-[32px]");
  });
});
