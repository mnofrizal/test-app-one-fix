import { create } from "zustand";
import { login as loginService } from "../services/authService";
import { clearStorage } from "../services/storage";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  error: null,
  errors: [],
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true, error: null, errors: [] });
    try {
      const response = await loginService(username, password);
      if (response.success) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message,
          errors: response.errors || [],
        });
        return false;
      }
    } catch (errorResponse) {
      set({
        error: errorResponse.message,
        errors: errorResponse.errors,
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: async () => {
    await clearStorage();
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null, errors: [] }),
}));
