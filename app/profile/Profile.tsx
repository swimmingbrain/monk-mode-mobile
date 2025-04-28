import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import Header from "@/components/Header";
import { MoveLeft } from "lucide-react-native";
import { router } from "expo-router";
import { removeToken } from "@/services/auth";

const Profile = () => {
  const handleLogout = async () => {
    try {
      await removeToken();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View className="bg-black h-full py-10">
      <ScrollView>
        <View className="flex gap-10 px-4">
          <Header title="Profil" icon={MoveLeft} />

          <TouchableOpacity
            className="bg-secondary p-4 rounded-lg mt-4"
            onPress={handleLogout}
          >
            <Text className="text-primary text-center font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
