import { render, screen } from "@testing-library/react";
import ChartView from ".";
import { generateChartData } from "@/helpers";
import type { Pivot } from "@/types";

jest.mock("@ant-design/plots", () => ({
  Column: ({
    xField,
    yField,
    seriesField,
  }: {
    xField: string;
    yField: string;
    seriesField: string;
  }) => (
    <div data-testid="column-chart">
      {JSON.stringify({ xField, yField, seriesField })}
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

  it("should render chart when data loaded successfully", () => {
    render(<ChartView {...defaultProps} />);

    expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    expect(screen.getByText(/"xField":"year"/)).toBeInTheDocument();
    expect(screen.getByText(/"yField":"value"/)).toBeInTheDocument();
    expect(screen.getByText(/"seriesField":"type"/)).toBeInTheDocument();
  });

  it("should call generateChartData with pivot prop", () => {
    render(<ChartView {...defaultProps} />);

    expect(mockedGenerateChartData).toHaveBeenCalledWith(samplePivot);
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
    expect(screen.queryByText("Failed to fetch pivot")).not.toBeInTheDocument();
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

  it("should pass correct height to chart config", () => {
    render(<ChartView {...defaultProps} height={600} />);

    expect(screen.getByTestId("column-chart")).toBeInTheDocument();
  });

  it("should render chart with empty data when pivot is empty", () => {
    mockedGenerateChartData.mockReturnValue([]);

    render(<ChartView {...defaultProps} pivot={[]} />);

    expect(screen.getByTestId("column-chart")).toBeInTheDocument();
    expect(mockedGenerateChartData).toHaveBeenCalledWith([]);
  });
});
