import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import MealOrderScreen from "../screens/MealOrderScreen";
import MealOrderSuccess from "../screens/MealOrderSuccess";
import ListMenuScreen from "../screens/ListMenuScreen";
import LoginScreen from "../screens/LoginScreen";
import KitchenHomeScreen from "../screens/KitchenHomeScreen";
import DriverHomeScreen from "../screens/DriverHomeScreen";
import PoolHomeScreen from "../screens/PoolHomeScreen";
import PMHomeScreen from "../screens/PMHomeScreen";
import SecretaryHomeScreen from "../screens/SecretaryHomeScreen";
import { useAuthStore } from "../store/authStore";

const Stack = createNativeStackNavigator();

// Component to render appropriate home screen based on role
const RoleHomeScreen = () => {
  const { user } = useAuthStore();
  const role = user?.role;

  if (!role) return <TabNavigator />;

  switch (role) {
    case "KITCHEN":
      return <KitchenHomeScreen />;
    case "DRIVER":
      return <DriverHomeScreen />;
    case "POOL_DRIVER":
      return <PoolHomeScreen />;
    case "PM":
      return <PMHomeScreen />;
    case "SECRETARY":
      return <SecretaryHomeScreen />;
    case "ADMIN":
      return <TabNavigator />;
    default:
      return <TabNavigator />;
  }
};

const StackNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();

  console.log("Current user role:", user?.role); // Add logging to debug role-based routing

  // Helper function to check if user has access to screens
  const canAccessMenuScreen = (role) => {
    return ["ADMIN", "KITCHEN", "SECRETARY"].includes(role);
  };

  const canAccessMealOrder = (role) => {
    return ["ADMIN", "SECRETARY"].includes(role);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: "#1F2937",
        },
        headerShadowVisible: true,
        animation: "fade_from_bottom",
        presentation: "transparentModal",
      }}
    >
      {!isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="MainTabs"
            component={RoleHomeScreen}
            options={{ headerShown: false }}
          />
          {/* Common screens accessible by all roles */}
          <Stack.Screen
            name="MealOrderSuccess"
            component={MealOrderSuccess}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          {/* Role-specific screens */}
          {user?.role && canAccessMenuScreen(user.role) && (
            <Stack.Screen
              name="ListMenu"
              component={ListMenuScreen}
              options={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
          )}
          {user?.role && canAccessMealOrder(user.role) && (
            <Stack.Screen
              name="MealOrder"
              component={MealOrderScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
