import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import IconButton from "@/components/common/IconButton";

describe("IconButton", () => {
  it("renders button with given ariaLabel and icon element", () => {
    const { container } = render(
      <IconButton
        ariaLabel="Search"
        icon="fa-solid fa-search"
        onClick={() => {}}
      />
    );

    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn).toBeInTheDocument();

    const iconEl = container.querySelector("i");
    expect(iconEl).toBeInTheDocument();
    expect(iconEl).toHaveClass("fa-solid", "fa-search");
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(
      <IconButton ariaLabel="Open" icon="fa-solid fa-open" onClick={onClick} />
    );

    const btn = screen.getByRole("button", { name: "Open" });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom buttonStyles and iconStyles", () => {
    const { container } = render(
      <IconButton
        ariaLabel="Custom"
        icon="fa-solid fa-custom"
        onClick={() => {}}
        buttonStyles="my-btn-class"
        iconStyles="my-icon-class"
      />
    );

    const btn = screen.getByRole("button", { name: "Custom" });
    expect(btn.className).toMatch(/my-btn-class/);

    const iconEl = container.querySelector("i");
    expect(iconEl).toHaveClass("my-icon-class", "fa-solid", "fa-custom");
  });

  it("matches snapshot", () => {
    const { container } = render(
      <IconButton
        ariaLabel="Snapshot"
        icon="fa-regular fa-box"
        onClick={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
