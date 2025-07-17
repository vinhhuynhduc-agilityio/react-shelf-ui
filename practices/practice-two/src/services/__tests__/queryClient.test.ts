import { ERROR_MESSAGE } from "@/constants";
import { queryClient } from "../queryClient";
import { QueryCache, Query } from "@tanstack/react-query";

jest.mock("@/stores", () => ({
	useToastStore: {
		getState: jest.fn(),
	},
}));

const mockShowToast = jest.fn();
import { useToastStore } from "@/stores";

describe("queryClient global error handling", () => {
	beforeEach(() => {
		(useToastStore.getState as jest.Mock).mockReturnValue({
			showToast: mockShowToast,
		});
		mockShowToast.mockClear();
	});

	const createMockQuery = (meta: Record<string, unknown>): Partial<Query> => ({
		meta,
	});

	it("shows toast with errorMessage from meta if no response error", () => {
		const error = new Error("API error!");
		const query = createMockQuery({ errorMessage: "Custom error!" });
		const cache = queryClient.getQueryCache() as QueryCache;
		cache.config.onError?.(
			error,
			query as Query<unknown, unknown, unknown, readonly unknown[]>
		);
		expect(mockShowToast).toHaveBeenCalledWith("Custom error!", "error");
	});

	it("shows toast with default error if no error in response or meta", () => {
		const error = new Error("API error!");
		const query = createMockQuery({});
		const cache = queryClient.getQueryCache() as QueryCache;
		cache.config.onError?.(
			error,
			query as Query<unknown, unknown, unknown, readonly unknown[]>
		);
		expect(mockShowToast).toHaveBeenCalledWith(ERROR_MESSAGE.DEFAULT, "error");
	});

	it("does not show toast if suppressToast is true", () => {
		const error = new Error("API error!");
		const query = createMockQuery({ suppressToast: true });
		const cache = queryClient.getQueryCache() as QueryCache;
		cache.config.onError?.(
			error,
			query as Query<unknown, unknown, unknown, readonly unknown[]>
		);
		expect(mockShowToast).not.toHaveBeenCalled();
	});
});
