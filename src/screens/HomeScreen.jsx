import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const ProgressBar = ({ progress, color = "#4F46E5" }) => (
  <View className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
    <View
      className="h-full rounded-full"
      style={{ width: `${progress}%`, backgroundColor: color }}
    />
  </View>
);

const TaskProgress = ({ title, total, completed, color }) => (
  <View className="mb-3">
    <View className="mb-2 flex-row justify-between">
      <Text className="text-sm font-medium text-gray-700">{title}</Text>
      <Text className="text-sm font-medium text-gray-500">
        {completed}/{total}
      </Text>
    </View>
    <ProgressBar progress={(completed / total) * 100} color={color} />
  </View>
);

const PopularService = ({ title, rating, users, icon, bgColor, iconColor }) => (
  <TouchableOpacity className="mr-4 w-40 rounded-xl bg-white p-4 shadow-sm">
    <View
      className={`mb-3 h-12 w-12 items-center justify-center rounded-full ${bgColor}`}
    >
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
    </View>
    <Text className="mb-1 text-sm font-semibold text-gray-900">{title}</Text>
    <View className="flex-row items-center">
      <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
      <Text className="ml-1 text-sm font-medium text-gray-600">{rating}</Text>
      <Text className="ml-2 text-xs text-gray-500">{users} users</Text>
    </View>
  </TouchableOpacity>
);

