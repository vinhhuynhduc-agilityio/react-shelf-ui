import { render } from "@testing-library/react";
import { Icon } from ".";
import { fa } from "@/icons/fa";

interface FontAwesomeIconProps {
  className?: string;
  onClick?: () => void;
}

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ className, onClick }: FontAwesomeIconProps) => (
    <svg className={className} onClick={onClick} data-testid="icon" />
  ),
}));

describe("Icon", () => {
  it("should render icon with className and onClick", () => {
    const handleClick = jest.fn();

    const { container } = render(
      <Icon
        icon={fa.faPencil}
        className="text-blue-600 text-lg"
        onClick={handleClick}
      />
    );

    const icon = container.querySelector("svg");
    expect(icon).toHaveClass("text-blue-600", "text-lg");
  });

  it("should match snapshot", () => {
    const { container } = render(
      <Icon icon={fa.faPencil} className="text-red-600" />
    );

    expect(container).toMatchSnapshot();
  });
});
