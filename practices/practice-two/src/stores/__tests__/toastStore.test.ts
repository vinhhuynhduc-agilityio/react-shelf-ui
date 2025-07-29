import { useToastStore } from "../toastStore";

describe("useToastStore", () => {
	beforeEach(() => {
		useToastStore.setState({ toasts: [] });
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it("should have initial state", () => {
		const state = useToastStore.getState();
		expect(state.toasts).toEqual([]);
	});

	it("should show toast and keep only 2 latest toasts", () => {
		useToastStore.getState().showToast("msg1", "success");
		useToastStore.getState().showToast("msg2", "error");
		useToastStore.getState().showToast("msg3", "info");
		const state = useToastStore.getState();
		expect(state.toasts.length).toBe(2);
		expect(state.toasts[0].message).toBe("msg2");
		expect(state.toasts[1].message).toBe("msg3");
	});

	it("should auto-remove toast after 3s", () => {
		useToastStore.getState().showToast("msg", "success");
		let state = useToastStore.getState();
		expect(state.toasts.length).toBe(1);
		jest.advanceTimersByTime(3000);
		state = useToastStore.getState();
		expect(state.toasts.length).toBe(0);
	});

	it("should remove toast by id", () => {
		useToastStore.getState().showToast("msg", "success");
		const state = useToastStore.getState();
		const id = state.toasts[0].id;
		useToastStore.getState().removeToast(id);
		expect(useToastStore.getState().toasts.length).toBe(0);
	});
});
