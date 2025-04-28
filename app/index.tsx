import { View, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/Header";
import TimeblockList from "@/components/TimeblockList";
import FocusModeButton from "@/components/FocusModeButton";
import CurrentFocusTime from "@/components/CurrentFocusTime";
import TaskList from "@/components/TaskList";
import { House } from "lucide-react-native";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

export default function Index() {
  return (
    <SafeAreaWrapper className="bg-black">
      <ScrollView>
        <View className="flex gap-10 px-4 py-4">
          <Header title="Dashboard" icon={House} />
          <FocusModeButton />
          <TimeblockList />
          <CurrentFocusTime />
          <TaskList />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
