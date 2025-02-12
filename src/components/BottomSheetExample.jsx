import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet from "./BottomSheet";

const BottomSheetExample = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="m-4 rounded-lg bg-blue-500 p-4"
      >
        <Text className="text-center text-white">Open Bottom Sheet</Text>
      </TouchableOpacity>

      <BottomSheet
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        snapPoints={["25%", "50%", "90%"]}
      >
        <View className="space-y-4">
          <Text className="text-xl font-semibold">Bottom Sheet Title</Text>

          {/* Example content */}
          {Array.from({ length: 20 }).map((_, index) => (
            <View key={index} className="rounded-lg bg-gray-100 p-4">
              <Text>Item {index + 1}</Text>
            </View>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
};

export default BottomSheetExample;
