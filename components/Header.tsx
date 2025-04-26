import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import {
  Calendar,
  CircleUserRound,
  House,
  UsersRound,
  LucideIcon,
} from "lucide-react-native";

interface HeaderProps {
  title: string;
  icon: LucideIcon;
}

const Header = ({ title, icon: Icon }: HeaderProps) => {
  const router = useRouter();

  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row gap-2 items-center">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Icon size={24} color="#c1c1c1" />
        </TouchableOpacity>
        <Text className="text-secondary text-2xl">{title}</Text>
      </View>
      <View className="flex flex-row gap-4">
        <TouchableOpacity onPress={() => router.push("/friends/Friends")}>
          <UsersRound size={24} color="#c1c1c1" />
        </TouchableOpacity>
        <Calendar size={24} color="#c1c1c1" />
        <TouchableOpacity onPress={() => router.push("/profile/Profile")}>
          <CircleUserRound size={24} color="#c1c1c1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
