/**
 * Notification type configuration
 * Each type defines:
 * - screen: Target screen to navigate to
 * - params: Parameters needed for navigation
 * - handler: Optional custom handler function for special cases
 */

export const NOTIFICATION_TYPES = {
  // Order related notifications
  order_update: {
    screen: (role) => {
      switch (role) {
        case "ADMIN":
        case "SECRETARY":
          return "OrderDetail";
        default:
          return "NotificationScreen";
      }
    },
    getParams: (data) => ({ orderId: data.orderId }),
    title: "Order Update",
  },
  order_assigned: {
    screen: "OrderDetail",
    getParams: (data) => ({ orderId: data.orderId }),
    title: "New Order Assigned",
  },
  order_completed: {
    screen: "OrderDetail",
    getParams: (data) => ({ orderId: data.orderId }),
    title: "Order Completed",
  },

  // Kitchen related notifications
  kitchen_update: {
    screen: (role) => {
      switch (role) {
        case "KITCHEN":
          return "KitchenOrderDetail";
        case "ADMIN":
          return "OrderDetail";
        default:
          return "NotificationScreen";
      }
    },
    getParams: (data) => ({ orderId: data.orderId }),
    title: "Kitchen Update",
  },
  kitchen_new_order: {
    screen: "KitchenOrderDetail",
    getParams: (data) => ({ orderId: data.orderId }),
    title: "Pesanan Baru",
  },

  // Secretary notifications
  secretary_approval_needed: {
    screen: "OrderDetail",
    getParams: (data) => ({ orderId: data.orderId }),
    title: "Approval Needed",
  },

  // Driver notifications
  driver_pickup_ready: {
    screen: "OrderDetail",
    getParams: (data) => ({ orderId: data.orderId }),
    title: "Order Ready for Pickup",
  },
  driver_assigned: {
    screen: "OrderDetail",
    getParams: (data) => ({ orderId: data.orderId }),
    title: "New Delivery Assigned",
  },

  // General notifications
  general_announcement: {
    screen: "NotificationScreen",
    getParams: () => ({}),
    title: "Announcement",
  },
  profile_update: {
    screen: "ProfileScreen",
    getParams: () => ({}),
    title: "Profile Update",
  },
};

// Helper function to handle navigation based on notification type
export const handleNotificationNavigation = (
  navigation,
  data,
  userRole = null
) => {
  if (!data?.type || !NOTIFICATION_TYPES[data.type]) {
    console.log("Unknown notification type:", data?.type);
    return;
  }

  const notificationType = NOTIFICATION_TYPES[data.type];
  const params = notificationType.getParams(data);

  // Determine target screen based on notification type and user role
  const screen =
    typeof notificationType.screen === "function"
      ? notificationType.screen(userRole)
      : notificationType.screen;

  navigation.navigate(screen, params);
};

// Helper to get notification title based on type
export const getNotificationTitle = (type) => {
  return NOTIFICATION_TYPES[type]?.title || "Notification";
};
