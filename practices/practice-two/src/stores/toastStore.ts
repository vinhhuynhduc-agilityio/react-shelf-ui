import { create } from "zustand";

export type ToastVariant = "info" | "success" | "error" | "warning";

interface ToastState {
	isVisible: boolean;
	variant: ToastVariant;
	message: string;
}

interface ToastActions {
	showToast: (
		message: string,
		variant?: ToastVariant,
		duration?: number
	) => void;
	hideToast: () => void;
}

const initialState: ToastState = {
	isVisible: false,
	variant: "info",
	message: "",
};

export const useToastStore = create<ToastState & ToastActions>((set) => ({
	...initialState,
	showToast: (message, variant = "info", duration = 4000) => {
		set({
			isVisible: true,
			message,
			variant,
		});
		setTimeout(() => {
			set({ isVisible: false });
		}, duration);
	},
	hideToast: () => set({ isVisible: false }),
}));
