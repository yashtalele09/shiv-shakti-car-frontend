import { create } from "zustand";

interface LoaderStore {
  loadingCount: number;
  isLoading: boolean;
  incrementLoading: () => void;
  decrementLoading: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  loadingCount: 0,
  isLoading: false,
  incrementLoading: () =>
    set((state) => ({
      loadingCount: state.loadingCount + 1,
      isLoading: true,
    })),
  decrementLoading: () =>
    set((state) => ({
      loadingCount: Math.max(0, state.loadingCount - 1),
      isLoading: state.loadingCount - 1 > 0,
    })),
}));
