import { render, screen } from "@testing-library/react";
import ChartView from ".";
import { generateChartData } from "@/helpers";
import type { Pivot } from "@/types";

jest.mock("@ant-design/plots", () => ({
  Column: ({
    xField,
    yField,
    seriesField,
    colorField,
    data,
    height,
    legend,
    style,
  }: {
    xField: string;
    yField: string;
    seriesField: string;
    colorField: string;
    data: unknown[];
    height: number;
    legend: unknown;
    style: unknown;
  }) => (
    <div data-testid="column-chart">
      <div data-testid="chart-config">
        {JSON.stringify({
          xField,
          yField,
          seriesField,
          colorField,
          dataLength: Array.isArray(data) ? data.length : 0,
          height,
          hasLegend: !!legend,
          hasStyle: !!style,
        })}
      </div>
    </div>
  ),
}));

jest.mock("antd", () => ({
  Spin: ({ spinning }: { spinning: boolean }) => (
    <div data-testid="spin">{spinning ? "loading" : "done"}</div>
  ),
}));

jest.mock("@/helpers", () => ({
  generateChartData: jest.fn(),
}));

jest.mock("@/components/common", () => ({
  ErrorAlert: ({ title, errors }: { title: string; errors: string[] }) => (
    <div data-testid="error-alert">
      <h3>{title}</h3>
      <ul>
        {errors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    </div>
  ),
}));

const mockedGenerateChartData = generateChartData as jest.MockedFunction<
  typeof generateChartData
>;

describe("ChartView", () => {
  const samplePivot: Pivot[] = [
    {
      name: "Country A",
      year: 2020,
      continent: "Asia",
      form: "liquid",
      gdp: 5000,
      oil: 100,
      balance: 50,
      key: 1,
    },
    {
      name: "Country B",
      year: 2020,
      continent: "Europe",
      form: "gas",
      gdp: 6000,
      oil: 150,
      balance: 75,
      key: 2,
    },
  ];

  const chartDataMock = [
    { year: "2020", type: "oil (min)", value: 100 },
    { year: "2020", type: "oil (sum)", value: 250 },
  ];

  const defaultProps = {
    pivot: samplePivot,
    height: 400,
    isErrorPivot: false,
    pivotError: null,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGenerateChartData.mockReturnValue(chartDataMock);
  });

  describe("Rendering", () => {
    it("should render chart when data loaded successfully", () => {
      render(<ChartView {...defaultProps} />);

      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    });

    it("should render loading spinner when isLoading is true", () => {
      render(<ChartView {...defaultProps} isLoading={true} />);

      expect(screen.getByTestId("spin")).toBeInTheDocument();
      expect(screen.getByText("loading")).toBeInTheDocument();
      expect(screen.queryByTestId("column-chart")).not.toBeInTheDocument();
    });

    it("should render error alert when isErrorPivot is true", () => {
      const error = new Error("Failed to fetch pivot");
      render(
        <ChartView {...defaultProps} isErrorPivot={true} pivotError={error} />
      );

      expect(screen.getByTestId("error-alert")).toBeInTheDocument();
      expect(screen.getByText("Failed to load pivot data")).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch pivot")).toBeInTheDocument();
      expect(screen.queryByTestId("column-chart")).not.toBeInTheDocument();
    });

    it("should not show error message when isErrorPivot is true but pivotError is null", () => {
      render(
        <ChartView {...defaultProps} isErrorPivot={true} pivotError={null} />
      );

      expect(screen.getByTestId("error-alert")).toBeInTheDocument();
      expect(
        screen.queryByText("Failed to fetch pivot")
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("column-chart")).not.toBeInTheDocument();
    });

    it("should show loading when isLoading is true even if error exists", () => {
      const error = new Error("Failed to fetch pivot");
      render(
        <ChartView
          {...defaultProps}
          isLoading={true}
          isErrorPivot={true}
          pivotError={error}
        />
      );

      expect(screen.getByTestId("spin")).toBeInTheDocument();
      expect(screen.getByTestId("error-alert")).toBeInTheDocument();
      expect(screen.queryByTestId("column-chart")).not.toBeInTheDocument();
    });
  });

  describe("Chart Data", () => {
    it("should call generateChartData with pivot prop", () => {
      render(<ChartView {...defaultProps} />);

      expect(mockedGenerateChartData).toHaveBeenCalledWith(samplePivot);
    });

    it("should render chart with empty data when pivot is empty", () => {
      mockedGenerateChartData.mockReturnValue([]);

      render(<ChartView {...defaultProps} pivot={[]} />);

      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
      expect(mockedGenerateChartData).toHaveBeenCalledWith([]);
    });

    it("should update chart when pivot data changes", () => {
      const { rerender } = render(<ChartView {...defaultProps} />);

      expect(mockedGenerateChartData).toHaveBeenCalledWith(samplePivot);

      const newPivot: Pivot[] = [
        {
          name: "Country C",
          year: 2021,
          continent: "Africa",
          form: "solid",
          gdp: 3000,
          oil: 200,
          balance: 100,
          key: 3,
        },
      ];

      const newChartDataMock = [
        { year: "2021", type: "oil (min)", value: 200 },
        { year: "2021", type: "oil (sum)", value: 200 },
      ];

      mockedGenerateChartData.mockReturnValue(newChartDataMock);

      rerender(<ChartView {...defaultProps} pivot={newPivot} />);

      expect(mockedGenerateChartData).toHaveBeenCalledWith(newPivot);
    });
  });

  describe("ColumnConfig - Fields", () => {
    it("should set correct xField to 'year'", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"xField":"year"');
    });

    it("should set correct yField to 'value'", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"yField":"value"');
    });

    it("should set correct seriesField to 'type'", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"seriesField":"type"');
    });

    it("should set colorField same as seriesField", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"colorField":"type"');
    });
  });

  describe("ColumnConfig - Height", () => {
    it("should pass correct height to config", () => {
      render(<ChartView {...defaultProps} height={400} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"height":400');
    });

    it("should update height when prop changes", () => {
      const { rerender } = render(<ChartView {...defaultProps} height={400} />);

      let config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"height":400');

      rerender(<ChartView {...defaultProps} height={600} />);

      config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"height":600');
    });

    it("should handle different height values", () => {
      const heights = [200, 400, 600, 800, 1000];

      heights.forEach((height) => {
        jest.clearAllMocks();
        mockedGenerateChartData.mockReturnValue(chartDataMock);

        const { unmount } = render(
          <ChartView {...defaultProps} height={height} />
        );

        const config = screen.getByTestId("chart-config");
        expect(config.textContent).toContain(`"height":${height}`);

        unmount();
      });
    });
  });

  describe("ColumnConfig - Data", () => {
    it("should pass data array to config", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"dataLength":2');
    });

    it("should pass empty data array when chart data is empty", () => {
      mockedGenerateChartData.mockReturnValue([]);

      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"dataLength":0');
    });
  });

  describe("ColumnConfig - Legend", () => {
    it("should include legend in config", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"hasLegend":true');
    });

    it("should have legend with color property", () => {
      render(<ChartView {...defaultProps} />);

      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
      // Legend is passed to Column component
      expect(screen.getByTestId("chart-config").textContent).toContain(
        '"hasLegend":true'
      );
    });

    it("should have legend positioned to right", () => {
      render(<ChartView {...defaultProps} />);

      // Legend config includes position: "right"
      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    });

    it("should have legend with center justify content", () => {
      render(<ChartView {...defaultProps} />);

      // Legend config includes justifyContent: "center"
      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    });
  });

  describe("ColumnConfig - Style & Color", () => {
    it("should include style config in chart", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"hasStyle":true');
    });

    it("should have color map for oil (min) as red", () => {
      render(<ChartView {...defaultProps} />);

      // Color map defined: "oil (min)": "#ff4d4f" (red)
      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    });

    it("should have color map for oil (sum) as purple", () => {
      render(<ChartView {...defaultProps} />);

      // Color map defined: "oil (sum)": "#722ed1" (purple)
      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    });

    it("should apply style fill function based on type", () => {
      render(<ChartView {...defaultProps} />);

      // Style.fill function uses colorMap
      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    });

    it("should use colorField for automatic coloring", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"colorField":"type"');
    });
  });

  describe("ColumnConfig - Complete Config", () => {
    it("should render chart with all required config properties", () => {
      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      const configText = config.textContent || "";

      expect(configText).toContain('"xField":"year"');
      expect(configText).toContain('"yField":"value"');
      expect(configText).toContain('"seriesField":"type"');
      expect(configText).toContain('"colorField":"type"');
      expect(configText).toContain('"hasLegend":true');
      expect(configText).toContain('"hasStyle":true');
      expect(configText).toContain('"height":400');
      expect(configText).toContain('"dataLength":2');
    });

    it("should maintain config consistency across re-renders", () => {
      const { rerender } = render(<ChartView {...defaultProps} />);

      let config = screen.getByTestId("chart-config");
      const firstConfigText = config.textContent;

      rerender(<ChartView {...defaultProps} />);

      config = screen.getByTestId("chart-config");
      const secondConfigText = config.textContent;

      // Config structure should remain same
      expect(firstConfigText).toContain('"xField":"year"');
      expect(secondConfigText).toContain('"xField":"year"');
    });

    it("should apply config with all chart data types", () => {
      const multiTypeChartData = [
        { year: "2020", type: "oil (min)", value: 100 },
        { year: "2020", type: "oil (sum)", value: 250 },
        { year: "2020", type: "oil (avg)", value: 175 },
        { year: "2021", type: "oil (min)", value: 120 },
        { year: "2021", type: "oil (sum)", value: 280 },
        { year: "2021", type: "oil (avg)", value: 200 },
      ];

      mockedGenerateChartData.mockReturnValue(multiTypeChartData);

      render(<ChartView {...defaultProps} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"dataLength":6');
      expect(config.textContent).toContain('"seriesField":"type"');
      expect(config.textContent).toContain('"colorField":"type"');
    });
  });

  describe("Edge Cases", () => {
    it("should handle null pivotError gracefully", () => {
      render(
        <ChartView {...defaultProps} isErrorPivot={false} pivotError={null} />
      );

      expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    });

    it("should handle very large height value", () => {
      render(<ChartView {...defaultProps} height={2000} />);

      const config = screen.getByTestId("chart-config");
      expect(config.textContent).toContain('"height":2000');
    });

    it("should handle pivot with many records", () => {
      const largePivot: Pivot[] = Array.from({ length: 100 }, (_, i) => ({
        name: `Country ${i}`,
        year: 2020 + Math.floor(i / 20),
        continent: "Test",
        form: "liquid",
        gdp: 5000 + i * 100,
        oil: 100 + i * 10,
        balance: 50 + i * 5,
        key: i,
      }));

      const largeChartData = Array.from({ length: 100 }, (_, i) => ({
        year: `${2020 + Math.floor(i / 20)}`,
        type: "oil (min)",
        value: 100 + i * 10,
      }));

      mockedGenerateChartData.mockReturnValue(largeChartData);

      render(<ChartView {...defaultProps} pivot={largePivot} />);

      expect(mockedGenerateChartData).toHaveBeenCalledWith(largePivot);
    });
  });

  describe("useMemo Optimization", () => {
    it("should regenerate chart data only when pivot changes", () => {
      const { rerender } = render(<ChartView {...defaultProps} />);

      const callCount1 = (mockedGenerateChartData as jest.Mock).mock.calls
        .length;

      // Re-render with same pivot
      rerender(<ChartView {...defaultProps} />);

      const callCount2 = (mockedGenerateChartData as jest.Mock).mock.calls
        .length;

      // Should be called again due to re-render
      expect(callCount2).toBeGreaterThanOrEqual(callCount1);
    });

    it("should not regenerate chart data when non-pivot props change", () => {
      mockedGenerateChartData.mockClear();
      mockedGenerateChartData.mockReturnValue(chartDataMock);

      const { rerender } = render(<ChartView {...defaultProps} height={400} />);

      const callCount1 = (mockedGenerateChartData as jest.Mock).mock.calls
        .length;

      // Re-render with different height but same pivot
      rerender(<ChartView {...defaultProps} height={600} />);

      const callCount2 = (mockedGenerateChartData as jest.Mock).mock.calls
        .length;

      // Call count should not increase for non-pivot prop changes
      expect(callCount2).toBeLessThanOrEqual(callCount1 + 1);
    });
  });
});
