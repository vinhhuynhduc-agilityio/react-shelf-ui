import { render, screen } from "@/helpers/test-utils";
import NotFoundPage from ".";

describe("NotFoundPage", () => {
  it("renders 404 image, heading, and message", () => {
    render(<NotFoundPage />);
    expect(screen.getByAltText(/404 not found/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /404 - page not found/i })).toBeInTheDocument();
    expect(screen.getByText(/oops! the page you’re looking for doesn’t exist/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<NotFoundPage />);
    expect(container).toMatchSnapshot();
  });
});
