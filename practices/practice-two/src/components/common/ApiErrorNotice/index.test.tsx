import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ApiErrorNotice from "./index";

describe("ApiErrorNotice", () => {
	it("renders nothing if errors array is empty", () => {
		const { container } = render(<ApiErrorNotice errors={[]} />);
		expect(container.firstChild).toBeNull();
	});

	it("renders nothing if errors array only has falsy values", () => {
		const { container } = render(
			<ApiErrorNotice errors={[null, undefined, ""]} />
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders error messages", () => {
		render(<ApiErrorNotice errors={["Error 1", "Error 2"]} />);
		expect(screen.getByText("Error 1")).toBeInTheDocument();
		expect(screen.getByText("Error 2")).toBeInTheDocument();
		expect(screen.getByRole("list")).toBeInTheDocument();
	});

	it("renders title if provided", () => {
		render(<ApiErrorNotice title="API Error" errors={["Error!"]} />);
		expect(screen.getByText("API Error")).toBeInTheDocument();
		expect(screen.getByText("Error!")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<ApiErrorNotice errors={["Error!"]} className="my-error" />);
		const box = screen.getByText("Error!").closest("div.border-red-500");
		expect(box).toHaveClass("my-error");
	});

	it("applies centerScreen styles", () => {
		render(<ApiErrorNotice errors={["Error!"]} centerScreen />);
		const wrapper = screen.getByText("Error!").closest("div.w-full");
		expect(wrapper).toHaveClass("flex");
		expect(wrapper).toHaveClass("items-center");
		expect(wrapper).toHaveClass("justify-center");
	});

	it("renders MdError icon", () => {
		render(<ApiErrorNotice errors={["Error!"]} />);
		expect(screen.getByTestId("MdError-icon")).toBeInTheDocument();
	});

	it("matches snapshot", () => {
		const { container } = render(
			<ApiErrorNotice errors={["Error!"]} title="Error" />
		);
		expect(container).toMatchSnapshot();
	});
});
