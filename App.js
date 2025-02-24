import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import StackNavigator from "./src/navigation/StackNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "./src/store/authStore";
import useNotificationStore from "./src/store/notificationStore";
import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
} from "./src/services/pushNotificationService";
import { handleNotificationNavigation } from "./src/constants/notificationTypes";

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

Text.defaultProps = {
  ...Text.defaultProps,
  style: {
    fontFamily: "Poppins_400Regular",
  },
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const navigationRef = useNavigationContainerRef();
  const setExpoPushToken = useNotificationStore(
    (state) => state.setExpoPushToken
  );
  const handleNewNotification = useNotificationStore(
    (state) => state.handleNewNotification
  );
  const notificationListener = useRef();
  const responseListener = useRef();
  const initializeAuth = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Notification setup effect
  useEffect(() => {
    let isMounted = true;

    // Skip notification setup if auth is not ready
    if (!isReady) {
      return;
    }

    // Clean up old listeners if they exist
    if (notificationListener.current) {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    }
    if (responseListener.current) {
      Notifications.removeNotificationSubscription(responseListener.current);
    }
    // Handle notifications received while app is foregrounded
    notificationListener.current = addNotificationReceivedListener(
      (notification) => {
        handleNewNotification(notification);
      }
    );

    // Handle notification responses (when user taps notification)
    responseListener.current = addNotificationResponseListener((response) => {
      const { data } = response.notification.request.content;
      handleNewNotification(response.notification);

      // Only process if component is still mounted
      if (isMounted) {
        console.log("Current user role:", user?.role);

        // Handle navigation if notification has data and navigation is ready
        if (data && navigationRef.current) {
          handleNotificationNavigation(navigationRef.current, data, user?.role);
        }
      }
    });

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        notificationListener.current = null;
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
        responseListener.current = null;
      }
    };
  }, [user, isReady, navigationRef, handleNewNotification]);

  // App initialization effect
  useEffect(() => {
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
        <NavigationContainer ref={navigationRef}>
          <StackNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
        {/* </SafeAreaProvider> */}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
