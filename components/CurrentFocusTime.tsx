import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { MoveRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { getDailyStatistics } from "@/services/statistics";

const CurrentFocusTime = () => {
  const router = useRouter();
  const [todayStats, setTodayStats] = useState<number>(0);
  const [weeklyStats, setWeeklyStats] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getDailyStatistics(new Date());
        if (stats.length > 0) {
          setTodayStats(stats[0].totalFocusTime);
          
          // Calculate weekly total
          const weeklyTotal = stats.reduce((acc, curr) => acc + curr.totalFocusTime, 0);
          setWeeklyStats(weeklyTotal);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStats();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <View className="flex gap-4">
      <View className="flex flex-row gap-2 items-center justify-between">
        <Text className="text-xl text-secondary">Aktuelle Fokuszeiten</Text>
        <TouchableOpacity 
          className="flex flex-row items-center justify-end gap-2"
          onPress={() => router.push("/statistics/Statistics")}
        >
          <Text className="text-secondary">alle Statistiken</Text>
          <MoveRight color="#c1c1c1" size={20} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row gap-4">
        <View className="flex-1 bg-primary/10 rounded-lg p-4">
          <Text className="text-secondary/70 text-sm mb-1">Heute</Text>
          <Text className="text-secondary text-2xl font-bold">{formatTime(todayStats)}</Text>
        </View>
        <View className="flex-1 bg-primary/10 rounded-lg p-4">
          <Text className="text-secondary/70 text-sm mb-1">Diese Woche</Text>
          <Text className="text-secondary text-2xl font-bold">{formatTime(weeklyStats)}</Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentFocusTime;
