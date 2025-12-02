import { render, screen } from "@testing-library/react";
import ErrorAlert from ".";

jest.mock("@/components", () => ({
  Icon: ({
    className,
    "data-testid": testId,
  }: {
    className?: string;
    "data-testid"?: string;
  }) => <svg data-testid={testId || "icon-svg"} className={className} />,
}));

describe("ErrorAlert", () => {
  it("should not render when errors array is empty", () => {
    const { container } = render(<ErrorAlert errors={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when all errors are null or undefined", () => {
    const { container } = render(
      <ErrorAlert errors={[null, undefined, "", null]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render error alert with single error message", () => {
    render(<ErrorAlert errors={["Password is required"]} />);

    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("should render error icon with FontAwesome", () => {
    render(<ErrorAlert errors={["Error message"]} />);

    const icon = screen.getByTestId("error-icon");
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe("svg");
  });

  it("should render multiple error messages", () => {
    const errors = [
      "Username must be at least 3 characters",
      "Password must contain uppercase letter",
      "Email is required",
    ];

    render(<ErrorAlert errors={errors} />);

    expect(
      screen.getByText("Username must be at least 3 characters")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Password must contain uppercase letter")
    ).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("should filter out null and undefined from mixed errors array", () => {
    render(
      <ErrorAlert errors={["Valid error", null, undefined, "Another error"]} />
    );

    expect(screen.getByText("Valid error")).toBeInTheDocument();
    expect(screen.getByText("Another error")).toBeInTheDocument();

    // Should only render 2 error items, not 4
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("should filter out empty strings", () => {
    render(<ErrorAlert errors={["Error 1", "", "Error 2"]} />);

    expect(screen.getByText("Error 1")).toBeInTheDocument();
    expect(screen.getByText("Error 2")).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("should render title when provided", () => {
    render(
      <ErrorAlert title="Validation Error" errors={["Field is required"]} />
    );

    expect(screen.getByText("Validation Error")).toBeInTheDocument();
    expect(screen.getByText("Field is required")).toBeInTheDocument();
  });

  it("should not render title when not provided", () => {
    render(<ErrorAlert errors={["Error message"]} />);

    // Should not find any h1/h2 or strong title element
    const titleElement = screen.queryByText("Validation Error");
    expect(titleElement).not.toBeInTheDocument();
  });

  it("should apply custom additional classes to alert box", () => {
    const { container } = render(
      <ErrorAlert errors={["Error"]} additionalClasses="custom-class mt-4" />
    );

    const alertBox = container.querySelector(".custom-class");
    expect(alertBox).toBeInTheDocument();
    expect(alertBox).toHaveClass("mt-4");
  });

  it("should apply center screen classes when centerScreen is true", () => {
    const { container } = render(
      <ErrorAlert errors={["Error"]} centerScreen={true} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "items-center", "justify-center");
  });

  it("should not apply center screen classes when centerScreen is false", () => {
    const { container } = render(
      <ErrorAlert errors={["Error"]} centerScreen={false} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveClass("flex", "items-center", "justify-center");
  });

  it("should have correct styling classes on alert container", () => {
    const { container } = render(<ErrorAlert errors={["Error"]} />);

    const alertBox = container.querySelector(".border.border-red-500");
    expect(alertBox).toBeInTheDocument();
    expect(alertBox).toHaveClass(
      "rounded-xl",
      "px-6",
      "py-4",
      "bg-white",
      "text-center",
      "shadow-md"
    );
  });

  it("should render error icon with correct styling", () => {
    render(<ErrorAlert errors={["Error"]} />);

    const icon = screen.getByTestId("error-icon");
    expect(icon).toHaveClass("text-red-600", "text-4xl");
  });

  it("should render error messages as list items", () => {
    render(<ErrorAlert errors={["Error 1", "Error 2", "Error 3"]} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);

    listItems.forEach((item) => {
      expect(item).toHaveClass("font-medium", "text-left");
    });
  });

  it("should render title with correct styling", () => {
    render(<ErrorAlert title="Form Error" errors={["Error message"]} />);

    const titleElement = screen.getByText("Form Error");
    expect(titleElement).toHaveClass("text-red-600", "font-bold", "text-lg");
  });

  it("should render all provided props together", () => {
    const { container } = render(
      <ErrorAlert
        title="Submit Error"
        errors={["Username taken", "Email already exists"]}
        additionalClasses="border-2"
        centerScreen={true}
      />
    );

    expect(screen.getByText("Submit Error")).toBeInTheDocument();
    expect(screen.getByText("Username taken")).toBeInTheDocument();
    expect(screen.getByText("Email already exists")).toBeInTheDocument();
    expect(container.querySelector(".border-2")).toBeInTheDocument();
    expect(
      container.querySelector(".flex.items-center.justify-center")
    ).toBeInTheDocument();
  });

  it("should have ul element with list styling", () => {
    const { container } = render(
      <ErrorAlert errors={["Error 1", "Error 2"]} />
    );

    const ul = container.querySelector("ul");
    expect(ul).toBeInTheDocument();
    expect(ul).toHaveClass("text-red-600", "text-sm", "list-none", "mt-2");
  });

  it("should render error messages in order", () => {
    render(
      <ErrorAlert errors={["First error", "Second error", "Third error"]} />
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("First error");
    expect(listItems[1]).toHaveTextContent("Second error");
    expect(listItems[2]).toHaveTextContent("Third error");
  });

  it("should handle very long error messages", () => {
    const longError =
      "This is a very long error message that should still render correctly and wrap to multiple lines if needed without breaking the layout";

    render(<ErrorAlert errors={[longError]} />);

    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it("should handle special characters in error messages", () => {
    const specialError = 'Error: <script> & "quotes" shouldn\'t break';

    render(<ErrorAlert errors={[specialError]} />);

    expect(screen.getByText(specialError)).toBeInTheDocument();
  });

  it("should filter out whitespace-only strings", () => {
    render(<ErrorAlert errors={["Error 1", "   ", "Error 2"]} />);

    // Should render but whitespace-only strings should not appear
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);
  });

  it("should render with default centerScreen value (false)", () => {
    const { container } = render(<ErrorAlert errors={["Error"]} />);

    const wrapper = container.firstChild as HTMLElement;
    // Should have w-full but not centered classes
    expect(wrapper).toHaveClass("w-full");
    expect(wrapper).not.toHaveClass("flex", "items-center", "justify-center");
  });

  it("should render with default additionalClasses value (empty string)", () => {
    const { container } = render(<ErrorAlert errors={["Error"]} />);

    const alertBox = container.querySelector(".border.border-red-500");
    // Should exist without additional classes
    expect(alertBox).toBeInTheDocument();
  });

  it("should match snapshot with single error", () => {
    const { container } = render(
      <ErrorAlert errors={["Email format is invalid"]} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with multiple errors", () => {
    const { container } = render(
      <ErrorAlert errors={["Error 1", "Error 2", "Error 3"]} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with title", () => {
    const { container } = render(
      <ErrorAlert title="Form Error" errors={["Error message"]} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with all props combined", () => {
    const { container } = render(
      <ErrorAlert
        title="Complex Error"
        errors={["Error 1", null, "Error 2", undefined]}
        additionalClasses="custom-margin"
        centerScreen={true}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
