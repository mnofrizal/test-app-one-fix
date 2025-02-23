import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";

const SkeletonItem = ({ style }) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: "#E5E7EB",
      position: "relative",
      overflow: "hidden",
      ...style,
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#F3F4F6",
      transform: [
        {
          translateX: interpolate(shimmer.value, [0, 1], [-100, 100]),
        },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Animated.View style={shimmerStyle} />
    </Animated.View>
  );
};

const SkeletonWhatsappSetting = () => {
  return (
    <View className="flex-1 bg-white p-4">
      {/* Server Status Section */}
      <View className="mb-6">
        <SkeletonItem
          style={{
            width: 180,
            height: 28,
            borderRadius: 4,
            marginBottom: 16,
          }}
        />
        <SkeletonItem
          style={{
            width: "100%",
            height: 56,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Notification Settings Section */}
      <View className="flex-1">
        <SkeletonItem
          style={{
            width: 200,
            height: 28,
            borderRadius: 4,
            marginBottom: 16,
          }}
        />

        {/* Admin Group Item */}
        <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
          <View className="flex-1">
            <SkeletonItem
              style={{
                width: 120,
                height: 20,
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <SkeletonItem
              style={{
                width: 100,
                height: 16,
                borderRadius: 4,
              }}
            />
          </View>
          <SkeletonItem
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
            }}
          />
        </View>

        {/* Kitchen Group Item */}
        <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
          <View className="flex-1">
            <SkeletonItem
              style={{
                width: 120,
                height: 20,
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <SkeletonItem
              style={{
                width: 100,
                height: 16,
                borderRadius: 4,
              }}
            />
          </View>
          <SkeletonItem
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
            }}
          />
        </View>

        {/* Notif Group Item */}
        <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
          <View className="flex-1">
            <SkeletonItem
              style={{
                width: 120,
                height: 20,
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <SkeletonItem
              style={{
                width: 100,
                height: 16,
                borderRadius: 4,
              }}
            />
          </View>
          <SkeletonItem
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default SkeletonWhatsappSetting;
