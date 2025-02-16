import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../store/authStore";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import useStore from "../store/useStore";

const { width } = Dimensions.get("window");

const ActiveOrderCard = ({ title, orderNo, status, eta, icon, time }) => {
  let statusColor = "bg-yellow-50 text-yellow-700";
  let statusBg = "bg-yellow-50";
  if (status === "In Progress") {
    statusColor = "text-blue-700";
    statusBg = "bg-blue-50";
  } else if (status === "Ready") {
    statusColor = "text-green-700";
    statusBg = "bg-green-50";
  }

  return (
    <View className="mr-4 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="rounded-full bg-indigo-50 p-2">
            <MaterialCommunityIcons name={icon} size={20} color="#4F46E5" />
          </View>
          <View className="ml-3">
            <Text className="text-sm font-medium text-gray-900">{title}</Text>
            <Text className="text-xs text-gray-500">#{orderNo}</Text>
          </View>
        </View>
        <View className={`rounded-full ${statusBg} px-3 py-1`}>
          <Text className={`text-xs font-medium ${statusColor}`}>{status}</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="#6B7280"
          />
          <Text className="ml-1 text-xs text-gray-500">{time}</Text>
        </View>
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="timer-outline"
            size={16}
            color="#6B7280"
          />
          <Text className="ml-1 text-xs text-gray-500">ETA: {eta}</Text>
        </View>
      </View>
    </View>
  );
};

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const WeatherWidget = ({ currentTime }) => (
  <View className="z-20 mt-2 flex-row items-center justify-between rounded-2xl bg-blue-800 p-3 pb-10 shadow-xl">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name="weather-sunny" size={24} color="white" />
      <View className="ml-3">
        <Text className="text-lg font-bold text-white">28°C</Text>
        <Text className="text-sm text-blue-100">Cilegon, Clear Sky</Text>
      </View>
    </View>
    <Text className="text-3xl font-medium text-white">
      {formatTime(currentTime)}
    </Text>
  </View>
);

