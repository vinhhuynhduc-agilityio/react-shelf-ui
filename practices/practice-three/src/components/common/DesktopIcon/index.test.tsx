import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DesktopIcon } from "@/components/common/DesktopIcon";
import type { WindowKey } from "@/types";

describe("DesktopIcon", () => {
  const IMAGE = "/images/icon.webp";
  const TITLE = "My App";
  const KEY: WindowKey = "spreadsheet";

  const defaultProps = {
    image: IMAGE,
    title: TITLE,
    keyIcon: KEY,
    onIconClick: jest.fn(),
    onDoubleClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render image with correct src and alt text", () => {
      render(<DesktopIcon {...defaultProps} />);

      const img = screen.getByAltText(TITLE) as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain(IMAGE);
    });

    it("should render title text", () => {
      render(<DesktopIcon {...defaultProps} />);

      expect(screen.getByText(TITLE)).toBeInTheDocument();
    });

    it("should render both image and title", () => {
      render(<DesktopIcon {...defaultProps} />);

      expect(screen.getByAltText(TITLE)).toBeInTheDocument();
      expect(screen.getByText(TITLE)).toBeInTheDocument();
    });

    it("should render with correct base classes", () => {
      const { container } = render(<DesktopIcon {...defaultProps} />);

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("flex");
      expect(root).toHaveClass("flex-col");
      expect(root).toHaveClass("items-center");
      expect(root).toHaveClass("justify-center");
      expect(root).toHaveClass("overflow-hidden");
      expect(root).toHaveClass("box-border");
      expect(root).toHaveClass("text-xs");
      expect(root).toHaveClass("border-none");
    });

    it("should have grid-drag-handle class", () => {
      const { container } = render(<DesktopIcon {...defaultProps} />);

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("grid-drag-handle");
    });

    it("should have correct width and height", () => {
      const { container } = render(<DesktopIcon {...defaultProps} />);

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("w-[100px]");
      expect(root).toHaveClass("h-[110px]");
    });

    it("should have hover styles", () => {
      const { container } = render(<DesktopIcon {...defaultProps} />);

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("hover:bg-[rgba(255,255,255,0.2)]");
      expect(root).toHaveClass(
        "hover:[border:2px_solid_rgba(255,255,255,0.2)]"
      );
    });

    it("should render with correct image container styles", () => {
      render(<DesktopIcon {...defaultProps} />);

      const img = screen.getByAltText(TITLE);
      expect(img).toHaveClass("w-[50px]");
      expect(img).toHaveClass("h-[50px]");
      expect(img).toHaveClass("object-contain");
    });

    it("should render title with correct styling", () => {
      render(<DesktopIcon {...defaultProps} />);

      const titleSpan = screen.getByText(TITLE);
      expect(titleSpan).toHaveClass("mt-2");
      expect(titleSpan).toHaveClass("text-white");
      expect(titleSpan).toHaveClass("text-[14px]");
      expect(titleSpan).toHaveClass("font-normal");
      expect(titleSpan).toHaveClass("leading-tight");
      expect(titleSpan).toHaveClass("max-w-[85px]");
      expect(titleSpan).toHaveClass("text-center");
      expect(titleSpan).toHaveClass("truncate");
    });

    it("should render title with text shadow style", () => {
      render(<DesktopIcon {...defaultProps} />);

      const titleSpan = screen.getByText(TITLE);
      expect(titleSpan).toHaveStyle({
        letterSpacing: "0.2px",
        textShadow: "1px 1px #222, 0px 1px 0px #000",
      });
    });
  });

  describe("Single Click (onIconClick)", () => {
    it("should call onIconClick on single mouseDown", () => {
      render(<DesktopIcon {...defaultProps} />);

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;
      fireEvent.mouseDown(container);

      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(1);
      expect(defaultProps.onIconClick).toHaveBeenCalledWith(KEY);
    });

    it("should call onIconClick with correct key", () => {
      const onIconClick = jest.fn();
      render(
        <DesktopIcon
          {...defaultProps}
          keyIcon="filemanager"
          onIconClick={onIconClick}
        />
      );

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;
      fireEvent.mouseDown(container);

      expect(onIconClick).toHaveBeenCalledWith("filemanager");
    });

    it("should call onIconClick after 300ms timeout if no second click", async () => {
      render(<DesktopIcon {...defaultProps} />);

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;
      fireEvent.mouseDown(container);

      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(300);

      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Double Click (onDoubleClick)", () => {
    it("should call onDoubleClick on double mouseDown", async () => {
      render(<DesktopIcon {...defaultProps} />);

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;

      // First click
      fireEvent.mouseDown(container);
      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(1);

      // Second click within 300ms
      fireEvent.mouseDown(container);

      expect(defaultProps.onDoubleClick).toHaveBeenCalledTimes(1);
      expect(defaultProps.onDoubleClick).toHaveBeenCalledWith(KEY);
      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(1); // Should not increase
    });

    it("should call onDoubleClick with correct key", () => {
      const onDoubleClick = jest.fn();
      render(
        <DesktopIcon
          {...defaultProps}
          keyIcon="pivot"
          onDoubleClick={onDoubleClick}
        />
      );

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;

      fireEvent.mouseDown(container);
      fireEvent.mouseDown(container);

      expect(onDoubleClick).toHaveBeenCalledWith("pivot");
    });

    it("should not call onDoubleClick if clicks are beyond 300ms", () => {
      render(<DesktopIcon {...defaultProps} />);

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;

      // First click
      fireEvent.mouseDown(container);
      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(1);

      // Advance time beyond 300ms
      jest.advanceTimersByTime(301);

      // Second click after timeout
      fireEvent.mouseDown(container);

      // Should call onIconClick again, not onDoubleClick
      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(2);
      expect(defaultProps.onDoubleClick).not.toHaveBeenCalled();
    });

    it("should clear timer after double click", () => {
      render(<DesktopIcon {...defaultProps} />);

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;

      fireEvent.mouseDown(container);
      fireEvent.mouseDown(container);

      // Third click should call onIconClick again (timer was cleared)
      fireEvent.mouseDown(container);

      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(2);
      expect(defaultProps.onDoubleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("isSelected Prop", () => {
    it("should not have selected styles when isSelected is false", () => {
      const { container } = render(
        <DesktopIcon {...defaultProps} isSelected={false} />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).not.toHaveClass("bg-[rgba(255,255,255,0.2)]");
      expect(root).not.toHaveClass("[border:2px_solid_rgba(255,255,255,0.2)]");
    });

    it("should have selected styles when isSelected is true", () => {
      const { container } = render(
        <DesktopIcon {...defaultProps} isSelected={true} />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("bg-[rgba(255,255,255,0.2)]");
      expect(root).toHaveClass("[border:2px_solid_rgba(255,255,255,0.2)]");
    });

    it("should have default isSelected as false", () => {
      const { container } = render(<DesktopIcon {...defaultProps} />);

      const root = container.querySelector(".desktop-icon");
      expect(root).not.toHaveClass("bg-[rgba(255,255,255,0.2)]");
    });
  });

  describe("cursorPointer Prop", () => {
    it("should not have cursor-pointer class when cursorPointer is false", () => {
      const { container } = render(
        <DesktopIcon {...defaultProps} cursorPointer={false} />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).not.toHaveClass("cursor-pointer");
    });

    it("should have cursor-pointer class when cursorPointer is true", () => {
      const { container } = render(
        <DesktopIcon {...defaultProps} cursorPointer={true} />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("cursor-pointer");
    });

    it("should have default cursorPointer as false", () => {
      const { container } = render(<DesktopIcon {...defaultProps} />);

      const root = container.querySelector(".desktop-icon");
      expect(root).not.toHaveClass("cursor-pointer");
    });

    it("should apply cursor-pointer with isSelected", () => {
      const { container } = render(
        <DesktopIcon {...defaultProps} isSelected={true} cursorPointer={true} />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("cursor-pointer");
      expect(root).toHaveClass("bg-[rgba(255,255,255,0.2)]");
    });
  });

  describe("Window Key Types", () => {
    it("should work with spreadsheet key", () => {
      render(<DesktopIcon {...defaultProps} keyIcon="spreadsheet" />);
      expect(screen.getByAltText(TITLE)).toBeInTheDocument();
    });

    it("should work with filemanager key", () => {
      render(<DesktopIcon {...defaultProps} keyIcon="filemanager" />);
      expect(screen.getByAltText(TITLE)).toBeInTheDocument();
    });

    it("should work with pivot key", () => {
      render(<DesktopIcon {...defaultProps} keyIcon="pivot" />);
      expect(screen.getByAltText(TITLE)).toBeInTheDocument();
    });

    it("should work with kanban key", () => {
      render(<DesktopIcon {...defaultProps} keyIcon="kanban" />);
      expect(screen.getByAltText(TITLE)).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid clicks correctly", () => {
      render(<DesktopIcon {...defaultProps} />);

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;

      // Rapid clicks
      fireEvent.mouseDown(container);
      fireEvent.mouseDown(container);
      fireEvent.mouseDown(container);

      expect(defaultProps.onDoubleClick).toHaveBeenCalledTimes(1);
      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(2);
    });

    it("should handle long title text", () => {
      const longTitle = "This is a very long title that should be truncated";
      render(<DesktopIcon {...defaultProps} title={longTitle} />);

      const titleSpan = screen.getByText(longTitle);
      expect(titleSpan).toHaveClass("truncate");
      expect(titleSpan).toHaveClass("max-w-[85px]");
    });

    it("should handle empty title gracefully", () => {
      const { container } = render(<DesktopIcon {...defaultProps} title="" />);

      expect(container.querySelector(".desktop-icon")).toBeInTheDocument();
    });

    it("should handle image load errors gracefully", () => {
      render(<DesktopIcon {...defaultProps} image="/non-existent.png" />);

      const img = screen.getByAltText(TITLE) as HTMLImageElement;
      expect(img.src).toContain("/non-existent.png");
    });

    it("should maintain timer reference correctly", () => {
      render(<DesktopIcon {...defaultProps} />);

      const container = screen.getByAltText(TITLE).closest(".desktop-icon")!;

      fireEvent.mouseDown(container);
      jest.advanceTimersByTime(150); // Halfway through timeout
      fireEvent.mouseDown(container); // Double click

      expect(defaultProps.onDoubleClick).toHaveBeenCalledTimes(1);
      expect(defaultProps.onIconClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have descriptive alt text for image", () => {
      render(<DesktopIcon {...defaultProps} />);

      const img = screen.getByAltText(TITLE);
      expect(img).toHaveAttribute("alt", TITLE);
    });

    it("should render text content for screen readers", () => {
      render(<DesktopIcon {...defaultProps} />);

      expect(screen.getByText(TITLE)).toBeInTheDocument();
    });
  });

  describe("Props Combinations", () => {
    it("should work with all props enabled", () => {
      const { container } = render(
        <DesktopIcon {...defaultProps} isSelected={true} cursorPointer={true} />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("cursor-pointer");
      expect(root).toHaveClass("bg-[rgba(255,255,255,0.2)]");
    });

    it("should work with all props disabled", () => {
      const { container } = render(
        <DesktopIcon
          {...defaultProps}
          isSelected={false}
          cursorPointer={false}
        />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).not.toHaveClass("cursor-pointer");
      expect(root).not.toHaveClass("bg-[rgba(255,255,255,0.2)]");
    });

    it("should work with selected but no cursor pointer", () => {
      const { container } = render(
        <DesktopIcon
          {...defaultProps}
          isSelected={true}
          cursorPointer={false}
        />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).not.toHaveClass("cursor-pointer");
      expect(root).toHaveClass("bg-[rgba(255,255,255,0.2)]");
    });

    it("should work with cursor pointer but not selected", () => {
      const { container } = render(
        <DesktopIcon
          {...defaultProps}
          isSelected={false}
          cursorPointer={true}
        />
      );

      const root = container.querySelector(".desktop-icon");
      expect(root).toHaveClass("cursor-pointer");
      expect(root).not.toHaveClass("bg-[rgba(255,255,255,0.2)]");
    });
  });
});
