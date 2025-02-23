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

const SkeletonActiveOrderCard = () => {
  return (
    <View className="mr-4 w-72 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
      <View className="absolute right-2 top-2">
        <SkeletonItem style={{ width: 40, height: 24, borderRadius: 4 }} />
      </View>
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <SkeletonItem style={{ width: 40, height: 40, borderRadius: 12 }} />
          <View className="ml-3">
            <SkeletonItem
              style={{
                width: 100,
                height: 16,
                borderRadius: 4,
                marginBottom: 4,
              }}
            />
            <SkeletonItem style={{ width: 180, height: 12, borderRadius: 4 }} />
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
        <SkeletonItem style={{ width: 80, height: 16, borderRadius: 4 }} />
        <SkeletonItem style={{ width: 80, height: 24, borderRadius: 999 }} />
      </View>
    </View>
  );
};

export const SkeletonActiveOrderList = () => {
  return (
    <View className="flex-row">
      {[1, 2, 3].map((key) => (
        <SkeletonActiveOrderCard key={key} />
      ))}
    </View>
  );
};

export default SkeletonActiveOrderCard;
