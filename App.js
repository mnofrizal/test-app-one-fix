import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import StackNavigator from "./src/navigation/StackNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "./src/store/authStore";

Text.defaultProps = {
  ...Text.defaultProps,
  style: {
    fontFamily: "Poppins_400Regular",
  },
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initialize);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Initialize auth state
        await initializeAuth();
        setIsReady(true);
      } catch (error) {
        console.error("Error during app initialization:", error);
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded || !isReady) {
    return null;
  }

  // Only hide splash screen when everything is ready
  Promise.resolve(SplashScreen.hideAsync());
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
