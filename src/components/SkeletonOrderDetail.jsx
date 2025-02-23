import React from "react";
import { View, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
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

const DetailTabSkeleton = () => (
  <View className="flex-1 bg-gray-50">
    <View className="bg-white py-4">
      <View className="px-4">
        <SkeletonItem style={{ width: 100, height: 16, marginBottom: 12 }} />
        <View className="flex-row items-center">
          <SkeletonItem
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
          />
          <View>
            <SkeletonItem style={{ width: 80, height: 16, marginBottom: 4 }} />
            <SkeletonItem style={{ width: 120, height: 12 }} />
          </View>
        </View>
      </View>
    </View>

    <View className="mt-2 bg-white">
      {[1, 2, 3].map((i) => (
        <View key={i} className="border-b border-gray-100 px-4 py-4">
          <SkeletonItem style={{ width: 120, height: 16, marginBottom: 12 }} />
          <SkeletonItem style={{ width: 200, height: 20, marginBottom: 8 }} />
          <View className="flex-row items-center">
            <SkeletonItem
              style={{ width: 16, height: 16, borderRadius: 8, marginRight: 8 }}
            />
            <SkeletonItem style={{ width: 150, height: 14 }} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

const MenuTabSkeleton = () => (
  <View className="flex-1 bg-gray-50">
    <View className="bg-white px-4 py-3">
      <SkeletonItem style={{ width: 80, height: 14, marginBottom: 4 }} />
      <SkeletonItem style={{ width: 100, height: 24 }} />
    </View>

    <View className="mt-2">
      {[1, 2].map((employeeIndex) => (
        <View key={employeeIndex} className="mb-2 bg-white">
          <View className="border-b border-gray-100 px-4 py-3">
            <View className="flex-row items-center">
              <SkeletonItem
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginRight: 12,
                }}
              />
              <View>
                <SkeletonItem
                  style={{ width: 120, height: 16, marginBottom: 4 }}
                />
                <SkeletonItem style={{ width: 80, height: 12 }} />
              </View>
            </View>
          </View>

          {[1, 2].map((itemIndex) => (
            <View
              key={itemIndex}
              className="border-b border-gray-100 px-4 py-3"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <SkeletonItem
                    style={{ width: 160, height: 20, marginBottom: 8 }}
                  />
                  <SkeletonItem style={{ width: 120, height: 14 }} />
                </View>
                <SkeletonItem
                  style={{ width: 40, height: 24, borderRadius: 12 }}
                />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  </View>
);

const ApprovalTabSkeleton = () => (
  <View className="flex-1 bg-gray-50">
    <View className="bg-white py-3">
      <View className="px-4">
        <SkeletonItem style={{ width: 120, height: 16 }} />
      </View>
    </View>

    <View className="mt-2">
      {[1, 2, 3].map((i) => (
        <View key={i} className="mb-2 bg-white">
          <View className="flex-row items-start px-4 py-4">
            <SkeletonItem
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 16,
              }}
            />
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <View>
                  <SkeletonItem
                    style={{ width: 140, height: 20, marginBottom: 8 }}
                  />
                  <SkeletonItem style={{ width: 160, height: 14 }} />
                </View>
                <SkeletonItem
                  style={{ width: 80, height: 24, borderRadius: 12 }}
                />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const SkeletonOrderDetail = () => {
  const layout = Dimensions.get("window");
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "detail", title: "Detail" },
    { key: "menu", title: "Menu" },
    { key: "approval", title: "Approval" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "detail":
        return <DetailTabSkeleton />;
      case "menu":
        return <MenuTabSkeleton />;
      case "approval":
        return <ApprovalTabSkeleton />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#4F46E5" }}
      style={{ backgroundColor: "white" }}
      labelStyle={{ color: "#374151", fontWeight: "500" }}
      activeColor="#4F46E5"
      inactiveColor="#6B7280"
    />
  );

  return (
    <View className="flex-1 bg-white">
      <View className="bg-blue-800 px-4 pb-6 pt-14 shadow-sm">
        <View className="mb-2 flex-row items-center">
          <SkeletonItem
            style={{ width: 64, height: 64, borderRadius: 32, marginRight: 12 }}
          />
          <View>
            <SkeletonItem
              style={{
                width: 80,
                height: 24,
                marginBottom: 8,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            />
            <SkeletonItem
              style={{
                width: 160,
                height: 32,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            />
          </View>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};
