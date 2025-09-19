import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DesktopIcon } from "@/components/common/DesktopIcon";

describe("DesktopIcon", () => {
  const IMAGE = "/images/icon.png";
  const TITLE = "My App";
  const KEY = "spreadsheet";

  it("renders image (with alt) and title", () => {
    render(
      <DesktopIcon
        image={IMAGE}
        title={TITLE}
        keyIcon={KEY}
        onIconClick={() => {}}
      />
    );

    const img = screen.getByAltText(TITLE) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(IMAGE);

    expect(screen.getByText(TITLE)).toBeInTheDocument();
  });

  it("calls onIconClick with correct key on mouseDown", () => {
    const handler = jest.fn();
    render(
      <DesktopIcon
        image={IMAGE}
        title={TITLE}
        keyIcon={KEY}
        onIconClick={handler}
      />
    );

    const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;
    fireEvent.mouseDown(container);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(KEY);
  });

  it("applies selected styles when isSelected is true", () => {
    const { container } = render(
      <DesktopIcon
        image={IMAGE}
        title={TITLE}
        keyIcon={KEY}
        onIconClick={() => {}}
        isSelected
      />
    );

    const root = container.querySelector(".desktop-icon")!;
    expect(root.className).toMatch(/bg-\[rgba\(255,255,255,0.2\)\]/);
  });
});
