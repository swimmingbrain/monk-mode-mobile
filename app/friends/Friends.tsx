import { View, Text, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/Header";
import { MoveLeft } from "lucide-react-native";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

const Friends = () => {
  return (
    <SafeAreaWrapper className="bg-black">
      <ScrollView>
        <View className="flex gap-10 px-4 py-4">
          <Header title="Freunde" icon={MoveLeft} />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default Friends;
