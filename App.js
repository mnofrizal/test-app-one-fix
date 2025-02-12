import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { PortalProvider } from "@gorhom/portal";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import StackNavigator from "./src/navigation/StackNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <PortalProvider>
          <BottomSheetModalProvider>
            <StackNavigator />
            <StatusBar style="auto" />
          </BottomSheetModalProvider>
        </PortalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
