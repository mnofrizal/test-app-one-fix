import { create } from "zustand";
import {
  fetchMenus,
  createMenu,
  updateMenu,
  toggleMenuAvailability,
} from "../services/menuService";
import { logger } from "../utils/logger";

export const useMenuStore = create((set, get) => ({
  menus: [],
  isLoading: false,
  error: null,
  selectedMenu: null,

  // Fetch all menus
  fetchMenus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchMenus();
      if (response.success) {
        set({
          menus: response.data,
          error: null,
        });
      } else {
        set({ error: response.message });
        logger.error("Failed to fetch menus:", response.message);
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching menus:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Add new menu
  addMenu: async (menuData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createMenu(menuData);
      if (response.success) {
        set((state) => ({
          menus: [...state.menus, response.data],
          error: null,
        }));
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error adding menu:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Update existing menu
  updateMenu: async (id, menuData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateMenu(id, menuData);
      if (response.success) {
        set((state) => ({
          menus: state.menus.map((menu) =>
            menu.id === id ? response.data : menu
          ),
          error: null,
        }));
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error updating menu:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Toggle menu availability
  toggleAvailability: async (id, isAvailable) => {
    set({ isLoading: true, error: null });
    try {
      const response = await toggleMenuAvailability(id, isAvailable);
      if (response.success) {
        set((state) => ({
          menus: state.menus.map((menu) =>
            menu.id === id ? { ...response.data } : menu
          ),
          error: null,
        }));
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error toggling menu availability:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear errors
  clearError: () => set({ error: null }),

  // Set selected menu
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),

  // Reset store
  resetStore: () =>
    set({
      menus: [],
      isLoading: false,
      error: null,
      selectedMenu: null,
    }),
}));
