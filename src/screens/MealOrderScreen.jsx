import React, { useEffect, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  BackHandler,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { submitOrder } from "../services/orderService";
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
import { useEmployeeStore } from "../store/employeeStore";
import {
  isDetailStepValid,
  isPemesanStepValid,
  isMenuStepValid,
} from "../store/mealOrderStore";
import DetailStepRefined from "../components/meal-order/DetailStepRefined";

const MealOrderScreen = () => {
  const navigation = useNavigation();
  const { currentStep, setCurrentStep, resetStep, formData } =
    useMealOrderStore();
  const { fetchEmployees, initializeStore } = useEmployeeStore();

  // Initialize employee data when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        await initializeStore();
        await fetchEmployees();
      };
      loadData();
    }, [])
  );

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

  // Calculate total count for Pemesan step
  const totalCount = React.useMemo(() => {
    if (currentStep !== 1) return 0;
    return Object.values(formData.entityCounts).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [currentStep, formData.entityCounts]);

  // Reset form data when component mounts
  useEffect(() => {
    resetStep();
  }, [resetStep]);

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

  const handleSubmit = async () => {
    try {
      // Prepare base payload
      const basePayload = {
        judulPekerjaan: formData.judulPekerjaan,
        type: formData.type,
        requestDate: new Date().toISOString(),
        requiredDate: new Date().toISOString(),
        category: formData.category,
        dropPoint: formData.dropPoint,
        supervisor: formData.supervisor,
        pic: formData.pic,
      };

      // Prepare employee orders
      let employeeOrders;
      if (formData.orderType === "bulk") {
        // Transform bulk order to individual employee orders
        employeeOrders = Object.entries(formData.selectedEntities)
          .filter(([_, isSelected]) => isSelected)
          .flatMap(([entity]) => {
            const count = formData.entityCounts[entity];
            return Array.from({ length: count }).map((_, index) => ({
              employeeName:
                entity === "PLNIP" ? "Pegawai PLNIP" : `Pegawai ${entity}`,
              entity,
              items: [
                {
                  menuItemId: formData.bulkOrder.menuItemId,
                  quantity: 1,
                },
              ],
            }));
          });
      } else {
        // Transform detail orders
        employeeOrders = formData.employeeOrders
          .sort((a, b) => {
            if (a.entity !== b.entity) return a.entity.localeCompare(b.entity);
            return a.index - b.index;
          })
          .map((order) => ({
            employeeName: order.employeeName,
            entity: order.entity,
            items: order.items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: 1,
            })),
          }));
      }

      // Combine into final payload
      const finalPayload = {
        ...basePayload,
        employeeOrders,
      };

      // Submit order to backend
      const response = await submitOrder(finalPayload);

      if (!response.success) {
        throw new Error(response.message || "Failed to submit order");
      }

      // Only proceed if submission was successful
      resetStep();
      navigation.replace("MealOrderSuccess", {
        orderData: {
          ...finalPayload,
          id: response.data.id,
        },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to submit order. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DetailStepRefined />;
      case 1:
        return <PemesanStep />;
      case 2:
        return <MenuStep />;
      case 3:
        return <SummaryStep />;
      default:
        return <DetailStepRefined />;
    }
  };

  return (
    <View className="flex-1 bg-blue-900">
      <View className="bg-blue-900 pt-8 shadow-sm">
        <View className="flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full p-2"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#ffff" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">
            Pesan Makanan
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <View className="bg-white px-6 py-4 shadow-sm">
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={4}
          renderStepIndicator={({ position, stepStatus }) => {
            const iconNames = [
              "clipboard-text-outline",
              "account-multiple",
              "food",
              "check-circle",
            ];
            const iconSize = stepStatus === "current" ? 24 : 20;
            const iconColor =
              stepStatus === "unfinished"
                ? "#94A3B8"
                : stepStatus === "current"
                ? "#1c40af"
                : "#ffffff";

            return (
              <MaterialCommunityIcons
                name={iconNames[position]}
                size={iconSize}
                color={iconColor}
              />
            );
          }}
        />
      </View>

      <View className="flex-1 bg-white">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          {renderStep()}
        </ScrollView>
        {canProceed() && (
          <View className="bg-white shadow-lg">
            {currentStep === 1 && totalCount > 0 && (
              <View className="flex-row items-center justify-between border-b border-t border-gray-100 p-3">
                <View className="flex-row items-center">
                  <View className="rounded-xl bg-indigo-100 p-2">
                    <MaterialCommunityIcons
                      name="account-group"
                      size={24}
                      color="#4F46E5"
                    />
                  </View>
                  <View className="ml-3">
                    <Text className="text-base font-semibold text-gray-900">
                      Total Pemesanan
                    </Text>
                    <Text className="text-sm font-medium text-slate-500">
                      Jumlah Pesanan
                    </Text>
                  </View>
                </View>
                <View className="rounded-full bg-indigo-100 px-4 py-2">
                  <Text className="text-base font-bold text-indigo-600">
                    {totalCount}
                  </Text>
                </View>
              </View>
            )}
            <View className="p-4">
              <TouchableOpacity
                className={`w-full rounded-xl py-3 ${
                  canProceed() ? "bg-blue-900 shadow-md" : "bg-slate-300"
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
                <Text className="text-center text-lg font-semibold text-white">
                  {currentStep === 3 ? "Submit Order" : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MealOrderScreen;
