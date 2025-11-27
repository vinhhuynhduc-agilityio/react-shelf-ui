import { queryClient } from "../queryClient";

describe("queryClient", () => {
  it("creates QueryClient with correct default options", () => {
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.staleTime).toBe(1000 * 60);
  });
});
