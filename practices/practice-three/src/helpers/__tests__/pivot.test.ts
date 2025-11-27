import {
  getUniqueSortedYears,
  generateDataSource,
  generatePivotTableColumns,
  generatePivotTreeColumns,
  generateTreeData,
  generateChartData,
} from "../pivot";
import type { Pivot } from "@/types";

describe("pivot helpers", () => {
  const mockPivot: Pivot[] = [
    {
      key: 1,
      form: "Developed",
      name: "USA",
      continent: "North America",
      year: 2020,
      gdp: 20890,
      oil: 13086,
      balance: 4688,
    },
    {
      key: 2,
      form: "Developed",
      name: "Germany",
      continent: "Europe",
      year: 2020,
      gdp: 3846,
      oil: 2616,
      balance: 1230,
    },
    {
      key: 3,
      form: "Emerging",
      name: "USA",
      continent: "North America",
      year: 2020,
      gdp: 20890,
      oil: 13086,
      balance: 4688,
    },
    {
      key: 4,
      form: "Developed",
      name: "USA",
      continent: "North America",
      year: 2021,
      gdp: 23315,
      oil: 13071,
      balance: 10128,
    },
    {
      key: 5,
      form: "Developed",
      name: "USA",
      continent: "North America",
      year: 2022,
      gdp: 25744,
      oil: 12078,
      balance: 12195,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUniqueSortedYears", () => {
    it("extracts and sorts unique years", () => {
      const result = getUniqueSortedYears(mockPivot);

      expect(result).toEqual([2020, 2021, 2022]);
    });

    it("returns empty array for empty pivot", () => {
      const result = getUniqueSortedYears([]);

      expect(result).toEqual([]);
    });

    it("handles single year", () => {
      const result = getUniqueSortedYears([mockPivot[0]]);

      expect(result).toEqual([2020]);
    });
  });

  describe("generateDataSource", () => {
    it("groups same country across years", () => {
      const result = generateDataSource(mockPivot);

      const usaDeveloped = result.find(
        (item) => item.name === "USA" && item.form === "Developed"
      );
      expect(usaDeveloped).toBeDefined();
      expect(usaDeveloped!["2020_oil_min"]).toBe(13086);
      expect(usaDeveloped!["2021_oil_min"]).toBe(13071);
    });
  });

  describe("generatePivotTableColumns", () => {
    it("generates columns with form and name fixed columns", () => {
      const result = generatePivotTableColumns(mockPivot);

      expect(result).toHaveLength(5);
      expect(result[0].key).toBe("form");
      expect(result[1].key).toBe("name");
      expect(result[0].fixed).toBe("left");
      expect(result[1].fixed).toBe("left");
    });
  });

  describe("generateTreeData", () => {
    it("builds hierarchical tree structure", () => {
      const result = generateTreeData(mockPivot);

      expect(result).toHaveLength(2);
      expect(result[0].key).toBe("Developed");
      expect(result[0].children).toBeDefined();
    });

    it("groups countries under forms", () => {
      const result = generateTreeData(mockPivot);

      const developed = result.find((f) => f.key === "Developed");
      expect(developed?.children).toHaveLength(2);
    });

    it("initializes all years with 0 for missing data", () => {
      const result = generateTreeData(mockPivot);

      const country = result[0].children?.[0];
      expect(country?.["2020_oil_min"]).toBeDefined();
      expect(country?.["2021_oil_min"]).toBeDefined();
      expect(country?.["2022_oil_min"]).toBeDefined();
    });

    it("calculates form-level min and sum from children", () => {
      const result = generateTreeData(mockPivot);

      const developed = result.find((f) => f.key === "Developed");
      expect(developed?.["2020_oil_min"]).toBeDefined();
      expect(developed?.["2020_oil_sum"]).toBeDefined();
    });

    it("calculates min correctly across children", () => {
      const result = generateTreeData(mockPivot);

      const developed = result.find((f) => f.key === "Developed");
      const expectedMin = Math.min(13086, 2616);
      expect(developed?.["2020_oil_min"]).toBe(expectedMin);
    });

    it("calculates sum correctly across children", () => {
      const result = generateTreeData(mockPivot);

      const developed = result.find((f) => f.key === "Developed");
      const expectedSum = 13086 + 2616;
      expect(developed?.["2020_oil_sum"]).toBe(expectedSum);
    });
  });

  describe("generateChartData", () => {
    it("generates chart data with min and sum per year", () => {
      const result = generateChartData(mockPivot);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("year");
      expect(result[0]).toHaveProperty("type");
      expect(result[0]).toHaveProperty("value");
    });

    it("creates oil min and oil sum entries for each year", () => {
      const result = generateChartData(mockPivot);

      const year2020 = result.filter((d) => d.year === "2020");
      expect(year2020).toHaveLength(2);
      expect(year2020.some((d) => d.type === "oil (min)")).toBe(true);
      expect(year2020.some((d) => d.type === "oil (sum)")).toBe(true);
    });

    it("calculates correct min value per year", () => {
      const result = generateChartData(mockPivot);

      const year2020Min = result.find(
        (d) => d.year === "2020" && d.type === "oil (min)"
      );
      expect(year2020Min?.value).toBe(2616);
    });

    it("rounds values to 3 decimal places", () => {
      const pivot: Pivot[] = [
        {
          key: 1,
          form: "Developed",
          name: "USA",
          continent: "North America",
          year: 2020,
          gdp: 20890.123456,
          oil: 13086.789123,
          balance: 4688.456789,
        },
      ];

      const result = generateChartData(pivot);

      expect(result[0].value).toBe(13086.789);
      expect(result[1].value).toBe(13086.789);
    });

    it("handles empty pivot data", () => {
      const result = generateChartData([]);

      expect(result).toEqual([]);
    });
  });
});

describe("generatePivotTreeColumns", () => {
  const mockPivot: Pivot[] = [
    {
      key: 1,
      form: "Developed",
      name: "USA",
      continent: "North America",
      year: 2020,
      gdp: 20890,
      oil: 13086,
      balance: 4688,
    },
    {
      key: 2,
      form: "Developed",
      name: "USA",
      continent: "North America",
      year: 2021,
      gdp: 23315,
      oil: 13071,
      balance: 10128,
    },
  ];

  it("generates tree columns with form > name header and year columns", () => {
    const result = generatePivotTreeColumns(mockPivot);

    expect(result).toHaveLength(3);
    expect(result[0].key).toBe("name");
    expect(result[0].fixed).toBe("left");
    expect(result[0].width).toBe(300);
    expect(result[1].key).toBe("2020");
    expect(result[2].key).toBe("2021");
  });

  it("includes oil min and sum children for each year column", () => {
    const result = generatePivotTreeColumns(mockPivot);

    const year2020Column = result[0];
    expect(year2020Column.key).toBe("name");
    expect(year2020Column.width).toBe(300);
    expect(year2020Column.fixed).toBe("left");
  });
});
