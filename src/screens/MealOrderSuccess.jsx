import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeInDown,
  runOnJS,
} from "react-native-reanimated";
import { useMealOrderStore } from "../store/mealOrderStore";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CENTER_POSITION = SCREEN_HEIGHT / 2 - 100;
const TOP_POSITION = 80;

const OrderDetail = ({ label, value, icon }) => (
  <View className="mb-4 flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm">
    <View className="flex-row items-center">
      <View className="rounded-lg bg-indigo-50 p-2">
        <MaterialCommunityIcons name={icon} size={20} color="#4F46E5" />
      </View>
      <Text className="ml-3 text-base font-medium text-gray-600">{label}</Text>
    </View>
    <Text className="text-base font-semibold text-gray-900">{value}</Text>
  </View>
);

const MealOrderSuccess = () => {
  const navigation = useNavigation();
  const formData = useMealOrderStore((state) => state.formData);
  const [showContent, setShowContent] = React.useState(false);

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Initial animation: Show check in center
    scale.value = withTiming(1, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // After check appears, move it up and show content
    setTimeout(() => {
      translateY.value = withTiming(-CENTER_POSITION + TOP_POSITION, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      runOnJS(setShowContent)(true);
    }, 800);
  }, []);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleShare = () => {
    console.log("Share order details");
  };

  const totalCount = Object.values(formData.entityCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Centered check mark that moves up */}
      <Animated.View
        className="absolute left-0 right-0 top-1/2 -mt-24 items-center justify-center"
        style={checkmarkStyle}
      >
        <View className="absolute h-32 w-32 rounded-full bg-green-100" />
        <MaterialCommunityIcons name="check-circle" size={80} color="#22C55E" />
      </Animated.View>

      {showContent && (
        <>
          {/* Content */}
          <View className="flex-1 px-6" style={{ marginTop: 190 }}>
            <Animated.View entering={FadeInDown.duration(600)} className="mb-6">
              <Text className="mb-2 text-center text-2xl font-bold text-gray-800">
                Order Successful!
              </Text>
              <Text className="text-center text-base text-gray-600">
                Your meal order has been successfully submitted.
              </Text>
            </Animated.View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Animated.View
                className="rounded-2xl bg-white p-6 shadow-md"
                entering={FadeInDown.duration(600).delay(200)}
              >
                <Text className="mb-4 text-lg font-semibold text-gray-900">
                  Order Summary
                </Text>
                <OrderDetail label="Order ID" value="#ORD123456" icon="pound" />
                <OrderDetail
                  label="Total Orders"
                  value={totalCount}
                  icon="account-group"
                />
                <OrderDetail
                  label="Job Title"
                  value={formData.judulPekerjaan}
                  icon="briefcase"
                />
                <OrderDetail
                  label="Drop Point"
                  value={formData.dropPoint}
                  icon="map-marker"
                />
                <OrderDetail
                  label="Time"
                  value={new Date().toLocaleTimeString()}
                  icon="clock"
                />
              </Animated.View>
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <Animated.View
            className="bg-white p-6 shadow-lg"
            entering={FadeInDown.duration(600).delay(400)}
          >
            <TouchableOpacity
              className="mb-4 w-full flex-row items-center justify-center rounded-xl bg-indigo-600 p-4 shadow-sm"
              onPress={handleShare}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="font-medium text-white">
                Share Order Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-xl border-2 border-indigo-600 bg-white p-4"
              onPress={() => navigation.navigate("MainTabs")}
            >
              <MaterialCommunityIcons
                name="home"
                size={20}
                color="#4F46E5"
                style={{ marginRight: 8 }}
              />
              <Text className="font-medium text-indigo-600">Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default MealOrderSuccess;
