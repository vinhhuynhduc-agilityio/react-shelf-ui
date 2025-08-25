import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Badge from ".";
import { STATUS_BADGE_STYLES } from "@/constants";

describe("Badge", () => {
  it("renders with 'In-Shelf' label and correct style", () => {
    render(
      <Badge label="In-Shelf" className={STATUS_BADGE_STYLES["In-Shelf"]} />
    );
    const badge = screen.getByText("In-Shelf");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-[#42BB4E]", "text-white");
  });

  it("renders with 'None' label and correct style", () => {
    render(<Badge label="None" className={STATUS_BADGE_STYLES["None"]} />);
    const badge = screen.getByText("None");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-[#C7C7C7]", "text-white");
  });

  it("matches snapshot for 'In-Shelf'", () => {
    const { container } = render(
      <Badge label="In-Shelf" className={STATUS_BADGE_STYLES["In-Shelf"]} />
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot for 'None'", () => {
    const { container } = render(
      <Badge label="None" className={STATUS_BADGE_STYLES["None"]} />
    );
    expect(container).toMatchSnapshot();
  });
});
