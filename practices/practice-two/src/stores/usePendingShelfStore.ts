import { create } from "zustand";

type PendingShelfState = {
	pendingShelfActions: string[];
	addPending: (id: string) => void;
	removePending: (id: string) => void;
};

export const usePendingShelfStore = create<PendingShelfState>((set) => ({
	pendingShelfActions: [],
	addPending: (id) =>
		set((state) => ({
			pendingShelfActions: [...state.pendingShelfActions, id],
		})),
	removePending: (id) =>
		set((state) => ({
			pendingShelfActions: state.pendingShelfActions.filter(
				(bookId) => bookId !== id
			),
		})),
}));
