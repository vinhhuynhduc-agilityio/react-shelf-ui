import { MOCK_USER } from "@/__mocks__";
import { useUserStore } from "../userStore";

describe("useUserStore", () => {
	beforeEach(() => {
		useUserStore.setState({ currentUser: null });
	});

	it("should have initial state", () => {
		expect(useUserStore.getState().currentUser).toBeNull();
	});

	it("should set user", () => {
		useUserStore.getState().setUser(MOCK_USER);
		expect(useUserStore.getState().currentUser).toEqual(MOCK_USER);
	});

	it("should logout", () => {
		useUserStore.setState({ currentUser: MOCK_USER });
		useUserStore.getState().logout();
		expect(useUserStore.getState().currentUser).toBeNull();
	});
});
