import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { updateXP } from "@/services/profile";

const FocusMode = () => {
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [xp, setXp] = useState(0);
  const [isGivingUp, setIsGivingUp] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  const router = useRouter();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setXp((prevXp) => prevXp + 50);
      }, 1000); // Changed to 1000ms to see effect quickly

      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

  const handlePress = async () => {
    if (isGivingUp) {
      return; // Prevent multiple calls while processing
    }

    setIsGivingUp(true);
    setIsRunning(false);

    try {
      if (xp > 0) {
        const response = await updateXP(xp);
      }
      router.push("/");
    } catch (error: any) {
      console.error("Failed to update XP:", error.message);
    } finally {
      setIsGivingUp(false);
    }
  };

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
          onPress={handlePress}
          disabled={isGivingUp}
          className="flex flex-row items-center bg-secondary rounded-lg py-4 px-20"
        >
          <Text className="text-primary text-lg">aufgeben</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FocusMode;
