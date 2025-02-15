import { create } from "zustand";
import { fetchEmployeesByDepartment } from "../services/employeeService";
import { logger } from "../utils/logger";

export const useEmployeeStore = create((set, get) => ({
  // State
  employeesByDepartment: {},
  selectedDepartment: null,
  selectedEmployee: null,
  selectedSupervisor: null,
  isLoading: false,
  error: null,

  // Actions
  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchEmployeesByDepartment();
      if (response.success) {
        set({
          employeesByDepartment: response.data,
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
    return state.employeesByDepartment[department].filter(
      (emp) => !emp.isAsman
    );
  },

  getDepartmentSupervisor: (department) => {
    const state = get();
    if (!department || !state.employeesByDepartment[department]) return null;
    return (
      state.employeesByDepartment[department].find((emp) => emp.isAsman) || null
    );
  },

  // Reset selections
  clearSelections: () => {
    set({
      selectedDepartment: null,
      selectedEmployee: null,
      selectedSupervisor: null,
    });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
