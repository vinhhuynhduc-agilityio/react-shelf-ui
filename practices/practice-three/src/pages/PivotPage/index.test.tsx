import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  useWindowActions: jest.fn(),
}));

jest.mock("@/components", () => ({
  Button: ({
    children,
    onClick,
    active,
    className,
  }: {
    children: string;
    onClick: () => void;
    active?: boolean;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      data-testid={`view-button-${children}`}
      data-active={active}
      className={className}
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
  WindowHeader: ({
    src,
    title,
    onClose,
    onMaximize,
    onMinimize,
  }: {
    src: string;
    title: string;
    onClose: () => void;
    onMaximize: () => void;
    onMinimize: () => void;
  }) => (
    <div data-testid="window-header">
      <img src={src} alt={title} data-testid="window-icon" />
      <span data-testid="window-title">{title}</span>
      <button data-testid="btn-close" onClick={onClose}>
        Close
      </button>
      <button data-testid="btn-maximize" onClick={onMaximize}>
        Maximize
      </button>
      <button data-testid="btn-minimize" onClick={onMinimize}>
        Minimize
      </button>
    </div>
  ),
}));

jest.mock("@/constant", () => ({
  VIEW: { TREE: "tree", TABLE: "table", CHART: "chart" },
  WINDOW_KEYS: { PIVOT: "pivot" },
}));

import { usePivotQuery, useWindowActions } from "@/hook";
import { WINDOW_KEYS } from "@/constant";

describe("PivotPage", () => {
  const mockWindowActions = {
    close: jest.fn(),
    maximize: jest.fn(),
    minimize: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePivotQuery as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: "Item 1" }],
      isLoading: false,
      isError: false,
      error: null,
    });

    (useWindowActions as jest.Mock).mockReturnValue(mockWindowActions);

    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 900,
    });
  });

  describe("Initial Render", () => {
    it("should render WindowHeader with correct title and icon", () => {
      render(<PivotPage />);

      expect(screen.getByTestId("window-title")).toHaveTextContent("Pivot");
      expect(screen.getByTestId("window-icon")).toHaveAttribute(
        "src",
        "/images/pivot.webp"
      );
    });

    it("should render TreeView as default", () => {
      render(<PivotPage />);

      expect(screen.getByTestId("pivot-tree-view")).toBeInTheDocument();
      expect(screen.getByTestId("view-button-Tree")).toHaveAttribute(
        "data-active",
        "true"
      );
    });

    it("should render all view buttons", () => {
      render(<PivotPage />);

      expect(screen.getByTestId("view-button-Tree")).toBeInTheDocument();
      expect(screen.getByTestId("view-button-Table")).toBeInTheDocument();
      expect(screen.getByTestId("view-button-Chart")).toBeInTheDocument();
    });
  });

  describe("View Switching", () => {
    it("should switch from TreeView to TableView", async () => {
      render(<PivotPage />);

      fireEvent.click(screen.getByTestId("view-button-Table"));

      await waitFor(() => {
        expect(screen.queryByTestId("pivot-tree-view")).not.toBeInTheDocument();
        expect(screen.getByTestId("pivot-table-view")).toBeInTheDocument();
        expect(screen.getByTestId("view-button-Table")).toHaveAttribute(
          "data-active",
          "true"
        );
      });
    });

    it("should switch to ChartView", async () => {
      render(<PivotPage />);

      fireEvent.click(screen.getByTestId("view-button-Chart"));

      await waitFor(() => {
        expect(screen.getByTestId("chart-view")).toBeInTheDocument();
        expect(screen.getByTestId("view-button-Chart")).toHaveAttribute(
          "data-active",
          "true"
        );
      });
    });

    it("should toggle back to TreeView", async () => {
      render(<PivotPage />);

      fireEvent.click(screen.getByTestId("view-button-Table"));
      await waitFor(() =>
        expect(screen.getByTestId("pivot-table-view")).toBeInTheDocument()
      );

      fireEvent.click(screen.getByTestId("view-button-Tree"));
      await waitFor(() =>
        expect(screen.getByTestId("pivot-tree-view")).toBeInTheDocument()
      );
    });
  });

  describe("WindowHeader Actions", () => {
    it("should call close action", () => {
      render(<PivotPage />);

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(mockWindowActions.close).toHaveBeenCalledTimes(1);
    });

    it("should call maximize action", () => {
      render(<PivotPage />);

      fireEvent.click(screen.getByTestId("btn-maximize"));

      expect(mockWindowActions.maximize).toHaveBeenCalledTimes(1);
    });

    it("should call minimize action", () => {
      render(<PivotPage />);

      fireEvent.click(screen.getByTestId("btn-minimize"));

      expect(mockWindowActions.minimize).toHaveBeenCalledTimes(1);
    });
  });

  describe("Height Calculation", () => {
    it("should pass height to TreeView", () => {
      render(<PivotPage />);

      const treeView = screen.getByTestId("pivot-tree-view");
      const height = Number(treeView.getAttribute("data-height"));

      expect(height).toBeGreaterThan(0);
      expect(height).toBeLessThan(900);
    });

    it("should pass height to TableView", async () => {
      render(<PivotPage />);

      fireEvent.click(screen.getByTestId("view-button-Table"));

      await waitFor(() => {
        const tableView = screen.getByTestId("pivot-table-view");
        const height = Number(tableView.getAttribute("data-height"));

        expect(height).toBeGreaterThan(0);
      });
    });

    it("should pass height to ChartView", async () => {
      render(<PivotPage />);

      fireEvent.click(screen.getByTestId("view-button-Chart"));

      await waitFor(() => {
        const chartView = screen.getByTestId("chart-view");
        const height = Number(chartView.getAttribute("data-height"));

        expect(height).toBeGreaterThan(0);
      });
    });
  });

  describe("Hook Integration", () => {
    it("should call useWindowActions with PIVOT key", () => {
      render(<PivotPage />);

      expect(useWindowActions).toHaveBeenCalledWith(WINDOW_KEYS.PIVOT);
    });

    it("should call usePivotQuery", () => {
      render(<PivotPage />);

      expect(usePivotQuery).toHaveBeenCalled();
    });
  });

  describe("Error States", () => {
    it("should render TreeView when query has error", () => {
      (usePivotQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: true,
        error: new Error("API Error"),
      });

      render(<PivotPage />);

      expect(screen.getByTestId("pivot-tree-view")).toBeInTheDocument();
    });

    it("should render TreeView when loading", () => {
      (usePivotQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: true,
        isError: false,
        error: null,
      });

      render(<PivotPage />);

      expect(screen.getByTestId("pivot-tree-view")).toBeInTheDocument();
    });
  });
});
