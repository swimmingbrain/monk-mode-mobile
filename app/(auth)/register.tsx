import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router, useRouter } from "expo-router";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleRegister = () => {
    // TODO: Implement register logic
    console.log("Register attempt with:", username, email, password);
    router.push("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-primary p-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-12 text-secondary">
        Create Account
      </Text>

      <View className="flex flex-col gap-4">
        <TextInput
          className="border border-secondary rounded-lg p-4 text-secondary"
          placeholder="Username"
          placeholderTextColor="#c1c1c1"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          className="border border-secondary rounded-lg p-4 text-secondary"
          placeholder="Email"
          placeholderTextColor="#c1c1c1"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="border border-secondary rounded-lg p-4 text-secondary"
          placeholder="Password"
          placeholderTextColor="#c1c1c1"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          className="border border-secondary rounded-lg p-4 text-secondary"
          placeholder="Confirm Password"
          placeholderTextColor="#c1c1c1"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-secondary p-4 rounded-lg"
          onPress={handleRegister}
        >
          <Text className="text-primary text-center font-semibold">
            Register
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-secondary">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-secondary font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
