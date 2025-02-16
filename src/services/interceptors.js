import { logger } from "../utils/logger";
import { api } from "../config/api";
import { getToken } from "./storage";
import { authEvents } from "./authEvents";

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log error only in development
    logger.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Transform error response to consistent format
    let errorResponse = {
      success: false,
      message: "An error occurred. Please try again.",
      errors: [],
    };

    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          // Force logout on unauthorized (invalid/expired token)
          if (!error.config.url.includes("/auth/login")) {
            // Don't logout on login failure
            await authEvents.triggerLogout();
          }
          errorResponse = {
            success: false,
            message:
              error.response.data?.message ||
              "Session expired. Please login again.",
            errors: [
              {
                field: "authorization",
                message: "Invalid or expired session",
              },
            ],
          };
          break;
        case 403:
          errorResponse = {
            success: false,
            message: "Access denied",
            errors: [
              {
                field: "authorization",
                message: "You don't have permission to perform this action",
              },
            ],
          };
          break;
        case 404:
          errorResponse = {
            success: false,
            message: "Resource not found",
            errors: [
              {
                field: "notFound",
                message: "The requested resource was not found",
              },
            ],
          };
          break;
        case 422:
          // Validation errors from server
          errorResponse = error.response.data;
          break;
        case 500:
          errorResponse = {
            success: false,
            message: "Server error",
            errors: [
              {
                field: "server",
                message:
                  "An unexpected error occurred. Please try again later.",
              },
            ],
          };
          break;
        default:
          errorResponse = error.response.data || errorResponse;
      }
    } else if (error.code === "ERR_NETWORK") {
      errorResponse = {
        success: false,
        message: "Network error",
        errors: [
          {
            field: "network",
            message:
              "Unable to connect to server. Please check your internet connection.",
          },
        ],
      };
    }

    return Promise.reject(errorResponse);
  }
);

export default api;
