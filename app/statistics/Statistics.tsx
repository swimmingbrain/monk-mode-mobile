import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { getDailyStatistics } from "@/services/statistics";
import { format, subDays, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from "date-fns";
import { de } from "date-fns/locale";
import Header from "@/components/Header";
import { BarChart, ChevronLeft, ChevronRight } from "lucide-react-native";

interface DailyStatistics {
  id: number;
  userId: string;
  date: string;
  totalFocusTime: number;
}

const Statistics = () => {
  const [statistics, setStatistics] = useState<DailyStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchStatistics();
  }, [selectedDate]);

  const fetchStatistics = async () => {
    try {
      const data = await getDailyStatistics();
      console.log('Raw statistics data:', data);
      setStatistics(data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFocusTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => 
      direction === 'prev' 
        ? subDays(prev, 7)
        : addDays(prev, 7)
    );
  };

  // Ensure we have data for all 7 days, filling in zeros for missing days
  const getChartData = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      return format(addDays(weekStart, i), "yyyy-MM-dd");
    });

    const dataMap = new Map(
      statistics.map(stat => [
        format(new Date(stat.date), "yyyy-MM-dd"),
        stat.totalFocusTime
      ])
    );

    return {
      labels: last7Days.map(date => format(new Date(date), "dd.MM", { locale: de })),
      datasets: [{
        data: last7Days.map(date => (dataMap.get(date) || 0) / 60) // Convert to minutes
      }]
    };
  };

  const chartData = getChartData();

  // Calculate total focus time for today (always current day)
  const getTodayFocusTime = () => {
    const todayStats = statistics.filter(stat => isToday(new Date(stat.date)));
    console.log('Today stats:', todayStats);
    return todayStats.reduce((sum, stat) => sum + stat.totalFocusTime, 0);
  };

  // Calculate total focus time for the current week
  const getCurrentWeekFocusTime = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    
    const weekStats = statistics.filter(stat => {
      const statDate = new Date(stat.date);
      return statDate >= weekStart && statDate <= weekEnd;
    });
    console.log('Current week stats:', weekStats);
    return weekStats.reduce((sum, stat) => sum + stat.totalFocusTime, 0);
  };

  // Calculate total focus time for the selected week
  const getSelectedWeekFocusTime = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    
    const weekStats = statistics.filter(stat => {
      const statDate = new Date(stat.date);
      return statDate >= weekStart && statDate <= weekEnd;
    });
    console.log('Selected week stats:', weekStats);
    return weekStats.reduce((sum, stat) => sum + stat.totalFocusTime, 0);
  };

  // Calculate longest focus session for the selected week
  const getLongestFocusSession = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    
    const weekStats = statistics.filter(stat => {
      const statDate = new Date(stat.date);
      return statDate >= weekStart && statDate <= weekEnd;
    });
    
    const maxTime = Math.max(...weekStats.map(stat => stat.totalFocusTime), 0);
    console.log('Longest session in selected week:', maxTime);
    return maxTime;
  };

  // Calculate days with focus for the selected week
  const getDaysWithFocus = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    
    const daysWithFocus = new Set(
      statistics
        .filter(stat => {
          const statDate = new Date(stat.date);
          return statDate >= weekStart && statDate <= weekEnd && stat.totalFocusTime > 0;
        })
        .map(stat => format(new Date(stat.date), "yyyy-MM-dd"))
    );
    
    console.log('Days with focus in selected week:', Array.from(daysWithFocus));
    return daysWithFocus.size;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#FFD700" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-black h-full py-8">
      <ScrollView>
        <View className="flex gap-10 px-4 py-4">
          <Header title="Statistiken" icon={BarChart} />

          {/* Week Navigation */}
          <View className="flex-row justify-between items-center">
            <TouchableOpacity 
              onPress={() => navigateWeek('prev')}
              className="p-2"
            >
              <ChevronLeft color="#FFD700" size={24} />
            </TouchableOpacity>
            <Text className="text-secondary">
              {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "dd.MM", { locale: de })} - {format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "dd.MM", { locale: de })}
            </Text>
            <TouchableOpacity 
              onPress={() => navigateWeek('next')}
              className="p-2"
            >
              <ChevronRight color="#FFD700" size={24} />
            </TouchableOpacity>
          </View>

          {/* Weekly Overview Chart */}
          <View className="bg-secondary/10 p-4 rounded-lg">
            <Text className="text-secondary text-lg mb-4">Wöchentliche Übersicht</Text>
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 48}
              height={220}
              chartConfig={{
                backgroundColor: "#000000",
                backgroundGradientFrom: "#000000",
                backgroundGradientTo: "#000000",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#FFD700"
                },
                formatYLabel: (value) => `${Math.round(Number(value))}m`,
                count: 5
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              segments={4}
            />
          </View>

          {/* Daily Stats */}
          <View className="bg-secondary/10 p-4 rounded-lg">
            <Text className="text-secondary text-lg mb-4">Tagesstatistik</Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-secondary">Fokuszeit heute</Text>
                <Text className="text-secondary font-bold">
                  {formatFocusTime(getTodayFocusTime())}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-secondary">Fokuszeit diese Woche</Text>
                <Text className="text-secondary font-bold">
                  {formatFocusTime(getCurrentWeekFocusTime())}
                </Text>
              </View>
            </View>
          </View>

          {/* Achievements Section */}
          <View className="bg-secondary/10 p-4 rounded-lg">
            <Text className="text-secondary text-lg mb-4">Erfolge</Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-secondary">Längste Fokussession</Text>
                <Text className="text-secondary font-bold">
                  {formatFocusTime(getLongestFocusSession())}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-secondary">Tage im Fokus</Text>
                <Text className="text-secondary font-bold">
                  {getDaysWithFocus()} Tage
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistics; 