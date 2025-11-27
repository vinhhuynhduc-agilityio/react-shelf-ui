import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorAlert from ".";

jest.mock("react-icons/md", () => ({
  MdError: ({ "data-testid": testId }: { "data-testid": string }) => (
    <div data-testid={testId}>Error Icon</div>
  ),
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

    expect(screen.getByTestId("MdError-icon")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("should match snapshot with single error", () => {
    const { container } = render(
      <ErrorAlert errors={["Email format is invalid"]} />
    );

    expect(container).toMatchSnapshot();
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

  it("should match snapshot with multiple errors", () => {
    const { container } = render(
      <ErrorAlert errors={["Error 1", "Error 2", "Error 3"]} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should filter out null and undefined from mixed errors array", () => {
    render(
      <ErrorAlert errors={["Valid error", null, undefined, "Another error"]} />
    );

    expect(screen.getByText("Valid error")).toBeInTheDocument();
    expect(screen.getByText("Another error")).toBeInTheDocument();
  });

  it("should render title when provided", () => {
    render(
      <ErrorAlert title="Validation Error" errors={["Field is required"]} />
    );

    expect(screen.getByText("Validation Error")).toBeInTheDocument();
    expect(screen.getByText("Field is required")).toBeInTheDocument();
  });

  it("should match snapshot with title", () => {
    const { container } = render(
      <ErrorAlert title="Form Error" errors={["Error message"]} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should not render title when not provided", () => {
    render(<ErrorAlert errors={["Error message"]} />);

    expect(screen.queryByText("Validation Error")).not.toBeInTheDocument();
  });

  it("should apply custom additional classes", () => {
    const { container } = render(
      <ErrorAlert errors={["Error"]} additionalClasses="custom-class" />
    );

    const alertBox = container.querySelector(".custom-class");
    expect(alertBox).toBeInTheDocument();
  });

  it("should match snapshot with additional classes", () => {
    const { container } = render(
      <ErrorAlert errors={["Error"]} additionalClasses="mt-4 mb-2" />
    );

    expect(container).toMatchSnapshot();
  });

  it("should center screen when centerScreen is true", () => {
    const { container } = render(
      <ErrorAlert errors={["Error"]} centerScreen={true} />
    );

    const wrapper = container.querySelector(
      ".flex.items-center.justify-center"
    );
    expect(wrapper).toBeInTheDocument();
  });

  it("should match snapshot with centerScreen enabled", () => {
    const { container } = render(
      <ErrorAlert errors={["Error"]} centerScreen={true} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should display error icon", () => {
    render(<ErrorAlert errors={["Error message"]} />);

    expect(screen.getByTestId("MdError-icon")).toBeInTheDocument();
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
