import { ParagraphMessage } from "./index";
import { render, screen } from "@testing-library/react";

describe("ParagraphMessage", () => {
  it("renders the text prop", () => {
    render(<ParagraphMessage text="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders with no className if not provided", () => {
    render(<ParagraphMessage text="No class" />);
    const p = screen.getByText("No class");
    expect(p.className).toBe("");
  });

  it("applies a custom className", () => {
    render(<ParagraphMessage text="Custom style" className="text-red-500" />);
    const p = screen.getByText("Custom style");
    expect(p).toHaveClass("text-red-500");
  });
});
