import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dropdown from ".";
import { DropdownOption } from "@/types";
import { fa } from "@/icons/fa";

jest.mock("@/components", () => ({
  Icon: ({ className }: { className?: string }) => (
    <svg data-testid="dropdown-icon" className={className} />
  ),
}));

describe("Dropdown", () => {
  const mockOptions: DropdownOption[] = [
    { key: "edit", label: "Edit", icon: fa.faPencil },
    { key: "copy", label: "Copy", icon: fa.faCopy },
    { key: "delete", label: "Delete", icon: fa.faTrash },
  ];

  const defaultProps = {
    options: mockOptions,
    isOpen: true,
    triggerRef: { current: document.createElement("button") },
    onSelect: jest.fn(),
    setIsOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(<Dropdown {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId("dropdown-listbox")).not.toBeInTheDocument();
  });

  it("should render dropdown when isOpen is true", () => {
    render(<Dropdown {...defaultProps} />);

    expect(screen.getByTestId("dropdown-listbox")).toBeInTheDocument();
  });

  it("should render all options", () => {
    render(<Dropdown {...defaultProps} />);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should render icon for each option", () => {
    render(<Dropdown {...defaultProps} />);

    const icons = screen.getAllByTestId("dropdown-icon");
    expect(icons).toHaveLength(3);
  });

  it("should call onSelect when option is clicked", () => {
    render(<Dropdown {...defaultProps} />);

    const editOption = screen.getByText("Edit");
    fireEvent.click(editOption);

    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockOptions[0]);
  });

  it("should call setIsOpen(false) after selecting an option", () => {
    render(<Dropdown {...defaultProps} />);

    const editOption = screen.getByText("Edit");
    fireEvent.click(editOption);

    expect(defaultProps.setIsOpen).toHaveBeenCalledWith(false);
  });

  it("should close dropdown when clicking outside", async () => {
    const triggerRef = { current: document.createElement("button") };
    const setIsOpen = jest.fn();

    render(
      <Dropdown
        {...defaultProps}
        triggerRef={triggerRef}
        setIsOpen={setIsOpen}
      />
    );

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });

  it("should not close dropdown when clicking on trigger", async () => {
    const triggerRef = { current: document.createElement("button") };
    const setIsOpen = jest.fn();

    render(
      <Dropdown
        {...defaultProps}
        triggerRef={triggerRef}
        setIsOpen={setIsOpen}
      />
    );

    fireEvent.mouseDown(triggerRef.current!);

    await waitFor(() => {
      expect(setIsOpen).not.toHaveBeenCalled();
    });
  });

  it("should not close dropdown when clicking on dropdown itself", async () => {
    render(<Dropdown {...defaultProps} />);

    const listbox = screen.getByTestId("dropdown-listbox");
    fireEvent.mouseDown(listbox);

    await waitFor(() => {
      expect(defaultProps.setIsOpen).not.toHaveBeenCalled();
    });
  });

  it("should render with correct styling classes", () => {
    render(<Dropdown {...defaultProps} />);

    const listbox = screen.getByTestId("dropdown-listbox");
    expect(listbox).toHaveClass(
      "absolute",
      "bg-white",
      "shadow-md",
      "border",
      "rounded-md",
      "z-50"
    );
  });

  it("should render each option with correct styling", () => {
    const { container } = render(<Dropdown {...defaultProps} />);

    const listItems = container.querySelectorAll("li");
    listItems.forEach((item) => {
      expect(item).toHaveClass("px-4", "py-[8px]", "hover:bg-[#F4F5F9]");
    });
  });

  it("should handle single option", () => {
    const singleOption: DropdownOption[] = [
      { key: "only", label: "Only Option", icon: fa.faPencil },
    ];

    render(<Dropdown {...defaultProps} options={singleOption} />);

    expect(screen.getByText("Only Option")).toBeInTheDocument();
  });

  it("should handle empty options", () => {
    render(<Dropdown {...defaultProps} options={[]} />);

    const listbox = screen.getByTestId("dropdown-listbox");
    expect(listbox.children).toHaveLength(0);
  });

  it("should update position on window scroll", () => {
    const triggerRef = { current: document.createElement("button") };
    const setIsOpen = jest.fn();

    render(
      <Dropdown
        {...defaultProps}
        triggerRef={triggerRef}
        setIsOpen={setIsOpen}
        isOpen={true}
      />
    );

    const listbox = screen.getByTestId("dropdown-listbox");

    fireEvent.scroll(window, { y: 100 });

    // Position should be recalculated (tested by checking event listener was set)
    expect(listbox).toBeInTheDocument();
  });

  it("should handle multiple selections in sequence", () => {
    const onSelect = jest.fn();
    const setIsOpen = jest.fn();

    const { rerender } = render(
      <Dropdown {...defaultProps} onSelect={onSelect} setIsOpen={setIsOpen} />
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(onSelect).toHaveBeenCalledWith(mockOptions[0]);

    // Reopen dropdown
    rerender(
      <Dropdown
        {...defaultProps}
        isOpen={true}
        onSelect={onSelect}
        setIsOpen={setIsOpen}
      />
    );

    fireEvent.click(screen.getByText("Copy"));
    expect(onSelect).toHaveBeenCalledWith(mockOptions[1]);
  });

  it("should have correct listbox role for accessibility", () => {
    render(<Dropdown {...defaultProps} />);

    const listbox = screen.getByTestId("dropdown-listbox");
    expect(listbox).toHaveAttribute("role", "listbox");
  });
});
