import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import IconButton from "@/components/common/IconButton";
import { fa } from "@/icons/fa";

describe("IconButton", () => {
  it("should render button with aria-label", () => {
    render(
      <IconButton
        ariaLabel="Search"
        icon={fa.faMagnifyingGlass}
        onClick={() => {}}
      />
    );

    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn).toBeInTheDocument();
  });

  it("should render icon element as FontAwesomeIcon", () => {
    render(
      <IconButton
        ariaLabel="Search"
        icon={fa.faMagnifyingGlass}
        onClick={() => {}}
      />
    );

    const svg = screen
      .getByRole("button", { name: "Search" })
      .querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const onClick = jest.fn();
    render(
      <IconButton ariaLabel="Open" icon={fa.faFolderOpen} onClick={onClick} />
    );

    const btn = screen.getByRole("button", { name: "Open" });
    fireEvent.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should stop event propagation on click", () => {
    const onClick = jest.fn();
    render(<IconButton ariaLabel="Test" icon={fa.faCheck} onClick={onClick} />);

    const btn = screen.getByRole("button", { name: "Test" });
    const event = new MouseEvent("click", { bubbles: true });
    const stopPropagationSpy = jest.spyOn(event, "stopPropagation");

    btn.dispatchEvent(event);

    expect(stopPropagationSpy).toHaveBeenCalled();
    stopPropagationSpy.mockRestore();
  });

  it("should call onMouseDown when mouse down", () => {
    const onMouseDown = jest.fn();
    render(
      <IconButton
        ariaLabel="MouseDown"
        icon={fa.faCaretRight}
        onMouseDown={onMouseDown}
      />
    );

    const btn = screen.getByRole("button", { name: "MouseDown" });
    fireEvent.mouseDown(btn);

    expect(onMouseDown).toHaveBeenCalledTimes(1);
  });

  it("should stop event propagation on mouse down", () => {
    const onMouseDown = jest.fn();
    render(
      <IconButton
        ariaLabel="Test"
        icon={fa.faCheck}
        onMouseDown={onMouseDown}
      />
    );

    const btn = screen.getByRole("button", { name: "Test" });
    const event = new MouseEvent("mousedown", { bubbles: true });
    const stopPropagationSpy = jest.spyOn(event, "stopPropagation");

    btn.dispatchEvent(event);

    expect(stopPropagationSpy).toHaveBeenCalled();
    stopPropagationSpy.mockRestore();
  });

  it("should apply custom buttonStyles", () => {
    render(
      <IconButton
        ariaLabel="Custom"
        icon={fa.faCheck}
        onClick={() => {}}
        buttonStyles="custom-btn-class px-4 py-2"
      />
    );

    const btn = screen.getByRole("button", { name: "Custom" });
    expect(btn).toHaveClass("custom-btn-class", "px-4", "py-2");
  });

  it("should apply default buttonStyles when not provided", () => {
    render(
      <IconButton ariaLabel="Default" icon={fa.faCheck} onClick={() => {}} />
    );

    const btn = screen.getByRole("button", { name: "Default" });
    expect(btn).toHaveClass(
      "p-1",
      "w-[26px]",
      "h-[26px]",
      "flex",
      "justify-center",
      "items-center",
      "rounded-full",
      "text-lg",
      "cursor-pointer"
    );
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <IconButton
        ariaLabel="Disabled"
        icon={fa.faCheck}
        onClick={() => {}}
        disabled={true}
      />
    );

    const btn = screen.getByRole("button", { name: "Disabled" });
    expect(btn).toBeDisabled();
  });

  it("should not be disabled by default", () => {
    render(
      <IconButton ariaLabel="Enabled" icon={fa.faCheck} onClick={() => {}} />
    );

    const btn = screen.getByRole("button", { name: "Enabled" });
    expect(btn).not.toBeDisabled();
  });

  it("should handle both onClick and onMouseDown", () => {
    const onClick = jest.fn();
    const onMouseDown = jest.fn();
    render(
      <IconButton
        ariaLabel="Both"
        icon={fa.faCheck}
        onClick={onClick}
        onMouseDown={onMouseDown}
      />
    );

    const btn = screen.getByRole("button", { name: "Both" });
    fireEvent.mouseDown(btn);
    fireEvent.click(btn);

    expect(onMouseDown).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should work without ariaLabel", () => {
    render(<IconButton icon={fa.faCheck} onClick={() => {}} />);

    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
  });

  it("should render different icons", () => {
    const { rerender } = render(
      <IconButton ariaLabel="Heart" icon={fa.faCheck} onClick={() => {}} />
    );

    let svg = screen
      .getByRole("button", { name: "Heart" })
      .querySelector("svg");
    expect(svg).toBeInTheDocument();

    rerender(
      <IconButton ariaLabel="Check" icon={fa.faCheck} onClick={() => {}} />
    );

    svg = screen.getByRole("button", { name: "Check" }).querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
