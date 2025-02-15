import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import ErrorAlert from "../components/ErrorAlert";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, errors } = useAuthStore();
  const [errorVisible, setErrorVisible] = useState(false);

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
    <SafeAreaView className="flex-1 bg-blue-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center"
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-8 py-12">
            {/* Header */}
            <View className="mb-12 items-center">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-2xl bg-white">
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={48}
                  color="#1E40AF"
                />
              </View>
              <Text className="text-2xl font-bold text-white">
                Welcome Back!
              </Text>
              <Text className="mt-2 text-center text-blue-200">
                Sign in to continue to your account
              </Text>
            </View>

            {/* Login Form */}
            <View className="space-y-4">
              {/* Username Input */}
              <View className="rounded-xl bg-white/10 px-4 py-3">
                <Text className="mb-1 text-sm font-medium text-blue-200">
                  Email
                </Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="email"
                    size={20}
                    color="#BFDBFE"
                  />
                  <TextInput
                    className="ml-2 flex-1 text-base text-white"
                    placeholder="Enter your email"
                    placeholderTextColor="#93C5FD"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="rounded-xl bg-white/10 px-4 py-3">
                <Text className="mb-1 text-sm font-medium text-blue-200">
                  Password
                </Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="lock"
                    size={20}
                    color="#BFDBFE"
                  />
                  <TextInput
                    className="ml-2 flex-1 text-base text-white"
                    placeholder="Enter your password"
                    placeholderTextColor="#93C5FD"
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
                      color="#BFDBFE"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end">
                <Text className="text-sm font-medium text-blue-200">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className={`mt-6 rounded-xl bg-white py-4 ${
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
                        Sign In
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
    </SafeAreaView>
  );
};

export default LoginScreen;
