import React, { ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useWindowStore } from "@/stores";
import DraggableWindow from ".";
import type { WindowKey } from "@/types";

jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(),
}));

jest.mock("@/helpers", () => ({
  updateFrame: jest.fn(),
}));

interface RndProps {
  children?: ReactNode;
  onMouseDown?: () => void;
  onDragStop?: (e: unknown, d: { x: number; y: number }) => void;
  onResize?: (
    e: unknown,
    direction: string,
    elementRef: HTMLElement,
    delta: unknown,
    position: { x: number; y: number }
  ) => void;
  onResizeStop?: (
    e: unknown,
    direction: string,
    elementRef: HTMLElement,
    delta: unknown,
    position: { x: number; y: number }
  ) => void;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

jest.mock("react-rnd", () => ({
  Rnd: React.forwardRef<HTMLDivElement, RndProps>(
    (
      {
        children,
        onMouseDown,
        onDragStop,
        onResize,
        onResizeStop,
        style,
        ...props
      }: RndProps,
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div
        ref={ref}
        data-testid="rnd-component"
        data-props={JSON.stringify(props)}
        style={style}
        onMouseDown={onMouseDown}
        onClick={() => {
          if (onDragStop && typeof onDragStop === "function") {
            onDragStop(null, { x: 100, y: 100 });
          }
          if (onResize && typeof onResize === "function") {
            const mockElement = {
              offsetWidth: 300,
              offsetHeight: 300,
            } as HTMLElement;
            onResize(null, "se", mockElement, null, { x: 0, y: 0 });
          }
          if (onResizeStop && typeof onResizeStop === "function") {
            const mockElement = {
              offsetWidth: 300,
              offsetHeight: 300,
            } as HTMLElement;
            onResizeStop(null, "se", mockElement, null, { x: 0, y: 0 });
          }
        }}
      >
        {children}
      </div>
    )
  ),
}));

const mockedUseWindowStore = useWindowStore as jest.MockedFunction<
  typeof useWindowStore
>;

describe("DraggableWindow", () => {
  const mockSetFrame = jest.fn();
  const mockOnMouseDown = jest.fn();

  const defaultProps = {
    windowKey: "spreadsheet" as WindowKey,
    children: <div>Window Content</div>,
    zIndex: 10,
    onMouseDown: mockOnMouseDown,
  };

  const mockStoreState = {
    setFrame: mockSetFrame,
    frames: {
      spreadsheet: { x: 0, y: 0, width: 400, height: 300 },
    },
    windows: {
      spreadsheet: { isMaximized: false },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof mockStoreState) => unknown;
      return fn(mockStoreState) as unknown as ReturnType<typeof useWindowStore>;
    });
  });

  it("should render children content", () => {
    render(<DraggableWindow {...defaultProps} />);

    expect(screen.getByText("Window Content")).toBeInTheDocument();
  });

  it("should render Rnd component with correct size when not maximized", () => {
    render(<DraggableWindow {...defaultProps} />);

    const rndComponent = screen.getByTestId("rnd-component");
    const props = JSON.parse(
      rndComponent.getAttribute("data-props") || "{}"
    ) as Record<string, unknown>;

    expect(props.size).toEqual({ width: 400, height: 300 });
    expect(props.position).toEqual({ x: 0, y: 0 });
  });

  it("should render fullscreen when maximized", () => {
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof mockStoreState) => unknown;
      return fn({
        ...mockStoreState,
        windows: {
          spreadsheet: { isMaximized: true },
        },
      }) as unknown as ReturnType<typeof useWindowStore>;
    });

    render(<DraggableWindow {...defaultProps} />);

    const rndComponent = screen.getByTestId("rnd-component");
    const props = JSON.parse(
      rndComponent.getAttribute("data-props") || "{}"
    ) as Record<string, unknown>;

    expect(props.size).toEqual({ width: "100%", height: "100%" });
    expect(props.position).toEqual({ x: 0, y: 0 });
  });

  it("should call onMouseDown when component is clicked", () => {
    render(<DraggableWindow {...defaultProps} />);

    fireEvent.mouseDown(screen.getByTestId("rnd-component"));

    expect(mockOnMouseDown).toHaveBeenCalled();
  });

  it("should hide window when hidden prop is true", () => {
    render(<DraggableWindow {...defaultProps} hidden={true} />);

    const rndComponent = screen.getByTestId("rnd-component") as HTMLElement;
    expect(rndComponent).toHaveStyle({ display: "none" });
  });

  it("should display window when hidden prop is false", () => {
    render(<DraggableWindow {...defaultProps} hidden={false} />);

    const rndComponent = screen.getByTestId("rnd-component") as HTMLElement;
    expect(rndComponent).toHaveStyle({ display: "block" });
  });

  it("should set correct zIndex", () => {
    render(<DraggableWindow {...defaultProps} zIndex={50} />);

    const rndComponent = screen.getByTestId("rnd-component") as HTMLElement;
    expect(rndComponent).toHaveStyle({ zIndex: "50" });
  });

  it("should call setFrame on drag stop when not maximized", () => {
    render(<DraggableWindow {...defaultProps} />);

    fireEvent.click(screen.getByTestId("rnd-component"));

    expect(mockSetFrame).toHaveBeenCalledWith("spreadsheet", {
      x: 100,
      y: 100,
      width: 400,
      height: 300,
    });
  });

  it("should not call setFrame on drag stop when maximized", () => {
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof mockStoreState) => unknown;
      return fn({
        ...mockStoreState,
        windows: {
          spreadsheet: { isMaximized: true },
        },
      }) as unknown as ReturnType<typeof useWindowStore>;
    });

    render(<DraggableWindow {...defaultProps} />);

    fireEvent.click(screen.getByTestId("rnd-component"));

    expect(mockSetFrame).not.toHaveBeenCalled();
  });

  it("should disable resizing when maximized", () => {
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof mockStoreState) => unknown;
      return fn({
        ...mockStoreState,
        windows: {
          spreadsheet: { isMaximized: true },
        },
      }) as unknown as ReturnType<typeof useWindowStore>;
    });

    render(<DraggableWindow {...defaultProps} />);

    const rndComponent = screen.getByTestId("rnd-component");
    const props = JSON.parse(
      rndComponent.getAttribute("data-props") || "{}"
    ) as Record<string, unknown>;

    expect(props.enableResizing).toBe(false);
  });

  it("should enable resizing when not maximized", () => {
    render(<DraggableWindow {...defaultProps} />);

    const rndComponent = screen.getByTestId("rnd-component");
    const props = JSON.parse(
      rndComponent.getAttribute("data-props") || "{}"
    ) as Record<string, unknown>;

    expect(props.enableResizing).toBe(true);
  });

  it("should disable dragging when maximized", () => {
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof mockStoreState) => unknown;
      return fn({
        ...mockStoreState,
        windows: {
          spreadsheet: { isMaximized: true },
        },
      }) as unknown as ReturnType<typeof useWindowStore>;
    });

    render(<DraggableWindow {...defaultProps} />);

    const rndComponent = screen.getByTestId("rnd-component");
    const props = JSON.parse(
      rndComponent.getAttribute("data-props") || "{}"
    ) as Record<string, unknown>;

    expect(props.disableDragging).toBe(true);
  });

  it("should enable dragging when not maximized", () => {
    render(<DraggableWindow {...defaultProps} />);

    const rndComponent = screen.getByTestId("rnd-component");
    const props = JSON.parse(
      rndComponent.getAttribute("data-props") || "{}"
    ) as Record<string, unknown>;

    expect(props.disableDragging).toBe(false);
  });
});
