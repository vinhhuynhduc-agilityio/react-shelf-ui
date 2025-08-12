import { create } from "zustand";

type PendingShelfState = {
  pendingShelfActions: string[];
  addShelf: (id: string) => void;
  removeShelf: (id: string) => void;
};

export const usePendingShelfStore = create<PendingShelfState>((set) => ({
  pendingShelfActions: [],
  addShelf: (id) =>
    set((state) => ({
      pendingShelfActions: [...state.pendingShelfActions, id],
    })),
  removeShelf: (id) =>
    set((state) => ({
      pendingShelfActions: state.pendingShelfActions.filter(
        (bookId) => bookId !== id
      ),
    })),
}));
