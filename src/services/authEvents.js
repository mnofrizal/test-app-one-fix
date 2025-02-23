import { logger } from "../utils/logger";
import { clearStorage } from "./storage";
import { useAdminStore } from "../store/adminStore";
import { useKitchenStore } from "../store/kitchenStore";
import { useMenuStore } from "../store/menuStore";
import { useSecretaryStore } from "../store/secretaryStore";
import { useMealOrderStore } from "../store/mealOrderStore";
import { useEmployeeStore } from "../store/employeeStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Auth Events Service
 * Centralizes auth-related events and callbacks to avoid circular dependencies
 */

let logoutCallback = async () => {
  try {
    // Clear all storage first
    await clearStorage();

    // Then reset all stores
    useAdminStore.getState().resetStore();
    useKitchenStore.getState().resetStore();
    useMenuStore.getState().resetStore();
    useSecretaryStore.getState().resetStore();
    useMealOrderStore.getState().resetStep();
    useEmployeeStore.getState().resetStore();
    logger.debug("Logout completed: All stores reset and storage cleared");
  } catch (error) {
    logger.error("Error during logout:", error);
    // Attempt to clear everything even if there's an error
    try {
      useAdminStore.getState().resetStore();
      useKitchenStore.getState().resetStore();
      useMenuStore.getState().resetStore();
      useSecretaryStore.getState().resetStore();
      useMealOrderStore.getState().resetStep();
      useEmployeeStore.getState().resetStore();
      await clearStorage();
    } catch (fallbackError) {
      logger.error("Critical error during logout fallback:", fallbackError);
    }
  }
};

export const authEvents = {
  /**
   * Set the callback to be called when logout is needed
   * @param {Function} callback - Async function to handle logout
   */
  setLogoutCallback: (callback) => {
    logoutCallback = callback;
  },

  /**
   * Trigger a logout (e.g., on token expiration)
   */
  triggerLogout: async () => {
    try {
      await logoutCallback();
      logger.debug("Logout triggered successfully");
    } catch (error) {
      logger.error("Error triggering logout:", error);
      // Fallback to clear storage if logout fails
      await clearStorage();
    }
  },
};
