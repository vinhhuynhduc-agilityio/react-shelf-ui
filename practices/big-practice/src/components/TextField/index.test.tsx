import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { TextField } from "../TextField";
import { isProjectDuplicate } from "@/components/Forms/ProjectForm/helpers";

jest.mock("@/helpers", () => ({
  isProjectDuplicate: jest.fn(),
}));

describe("TextField Component", () => {
  const TestWrapper = (
    props: Partial<React.ComponentProps<typeof TextField>>
  ) => {
    const { register, formState: { errors } } = useForm();

    return (
      <form>
        <TextField
          name="projectName"
          label="Project Name"
          placeholder="Enter project name"
          labelWidth="w-32"
          register={register}
          withErrorMargin="ml-32"
          validation={{
            required: "Project name is required",
            validate: {
              duplicate: (value) =>
                !isProjectDuplicate([], value) || "Project name already exists",
            },
          }}
          error={errors.projectName?.message as string}
          {...props}
        />
      </form>
    );
  };

  const setup = (props?: Partial<React.ComponentProps<typeof TextField>>) =>
    render(<TestWrapper {...props} />);

  it("should render the input with the correct label", () => {
    setup();
    expect(screen.getByLabelText("Project Name")).toBeInTheDocument();
  });

  it("should render the placeholder text", () => {
    setup();
    expect(screen.getByPlaceholderText("Enter project name")).toBeInTheDocument();
  });

  it("should apply the correct label width class", () => {
    setup({ labelWidth: "w-32" });
    const label = screen.getByText("Project Name");
    expect(label).toHaveClass("w-32");
  });

  it("should display an error message when validation fails", () => {
    setup({ error: "Project name is required" });
    expect(screen.getByText("Project name is required")).toBeInTheDocument();
  });

  it("should apply the correct error margin class", () => {
    setup({ error: "Project name is required", withErrorMargin: "ml-32" });
    const errorMessage = screen.getByText("Project name is required");
    expect(errorMessage).toHaveClass("ml-32");
  });

  it("should not render an error message when no error prop is provided", () => {
    setup();
    expect(screen.queryByText("Project name is required")).not.toBeInTheDocument();
  });

  it("should render the input with the correct type", () => {
    setup({ type: "email" });
    const input = screen.getByLabelText("Project Name");
    expect(input).toHaveAttribute("type", "email");
  });
});
