import { render, screen } from "../test-utils";
import React from "react";

describe("customRender", () => {
	it("renders children with QueryClientProvider", () => {
		render(<div>Test content</div>);
		expect(screen.getByText("Test content")).toBeInTheDocument();
	});
});
