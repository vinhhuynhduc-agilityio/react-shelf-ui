import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthorCard from ".";

describe("AuthorCard", () => {
	it("matches snapshot", () => {
		const { container } = render(
			<AuthorCard name="Snapshot Name" bio="Snapshot Bio" />
		);
		expect(container).toMatchSnapshot();
	});

	it("renders author name and bio", () => {
		render(<AuthorCard name="John Doe" bio="A passionate writer." />);
		expect(screen.getByText(/Author/i)).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("A passionate writer.")).toBeInTheDocument();
	});

	it("applies correct container classes", () => {
		const { container } = render(
			<AuthorCard name="Jane Smith" bio="Bio here" />
		);
		expect(container.firstChild).toHaveClass("xl:w-[445px]");
		expect(container.firstChild).toHaveClass("xl:h-[418px]");
		expect(container.firstChild).toHaveClass("bg-white");
		expect(container.firstChild).toHaveClass("p-6");
		expect(container.firstChild).toHaveClass("rounded-[10px]");
	});
});
