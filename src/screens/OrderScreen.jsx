import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import BottomSheet from "../components/BottomSheet";

const OrderCard = ({ type, title, date, time, status, details }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          icon: "check-circle",
          label: "Completed",
        };
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          icon: "clock-outline",
          label: "Pending Approval",
        };
      case "processing":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: "progress-clock",
          label: "In Progress",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          icon: "information",
          label: status,
        };
    }
  };

  const getServiceInfo = (type) => {
    switch (type.toLowerCase()) {
      case "meal":
        return {
          icon: "food",
          color: "#FFD07A",
          bg: "bg-orange-50",
          lightBg: "bg-orange-50/50",
        };
      case "transport":
        return {
          icon: "car",
          color: "#00AACC",
          bg: "bg-blue-50",
          lightBg: "bg-blue-50/50",
        };
      case "room":
        return {
          icon: "door",
          color: "#FF0000",
          bg: "bg-red-50",
          lightBg: "bg-red-50/50",
        };
      case "stationary":
        return {
          icon: "pencil",
          color: "#00A0A0",
          bg: "bg-teal-50",
          lightBg: "bg-teal-50/50",
        };
      default:
        return {
          icon: "package",
          color: "#4F46E5",
          bg: "bg-indigo-50",
          lightBg: "bg-indigo-50/50",
        };
    }
  };

  const serviceInfo = getServiceInfo(type);
  const statusInfo = getStatusColor(status);

  return (
    <Animated.View
      entering={FadeIn}
      layout={Layout}
      className="mb-4 overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-lg"
    >
      <View
        className={`relative px-5 py-4 ${serviceInfo.lightBg} shadow-sm`}
        style={{
          borderLeftWidth: 4,
          borderLeftColor: serviceInfo.color,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className={`mr-3 rounded-xl ${serviceInfo.bg} p-3`}>
              <MaterialCommunityIcons
                name={serviceInfo.icon}
                size={24}
                color={serviceInfo.color}
              />
            </View>
            <View>
              <View className="flex-row items-center">
                <Text className="mr-2 text-lg font-semibold text-gray-900">
                  {title}
                </Text>
                <View className={`rounded-full ${statusInfo.bg} px-3 py-1`}>
                  <Text className={`text-xs font-semibold ${statusInfo.text}`}>
                    {statusInfo.label}
                  </Text>
                </View>
              </View>
              <Text className="text-sm font-medium text-gray-500">{time}</Text>
            </View>
          </View>
        </View>
      </View>

      {details?.assignee && (
        <View className="border-gray-200 bg-white px-5 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-8 w-8 rounded-full bg-gray-200">
                <MaterialCommunityIcons
                  name="account"
                  size={32}
                  color="#9CA3AF"
                />
              </View>
              <View className="ml-3">
                <Text className="text-sm font-medium text-gray-900">
                  {details.assignee}
                </Text>
                <Text className="text-xs text-gray-500">Assigned Staff</Text>
              </View>
            </View>
            <TouchableOpacity className="rounded-full bg-indigo-50 p-2">
              <MaterialCommunityIcons
                name="chat-outline"
                size={20}
                color="#4F46E5"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const TabBar = ({ tabs, activeTab, onTabChange }) => (
  <View className="flex-row border-b border-gray-200">
    {tabs.map((tab) => (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabChange(tab.key)}
        className={`flex-1 border-b-2 px-4 py-4 ${
          activeTab === tab.key ? "border-blue-600" : "border-transparent"
        }`}
      >
        <View className="flex-row items-center justify-center">
          <Text
            className={`text-sm font-medium ${
              activeTab === tab.key ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {tab.label}
          </Text>
          {tab.count > 0 && (
            <View className="ml-2 rounded-full bg-gray-100 px-2 py-0.5">
              <Text
                className={`text-xs font-medium ${
                  activeTab === tab.key ? "text-blue-800" : "text-gray-600"
                }`}
              >
                {tab.count}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

const FilterButton = ({ label, icon, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mr-2 flex-row items-center rounded-full px-4 py-2 ${
      isSelected ? "bg-blue-800" : "bg-white border border-gray-200"
    }`}
  >
    <MaterialCommunityIcons
      name={icon}
      size={18}
      color={isSelected ? "#ffffff" : "#374151"}
    />
    {label && (
      <Text
        className={`ml-2 text-sm font-medium ${
          isSelected ? "text-white" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    )}
  </TouchableOpacity>
);

const DateLabel = ({ date }) => (
  <View className="mb-4 mt-2">
    <Text className="text-base font-semibold text-gray-900">{date}</Text>
  </View>
);

const DateFilterSheet = ({
  visible,
  onClose,
  selectedDate,
  onSelect,
  dateGroups,
}) => {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%"]}
      enablePanDownToClose
    >
      <View className="flex-1 px-6">
        <View className="mb-6 border-b border-gray-100 pb-4">
          <Text className="text-xl font-bold text-gray-900">
            Filter by Date
          </Text>
          <Text className="text-base text-gray-500">
            Select a date range to filter orders
          </Text>
        </View>

        {dateGroups.map((group, index) => (
          <View key={group.title} className="mb-6">
            <Text className="mb-3 text-sm font-medium text-gray-500">
              {group.title}
            </Text>
            {group.filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => {
                  onSelect(filter.value === "all" ? null : filter.value);
                  onClose();
                }}
                className={`mb-2 flex-row items-center rounded-full px-4 py-2 ${
                  selectedDate === filter.value
                    ? "bg-gray-900"
                    : "bg-white border border-gray-200"
                }`}
              >
                <MaterialCommunityIcons
                  name={filter.icon}
                  size={18}
                  color={selectedDate === filter.value ? "#ffffff" : "#374151"}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    selectedDate === filter.value
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </BottomSheet>
  );
};

const dateFilterGroups = [
  {
    title: "Quick Filters",
    filters: [
      { label: "All Dates", value: "all", icon: "calendar" },
      { label: "Today", value: "today", icon: "calendar-today" },
      { label: "This Week", value: "week", icon: "calendar-week" },
      { label: "This Month", value: "month", icon: "calendar-month" },
    ],
  },
  {
    title: "Custom Range",
    filters: [
      { label: "Last 7 Days", value: "last7", icon: "calendar-range" },
      { label: "Last 30 Days", value: "last30", icon: "calendar-range" },
      { label: "Last 90 Days", value: "last90", icon: "calendar-range" },
    ],
  },
];

const OrderScreen = () => {
  const [activeTab, setActiveTab] = useState("approval");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilterVisible, setDateFilterVisible] = useState(false);

  // Mock data for orders
  const allOrders = {
    approval: [
      {
        type: "meal",
        title: "Lunch Order",
        date: "Today",
        dateGroup: "today",
        time: "12:30 PM",
        status: "Pending",
        details: {
          time: "Awaiting approval",
          assignee: "John Manager",
        },
      },
      {
        type: "transport",
        title: "Airport Transfer",
        date: "Tomorrow",
        dateGroup: "week",
        time: "09:00 AM",
        status: "Pending",
        details: {
          time: "Requested 30 mins ago",
          assignee: "Sarah Admin",
        },
      },
    ],
    inprogress: [
      {
        type: "room",
        title: "Meeting Room Booking",
        date: "Today",
        dateGroup: "today",
        time: "14:00 PM",
        status: "Processing",
        details: {
          time: "Started 1 hour ago",
          progress: 75,
          assignee: "Room Service",
        },
      },
      {
        type: "stationary",
        title: "Office Supplies",
        date: "Today",
        dateGroup: "today",
        time: "15:30 PM",
        status: "Processing",
        details: {
          time: "Started 45 mins ago",
          progress: 30,
          assignee: "Supply Team",
        },
      },
    ],
    done: [
      {
        type: "meal",
        title: "Dinner Order",
        date: "Yesterday",
        dateGroup: "week",
        time: "19:00 PM",
        status: "Completed",
        details: {
          time: "Completed in 1.5 hours",
          assignee: "Kitchen Staff",
        },
      },
      {
        type: "room",
        title: "Meeting Room A",
        date: "Jan 12, 2024",
        dateGroup: "month",
        time: "Jan 12, 2024",
        status: "Completed",
        details: {
          time: "Used for 2 hours",
          assignee: "Facility Team",
        },
      },
    ],
  };

  const tabs = [
    { label: "Approval", key: "approval", count: allOrders.approval.length },
    {
      label: "In Progress",
      key: "inprogress",
      count: allOrders.inprogress.length,
    },
    { label: "Done", key: "done", count: allOrders.done.length },
  ];

  const filterTypes = [
    { label: "Meal", icon: "food", value: "meal" },
    { label: "Transport", icon: "car", value: "transport" },
    { label: "Room", icon: "door", value: "room" },
    { label: "Stationary", icon: "pencil", value: "stationary" },
  ];

  // Filter orders by search, type and date
  const filteredOrders = allOrders[activeTab].filter((order) => {
    const matchesSearch = searchQuery
      ? order.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    // Show order if it matches any of the selected types, or show all if no types selected
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.some(
        (type) => order.type.toLowerCase() === type.toLowerCase()
      );
    const matchesDate = selectedDate ? order.dateGroup === selectedDate : true;

    return matchesSearch && matchesType && matchesDate;
  });

  const groupedOrders = filteredOrders.reduce((groups, order) => {
    if (!groups[order.date]) {
      groups[order.date] = [];
    }
    groups[order.date].push(order);
    return groups;
  }, {});

  return (
    <View className="flex-1 bg-gray-50 pt-3">
      <View className="bg-white shadow-sm">
        <View className="px-4 pb-2 pt-10">
          <View className="flex-row items-center justify-center space-x-3">
            <View className="flex-1 overflow-hidden rounded-full border border-gray-200 bg-white">
              <View className="flex-row items-center px-4">
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color="#6B7280"
                />
                <TextInput
                  placeholder="Search orders..."
                  className="flex-1 py-2 pl-2 text-base"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
                  autoCorrect={false}
                  blurOnSubmit={false}
                  autoCapitalize="none"
                />
                {searchQuery ? (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    className="rounded-full p-1"
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <TouchableOpacity className="rounded-full bg-blue-900 p-2">
              <MaterialCommunityIcons name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      <ScrollView className="flex-1">
        <View className="flex-row pt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-6"
          >
            {filterTypes.map((type) => (
              <FilterButton
                key={type.value}
                label={type.label}
                icon={type.icon}
                isSelected={selectedTypes.includes(type.value)}
                onPress={() => {
                  setSelectedTypes((prevTypes) =>
                    prevTypes.includes(type.value)
                      ? prevTypes.filter((t) => t !== type.value)
                      : [...prevTypes, type.value]
                  );
                }}
              />
            ))}
          </ScrollView>
          <View className="px-2">
            <FilterButton
              icon="calendar"
              isSelected={selectedDate !== null}
              onPress={() => setDateFilterVisible(true)}
            />
          </View>
        </View>

        <View className="p-4 py-2">
          {Object.entries(groupedOrders).length > 0 ? (
            Object.entries(groupedOrders).map(([date, orders]) => (
              <View key={date}>
                <DateLabel date={date} />
                {orders.map((order, index) => (
                  <OrderCard key={index} {...order} />
                ))}
              </View>
            ))
          ) : (
            <View className="mt-4 items-center">
              <MaterialCommunityIcons
                name="clipboard-text-search"
                size={48}
                color="#9CA3AF"
              />
              <Text className="mt-2 text-base font-medium text-gray-500">
                No orders found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <DateFilterSheet
        visible={dateFilterVisible}
        onClose={() => setDateFilterVisible(false)}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        dateGroups={dateFilterGroups}
      />
    </View>
  );
};

export default OrderScreen;
