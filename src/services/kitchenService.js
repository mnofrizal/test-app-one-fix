import api from "./interceptors";

// Kitchen Orders
export const getAllKitchenOrders = async () => {
  try {
    const response = await api.get("/kitchen/orders");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to fetch kitchen orders");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch kitchen orders"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getKitchenOrderStats = async () => {
  try {
    const response = await api.get("/kitchen/orders/stats");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch kitchen statistics"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch kitchen statistics"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getPendingKitchenOrders = async () => {
  try {
    const response = await api.get("/kitchen/orders/pending");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to fetch pending orders");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch pending orders"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getInProgressKitchenOrders = async () => {
  try {
    const response = await api.get("/kitchen/orders/inprogress");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch in-progress orders"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch in-progress orders"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getCompletedKitchenOrders = async () => {
  try {
    const response = await api.get("/kitchen/orders/completed");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch completed orders"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch completed orders"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getKitchenOrderById = async (orderId) => {
  try {
    const response = await api.get(`/kitchen/orders/${orderId}`);
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

export const startKitchenOrder = async (orderId) => {
  try {
    const response = await api.post(`/kitchen/orders/${orderId}/progress`);
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to start order");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to start order");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const completeKitchenOrder = async (orderId, evidenceUri, notes) => {
  try {
    // Create form data for the evidence image
    const formData = new FormData();
    formData.append("evidence", {
      uri: evidenceUri,
      type: "image/jpeg",
      name: `evidence-${orderId}.jpg`,
    });
    if (notes) {
      formData.append("notes", notes);
    }

    const response = await api.post(
      `/kitchen/orders/${orderId}/complete`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
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
    throw new Error(response.data.message || "Failed to complete order");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to complete order"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const updateKitchenOrderStatus = async (orderId, status, notes) => {
  try {
    const response = await api.patch(`/kitchen/orders/${orderId}/status`, {
      status,
      notes,
    });
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

// Kitchen Statistics
export const getDailyKitchenStats = async () => {
  try {
    const response = await api.get("/kitchen/orders/stats/daily");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch daily statistics"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch daily statistics"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getTopOrderedItems = async () => {
  try {
    const response = await api.get("/kitchen/orders/stats/items");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch top ordered items"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch top ordered items"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Kitchen Order Counts
export const getPendingOrdersCount = async () => {
  try {
    const response = await api.get("/kitchen/orders/count/pending");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch pending orders count"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch pending orders count"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getInProgressOrdersCount = async () => {
  try {
    const response = await api.get("/kitchen/orders/count/inprogress");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch in-progress orders count"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Failed to fetch in-progress orders count"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const getCompletedOrdersCount = async () => {
  try {
    const response = await api.get("/kitchen/orders/count/completed");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    throw new Error(
      response.data.message || "Failed to fetch completed orders count"
    );
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch completed orders count"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};
