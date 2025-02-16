import { create } from "zustand";
import { login as loginService } from "../services/authService";
import { clearStorage, getToken, getUser } from "../services/storage";
import { logger } from "../utils/logger";
import { authEvents } from "../services/authEvents";

export const useAuthStore = create((set, get) => {
  // Register auth store's logout handler with authEvents
  const logoutHandler = async () => {
    try {
      await clearStorage();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        errors: [],
      });
      logger.debug("Auth store: Logged out successfully");
    } catch (error) {
      logger.error("Auth store: Error during logout:", error);
      // Force clear state even if storage clear fails
      set({
        user: null,
        isAuthenticated: false,
        error: "Error during logout",
        errors: [],
      });
    }
  };

  // Register logout handler
  authEvents.setLogoutCallback(logoutHandler);

  return {
    isAuthenticated: false,
    user: null,
    error: null,
    errors: [],
    isLoading: false,
    isInitialized: false,

    // Initialize auth state from storage
    initialize: async () => {
      try {
        const [token, user] = await Promise.all([getToken(), getUser()]);

        if (token && user) {
          set({
            isAuthenticated: true,
            user,
            error: null,
            errors: [],
          });
          logger.debug("Auth store: State restored", { user });
        }
      } catch (error) {
        logger.error("Auth store: Error initializing state:", error);
        // Clear potentially corrupted state
        await clearStorage();
      } finally {
        set({ isInitialized: true });
      }
    },

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

    // Use authEvents.triggerLogout() instead of calling this directly from outside
    logout: logoutHandler,

    clearError: () => set({ error: null, errors: [] }),
  };
});
