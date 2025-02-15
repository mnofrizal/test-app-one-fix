import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import MealOrderScreen from "../screens/MealOrderScreen";
import MealOrderSuccess from "../screens/MealOrderSuccess";
import LoginScreen from "../screens/LoginScreen";
import { useAuthStore } from "../store/authStore";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MealOrder"
            component={MealOrderScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MealOrderSuccess"
            component={MealOrderSuccess}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
