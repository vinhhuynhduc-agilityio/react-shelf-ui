import { useToastStore } from "../useToastStore";

describe("useToastStore", () => {
	beforeEach(() => {
		useToastStore.setState({ isVisible: false, variant: "info", message: "" });
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it("should have initial state", () => {
		const state = useToastStore.getState();
		expect(state.isVisible).toBe(false);
		expect(state.variant).toBe("info");
		expect(state.message).toBe("");
	});

	it("should show toast with message and variant", () => {
		useToastStore.getState().showToast("msg", "error", 1000);
		let state = useToastStore.getState();
		expect(state.isVisible).toBe(true);
		expect(state.message).toBe("msg");
		expect(state.variant).toBe("error");
		// Simulate timeout
		jest.advanceTimersByTime(1000);
		state = useToastStore.getState();
		expect(state.isVisible).toBe(false);
	});

	it("should hide toast", () => {
		useToastStore.setState({ isVisible: true });
		useToastStore.getState().hideToast();
		expect(useToastStore.getState().isVisible).toBe(false);
	});
});
