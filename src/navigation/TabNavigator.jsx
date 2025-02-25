import React from "react";
import { useAuthStore } from "../store/authStore";
import {
  AdminTabNavigator,
  KitchenTabNavigator,
  DriverTabNavigator,
  PoolTabNavigator,
  PMTabNavigator,
  SecretaryTabNavigator,
} from "./RoleTabNavigators";

const TabNavigator = () => {
  const user = useAuthStore((state) => state.user);

  switch (user?.role) {
    case "KITCHEN":
      return <KitchenTabNavigator />;
    case "DRIVER":
      return <DriverTabNavigator />;
    case "POOL_DRIVER":
      return <PoolTabNavigator />;
    case "PM":
      return <PMTabNavigator />;
    case "SECRETARY":
      return <SecretaryTabNavigator />;
    case "ADMIN":
      return <AdminTabNavigator />;
    default:
      return <AdminTabNavigator />;
  }
};

export default TabNavigator;
