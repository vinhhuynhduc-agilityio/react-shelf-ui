import { MyShelfBookCardSkeleton } from "./";
import { render, screen } from "@testing-library/react";

// Mock Skeleton to add data-testid for easier querying
jest.mock("@/components", () => {
	return {
		...jest.requireActual("@/components"),
		Skeleton: ({
			width,
			height,
			borderRadius,
			...rest
		}: React.ComponentProps<"div"> & {
			width?: string | number;
			height?: string | number;
			borderRadius?: string | number;
		}) => (
			<div
				data-testid="skeleton"
				{...rest}
				style={{
					width,
					height,
					borderRadius,
				}}
			/>
		),
	};
});

describe("MyShelfBookCardSkeleton", () => {
	it("renders without crashing", () => {
		render(<MyShelfBookCardSkeleton />);
	});

	it("renders exactly 7 Skeleton components", () => {
		render(<MyShelfBookCardSkeleton />);
		const skeletons = screen.getAllByTestId("skeleton");
		expect(skeletons.length).toBe(7);
	});

	it("Skeleton components have correct props", () => {
		render(<MyShelfBookCardSkeleton />);
		const skeletons = screen.getAllByTestId("skeleton");
		expect(skeletons[0]).toHaveStyle({
			width: "100px",
			height: "140px",
			borderRadius: "6px",
		});
		expect(skeletons[1]).toHaveStyle({
			width: "80px",
			height: "18px",
			borderRadius: "4px",
		});
		expect(skeletons[4]).toHaveStyle({
			width: "80px",
			height: "16px",
			borderRadius: "4px",
		});
		expect(skeletons[5]).toHaveStyle({
			width: "60px",
			height: "12px",
			borderRadius: "4px",
		});
		expect(skeletons[6]).toHaveStyle({
			width: "80px",
			height: "25px",
			borderRadius: "6px",
		});
	});

	it("renders left and right layout sections", () => {
		const { container } = render(<MyShelfBookCardSkeleton />);
		const left = container.querySelector(".w-3\\/5");
		const right = container.querySelector(".w-2\\/5");
		expect(left).toBeInTheDocument();
		expect(right).toBeInTheDocument();
	});

	it("renders correct structure for left section", () => {
		const { container } = render(<MyShelfBookCardSkeleton />);
		const left = container.querySelector(".w-3\\/5");
		expect(left?.querySelectorAll("[data-testid='skeleton']").length).toBe(4);
	});

	it("renders correct structure for right section", () => {
		const { container } = render(<MyShelfBookCardSkeleton />);
		const right = container.querySelector(".w-2\\/5");
		expect(right?.querySelectorAll("[data-testid='skeleton']").length).toBe(3);
	});
});
