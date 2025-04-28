import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { login, saveToken } from "@/services/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await login({ username, password });

      if (response.token) {
        // Save the JWT token
        await saveToken(response.token);
        // Redirect to dashboard
        router.replace("/");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-primary p-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-12 text-secondary">
        Welcome to MonkMode
      </Text>

      <View className="flex flex-col gap-4">
        {error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : null}

        <TextInput
          className="border border-secondary rounded-lg p-4 text-secondary"
          placeholder="Username"
          placeholderTextColor="#c1c1c1"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setError("");
          }}
          autoCapitalize="none"
        />

        <TextInput
          className="border border-secondary rounded-lg p-4 text-secondary"
          placeholder="Password"
          placeholderTextColor="#c1c1c1"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          secureTextEntry
        />

        <TouchableOpacity
          className={`p-4 rounded-lg ${
            isSubmitting ? "bg-gray-500" : "bg-secondary"
          }`}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          <Text className="text-primary text-center font-semibold">
            {isSubmitting ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-secondary">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="text-secondary font-semibold">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
