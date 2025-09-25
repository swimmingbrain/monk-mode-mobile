import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  icon: React.ReactNode; // statt LucideIcon: jetzt direkt JSX
}

const Header = ({ title, icon }: HeaderProps) => {
  const router = useRouter();

  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row gap-2 items-center">
        <TouchableOpacity onPress={() => router.push("/")}>
          {icon}
        </TouchableOpacity>
        <Text className="text-secondary text-2xl">{title}</Text>
      </View>
      <View className="flex flex-row gap-4">
        <TouchableOpacity onPress={() => router.push("/friends/Friends")}>
          <Feather name="users" size={24} color="#c1c1c1" />
        </TouchableOpacity>
        <Feather name="calendar" size={24} color="#c1c1c1" />
        <TouchableOpacity onPress={() => router.push("/profile/Profile")}>
          <Feather name="user" size={24} color="#c1c1c1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
