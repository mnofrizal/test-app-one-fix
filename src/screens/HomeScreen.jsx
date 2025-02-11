import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useStore from "../store/useStore";

const ServiceMenuItem = ({ title, icon, onPress }) => (
  <TouchableOpacity
    className="h-20 flex-1 items-center justify-center"
    onPress={onPress}
  >
    <View className="mb-2 h-14 w-14 items-center justify-center rounded-full bg-blue-50 shadow-sm">
      <MaterialCommunityIcons name={icon} size={28} color="#007AFF" />
    </View>
    <Text className="text-center text-xs font-medium text-gray-700">
      {title}
    </Text>
  </TouchableOpacity>
);

const SummaryCard = ({ title, icon, count }) => (
  <View className="mb-3 overflow-hidden rounded-lg bg-white p-4 shadow">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="mr-3 rounded-full bg-blue-50 p-2">
          <MaterialCommunityIcons name={icon} size={24} color="#007AFF" />
        </View>
        <View>
          <Text className="font-medium text-gray-800">{title}</Text>
          <Text className="text-xs text-gray-500">Total Requests</Text>
        </View>
      </View>
      <View className="rounded-full bg-blue-100 px-3 py-1">
        <Text className="font-semibold text-blue-600">{count}</Text>
      </View>
    </View>
  </View>
);

const SectionHeader = ({ title }) => (
  <Text className="mb-4 text-base font-semibold text-gray-800">{title}</Text>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const requestSummary = useStore((state) => state.requestSummary);

  const menuItems = [
    { title: "Meal Order", key: "meals", icon: "food" },
    { title: "Transport", key: "transport", icon: "car" },
    { title: "Rooms", key: "rooms", icon: "door" },
    { title: "Stationary", key: "stationary", icon: "pencil" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-white px-4 pb-6 pt-8 shadow-sm">
        <Text className="mb-2 text-2xl font-bold text-gray-800">
          Hello World
        </Text>
        <Text className="mb-4 text-gray-500">
          What would you like to do today?
        </Text>

        {/* Search Bar */}
        <View className="overflow-hidden rounded-lg bg-gray-100">
          <View className="flex-row items-center px-3">
            <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
            <TextInput
              placeholder="Search services..."
              className="flex-1 p-3 text-base"
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>
      </View>

      <View className="p-4">
        {/* Services Section */}
        <View className="mb-8">
          <SectionHeader title="Our Services" />
          <View className="flex-row">
            {menuItems.map((item) => (
              <ServiceMenuItem
                key={item.key}
                title={item.title}
                icon={item.icon}
                onPress={() => {
                  if (item.key === "meals") {
                    navigation.navigate("MealOrder");
                  }
                }}
              />
            ))}
          </View>
        </View>

        {/* Summary Section */}
        <View>
          <SectionHeader title="Request Summary" />
          {menuItems.map((item) => (
            <SummaryCard
              key={item.key}
              title={item.title}
              icon={item.icon}
              count={requestSummary[item.key]}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
