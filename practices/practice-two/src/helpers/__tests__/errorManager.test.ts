import { showDefaultErrorToast } from "../errorManager";
import { useToastStore } from "@/stores";

jest.mock("@/stores", () => ({
	useToastStore: {
		getState: jest.fn(),
	},
}));

jest.mock("@/constants", () => ({
	ERROR_MESSAGE: { DEFAULT: "Something went wrong!" },
}));

describe("showDefaultErrorToast", () => {
	it("calls showToast with default error message and error type", () => {
		const showToast = jest.fn();
		(useToastStore.getState as jest.Mock).mockReturnValue({ showToast });
		showDefaultErrorToast();
		expect(showToast).toHaveBeenCalledWith("Something went wrong!", "error");
	});
});
