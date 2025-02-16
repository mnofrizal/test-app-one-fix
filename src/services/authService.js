import api from "./interceptors";
import { setToken, setUser } from "./storage";
import { logger } from "../utils/logger";

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
