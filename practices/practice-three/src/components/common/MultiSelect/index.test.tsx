import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MultiSelect from ".";

jest.mock("@/components", () => ({
  IconButton: ({
    onClick,
    onMouseDown,
    buttonStyles,
    iconStyles,
    ariaLabel,
  }: {
    onClick?: (e: React.MouseEvent) => void;
    onMouseDown?: (e: React.MouseEvent) => void;
    buttonStyles?: string;
    iconStyles?: string;
    ariaLabel?: string;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown?.(e);
      }}
      className={buttonStyles}
      aria-label={ariaLabel}
    >
      <i className={iconStyles} />
    </button>
  ),
}));

describe("MultiSelect", () => {
  const defaultOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const defaultProps = {
    options: defaultOptions,
    selected: [] as string[],
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // === RENDERING ===
  it("should render multiselect input", () => {
    render(<MultiSelect {...defaultProps} />);

    expect(screen.getByTestId("multiselect-input")).toBeInTheDocument();
  });

  it("should render selected tags", () => {
    render(
      <MultiSelect {...defaultProps} selected={["Option 1", "Option 2"]} />
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("should render remove button for each tag", () => {
    render(
      <MultiSelect {...defaultProps} selected={["Option 1", "Option 2"]} />
    );

    expect(screen.getByLabelText("Remove Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove Option 2")).toBeInTheDocument();
  });

  // === DROPDOWN TOGGLE ===
  it("should open dropdown when input clicked", () => {
    render(<MultiSelect {...defaultProps} />);

    fireEvent.click(screen.getByTestId("multiselect-input"));

    expect(screen.getByTestId("multiselect-dropdown")).toBeInTheDocument();
    defaultOptions.forEach((option) => {
      expect(screen.getByLabelText(option)).toBeInTheDocument();
    });
  });

  it("should close dropdown when clicked outside", async () => {
    render(<MultiSelect {...defaultProps} />);

    fireEvent.click(screen.getByTestId("multiselect-input"));
    expect(screen.getByTestId("multiselect-dropdown")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(
        screen.queryByTestId("multiselect-dropdown")
      ).not.toBeInTheDocument();
    });
  });

  it("should toggle dropdown when input clicked twice", () => {
    render(<MultiSelect {...defaultProps} />);

    const input = screen.getByTestId("multiselect-input");

    fireEvent.click(input);
    expect(screen.getByTestId("multiselect-dropdown")).toBeInTheDocument();

    fireEvent.click(input);
    expect(
      screen.queryByTestId("multiselect-dropdown")
    ).not.toBeInTheDocument();
  });

  // === SELECTION ===
  it("should select option and call onChange", () => {
    const onChange = jest.fn();
    render(<MultiSelect {...defaultProps} onChange={onChange} />);

    fireEvent.click(screen.getByTestId("multiselect-input"));
    fireEvent.click(screen.getByLabelText("Option 1"));

    expect(onChange).toHaveBeenCalledWith(["Option 1"]);
  });

  it("should select multiple options", () => {
    const onChange = jest.fn();
    render(<MultiSelect {...defaultProps} onChange={onChange} />);

    fireEvent.click(screen.getByTestId("multiselect-input"));
    fireEvent.click(screen.getByLabelText("Option 1"));
    expect(onChange).toHaveBeenLastCalledWith(["Option 1"]);
    fireEvent.click(screen.getByLabelText("Option 3"));
    expect(onChange).toHaveBeenLastCalledWith(["Option 3"]);
  });

  it("should deselect option when already selected", () => {
    const onChange = jest.fn();
    render(
      <MultiSelect
        {...defaultProps}
        selected={["Option 1"]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId("multiselect-input"));
    fireEvent.click(screen.getByLabelText("Option 1"));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("should show correct checked state for selected options", () => {
    render(
      <MultiSelect {...defaultProps} selected={["Option 1", "Option 3"]} />
    );

    fireEvent.click(screen.getByTestId("multiselect-input"));

    expect(screen.getByLabelText("Option 1")).toBeChecked();
    expect(screen.getByLabelText("Option 2")).not.toBeChecked();
    expect(screen.getByLabelText("Option 3")).toBeChecked();
  });

  // === TAG REMOVAL ===
  it("should remove tag when remove button clicked", () => {
    const onChange = jest.fn();
    render(
      <MultiSelect
        {...defaultProps}
        selected={["Option 1", "Option 2"]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByLabelText("Remove Option 1"));

    expect(onChange).toHaveBeenCalledWith(["Option 2"]);
  });

  it("should not open dropdown when removing tag", () => {
    render(<MultiSelect {...defaultProps} selected={["Option 1"]} />);

    fireEvent.click(screen.getByLabelText("Remove Option 1"));

    expect(
      screen.queryByTestId("multiselect-dropdown")
    ).not.toBeInTheDocument();
  });

  // === EDGE CASES ===
  it("should handle empty options array", () => {
    render(<MultiSelect {...defaultProps} options={[]} />);

    fireEvent.click(screen.getByTestId("multiselect-input"));

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });

  it("should apply custom className", () => {
    const { container } = render(
      <MultiSelect {...defaultProps} className="custom-class" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
    expect(wrapper).toHaveClass("relative");
  });

  it("should handle special characters in option names", () => {
    const onChange = jest.fn();
    render(
      <MultiSelect
        options={["React & Vue", "Next.js"]}
        selected={[]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId("multiselect-input"));
    fireEvent.click(screen.getByLabelText("React & Vue"));

    expect(onChange).toHaveBeenCalledWith(["React & Vue"]);
  });

  // === EVENT LISTENERS ===
  it("should add event listener on mount and remove on unmount", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const removeSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = render(<MultiSelect {...defaultProps} />);

    expect(addSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("should maintain selected state when dropdown reopened", async () => {
    render(<MultiSelect {...defaultProps} selected={["Option 1"]} />);

    const input = screen.getByTestId("multiselect-input");

    fireEvent.click(input);
    expect(screen.getByLabelText("Option 1")).toBeChecked();

    fireEvent.click(input);
    await waitFor(() => {
      expect(
        screen.queryByTestId("multiselect-dropdown")
      ).not.toBeInTheDocument();
    });

    fireEvent.click(input);
    expect(screen.getByLabelText("Option 1")).toBeChecked();
  });
});
