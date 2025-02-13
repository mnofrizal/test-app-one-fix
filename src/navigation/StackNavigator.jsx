import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import MealOrderScreen from "../screens/MealOrderScreen";
import MealOrderSuccess from "../screens/MealOrderSuccess";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
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
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MealOrder"
        component={MealOrderScreen}
        options={{
          title: "Meal Order",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1e3a8a", // Blue 800 color
          },
          headerTitleStyle: {
            color: "#FFFFFF", // White color for text
          },
        }}
      />
      <Stack.Screen
        name="MealOrderSuccess"
        component={MealOrderSuccess}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
