import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import OrderScreen from "../screens/OrderScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

// Custom tab icon component
const TabIcon = ({ focused, iconName, color }) => (
  <MaterialCommunityIcons name={iconName} size={27} color={color} />
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // Show labels
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#1e3a8a", // Active label and icon color
        tabBarInactiveTintColor: "#8E8E93", // Inactive label and icon color
        tabBarLabelStyle: {
          fontSize: 12, // Customize label font size
        },
        tabBarButton: (props) => (
          <TouchableOpacity {...props} activeOpacity={1} />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} iconName="home-variant" color={color} />
          ),
          tabBarLabel: "Home", // Add label
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              iconName="clipboard-list"
              color={color}
            />
          ),
          tabBarLabel: "Order", // Add label
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} iconName="bell" color={color} />
          ),
          tabBarLabel: "Notifications", // Add label
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} iconName="account" color={color} />
          ),
          tabBarLabel: "Profile", // Add label
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
