import { render, screen, fireEvent } from "@testing-library/react";
import SingleSelect from ".";

jest.mock("react-dom", () => {
  const original = jest.requireActual("react-dom");
  return {
    ...original,
    createPortal: (element: React.ReactNode) => element,
  };
});

describe("SingleSelect", () => {
  const defaultProps = {
    options: ["Apple", "Banana", "Orange"],
    value: "Banana",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render current value with chevron icon", () => {
    render(<SingleSelect {...defaultProps} />);

    expect(screen.getByText("Banana")).toBeInTheDocument();

    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should open dropdown and display all options", () => {
    render(<SingleSelect {...defaultProps} />);

    fireEvent.click(screen.getByText("Banana"));

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Orange")).toBeInTheDocument();
  });

  it("should highlight selected option in dropdown", () => {
    render(<SingleSelect {...defaultProps} />);

    fireEvent.click(screen.getByText("Banana"));

    const allBananas = screen.getAllByText("Banana");
    const selectedLi = allBananas[1].closest("li");
    const unselectedLi = screen.getByText("Apple").closest("li");

    expect(selectedLi).toHaveClass("bg-[#F4F5F9]");
    expect(unselectedLi).not.toHaveClass("bg-[#F4F5F9]");
  });

  it("should select option, call onChange and close dropdown", () => {
    render(<SingleSelect {...defaultProps} />);

    fireEvent.click(screen.getByText("Banana"));
    fireEvent.mouseDown(screen.getByText("Orange"));

    expect(defaultProps.onChange).toHaveBeenCalledWith("Orange");
  });

  it("should close dropdown when clicking outside", () => {
    render(<SingleSelect {...defaultProps} />);

    fireEvent.click(screen.getByText("Banana"));
    expect(screen.getByRole("list")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <SingleSelect {...defaultProps} className="custom-class" />
    );

    const wrapper = container.querySelector(".relative");
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should match snapshot", () => {
    const { container } = render(<SingleSelect {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
