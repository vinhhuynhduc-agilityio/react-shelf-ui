import { getPivotData } from "../pivot";
import { apiRequest } from "@/helpers";
import { API_BASE_URL } from "@/services";
import { API_ENDPOINTS } from "@/constant";
import { Pivot } from "@/types";

jest.mock("@/helpers");

describe("Pivot Services", () => {
  const mockPivotData: Pivot[] = [
    {
      name: "China",
      year: 2005,
      continent: "Asia",
      form: "GDP",
      gdp: 2256.919,
      oil: 3.6,
      balance: 0.2,
      key: 1,
    },
    {
      name: "USA",
      year: 2005,
      continent: "North America",
      form: "GDP",
      gdp: 13093.28,
      oil: 0.9,
      balance: 2.7,
      key: 2,
    },
    {
      name: "Japan",
      year: 2006,
      continent: "Asia",
      form: "GDP",
      gdp: 5964.271,
      oil: 0.1,
      balance: 5.8,
      key: 3,
    },
    {
      name: "Germany",
      year: 2006,
      continent: "Europe",
      form: "GDP",
      gdp: 3667.738,
      oil: 0,
      balance: 1.6,
      key: 4,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPivotData", () => {
    it("should call apiRequest with correct params and return pivot data", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      const result = await getPivotData();

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        `${API_BASE_URL}${API_ENDPOINTS.PIVOT}`
      );
      expect(result).toEqual(mockPivotData);
      expect(result).toHaveLength(4);
    });

    it("should return pivot data with correct structure", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      const result = await getPivotData();

      // Assert
      result.forEach((pivot) => {
        expect(pivot).toHaveProperty("name");
        expect(pivot).toHaveProperty("year");
        expect(pivot).toHaveProperty("continent");
        expect(pivot).toHaveProperty("form");
        expect(pivot).toHaveProperty("gdp");
        expect(pivot).toHaveProperty("oil");
        expect(pivot).toHaveProperty("balance");
        expect(pivot).toHaveProperty("key");
      });
    });

    it("should return data with correct types", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      const result = await getPivotData();

      // Assert
      result.forEach((pivot) => {
        expect(typeof pivot.name).toBe("string");
        expect(typeof pivot.year).toBe("number");
        expect(typeof pivot.continent).toBe("string");
        expect(typeof pivot.form).toBe("string");
        expect(typeof pivot.gdp).toBe("number");
        expect(typeof pivot.oil).toBe("number");
        expect(typeof pivot.balance).toBe("number");
        expect(typeof pivot.key).toBe("number");
      });
    });

    it("should return data grouped by year and continent", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      const result = await getPivotData();

      // Assert
      const year2005 = result.filter((p) => p.year === 2005);
      const year2006 = result.filter((p) => p.year === 2006);
      const asia = result.filter((p) => p.continent === "Asia");

      expect(year2005).toHaveLength(2);
      expect(year2006).toHaveLength(2);
      expect(asia).toHaveLength(2);
    });

    it("should return valid GDP values", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      const result = await getPivotData();

      // Assert
      result.forEach((pivot) => {
        expect(pivot.gdp).toBeGreaterThan(0);
        expect(typeof pivot.gdp).toBe("number");
      });
    });

    it("should return valid oil and balance values", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      const result = await getPivotData();

      // Assert
      result.forEach((pivot) => {
        expect(pivot.oil).toBeGreaterThanOrEqual(0);
        expect(pivot.balance).toBeGreaterThanOrEqual(0);
      });
    });

    it("should return empty array when no pivot data", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await getPivotData();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle single pivot item", async () => {
      // Arrange
      const singleItem: Pivot[] = [
        {
          name: "India",
          year: 2007,
          continent: "Asia",
          form: "GDP",
          gdp: 1175.56,
          oil: 2.1,
          balance: 0.1,
          key: 5,
        },
      ];
      (apiRequest as jest.Mock).mockResolvedValue(singleItem);

      // Act
      const result = await getPivotData();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("India");
      expect(result[0].year).toBe(2007);
    });

    it("should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to fetch pivot data");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(getPivotData()).rejects.toThrow(
        "Failed to fetch pivot data"
      );
    });

    it("should throw error on network failure", async () => {
      // Arrange
      const error = new Error("Network error");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(getPivotData()).rejects.toThrow("Network error");
    });

    it("should throw error on server error", async () => {
      // Arrange
      const error = new Error("500 Internal Server Error");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(getPivotData()).rejects.toThrow("500 Internal Server Error");
    });

    it("should construct correct API URL", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);
      const expectedUrl = `${API_BASE_URL}${API_ENDPOINTS.PIVOT}`;

      // Act
      await getPivotData();

      // Assert
      expect(apiRequest).toHaveBeenCalledWith("GET", expectedUrl);
      expect(apiRequest).toHaveBeenCalledTimes(1);
    });

    it("should use GET method", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      await getPivotData();

      // Assert
      expect(apiRequest).toHaveBeenCalledWith("GET", expect.any(String));
    });

    it("should not send body in GET request", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      await getPivotData();

      // Assert
      const calls = (apiRequest as jest.Mock).mock.calls;
      expect(calls[0]).toHaveLength(2); // Only method and URL, no body
    });

    it("should handle large dataset", async () => {
      // Arrange
      const largeDataset: Pivot[] = Array.from({ length: 100 }, (_, i) => ({
        name: `Country${i}`,
        year: 2000 + (i % 20),
        continent: ["Asia", "Europe", "Africa", "Americas"][i % 4],
        form: "GDP",
        gdp: Math.random() * 15000,
        oil: Math.random() * 5,
        balance: Math.random() * 10,
        key: i,
      }));
      (apiRequest as jest.Mock).mockResolvedValue(largeDataset);

      // Act
      const result = await getPivotData();

      // Assert
      expect(result).toHaveLength(100);
      expect(result[0]).toHaveProperty("name");
      expect(result[99]).toHaveProperty("key");
    });

    it("should return data in expected format", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      const result = await getPivotData();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(typeof item.name).toBe("string");
        expect(typeof item.year).toBe("number");
        expect(typeof item.continent).toBe("string");
        expect(typeof item.form).toBe("string");
        expect(typeof item.gdp).toBe("number");
        expect(typeof item.oil).toBe("number");
        expect(typeof item.balance).toBe("number");
        expect(typeof item.key).toBe("number");
      });
    });
  });

  describe("URL Construction", () => {
    it("should use API_BASE_URL and API_ENDPOINTS.PIVOT", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockPivotData);

      // Act
      await getPivotData();

      // Assert
      const callArgs = (apiRequest as jest.Mock).mock.calls[0];
      expect(callArgs[1]).toContain(API_BASE_URL);
      expect(callArgs[1]).toContain(API_ENDPOINTS.PIVOT);
    });
  });
});
