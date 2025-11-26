import { renderHook, waitFor, wrapper } from "@/components/Test/test-utils";
import { usePivotQuery } from "../pivot";
import * as services from "@/services";

jest.mock("@/services");
jest.mock("@/constant");

describe("usePivotQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches pivot data successfully", async () => {
    const mockPivotData = {
      id: "1",
      name: "Pivot Report",
      data: [{ value: 100 }],
    };

    (services.getPivotData as jest.Mock).mockResolvedValue(mockPivotData);

    const { result } = renderHook(() => usePivotQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPivotData);
    expect(services.getPivotData).toHaveBeenCalledTimes(1);
  });
});