const ExpenseSummary = ({ title, amount, trend, icon }) => (
  <View className="mr-4 w-40 rounded-xl bg-white p-4 shadow-sm">
    <View className="mb-2 flex-row items-center">
      <MaterialCommunityIcons name={icon} size={20} color="#4F46E5" />
      <Text className="ml-2 text-xs font-medium text-gray-500">{title}</Text>
    </View>
    <Text className="text-lg font-bold text-gray-900">${amount}</Text>
    <View className="mt-1 flex-row items-center">
      <MaterialCommunityIcons
        name={trend > 0 ? "trending-up" : "trending-down"}
        size={16}
        color={trend > 0 ? "#059669" : "#DC2626"}
      />
      <Text
        className={`ml-1 text-xs font-medium ${
          trend > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {Math.abs(trend)}%
      </Text>
    </View>
  </View>
);

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const WeatherWidget = ({ currentTime }) => (
  <View className="mt-2 flex-row items-center justify-between rounded-xl bg-blue-700/30 p-3 pb-10 shadow-xl">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name="weather-sunny" size={24} color="white" />
      <View className="ml-3">
        <Text className="text-lg font-bold text-white">28°C</Text>
        <Text className="text-sm text-blue-100">Jakarta, Clear Sky</Text>
      </View>
    </View>
    <Text className="mb-2 text-2xl font-medium text-white">
      {formatTime(currentTime)}
    </Text>
  </View>
);

const StatCard = ({ title, value, icon, trend }) => (
  <View className="mr-4 w-36 rounded-xl bg-white p-4 shadow-sm">
    <View className="mb-2 flex-row items-center justify-between">
      <MaterialCommunityIcons name={icon} size={24} color="#4F46E5" />
      {trend && (
        <View className="flex-row items-center rounded-full bg-green-50 px-2 py-1">
          <MaterialCommunityIcons
            name="trending-up"
            size={16}
            color="#059669"
          />
          <Text className="ml-1 text-xs font-medium text-green-700">
            {trend}
          </Text>
        </View>
      )}
    </View>
    <Text className="text-sm font-medium text-gray-500">{title}</Text>
    <Text className="mt-1 text-lg font-bold text-gray-900">{value}</Text>
  </View>
);

const AnnouncementCard = ({ title, description, time, type }) => (
  <TouchableOpacity className="mb-3 rounded-xl bg-white p-4 shadow-sm">
    <View className="mb-2 flex-row items-center">
      <View className="rounded-full bg-blue-50 p-2">
        <MaterialCommunityIcons
          name={type === "event" ? "calendar-star" : "bullhorn"}
          size={20}
          color="#4F46E5"
        />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        <Text className="text-xs text-gray-500">{time}</Text>
      </View>
    </View>
    <Text className="text-sm text-gray-600">{description}</Text>
  </TouchableOpacity>
);

const EventCard = ({ title, date, time, location }) => (
  <View className="mr-4 w-72 rounded-xl bg-white p-4 shadow-sm">
    <View className="mb-3 flex-row items-center justify-between">
      <View className="rounded-full bg-indigo-50 p-2">
        <MaterialCommunityIcons
          name="calendar-blank"
          size={20}
          color="#4F46E5"
        />
      </View>
      <TouchableOpacity className="rounded-full bg-indigo-50 px-3 py-1">
        <Text className="text-xs font-medium text-indigo-600">
          Add to Calendar
        </Text>
      </TouchableOpacity>
    </View>
    <Text className="mb-1 text-base font-semibold text-gray-900">{title}</Text>
    <View className="mb-1 flex-row items-center">
      <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
      <Text className="ml-1 text-sm text-gray-500">
        {date} - {time}
      </Text>
    </View>
    <View className="flex-row items-center">
      <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
      <Text className="ml-1 text-sm text-gray-500">{location}</Text>
    </View>
  </View>
);

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

const SectionHeader = ({ title }) => (
  <Text className="mb-5 text-xl font-bold tracking-tight text-gray-900">
    {title}
  </Text>
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
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const menuItems = [
    { title: "Meal Order", key: "meals", icon: "food" },
    { title: "Transport", key: "transport", icon: "car" },
    { title: "Rooms", key: "rooms", icon: "door" },
    { title: "Stationary", key: "stationary", icon: "pencil" },
  ];

  const extraMenuItems = [
    { title: "Event Meal", key: "event-meal", icon: "food-variant" },
    { title: "Car Rental", key: "car-rental", icon: "car-estate" },
    { title: "Auditorium", key: "auditorium", icon: "theater" },
    { title: "Office Supply", key: "office", icon: "office-building" },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header Section */}
      <View className="bg-blue-900 px-6 pb-8 pt-14 shadow-lg">
        <View className="mb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-medium text-blue-100">
              {formatGreeting()}
            </Text>
            <Text className="text-3xl font-extrabold tracking-tight text-white">
              John Doe
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="mr-4 rounded-full bg-blue-800 p-2"
              onPress={() => navigation.navigate("Notifications")}
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
          What would you like to do today?
        </Text>
        <WeatherWidget currentTime={currentTime} />
      </View>

      <View className="w-full">
        {/* Services Section */}
        <View className="mx-3 -mt-14 shadow-xl">
          <View className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
            <View className="flex-row justify-between">
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

            <Animated.View
              style={animatedContentStyle}
              className="overflow-hidden"
            >
              <View className="mt-4 flex-row justify-between border-t border-gray-100 pt-4">
                {extraMenuItems.map((item) => (
                  <ServiceMenuItem
                    key={item.key}
                    title={item.title}
                    icon={item.icon}
                    onPress={() => {
                      if (item.key === "event-meal") {
                        navigation.navigate("MealOrder");
                      }
                    }}
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
        <View className="mt-2 px-3 py-2">
          <View className="mb-4 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
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
            <View className="mb-5 flex-row items-center justify-between">
              <SectionHeader title="Active Orders" />
              <TouchableOpacity>
                <Text className="text-sm font-medium text-indigo-600">
                  View Map
                </Text>
              </TouchableOpacity>
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

          {/* Statistics Section */}
          <View className="mb-6">
            <SectionHeader title="Monthly Statistics" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <StatCard
                title="Total Requests"
                value="248"
                icon="chart-bar"
                trend="12%"
              />
              <StatCard
                title="Approval Rate"
                value="94.2%"
                icon="check-circle"
                trend="5%"
              />
              <StatCard
                title="Response Time"
                value="1.2h"
                icon="clock-fast"
                trend="18%"
              />
              <StatCard
                title="Active Users"
                value="1,234"
                icon="account-group"
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

          {/* Upcoming Events Section */}
          <View className="mb-6">
            <SectionHeader title="Upcoming Events" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <EventCard
                title="Company Town Hall"
                date="Feb 15, 2024"
                time="10:00 AM"
                location="Main Auditorium"
              />
              <EventCard
                title="Team Building Event"
                date="Feb 18, 2024"
                time="09:00 AM"
                location="Recreation Center"
              />
              <EventCard
                title="Product Launch"
                date="Feb 20, 2024"
                time="02:00 PM"
                location="Conference Room A"
              />
            </ScrollView>
          </View>

          {/* Announcements Section */}
          {/* <View className="mb-6">
            <SectionHeader title="Announcements" />
            <AnnouncementCard
              title="System Maintenance Notice"
              description="Scheduled maintenance will be performed on Feb 16, 2024. Some services may be unavailable during this time."
              time="2 hours ago"
              type="announcement"
            />
            <AnnouncementCard
              title="New Feature Release"
              description="Check out our latest update with improved request tracking and notifications."
              time="1 day ago"
              type="announcement"
            />
          </View> */}

          {/* Quick Expense Overview */}
          {/* <View className="mb-6">
            <SectionHeader title="Expense Overview" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ExpenseSummary
                title="Today's Expenses"
                amount="1,234"
                trend={8}
                icon="calendar-today"
              />
              <ExpenseSummary
                title="This Week"
                amount="5,678"
                trend={-3}
                icon="calendar-week"
              />
              <ExpenseSummary
                title="This Month"
                amount="15,890"
                trend={12}
                icon="calendar-month"
              />
            </ScrollView>
          </View> */}

          {/* Popular Services */}
          <View className="mb-6">
            <SectionHeader title="Popular Services" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <PopularService
                title="Meal Delivery"
                rating="4.9"
                users="1.2k"
                icon="food"
                bgColor="bg-orange-50"
                iconColor="#FFD07A"
              />
              <PopularService
                title="Meeting Rooms"
                rating="4.8"
                users="890"
                icon="door"
                bgColor="bg-red-50"
                iconColor="#FF0000"
              />
              <PopularService
                title="Airport Pickup"
                rating="4.7"
                users="650"
                icon="car"
                bgColor="bg-blue-50"
                iconColor="#00AACC"
              />
            </ScrollView>
          </View>

          {/* Tasks Progress */}
          <View className="mb-6">
            <SectionHeader title="Tasks Progress" />
            <View className="rounded-xl bg-white p-4 shadow-sm">
              <TaskProgress
                title="Pending Approvals"
                total={20}
                completed={15}
                color="#4F46E5"
              />
              <TaskProgress
                title="Meal Orders"
                total={50}
                completed={42}
                color="#FFD07A"
              />
              <TaskProgress
                title="Transport Requests"
                total={30}
                completed={28}
                color="#00AACC"
              />
              <TaskProgress
                title="Room Bookings"
                total={25}
                completed={20}
                color="#FF0000"
              />
            </View>
          </View>

          {/* Recent Activity Section */}
          <View className="mb-6">
            <View className="mb-5 flex-row items-center justify-between">
              <SectionHeader title="Recent Activity" />
              <TouchableOpacity>
                <Text className="text-sm font-medium text-indigo-600">
                  View All
                </Text>
              </TouchableOpacity>
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
