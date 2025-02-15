import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import StackNavigator from "./src/navigation/StackNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {/* <SafeAreaProvider style={{ backgroundColor: "black" }}> */}
        <NavigationContainer>
          <StackNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
        {/* </SafeAreaProvider> */}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
