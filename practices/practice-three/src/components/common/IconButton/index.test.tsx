import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import IconButton from "@/components/common/IconButton";

describe("IconButton", () => {
  it("should render button with aria-label", () => {
    render(
      <IconButton
        ariaLabel="Search"
        iconStyles="fa-solid fa-search"
        onClick={() => {}}
      />
    );

    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn).toBeInTheDocument();
  });

  it("should render icon element with correct classes", () => {
    const { container } = render(
      <IconButton
        ariaLabel="Search"
        iconStyles="fa-solid fa-search"
        onClick={() => {}}
      />
    );

    const iconEl = container.querySelector("i");
    expect(iconEl).toBeInTheDocument();
    expect(iconEl).toHaveClass("fa-solid", "fa-search");
  });

  it("should call onClick when clicked", () => {
    const onClick = jest.fn();
    render(
      <IconButton
        ariaLabel="Open"
        iconStyles="fa-solid fa-open"
        onClick={onClick}
      />
    );

    const btn = screen.getByRole("button", { name: "Open" });
    fireEvent.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should stop event propagation on click", () => {
    const onClick = jest.fn();
    render(
      <IconButton
        ariaLabel="Test"
        iconStyles="fa-solid fa-test"
        onClick={onClick}
      />
    );

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
        iconStyles="fa-solid fa-hand"
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
        iconStyles="fa-solid fa-test"
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
        iconStyles="fa-solid fa-custom"
        onClick={() => {}}
        buttonStyles="custom-btn-class px-4 py-2"
      />
    );

    const btn = screen.getByRole("button", { name: "Custom" });
    expect(btn).toHaveClass("custom-btn-class", "px-4", "py-2");
  });

  it("should apply custom iconStyles", () => {
    const { container } = render(
      <IconButton
        ariaLabel="Custom"
        iconStyles="fa-solid fa-custom custom-icon-class"
        onClick={() => {}}
      />
    );

    const iconEl = container.querySelector("i");
    expect(iconEl).toHaveClass("fa-solid", "fa-custom", "custom-icon-class");
  });

  it("should apply default buttonStyles when not provided", () => {
    render(
      <IconButton
        ariaLabel="Default"
        iconStyles="fa-solid fa-default"
        onClick={() => {}}
      />
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
        iconStyles="fa-solid fa-lock"
        onClick={() => {}}
        disabled={true}
      />
    );

    const btn = screen.getByRole("button", { name: "Disabled" });
    expect(btn).toBeDisabled();
  });

  it("should not be disabled by default", () => {
    render(
      <IconButton
        ariaLabel="Enabled"
        iconStyles="fa-solid fa-unlock"
        onClick={() => {}}
      />
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
        iconStyles="fa-solid fa-both"
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
    render(<IconButton iconStyles="fa-solid fa-test" onClick={() => {}} />);

    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-label", "");
  });

  it("should combine multiple icon style classes", () => {
    const { container } = render(
      <IconButton
        ariaLabel="Multi"
        iconStyles="fa-solid fa-heart fa-2x text-red-500"
        onClick={() => {}}
      />
    );

    const iconEl = container.querySelector("i");
    expect(iconEl).toHaveClass("fa-solid", "fa-heart", "fa-2x", "text-red-500");
  });
});