const ServiceMenuItem = ({ title, icon, onPress, route }) => {
  const navigation = useNavigation();
  let iconColor = "#4F46E5"; // Default color
  let bgColor = "bg-indigo-100"; // Default background color

  if (icon === "food") {
    iconColor = "#FFD07A";
    bgColor = "bg-orange-50";
  } else if (icon === "car") {
    iconColor = "#00AACC";
    bgColor = "bg-blue-50";
  } else if (icon === "door") {
    iconColor = "#FF0000";
    bgColor = "bg-red-50";
  } else if (icon === "pencil") {
    iconColor = "#00A0A0";
    bgColor = "bg-teal-50";
  }

  const handlePress = () => {
    if (route) {
      navigation.navigate(route);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      className="h-24 flex-1 items-center justify-center"
      onPress={handlePress}
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

const ServiceExtraMenuItem = ({ title, icon, onPress, route }) => {
  const navigation = useNavigation();
  let iconColor = "#4F46E5"; // Default color
  let bgColor = "bg-indigo-100"; // Default background color

  if (icon === "food") {
    iconColor = "#FFD07A";
    bgColor = "bg-orange-50";
  } else if (icon === "car") {
    iconColor = "#00AACC";
    bgColor = "bg-blue-50";
  } else if (icon === "door") {
    iconColor = "#FF0000";
    bgColor = "bg-red-50";
  } else if (icon === "pencil") {
    iconColor = "#00A0A0";
    bgColor = "bg-teal-50";
  }

  const handlePress = () => {
    if (route) {
      navigation.navigate(route);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      className="h-24 flex-1 items-center justify-center"
      onPress={handlePress}
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

const SummaryCard = ({ title, icon, count }) => {
  let iconColor = "#4F46E5"; // Default color
  let bgColor = "bg-indigo-50"; // Default background color
  let countBgColor = "bg-indigo-100"; // Default count background color
  let countTextColor = "text-indigo-600"; // Default count text color

  if (icon === "food") {
    iconColor = "#FFD07A";
    bgColor = "bg-orange-50";
    countBgColor = "bg-orange-100";
    countTextColor = "text-orange-600";
  } else if (icon === "car") {
    iconColor = "#00AACC";
    bgColor = "bg-blue-50";
    countBgColor = "bg-blue-100";
    countTextColor = "text-blue-600";
  } else if (icon === "door") {
    iconColor = "#FF0000";
    bgColor = "bg-red-50";
    countBgColor = "bg-red-100";
    countTextColor = "text-red-600";
  } else if (icon === "pencil") {
    iconColor = "#00A0A0";
    bgColor = "bg-teal-50";
    countBgColor = "bg-teal-100";
    countTextColor = "text-teal-600";
  }

  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className={`mr-4 rounded-xl ${bgColor} p-3`}>
            <MaterialCommunityIcons name={icon} size={26} color={iconColor} />
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
        <View className={`rounded-full ${countBgColor} px-4 py-2`}>
          <Text className={`text-base font-bold ${countTextColor}`}>
            {count}
          </Text>
        </View>
      </View>
    </View>
  );
};

const SectionHeader = ({ title, more }) => (
  <View className="mb-4 w-full flex-row items-center justify-between">
    <Text className="text-xl font-bold tracking-tight text-gray-900">
      {title}
    </Text>
    <TouchableOpacity>
      <Text className="text-sm font-medium text-indigo-600">{more}</Text>
    </TouchableOpacity>
  </View>
);

const QuickAction = ({ title, icon, onPress }) => (
  <TouchableOpacity
    className="mr-3 flex-row items-center rounded-full bg-white px-4 py-2 shadow-sm"
    onPress={onPress}
  >
    <MaterialCommunityIcons name={icon} size={18} color="#4F46E5" />
    <Text className="ml-2 text-sm font-medium text-gray-700">{title}</Text>
  </TouchableOpacity>
);

const ActivityItem = ({ title, time, status, icon }) => (
  <View className="mb-3 flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm">
    <View className="flex-row items-center">
      <View className="mr-3 rounded-full bg-blue-50 p-2">
        <MaterialCommunityIcons name={icon} size={20} color="#4F46E5" />
      </View>
      <View>
        <Text className="text-sm font-medium text-gray-900">{title}</Text>
        <Text className="text-xs text-gray-500">{time}</Text>
      </View>
    </View>
    <View className="rounded-full bg-green-50 px-3 py-1">
      <Text className="text-xs font-medium text-green-700">{status}</Text>
    </View>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const requestSummary = useStore((state) => state.requestSummary);
  const user = useAuthStore((state) => state.user);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isExpanded, setIsExpanded] = React.useState(false);
  const heightValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    heightValue.value = withSpring(isExpanded ? 120 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 100,
    });
    rotateValue.value = withSpring(isExpanded ? 180 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 100,
    });
    opacityValue.value = withTiming(isExpanded ? 1 : 0, {
      duration: 200,
    });
  }, [isExpanded]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    maxHeight: heightValue.value,
    opacity: opacityValue.value,
  }));

  const animatedRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotateValue.value}deg` }],
  }));

  const formatGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Siang";
    return "Selamat Malam";
  };

  const menuItems = [
    { title: "Meal Order", key: "meals", icon: "food", route: "MealOrder" },
    { title: "Transport", key: "transport", icon: "car" },
    { title: "Rooms", key: "rooms", icon: "door" },
    { title: "Stationary", key: "stationary", icon: "pencil" },
  ];

  const extraMenuItems = [
    { title: "Event Meal", key: "event-meal", icon: "food-variant" },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header Section */}
      <View className="bg-white px-6 pb-8 pt-14 shadow-lg">
        <View className="absolute -left-[339px] -top-[840px] right-0 z-0">
          <FontAwesome name="circle" size={1250} color="#1c3a8a" />
        </View>
        <View className="absolute -right-2 -top-20 z-10 opacity-20">
          <FontAwesome name="bolt" size={400} color="darkblue" />
        </View>
        <View className="z-50 mb-1 flex-row items-center justify-between">
          <View>
            <Text className="mb-1 text-lg font-medium text-blue-100">
              {formatGreeting()}
            </Text>
            <Text className="text-3xl font-extrabold tracking-tight text-white">
              {user?.name?.replace("Sekretaris", "Sec.") || "User"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="mr-4 rounded-full bg-blue-800 p-2"
              onPress={() => navigation.navigate("Notification")}
            >
              <View className="absolute -right-1 -top-1 z-10 h-4 w-4 items-center justify-center rounded-full bg-red-500">
                <Text className="text-xs font-bold text-white">3</Text>
              </View>
              <MaterialCommunityIcons name="bell" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-gray-300"
              onPress={() => navigation.navigate("Profile")}
            >
              <MaterialCommunityIcons name="account" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="mb-2 text-base font-medium text-blue-100">
          Mau ngapain hari ini?
        </Text>
        <WeatherWidget currentTime={currentTime} />
      </View>

      <View className="w-full">
        {/* Services Section */}
        <View className="mx-4 -mt-14 shadow-xl">
          <View className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
            <View className="flex-row justify-between">
              {menuItems.map((item) => (
                <ServiceMenuItem
                  key={item.key}
                  title={item.title}
                  icon={item.icon}
                  route={item.route}
                />
              ))}
            </View>

            <Animated.View
              style={animatedContentStyle}
              className="overflow-hidden"
            >
              <View className="mt-4 flex-row justify-between border-t border-gray-100 pt-4">
                {extraMenuItems.map((item) => (
                  <ServiceExtraMenuItem
                    key={item.key}
                    title={item.title}
                    icon={item.icon}
                    route={item.route}
                  />
                ))}
              </View>
            </Animated.View>

            <TouchableOpacity
              className="mt-2 items-center"
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <Animated.View style={animatedRotateStyle}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color="#6B7280"
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-2 px-4 py-2">
          {/* Quick Actions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            <QuickAction
              title="Schedule Meeting"
              icon="calendar"
              onPress={() => {}}
            />
            <QuickAction
              title="Book Event"
              icon="calendar-star"
              onPress={() => {}}
            />
            <QuickAction
              title="File Request"
              icon="file-document"
              onPress={() => {}}
            />
            <QuickAction
              title="Contact Support"
              icon="headphones"
              onPress={() => {}}
            />
          </ScrollView>
        </View>

        {/* Main Content */}
        <View className="px-4 pb-4">
          {/* Active Orders */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between">
              <SectionHeader title="Active Orders" more="View All" />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ActiveOrderCard
                title="Lunch Order"
                orderNo="ORD-1234"
                status="In Preparation"
                eta="15 mins"
                icon="food"
                time="Ordered 10 mins ago"
              />
              <ActiveOrderCard
                title="Airport Pickup"
                orderNo="TRN-5678"
                status="In Progress"
                eta="25 mins"
                icon="car"
                time="Ordered 30 mins ago"
              />
              <ActiveOrderCard
                title="Meeting Room"
                orderNo="ROM-9012"
                status="Ready"
                eta="Available"
                icon="door"
                time="Booked for 2:00 PM"
              />
            </ScrollView>
          </View>

          {/* Request Summary Section */}
          <View className="mb-6">
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

          {/* Recent Activity Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between">
              <SectionHeader title="Recent Activity" more="View All" />
            </View>
            <ActivityItem
              title="Meal Order #1234"
              time="10 minutes ago"
              status="Approved"
              icon="food"
            />
            <ActivityItem
              title="Transport Request #5678"
              time="2 hours ago"
              status="Pending"
              icon="car"
            />
            <ActivityItem
              title="Room Booking #9012"
              time="Yesterday"
              status="Completed"
              icon="door"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
