import { logger } from "../utils/logger";
import { clearStorage } from "./storage";

/**
 * Auth Events Service
 * Centralizes auth-related events and callbacks to avoid circular dependencies
 */

let logoutCallback = async () => {
  try {
    await clearStorage();
    logger.debug("Default logout: Storage cleared");
  } catch (error) {
    logger.error("Error in default logout:", error);
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
