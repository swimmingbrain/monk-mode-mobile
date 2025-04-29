import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { MoveLeft } from "lucide-react-native";
import { router } from "expo-router";
import { removeToken } from "@/services/auth";
import { getUserProfile } from "@/services/profile";
import { getFriends } from "@/services/friends";
import { UserProfile, Friendship } from "@/types/types";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    const loadFriends = async () => {
      try {
        setIsLoading(true);
        setError("");
        const loadedFriends = await getFriends();
        setFriends(loadedFriends);
      } catch (err) {
        console.error("Error loading friends:", err);
        if (err instanceof Error) {
          setError(`Failed to load friends: ${err.message}`);
        } else {
          setError("Failed to load friends: Unknown error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
    loadFriends();
  }, []);

  const handleLogout = async () => {
    try {
      await removeToken();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView className="bg-black h-full py-8">
      <ScrollView>
        <View className="flex gap-10 px-4 py-4">
          <Header title="Profile" icon={MoveLeft} />

          {/* Profile Section */}
          <View className="bg-secondary/10 p-4 rounded-lg">
            <View className="flex-row items-center">
              <View className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
                <Text className="text-primary text-2xl font-bold">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
              <View className="ml-4">
                <Text className="text-secondary text-xl font-bold">
                  {user?.username || "Loading..."}
                </Text>
                <Text className="text-secondary/70">
                  {user?.email || "Loading..."}
                </Text>
              </View>
            </View>
          </View>

          {/* Statistics Section */}
          <View>
            <Text className="text-secondary text-xl font-bold mb-4">
              Focus Statistics
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] bg-secondary/10 p-4 rounded-lg mb-4">
                <Text className="text-secondary/70 text-sm">
                  Today's Focus Time
                </Text>
                <Text className="text-secondary text-2xl font-bold">0h 0m</Text>
              </View>
              <View className="w-[48%] bg-secondary/10 p-4 rounded-lg mb-4">
                <Text className="text-secondary/70 text-sm">This Week</Text>
                <Text className="text-secondary text-2xl font-bold">0h 0m</Text>
              </View>
              <View className="w-[48%] bg-secondary/10 p-4 rounded-lg mb-4">
                <Text className="text-secondary/70 text-sm">
                  All Time Focus
                </Text>
                <Text className="text-secondary text-2xl font-bold">0h 0m</Text>
              </View>
              <View className="w-[48%] bg-secondary/10 p-4 rounded-lg mb-4">
                <Text className="text-secondary/70 text-sm">
                  Completed Tasks
                </Text>
                <Text className="text-secondary text-2xl font-bold">0</Text>
              </View>
            </View>
          </View>

          {/* Friends Section */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-secondary text-xl font-bold">
                Friends ({friends.length})
              </Text>
              <TouchableOpacity
                className="bg-primary px-3 py-1 rounded"
                onPress={() => router.push("/friends/Friends")}
              >
                <Text className="text-white font-medium">View All</Text>
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <ActivityIndicator color="#c1c1c1" />
            ) : error ? (
              <Text className="text-red-500">{error}</Text>
            ) : friends.length === 0 ? (
              <Text className="text-secondary/70">
                You don't have any friends yet.
              </Text>
            ) : (
              <View className="flex-row flex-wrap">
                {friends.slice(0, 4).map((friend) => (
                  <View
                    key={friend.id}
                    className="w-[48%] bg-secondary/10 p-4 rounded-lg mb-4 mr-[4%]"
                  >
                    <View className="flex-row items-center space-x-6">
                      <View className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <Text className="text-primary text-sm font-bold">
                          {friend.friendUsername.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text className="text-secondary font-medium ml-2">
                        {friend.friendUsername}
                      </Text>
                    </View>
                  </View>
                ))}
                {friends.length > 4 && (
                  <View className="w-[48%] bg-secondary/10 p-4 rounded-lg mb-4 mr-[4%] items-center justify-center">
                    <Text className="text-secondary/70">
                      +{friends.length - 4} more
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-400/15 p-4 rounded-lg"
            onPress={handleLogout}
          >
            <Text className="text-red-400/60 text-center font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
