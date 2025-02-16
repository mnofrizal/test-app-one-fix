import { create } from "zustand";
import * as adminService from "../services/adminService";

export const useAdminStore = create((set, get) => ({
  // Orders state
  orders: [],
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  selectedOrder: null,

  // Recent items state
  recentActiveOrders: [],
  recentActivities: [],

  // Statistics state
  statusStats: {},
  typeStats: {},
  newestOrders: [],

  // Filters state
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    type: null,
    limit: 10,
  },

  // Actions
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () =>
    set({
      filters: {
        startDate: null,
        endDate: null,
        status: null,
        type: null,
        limit: 10,
      },
    }),

  // Fetch orders with pagination and filters
  fetchOrders: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const response = await adminService.getAllOrders({
        page,
        ...filters,
      });
      set({
        orders: response.data.requests || [],
        totalOrders: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 1,
        currentPage: page,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Get single order details
  fetchOrderDetails: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await adminService.getOrderById(orderId);
      set({
        selectedOrder: response.data,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await adminService.createOrder(orderData);
      set((state) => ({
        orders: [response.data, ...state.orders],
        loading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update order
  updateOrder: async (orderId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await adminService.updateOrder(orderId, updateData);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? response.data : order
        ),
        selectedOrder: response.data,
        loading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      await adminService.cancelOrder(orderId);
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Recent activities and stats
  fetchRecentActiveOrders: async () => {
    try {
      const response = await adminService.getRecentActiveOrders();
      set({ recentActiveOrders: response.data });
    } catch (error) {
      set((state) => ({ error: error.message }));
    }
  },

  fetchRecentActivities: async () => {
    try {
      const response = await adminService.getRecentActivities();
      set({ recentActivities: response.data });
    } catch (error) {
      set((state) => ({ error: error.message }));
    }
  },

  // Statistics
  fetchStatusStats: async () => {
    try {
      const response = await adminService.getStatusStats();
      set({ statusStats: response.data });
    } catch (error) {
      set((state) => ({ error: error.message }));
    }
  },

  fetchTypeStats: async () => {
    try {
      const response = await adminService.getTypeStats();
      set({ typeStats: response.data });
    } catch (error) {
      set((state) => ({ error: error.message }));
    }
  },

  // Newest orders
  fetchNewestOrders: async () => {
    set({ loading: true });
    try {
      const response = await adminService.getNewestOrders();
      if (response.success) {
        set({
          newestOrders: response.data.requests || [],
          error: null,
          loading: false,
        });
      } else {
        set({
          newestOrders: [],
          error: response.message || "Failed to fetch newest orders",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error.message,
        newestOrders: [],
        loading: false,
      });
    }
  },

  // Utility functions
  clearSelectedOrder: () => set({ selectedOrder: null }),
  clearError: () => set({ error: null }),
}));
