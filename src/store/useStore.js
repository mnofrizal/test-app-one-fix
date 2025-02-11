import { create } from "zustand";

const useStore = create((set) => ({
  // Example state for requests/orders summary
  requestSummary: {
    meals: 0,
    transport: 0,
    rooms: 0,
    stationary: 0,
  },

  // Actions
  updateRequestCount: (category, count) =>
    set((state) => ({
      requestSummary: {
        ...state.requestSummary,
        [category]: count,
      },
    })),

  // Reset state
  resetStore: () =>
    set({
      requestSummary: {
        meals: 0,
        transport: 0,
        rooms: 0,
        stationary: 0,
      },
    }),
}));

export default useStore;
