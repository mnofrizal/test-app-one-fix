import { create } from "zustand";
import {
  getAllKitchenOrders,
  getKitchenOrderStats,
  getPendingKitchenOrders,
  getInProgressKitchenOrders,
  getCompletedKitchenOrders,
  getKitchenOrderById,
  startKitchenOrder,
  completeKitchenOrder,
  updateKitchenOrderStatus,
  getDailyKitchenStats,
  getTopOrderedItems,
} from "../services/kitchenService";
import { logger } from "../utils/logger";

export const useKitchenStore = create((set, get) => ({
  orders: [],
  pendingOrders: [],
  inProgressOrders: [],
  completedOrders: [],
  selectedOrder: null,
  dailyStats: null,
  topItems: [],
  stats: {
    PENDING_KITCHEN: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
  },
  isLoading: false,
  error: null,

  // Fetch all kitchen orders
  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAllKitchenOrders();
      if (response.success) {
        set({
          orders: response.data,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching all kitchen orders:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch pending orders
  fetchPendingOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getPendingKitchenOrders();
      if (response.success) {
        set({
          pendingOrders: response.data,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching pending orders:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch in-progress orders
  fetchInProgressOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getInProgressKitchenOrders();
      if (response.success) {
        set({
          inProgressOrders: response.data,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching in-progress orders:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch completed orders
  fetchCompletedOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompletedKitchenOrders();
      if (response.success) {
        set({
          completedOrders: response.data,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching completed orders:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch order details
  fetchOrderDetails: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getKitchenOrderById(orderId);
      if (response.success) {
        set({
          selectedOrder: response.data,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching order details:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Start working on order
  startOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await startKitchenOrder(orderId);
      if (response.success) {
        // Update orders lists and stats
        await Promise.all([
          get().fetchPendingOrders(),
          get().fetchInProgressOrders(),
          get().fetchKitchenStats(),
        ]);
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error starting order:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Complete order
  completeOrder: async (orderId, photoUri, notes) => {
    set({ isLoading: true, error: null });
    try {
      const response = await completeKitchenOrder(orderId, photoUri, notes);
      if (response.success) {
        // Update orders lists and stats
        await Promise.all([
          get().fetchInProgressOrders(),
          get().fetchCompletedOrders(),
          get().fetchKitchenStats(),
        ]);
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error completing order:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status, notes) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateKitchenOrderStatus(orderId, status, notes);
      if (response.success) {
        // Refresh all order lists and stats
        await Promise.all([
          get().fetchPendingOrders(),
          get().fetchInProgressOrders(),
          get().fetchCompletedOrders(),
          get().fetchKitchenStats(),
        ]);
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error updating order status:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch daily statistics
  fetchDailyStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getDailyKitchenStats();
      if (response.success) {
        set({
          dailyStats: response.data,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching daily stats:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch top ordered items
  fetchTopItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getTopOrderedItems();
      if (response.success) {
        set({
          topItems: response.data,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        set({ error: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching top items:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch kitchen stats
  fetchKitchenStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getKitchenOrderStats();
      if (response.success) {
        set({
          stats: response.data,
          error: null,
        });
        return { success: true };
      } else {
        set({ error: response.message || "Failed to fetch kitchen stats" });
        return { success: false, message: response.message };
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching kitchen stats:", error);
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear errors
  clearError: () => set({ error: null }),

  // Set selected order
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));
