import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Implement actual login logic
    console.log("Login attempt with:", username, password);

    // For now, just redirect to dashboard
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-primary p-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-12 text-secondary">
        Welcome to MonkMode
      </Text>

      <View className="flex flex-col gap-4">
        <TextInput
          className="border border-secondary rounded-lg p-4 text-secondary"
          placeholder="Username"
          placeholderTextColor="#c1c1c1"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          className="border border-secondary rounded-lg p-4 text-secondary"
          placeholder="Password"
          placeholderTextColor="#c1c1c1"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-secondary p-4 rounded-lg"
          onPress={handleLogin}
        >
          <Text className="text-primary text-center font-semibold">Login</Text>
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
