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

const SkeletonOrderCard = () => {
  return (
    <View className="mb-4 overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-lg">
      <View className="px-5 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="ml-3 flex-1">
              <View className="flex-row items-center justify-between">
                <SkeletonItem
                  style={{
                    width: 100,
                    height: 24,
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />

                <SkeletonItem
                  style={{ width: 60, height: 24, borderRadius: 4 }}
                />
              </View>
              <View className="mt-2 flex-row items-center justify-between">
                <SkeletonItem
                  style={{ width: 230, height: 16, borderRadius: 4 }}
                />
              </View>
              <View className="mt-2 flex-row items-center justify-between">
                <SkeletonItem
                  style={{ width: 80, height: 16, borderRadius: 4 }}
                />
              </View>
              <View className="mt-2 flex-row items-center justify-between">
                <SkeletonItem
                  style={{ width: 150, height: 16, borderRadius: 4 }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export const SkeletonOrderList = () => {
  return (
    <View className="">
      {[1, 2, 3].map((key) => (
        <SkeletonOrderCard key={key} />
      ))}
    </View>
  );
};

export default SkeletonOrderCard;
