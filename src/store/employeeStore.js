import { create } from "zustand";
import { fetchEmployeesByDepartment } from "../services/employeeService";
import { logger } from "../utils/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@employee_store";

export const useEmployeeStore = create((set, get) => ({
  // State
  employeesByDepartment: {},
  selectedDepartment: null,
  selectedEmployee: null,
  selectedSupervisor: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  // Initialize store with fresh data
  initializeStore: async () => {
    try {
      // Always fetch fresh data on initialize
      const response = await fetchEmployeesByDepartment();
      if (response.success) {
        const newData = {
          employeesByDepartment: response.data,
        };
        // Store in AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        set({
          ...newData,
          isInitialized: true,
          error: null,
        });
      } else {
        set({ error: response.message });
        logger.error("Failed to initialize employees:", response.message);
      }
    } catch (error) {
      logger.error("Error initializing employee data:", error);
      set({ error: error.message });
    }
  },

  // Actions
  fetchEmployees: async (forceRefresh = false) => {
    const state = get();
    // Skip fetch if data is already loaded unless force refresh is requested
    if (
      state.isInitialized &&
      !forceRefresh &&
      Object.keys(state.employeesByDepartment).length > 0
    ) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetchEmployeesByDepartment();
      if (response.success) {
        const newData = {
          employeesByDepartment: response.data,
        };
        // Store in AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        set({
          ...newData,
          isInitialized: true,
          error: null,
        });
      } else {
        set({ error: response.message });
        logger.error("Failed to fetch employees:", response.message);
      }
    } catch (error) {
      set({ error: error.message });
      logger.error("Error fetching employees:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Selection actions
  setSelectedDepartment: (department) => {
    const state = get();
    set({
      selectedDepartment: department,
      // When department changes, clear employee selection
      selectedEmployee: null,
      // Auto-select supervisor for the department
      selectedSupervisor: department
        ? state.employeesByDepartment[department]?.find((emp) => emp.isAsman) ||
          null
        : null,
    });
  },

  setSelectedEmployee: (employee) => {
    set({ selectedEmployee: employee });
  },

  setSelectedSupervisor: (supervisor) => {
    set({ selectedSupervisor: supervisor });
  },

  // Helper getters
  getDepartmentEmployees: (department) => {
    const state = get();
    if (!department || !state.employeesByDepartment[department]) return [];
    return state.employeesByDepartment[department];
  },

  getDepartmentSupervisor: (department) => {
    const state = get();
    if (!department || !state.employeesByDepartment[department]) return null;
    return (
      state.employeesByDepartment[department].find((emp) => emp.isAsman) || null
    );
  },

  // Reset selections and data
  resetStore: () => {
    set({
      employeesByDepartment: {},
      selectedDepartment: null,
      selectedEmployee: null,
      selectedSupervisor: null,
      isLoading: false,
      error: null,
      isInitialized: false,
    });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
