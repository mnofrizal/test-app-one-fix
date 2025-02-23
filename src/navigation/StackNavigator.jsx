import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealOrderScreen from "../screens/MealOrderScreen";
import MealOrderSuccess from "../screens/MealOrderSuccess";
import ListMenuScreen from "../screens/ListMenuScreen";
import LoginScreen from "../screens/LoginScreen";
import KitchenOrderDetailScreen from "../screens/KitchenOrderDetailScreen";
import KitchenOrderCompleteScreen from "../screens/KitchenOrderCompleteScreen";
import KitchenOrderSuccessScreen from "../screens/KitchenOrderSuccessScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import { useAuthStore } from "../store/authStore";
import {
  AdminTabNavigator,
  KitchenTabNavigator,
  DriverTabNavigator,
  PoolTabNavigator,
  PMTabNavigator,
  SecretaryTabNavigator,
} from "./RoleTabNavigators";
import TestScreen from "../screens/TestScreen";
import { Platform } from "react-native";
import TestScreen2 from "../screens/TestScreen2";
import WhatsappSettingScreen from "../screens/WhatsappSettingScreen";

const Stack = createNativeStackNavigator();

// Component to render appropriate tab navigator based on role
const getRoleNavigator = (role) => {
  if (!role) return AdminTabNavigator;

  switch (role) {
    case "KITCHEN":
      return KitchenTabNavigator;
    case "DRIVER":
      return DriverTabNavigator;
    case "POOL_DRIVER":
      return PoolTabNavigator;
    case "PM":
      return PMTabNavigator;
    case "SECRETARY":
      return SecretaryTabNavigator;
    case "ADMIN":
      return AdminTabNavigator;
    default:
      return AdminTabNavigator;
  }
};

const StackNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();

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
        animationDuration: 100,
        presentation: "card",
        // presentation: "transparentModal",
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
            component={getRoleNavigator(user?.role)}
            options={{ headerShown: false }}
          />
          {/* Common screens accessible by all roles */}
          <Stack.Screen
            name="MealOrderSuccess"
            component={MealOrderSuccess}
            options={{
              headerShown: false,
              animation: "fade_from_bottom",
            }}
          />
          <Stack.Screen
            name="TestPage"
            component={TestScreen}
            options={{
              // presentation: "transparentModal",
              animation: "slide_from_right",
              animationDuration: 100,
            }}
          />
          <Stack.Screen
            name="TestPage2"
            component={TestScreen2}
            options={{
              // presentation: "transparentModal",
              animation: "slide_from_right",
              animationDuration: 100,
            }}
          />

          <Stack.Screen
            name="WhatsappSetting"
            component={WhatsappSettingScreen}
            options={{
              title: "WhatsApp Settings",
              animation: "slide_from_right",
              animationDuration: 100,
            }}
          />

          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{
              title: "Order Detail",
              headerTitleStyle: {
                fontWeight: "600",
              },
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
          {/* Kitchen-specific screens */}
          {user?.role === "KITCHEN" && (
            <>
              <Stack.Screen
                name="KitchenOrderDetail"
                component={KitchenOrderDetailScreen}
                options={{
                  headerShown: false,
                  animation: "fade_from_bottom",
                }}
              />
              <Stack.Screen
                name="KitchenOrderComplete"
                component={KitchenOrderCompleteScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="KitchenOrderSuccess"
                component={KitchenOrderSuccessScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                  gestureEnabled: false,
                }}
              />
            </>
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
