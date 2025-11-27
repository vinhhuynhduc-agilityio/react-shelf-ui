import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PivotPage from ".";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    constructor(private cb: ResizeObserverCallback) {}
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  } as unknown as typeof ResizeObserver;
});

afterAll(() => {
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

jest.mock("@/hook", () => ({
  usePivotQuery: jest.fn(),
}));

jest.mock("@/components", () => ({
  Button: ({
    children,
    onClick,
    active,
  }: {
    children: string;
    onClick: () => void;
    active?: boolean;
  }) => (
    <button
      onClick={onClick}
      data-testid={`view-button-${children}`}
      data-active={active}
    >
      {children}
    </button>
  ),
  PivotTableView: ({ tableHeight }: { tableHeight: number }) => (
    <div data-testid="pivot-table-view" data-height={tableHeight}>
      Table View
    </div>
  ),
  PivotTreeView: ({ tableHeight }: { tableHeight: number }) => (
    <div data-testid="pivot-tree-view" data-height={tableHeight}>
      Tree View
    </div>
  ),
  ChartView: ({ height }: { height: number }) => (
    <div data-testid="chart-view" data-height={height}>
      Chart View
    </div>
  ),
}));

jest.mock("@/constant", () => ({
  VIEW: { TREE: "tree", TABLE: "table", CHART: "chart" },
}));

import { usePivotQuery } from "@/hook";

describe("PivotPage", () => {
  const mockPivotData = [{ id: 1, name: "Item 1" }];

  beforeEach(() => {
    jest.clearAllMocks();
    (usePivotQuery as jest.Mock).mockReturnValue({
      data: mockPivotData,
      isLoading: false,
      isError: false,
      error: null,
    });

    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 900,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 900,
    });
  });

  it("should render with TreeView as default", () => {
    render(<PivotPage />);
    expect(screen.getByTestId("pivot-tree-view")).toBeInTheDocument();
    expect(screen.getByTestId("view-button-Tree")).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("should match snapshot on initial load", () => {
    const { container } = render(<PivotPage />);
    expect(container).toMatchSnapshot();
  });

  it("should switch view when button clicked", async () => {
    render(<PivotPage />);
    fireEvent.click(screen.getByTestId("view-button-Table"));

    await waitFor(() => {
      expect(screen.getByTestId("pivot-table-view")).toBeInTheDocument();
    });
  });

  it("should switch to ChartView", async () => {
    render(<PivotPage />);
    fireEvent.click(screen.getByTestId("view-button-Chart"));

    await waitFor(() => {
      expect(screen.getByTestId("chart-view")).toBeInTheDocument();
    });
  });

  it("should display loading state", () => {
    jest.clearAllMocks();
    (usePivotQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });
    render(<PivotPage />);
    expect(screen.getByTestId("view-button-Tree")).toBeInTheDocument();
  });

  it("should calculate correct table height", () => {
    render(<PivotPage />);
    expect(screen.getByTestId("pivot-tree-view")).toHaveAttribute(
      "data-height"
    );
  });

  it("should match snapshot after view switch", async () => {
    const { container } = render(<PivotPage />);
    fireEvent.click(screen.getByTestId("view-button-Table"));
    await waitFor(() =>
      expect(screen.getByTestId("pivot-table-view")).toBeInTheDocument()
    );
    expect(container).toMatchSnapshot();
  });

  it("should maintain view when data updates", async () => {
    const { rerender } = render(<PivotPage />);
    fireEvent.click(screen.getByTestId("view-button-Table"));
    await waitFor(() =>
      expect(screen.getByTestId("pivot-table-view")).toBeInTheDocument()
    );

    (usePivotQuery as jest.Mock).mockReturnValue({
      data: [...mockPivotData, { id: 2, name: "Item 2" }],
      isLoading: false,
    });

    rerender(<PivotPage />);
    await waitFor(() =>
      expect(screen.getByTestId("pivot-table-view")).toBeInTheDocument()
    );
  });
});
