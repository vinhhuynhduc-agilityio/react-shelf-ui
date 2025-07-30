import { create } from "zustand";
export const useShelfChangedStore = create<{
	shelfChanged: boolean;
	setShelfChanged: (v: boolean) => void;
}>((set) => ({
	shelfChanged: false,
	setShelfChanged: (v) => set({ shelfChanged: v }),
}));
