import api from "./interceptors";

export const fetchMenus = async () => {
  try {
    const response = await api.get("/menu", {
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

    return {
      success: false,
      message: response.data.message || "Failed to fetch menus",
      data: [],
    };
  } catch (error) {
    return error; // Error is already formatted by interceptor
  }
};

export const createMenu = async (menuData) => {
  try {
    const response = await api.post("/menu", menuData, {
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

    return {
      success: false,
      message: response.data.message || "Failed to create menu",
      data: null,
    };
  } catch (error) {
    return error; // Error is already formatted by interceptor
  }
};

export const updateMenu = async (id, menuData) => {
  try {
    const response = await api.put(`/menu/${id}`, menuData, {
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

    return {
      success: false,
      message: response.data.message || "Failed to update menu",
      data: null,
    };
  } catch (error) {
    return error; // Error is already formatted by interceptor
  }
};

export const toggleMenuAvailability = async (id, isAvailable) => {
  try {
    const response = await api.patch(
      `/menu/${id}/availability`,
      { isAvailable },
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

    return {
      success: false,
      message: response.data.message || "Failed to toggle menu availability",
      data: null,
    };
  } catch (error) {
    return error; // Error is already formatted by interceptor
  }
};
