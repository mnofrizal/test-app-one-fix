import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Keyboard,
} from "react-native";
import ErrorAlert from "../components/ErrorAlert";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { login, isLoading, error, errors } = useAuthStore();
  const [errorVisible, setErrorVisible] = useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) return;
    const success = await login(username, password);
    if (!success) {
      setErrorVisible(true);
    }
  };

  const getErrorMessage = () => {
    if (errors?.length > 0) {
      return errors[0].message;
    }
    return error || "An unknown error occurred";
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-700">
      <StatusBar barStyle="light-content" bakgroundColor="#1E40AF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="absolute -left-[240px] -top-32 right-0 items-center justify-center opacity-50">
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={1100}
            color="#1E40AF"
          />
        </View>
        {/* <View className="top-38 absolute right-20 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={48}
            color="#1E40AF"
          />
        </View> */}

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <View className="flex-1 justify-center px-6">
            {/* Header */}
            <View
              className={`items-start ${keyboardVisible ? "mb-4" : "mb-6"}`}
            >
              {!keyboardVisible && (
                <>
                  <Text
                    className={`text-5xl font-extrabold text-white py-2  ${
                      keyboardVisible ? "mb-2" : ""
                    }`}
                  >
                    Sign in to
                  </Text>
                  <Text
                    className={`text-5xl font-extrabold text-white py-2  ${
                      keyboardVisible ? "mb-2" : ""
                    }`}
                  >
                    your Account
                  </Text>

                  <Text className="mt-4 text-center text-blue-200">
                    Masuk untuk melanjutkan ke akun Anda
                  </Text>
                </>
              )}
              {keyboardVisible && (
                <>
                  <View className="flex-row items-center justify-between">
                    {/* <View className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                      <MaterialCommunityIcons
                        name="lightning-bolt"
                        size={46}
                        color="#1E40AF"
                      />
                    </View> */}
                    <View className="">
                      <Text className={`text-4xl font-extrabold text-white`}>
                        Sign in to
                      </Text>
                      <Text
                        className={`${
                          keyboardVisible ? "text-4xl" : "text-5xl"
                        } font-extrabold text-white`}
                      >
                        your Account
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-4 text-center text-blue-200">
                    Masuk untuk melanjutkan ke akun Anda
                  </Text>
                </>
              )}
            </View>

            {/* Login Form */}
            <View className="space-y-4">
              {/* Username Input */}
              <View className="overflow-hidden rounded-xl bg-white shadow-sm">
                <View className="flex-row items-center px-4 py-2">
                  <MaterialCommunityIcons
                    name="email"
                    size={24}
                    color="#1d4bce"
                  />
                  <TextInput
                    className="ml-2 flex-1 text-lg text-black"
                    placeholder="Masukan email"
                    placeholderTextColor="#D1D5DB"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="overflow-hidden rounded-xl bg-white shadow-sm">
                <View className="flex-row items-center px-4 py-2">
                  <MaterialCommunityIcons
                    name="lock"
                    size={24}
                    color="#1d4bce"
                  />
                  <TextInput
                    className="ml-2 flex-1 text-lg text-black"
                    placeholder="Masukan password"
                    placeholderTextColor="#D1D5DB"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-2"
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#1d4bce"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end">
                <Text className="text-sm font-medium text-blue-200">
                  Lupa Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className={`mt-6 rounded-xl bg-white py-4 shadow-lg ${
                  (!username || !password || isLoading) && "opacity-50"
                }`}
                onPress={handleLogin}
                disabled={!username || !password || isLoading}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="loading"
                        size={24}
                        color="#1E40AF"
                        className="animate-spin"
                      />
                      <Text className="ml-2 text-base font-semibold text-blue-900">
                        Signing In...
                      </Text>
                    </View>
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="login"
                        size={20}
                        color="#1E40AF"
                      />
                      <Text className="ml-2 text-base font-semibold text-blue-900">
                        Masuk
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ErrorAlert
        visible={errorVisible}
        message={getErrorMessage()}
        onClose={() => setErrorVisible(false)}
      />
      {!keyboardVisible && (
        <View className="mb-5 flex-row items-center justify-center">
          <View className="flex items-center">
            <View className="mt-4 flex-row space-x-4">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                <MaterialCommunityIcons name="food" size={24} color="#1E40AF" />
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                <MaterialCommunityIcons name="car" size={24} color="#1E40AF" />
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                <MaterialCommunityIcons name="door" size={24} color="#1E40AF" />
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                <MaterialCommunityIcons
                  name="pencil"
                  size={24}
                  color="#1E40AF"
                />
              </View>
            </View>
            <Text className="mt-4 text-base text-white">
              General Affairs Suralaya
            </Text>
            <Text className="text-base text-white">Version 0.10</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
