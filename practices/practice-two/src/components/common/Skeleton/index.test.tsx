import Skeleton from ".";
import { render } from "@testing-library/react";

describe("Skeleton", () => {
	it("renders with default props", () => {
		const { getByTestId } = render(<Skeleton dataTestId="skeleton" />);
		const skeleton = getByTestId("skeleton");
		expect(skeleton).toBeInTheDocument();
		expect(skeleton).toHaveClass("block");
		expect(skeleton).toHaveClass("bg-gray-200");
	});

	it("applies custom width, height, and borderRadius", () => {
		const { getByTestId } = render(
			<Skeleton
				dataTestId="skeleton"
				width={120}
				height={40}
				borderRadius={8}
			/>
		);
		const skeleton = getByTestId("skeleton");
		expect(skeleton).toHaveStyle({
			width: "120px",
			height: "40px",
			borderRadius: "8px",
		});
	});

	it("applies custom className", () => {
		const { getByTestId } = render(
			<Skeleton dataTestId="skeleton" className="custom-class" />
		);
		const skeleton = getByTestId("skeleton");
		expect(skeleton).toHaveClass("custom-class");
	});

	it("renders inline-block variant", () => {
		const { getByTestId } = render(
			<Skeleton dataTestId="skeleton" variant="inline-block" />
		);
		const skeleton = getByTestId("skeleton");
		expect(skeleton).toHaveClass("inline-block");
	});
});
