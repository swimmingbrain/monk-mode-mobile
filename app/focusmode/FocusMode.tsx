import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const FocusMode = () => {
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [xp, setXp] = useState(0);

  const router = useRouter();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update XP every minute (60 seconds)
    const intervalId = setInterval(() => {
      setXp((prevXp) => prevXp + 50);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SafeAreaView className="bg-black">
      <View className="flex items-center justify-center w-full h-full gap-10">
        <View className="flex items-center gap-6">
          <View className="bg-primary w-48 h-48 rounded-full flex items-center justify-center">
            <Text className="text-secondary text-4xl">{formatTime(timer)}</Text>
          </View>
          <Text className="text-secondary">{xp} XP verdient</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="flex flex-row items-center bg-secondary rounded-lg py-4 px-20"
        >
          <Text className="text-primary text-lg">aufgeben</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FocusMode;
