import { View, Text, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/Header";
import { MoveLeft } from "lucide-react-native";

const Profile = () => {
  return (
    <View className="bg-black h-full py-10">
      <ScrollView>
        <View className="flex gap-10 px-4">
          <Header title="Profil" icon={MoveLeft} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
