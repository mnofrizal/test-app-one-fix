import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StepIndicator from "react-native-step-indicator";
import { create } from "zustand";
import { useNavigation } from "@react-navigation/native";

const useMealOrderStore = create((set) => ({
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  resetStep: () => set({ currentStep: 0 }),
}));

const labels = ["Detail", "Pemesan", "Menu", "Summary"];
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: "#007AFF",
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: "#007AFF",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#007AFF",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#007AFF",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#007AFF",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#007AFF",
};

const DetailStep = () => (
  <View className="p-4">
    <Text className="mb-4 text-base font-medium text-gray-800">
      Order Details
    </Text>
    {/* Add your detail form components here */}
    <Text className="text-gray-600">Detail form will be implemented here</Text>
  </View>
);

const PemesanStep = () => (
  <View className="p-4">
    <Text className="mb-4 text-base font-medium text-gray-800">
      Pemesan Information
    </Text>
    {/* Add your pemesan form components here */}
    <Text className="text-gray-600">Pemesan form will be implemented here</Text>
  </View>
);

const MenuStep = () => (
  <View className="p-4">
    <Text className="mb-4 text-base font-medium text-gray-800">
      Select Menu
    </Text>
    {/* Add your menu selection components here */}
    <Text className="text-gray-600">
      Menu selection will be implemented here
    </Text>
  </View>
);

const SummaryStep = () => (
  <View className="p-4">
    <Text className="mb-4 text-base font-medium text-gray-800">
      Order Summary
    </Text>
    {/* Add your summary components here */}
    <Text className="text-gray-600">
      Order summary will be implemented here
    </Text>
  </View>
);

const MealOrderScreen = () => {
  const navigation = useNavigation();
  const { currentStep, setCurrentStep, resetStep } = useMealOrderStore();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DetailStep />;
      case 1:
        return <PemesanStep />;
      case 2:
        return <MenuStep />;
      case 3:
        return <SummaryStep />;
      default:
        return <DetailStep />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-6">
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={4}
        />
      </View>

      <ScrollView className="flex-1">{renderStep()}</ScrollView>

      <View className="bg-white p-4 shadow-sm">
        <TouchableOpacity
          className="w-full rounded-lg bg-blue-500 py-4"
          onPress={() => {
            if (currentStep === 3) {
              resetStep();
              navigation.replace("MealOrderSuccess");
            } else {
              setCurrentStep(Math.min(3, currentStep + 1));
            }
          }}
        >
          <Text className="text-center font-medium text-white">
            {currentStep === 3 ? "Submit Order" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MealOrderScreen;
