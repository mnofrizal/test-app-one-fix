import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import StepIndicator from "react-native-step-indicator";

import { DetailStep } from "../components/meal-order/DetailStep";
import { PemesanStep } from "../components/meal-order/PemesanStep";
import { MenuStep } from "../components/meal-order/MenuStep";
import { SummaryStep } from "../components/meal-order/SummaryStep";
import {
  customStyles,
  labels,
} from "../components/meal-order/StepIndicatorStyle";
import { useMealOrderStore } from "../store/mealOrderStore";
import {
  isDetailStepValid,
  isPemesanStepValid,
  isMenuStepValid,
} from "../store/mealOrderStore";

const MealOrderScreen = () => {
  const navigation = useNavigation();
  const { currentStep, setCurrentStep, resetStep, formData } =
    useMealOrderStore();

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return isDetailStepValid(formData);
      case 1:
        return isPemesanStepValid(formData);
      case 2:
        return isMenuStepValid(formData);
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Split useEffect for initialization and back handler
  useEffect(() => {
    // Reset form data when component mounts
    resetStep();
  }, []);

  // Separate useEffect for back handler to update when currentStep changes
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Only handle back press if we're not on the first step
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior on first step
      }
    );

    return () => backHandler.remove();
  }, [currentStep, setCurrentStep]); // Include dependencies

  const handleSubmit = () => {
    console.log("Submitting order with data:", {
      judulPekerjaan: formData.judulPekerjaan,
      type: formData.type,
      category: formData.category,
      dropPoint: formData.dropPoint,
      supervisor: formData.supervisor,
      pic: formData.pic,
      orderType: formData.orderType,
      orders:
        formData.orderType === "bulk"
          ? {
              type: "bulk",
              menuItemId: formData.bulkOrder.menuItemId,
              note: formData.bulkOrder.note,
              entities: Object.entries(formData.selectedEntities)
                .filter(([_, isSelected]) => isSelected)
                .map(([entity]) => ({
                  entity,
                  count: formData.entityCounts[entity],
                })),
            }
          : {
              type: "detail",
              orders: formData.employeeOrders.sort((a, b) => {
                if (a.entity !== b.entity) {
                  return a.entity.localeCompare(b.entity);
                }
                return a.index - b.index;
              }),
            },
    });

    // Reset form data and navigate to success screen
    resetStep();
    navigation.replace("MealOrderSuccess");
  };

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
          className={`w-full rounded-lg py-4 ${
            canProceed() ? "bg-blue-500" : "bg-gray-300"
          }`}
          disabled={!canProceed()}
          onPress={() => {
            if (currentStep === 3) {
              handleSubmit();
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
