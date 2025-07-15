import { BookMediaCard } from "@/components";
import { render, screen } from "@testing-library/react";

describe("BookMediaCard", () => {
	it("renders image with correct src and alt", () => {
		render(<BookMediaCard imageUrl="test.jpg" title="Test Book" />);
		const img = screen.getByAltText("Test Book");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", "test.jpg");
	});

	it("renders action icons with correct labels", () => {
		render(<BookMediaCard imageUrl="test.jpg" title="Test Book" />);
		expect(screen.getByText("Review")).toBeInTheDocument();
		expect(screen.getByText("Notes")).toBeInTheDocument();
		expect(screen.getByText("Share")).toBeInTheDocument();
	});
});
