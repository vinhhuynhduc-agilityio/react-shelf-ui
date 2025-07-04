import { render, screen, fireEvent } from "@testing-library/react";
import Toast from ".";
import { useToastStore } from "@/stores";

jest.mock("@/stores", () => ({
	useToastStore: jest.fn(),
}));

const mockShowToast = jest.fn();
const mockHideToast = jest.fn();

describe("Toast Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("matches snapshot when displaying", () => {
		(
			useToastStore as unknown as jest.MockedFunction<typeof useToastStore>
		).mockReturnValue({
			isVisible: true,
			variant: "info",
			message: "Message",
			showToast: mockShowToast,
			hideToast: mockHideToast,
		});
		const { asFragment } = render(<Toast />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("returns null when not visible", () => {
		(
			useToastStore as unknown as jest.MockedFunction<typeof useToastStore>
		).mockReturnValue({
			isVisible: false,
			variant: "info",
			message: "Message",
			showToast: mockShowToast,
			hideToast: mockHideToast,
		});
		const { container } = render(<Toast />);
		expect(container.firstChild).toBeNull();
	});

	it("calls hideToast when close button is clicked", () => {
		(
			useToastStore as unknown as jest.MockedFunction<typeof useToastStore>
		).mockReturnValue({
			isVisible: true,
			variant: "info",
			message: "Message",
			showToast: mockShowToast,
			hideToast: mockHideToast,
		});
		render(<Toast />);
		const closeButton = screen.getByRole("button", { name: /close toast/i });
		fireEvent.click(closeButton);
		expect(mockHideToast).toHaveBeenCalledTimes(1);
	});
});
