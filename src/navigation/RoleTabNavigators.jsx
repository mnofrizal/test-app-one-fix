import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import KitchenHomeScreen from "../screens/KitchenHomeScreen";
import DriverHomeScreen from "../screens/DriverHomeScreen";
import PoolHomeScreen from "../screens/PoolHomeScreen";
import PMHomeScreen from "../screens/PMHomeScreen";
import SecretaryHomeScreen from "../screens/SecretaryHomeScreen";
import OrderScreen from "../screens/OrderScreen";
import KitchenOrdersScreen from "../screens/KitchenOrdersScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

// Custom tab icon component
const TabIcon = ({ focused, iconName, color }) => (
  <MaterialCommunityIcons name={iconName} size={27} color={color} />
);

// Common tab navigator options
const tabNavigatorOptions = {
  headerShown: false,
  tabBarShowLabel: true,
  tabBarStyle: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarActiveTintColor: "#1e3a8a",
  tabBarInactiveTintColor: "#8E8E93",
  tabBarLabelStyle: {
    fontSize: 12,
  },
  tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={1} />,
};

// Common screens that appear in all role navigators
const commonScreens = (Tab) => (
  <>
    <Tab.Screen
      name="Notification"
      component={NotificationScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="bell" color={color} />
        ),
        tabBarLabel: "Notifications",
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="account" color={color} />
        ),
        tabBarLabel: "Profile",
      }}
    />
  </>
);

// Admin Tab Navigator
export const AdminTabNavigator = () => (
  <Tab.Navigator screenOptions={tabNavigatorOptions}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="home-variant" color={color} />
        ),
        tabBarLabel: "Home",
      }}
    />
    <Tab.Screen
      name="Order"
      component={OrderScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="clipboard-list" color={color} />
        ),
        tabBarLabel: "Order",
      }}
    />
    {commonScreens(Tab)}
  </Tab.Navigator>
);

// Kitchen Tab Navigator
export const KitchenTabNavigator = () => (
  <Tab.Navigator screenOptions={tabNavigatorOptions}>
    <Tab.Screen
      name="Kitchen"
      component={KitchenHomeScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="food-variant" color={color} />
        ),
        tabBarLabel: "Kitchen",
      }}
    />
    <Tab.Screen
      name="Orders"
      component={KitchenOrdersScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="clipboard-list" color={color} />
        ),
        tabBarLabel: "Orders",
      }}
    />
    {commonScreens(Tab)}
  </Tab.Navigator>
);

// Driver Tab Navigator
export const DriverTabNavigator = () => (
  <Tab.Navigator screenOptions={tabNavigatorOptions}>
    <Tab.Screen
      name="Driver"
      component={DriverHomeScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="truck-delivery" color={color} />
        ),
        tabBarLabel: "Deliveries",
      }}
    />
    <Tab.Screen
      name="Order"
      component={OrderScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="clipboard-list" color={color} />
        ),
        tabBarLabel: "Tasks",
      }}
    />
    {commonScreens(Tab)}
  </Tab.Navigator>
);

// Pool Driver Tab Navigator
export const PoolTabNavigator = () => (
  <Tab.Navigator screenOptions={tabNavigatorOptions}>
    <Tab.Screen
      name="Pool"
      component={PoolHomeScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="car-multiple" color={color} />
        ),
        tabBarLabel: "Vehicles",
      }}
    />
    <Tab.Screen
      name="Order"
      component={OrderScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="clipboard-list" color={color} />
        ),
        tabBarLabel: "Requests",
      }}
    />
    {commonScreens(Tab)}
  </Tab.Navigator>
);

// PM Tab Navigator
export const PMTabNavigator = () => (
  <Tab.Navigator screenOptions={tabNavigatorOptions}>
    <Tab.Screen
      name="PM"
      component={PMHomeScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="clipboard-check" color={color} />
        ),
        tabBarLabel: "Approvals",
      }}
    />
    <Tab.Screen
      name="Order"
      component={OrderScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="clipboard-list" color={color} />
        ),
        tabBarLabel: "Requests",
      }}
    />
    {commonScreens(Tab)}
  </Tab.Navigator>
);

// Secretary Tab Navigator
export const SecretaryTabNavigator = () => (
  <Tab.Navigator screenOptions={tabNavigatorOptions}>
    <Tab.Screen
      name="Secretary"
      component={SecretaryHomeScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="calendar-check" color={color} />
        ),
        tabBarLabel: "Dashboard",
      }}
    />
    <Tab.Screen
      name="Order"
      component={OrderScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon focused={focused} iconName="clipboard-list" color={color} />
        ),
        tabBarLabel: "Requests",
      }}
    />
    {commonScreens(Tab)}
  </Tab.Navigator>
);
