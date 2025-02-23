import api from "./interceptors";
import { setToken, setUser, removeToken, removeUser } from "./storage";
import { logger } from "../utils/logger";
import {
  getExpoPushToken,
  registerPushToken,
  removePushToken,
} from "./pushNotificationService";

export const login = async (username, password) => {
  try {
    const response = await api.post("/auth/login", {
      email: username,
      password,
    });

    if (response.data.success) {
      const { accessToken, user } = response.data.data;

      // Store token and user data
      await setToken(accessToken);
      await setUser(user);

      // Register push token after successful login
      try {
        const pushToken = await getExpoPushToken();
        if (pushToken) {
          await registerPushToken(pushToken);
        }
      } catch (error) {
        logger.error("Push token registration error", error);
        // Don't fail login if push token registration fails
      }

      logger.debug("Login successful", { user });

      return {
        success: true,
        data: {
          user,
          accessToken,
        },
      };
    }

    return response.data; // Return the full error response structure
  } catch (error) {
    logger.error("Login error", error);
    return error; // Error is already formatted by interceptor
  }
};

export const logout = async () => {
  try {
    // Remove push token from backend first while we still have auth token
    try {
      const pushToken = await getExpoPushToken();
      console.log([pushToken]);
      if (pushToken) {
        await removePushToken(pushToken);
      }
    } catch (error) {
      logger.error("Error removing push token during logout:", error);
      // Continue with logout even if push token removal fails
    }

    // Clear auth data
    await removeToken();
    await removeUser();

    return { success: true };
  } catch (error) {
    logger.error("Logout error:", error);
    return { success: false, error };
  }
};
