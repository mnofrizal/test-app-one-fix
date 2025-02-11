import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import useStore from "../store/useStore";

const ServiceMenuItem = ({ title, icon, onPress }) => (
  <TouchableOpacity
    className="items-center justify-center w-20 h-20 mx-2"
    onPress={onPress}
  >
    <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-1">
      {/* Icon placeholder - will be replaced with actual icons */}
      <View className="w-8 h-8 bg-blue-500 rounded-full" />
    </View>
    <Text className="text-xs text-center">{title}</Text>
  </TouchableOpacity>
);

const SummaryCard = ({ title, count }) => (
  <View className="bg-white p-4 rounded-lg shadow-sm mb-3 flex-row justify-between items-center">
    <Text className="font-medium text-gray-800">{title}</Text>
    <View className="bg-blue-100 px-3 py-1 rounded-full">
      <Text className="text-blue-600 font-medium">{count}</Text>
    </View>
  </View>
);

const HomeScreen = () => {
  const requestSummary = useStore((state) => state.requestSummary);

  const menuItems = [
    { title: "Meal Order", key: "meals" },
    { title: "Transport", key: "transport" },
    { title: "Rooms", key: "rooms" },
    { title: "Stationary", key: "stationary" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Hello World</Text>

        {/* Search Bar */}
        <View className="bg-white rounded-lg mb-6 shadow-sm">
          <TextInput placeholder="Search..." className="p-3" />
        </View>

        {/* Menu Items */}
        <View className="flex-row justify-around mb-6">
          {menuItems.map((item) => (
            <ServiceMenuItem
              key={item.key}
              title={item.title}
              onPress={() => {}}
            />
          ))}
        </View>

        {/* Summary Cards */}
        <View>
          {menuItems.map((item) => (
            <SummaryCard
              key={item.key}
              title={item.title}
              count={requestSummary[item.key]}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
