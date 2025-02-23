import api from "./interceptors";

export const submitOrder = async (orderData) => {
  try {
    const response = await api.post("/service-requests", orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Failed to submit order");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to submit order");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const fetchOrders = async (params = {}) => {
  try {
    const response = await api.get("/service-requests", {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });

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

export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/service-requests/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Failed to get order details");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to get order details"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(
      `/service-requests/${orderId}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Failed to update order status");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to update order status"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getDropPoints = async () => {
  try {
    const response = await api.get("/service-requests/drop-points", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Failed to fetch drop points");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch drop points"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const validateOrder = async (orderData) => {
  try {
    const response = await api.post("/service-requests/validate", orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Order validation failed");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Order validation failed");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/service-requests/${id}`);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Failed to delete order");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to delete order");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const respondToRequest = async (token, approved, responseNote) => {
  try {
    // Create FormData and append fields
    const formData = new FormData();
    formData.append("response", approved);
    formData.append("responseNote", responseNote || "");

    const response = await api.post(
      `/requests/approval/respond/${token}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Failed to respond to request");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to respond to request"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};
