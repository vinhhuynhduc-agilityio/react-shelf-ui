import { create } from "zustand";

interface ProcessingState {
	isProcessing: boolean;
	setProcessing: (processing: boolean) => void;
}

export const useProcessingStore = create<ProcessingState>((set) => ({
	isProcessing: false,
	setProcessing: (processing) => set({ isProcessing: processing }),
}));
