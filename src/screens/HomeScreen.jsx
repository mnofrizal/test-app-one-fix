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

const ServiceMenuItem = ({ title, icon, onPress }) => {
  let iconColor = "#4F46E5"; // Default color
  let bgColor = "bg-indigo-100"; // Default background color
  if (icon === "food") {
    iconColor = "#FFD07A"; // Vibrant orange for food
    bgColor = "bg-orange-50"; // Orange background for food
  } else if (icon === "car") {
    iconColor = "#00AACC"; // Vibrant blue for transport
    bgColor = "bg-blue-50"; // Blue background for transport
  } else if (icon === "door") {
    iconColor = "#FF0000"; // Vibrant red for rooms
    bgColor = "bg-red-50"; // Red background for rooms
  } else if (icon === "pencil") {
    iconColor = "#00A0A0"; // Vibrant teal for stationary
    bgColor = "bg-teal-50"; // Teal background for stationary
  }

  return (
    <TouchableOpacity
      className="h-24 flex-1 items-center justify-center"
      onPress={onPress}
    >
      <View
        className={`mb-3 h-16 w-16 items-center justify-center rounded-full ${bgColor} shadow-xl`}
      >
        <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
      </View>
      <Text className="font-base text-center text-sm text-gray-900">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const SummaryCard = ({ title, icon, count }) => (
  <View className="mb-4 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="mr-4 rounded-xl bg-indigo-50 p-3">
          <MaterialCommunityIcons name={icon} size={26} color="#4F46E5" />
        </View>
        <View>
          <Text className="mb-1 text-base font-semibold text-gray-900">
            {title}
          </Text>
          <Text className="text-sm font-medium text-slate-500">
            Total Requests
          </Text>
        </View>
      </View>
      <View className="rounded-full bg-indigo-100 px-4 py-2">
        <Text className="text-base font-bold text-indigo-600">{count}</Text>
      </View>
    </View>
  </View>
);

const SectionHeader = ({ title }) => (
  <Text className="mb-5 text-xl font-bold tracking-tight text-gray-900">
    {title}
  </Text>
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
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header Section */}
      <View className="relative bg-blue-900 px-6 pb-8 pt-14 shadow-lg">
        <Text className="text-3xl font-extrabold tracking-tight text-white">
          Hello World
        </Text>
        <Text className="mb-10 text-lg font-medium text-white">
          What would you like to do today?
        </Text>
      </View>

      <View className="absolute top-32 w-full">
        {/* Services Section */}
        <View className="p-3 shadow-xl">
          <View className="flex-row justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
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

        {/* Search Bar */}
        <View className="p-3 py-2">
          <View className="overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
            <View className="flex-row items-center px-4">
              <MaterialCommunityIcons
                name="magnify"
                size={22}
                color="#64748B"
              />
              <TextInput
                placeholder="Search services..."
                className="flex-1 py-4 text-base font-medium text-gray-900"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
          <View className="mt-2 flex-row items-center">
            <View className="mt-1 flex-row">
              <View className="m-1 rounded-full border border-gray-200 p-2">
                <Text className="text-xs font-medium text-gray-600">
                  Meal Order
                </Text>
              </View>
              <View className="m-1 rounded-full border border-gray-200 p-2">
                <Text className="text-xs font-medium text-gray-600">
                  Event Meal
                </Text>
              </View>
              <View className="m-1 rounded-full border border-gray-200 p-2">
                <Text className="text-xs font-medium text-gray-600">
                  Transport
                </Text>
              </View>
              <View className="m-1 rounded-full border border-gray-200 p-2">
                <Text className="text-xs font-medium text-gray-600">Rooms</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View className="p-4">
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
