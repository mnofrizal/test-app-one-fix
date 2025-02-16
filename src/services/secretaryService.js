import api from "./interceptors";

// Basic CRUD operations
export const getAllOrders = async ({
  page = 1,
  limit = 10,
  startDate,
  endDate,
  status,
  type,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (status) params.append("status", status);
    if (type) params.append("type", type);

    const response = await api.get(`/secretary/orders?${params.toString()}`);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to fetch orders");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch orders");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getNewestOrders = async () => {
  try {
    const response = await api.get(
      `/secretary/orders?page=1&limit=7&sort=requestDate:desc`
    );

    if (response.data.success) {
      return {
        success: true,
        data: {
          requests: response.data.data.requests,
        },
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to fetch orders");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch orders");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/secretary/orders/${orderId}`);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to fetch order details");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch order details"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/secretary/orders", orderData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to create order");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create order");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const updateOrder = async (orderId, updateData) => {
  try {
    const response = await api.put(`/secretary/orders/${orderId}`, updateData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to update order");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update order");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.delete(`/secretary/orders/${orderId}`);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to cancel order");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to cancel order");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Quick Access
export const getRecentActiveOrders = async () => {
  try {
    const response = await api.get("/secretary/orders/recent-active");

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch recent active orders"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch recent active orders"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getRecentActivities = async () => {
  try {
    const response = await api.get("/secretary/orders/recent-activities");

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch recent activities"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch recent activities"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Statistics & Reports
export const getStatusStats = async () => {
  try {
    const response = await api.get("/secretary/orders/stats/status");

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch status statistics"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch status statistics"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getTypeStats = async () => {
  try {
    const response = await api.get("/secretary/orders/stats/type");

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to fetch type statistics");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch type statistics"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};
