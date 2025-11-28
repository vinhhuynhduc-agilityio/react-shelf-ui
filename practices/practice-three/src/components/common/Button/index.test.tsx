import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from ".";

describe("Button", () => {
  it("should render button with children", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText("Click"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should render with primary variant by default", () => {
    const { container } = render(<Button>Primary</Button>);

    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-[#1CA1C1]", "text-[#FFFFFF]");
  });

  it("should render with success variant", () => {
    const { container } = render(<Button variant="success">Success</Button>);

    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-[#F4F5F9]", "text-[#1CA1C1]");
  });

  it("should render with segment variant", () => {
    const { container } = render(
      <Button variant="segment" active={true}>
        Segment
      </Button>
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-[rgb(28,161,193)]", "text-[#FFFFFF]");
  });

  it("should disable button when disabled prop is true", () => {
    render(<Button disabled={true}>Disabled</Button>);

    const button = screen.getByText("Disabled") as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it("should not call onClick when disabled", () => {
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} disabled={true}>
        Click
      </Button>
    );

    const button = screen.getByText("Click");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should render with button type by default", () => {
    const { container } = render(<Button>Button</Button>);

    const button = container.querySelector("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("should render with submit type", () => {
    const { container } = render(<Button type="submit">Submit</Button>);

    const button = container.querySelector("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("should render with reset type", () => {
    const { container } = render(<Button type="reset">Reset</Button>);

    const button = container.querySelector("button");
    expect(button).toHaveAttribute("type", "reset");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Button className="custom-class">Button</Button>
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should have aria-label attribute", () => {
    render(<Button ariaLabel="Save button">Save</Button>);

    const button = screen.getByLabelText("Save button");
    expect(button).toBeInTheDocument();
  });

  it("should apply disabled styles when disabled", () => {
    const { container } = render(<Button disabled={true}>Disabled</Button>);

    const button = container.querySelector("button");
    expect(button).toHaveClass("disabled:cursor-not-allowed");
  });

  it("should render segment variant without active state", () => {
    const { container } = render(
      <Button variant="segment" active={false}>
        Segment
      </Button>
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("text-[#475466]");
    expect(button).not.toHaveClass("bg-[rgb(28,161,193)]");
  });

  it("should match snapshot with primary variant", () => {
    const { container } = render(<Button>Primary Button</Button>);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with success variant", () => {
    const { container } = render(
      <Button variant="success">Success Button</Button>
    );

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot when disabled", () => {
    const { container } = render(<Button disabled={true}>Disabled</Button>);

    expect(container).toMatchSnapshot();
  });
});
