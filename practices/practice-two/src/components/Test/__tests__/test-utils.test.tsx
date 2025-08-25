import { render, screen } from "../test-utils";

describe("customRender", () => {
  it("renders children with QueryClientProvider", () => {
    render(<div>Test content</div>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
