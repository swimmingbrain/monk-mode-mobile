import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  Friendship,
} from "@/services/friendship";
import FriendItem from "@/components/FriendItem";
import FriendRequest from "@/components/FriendRequest";
import FriendRequestForm from "@/components/FriendRequestForm";
import { signalRService } from "@/services/signalR";
import { SafeAreaView } from "react-native-safe-area-context";

const Friends = () => {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

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

  const loadFriendRequests = async () => {
    try {
      setIsLoading(true);
      setError("");
      const requests = await getFriendRequests();
      setFriendRequests(requests);
    } catch (err) {
      console.error("Error loading friend requests:", err);
      if (err instanceof Error) {
        setError(`Failed to load friend requests: ${err.message}`);
      } else {
        setError("Failed to load friend requests: Unknown error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
    loadFriendRequests();

    // Set up SignalR listeners for real-time notifications
    signalRService.onReceiveFriendRequest((userId, username) => {
      Alert.alert(
        "New Friend Request",
        `${username} sent you a friend request`,
        [
          {
            text: "View",
            onPress: () => {
              setActiveTab("requests");
              loadFriendRequests();
            },
          },
          { text: "Later", style: "cancel" },
        ]
      );
    });

    signalRService.onFriendRequestAccepted((userId) => {
      Alert.alert(
        "Friend Request Accepted",
        "Your friend request was accepted",
        [
          {
            text: "View Friends",
            onPress: () => {
              setActiveTab("friends");
              loadFriends();
            },
          },
          { text: "OK", style: "cancel" },
        ]
      );
    });

    signalRService.onFriendRequestRejected((userId) => {
      Alert.alert(
        "Friend Request Rejected",
        "Your friend request was rejected"
      );
    });

    return () => {
      signalRService.removeAllListeners();
    };
  }, []);

  const handleAcceptRequest = async (friendshipId: number) => {
    try {
      setIsActionLoading(true);
      await acceptFriendRequest(friendshipId);
      await loadFriendRequests();
      await loadFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert("Error", "Failed to accept friend request");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectRequest = async (friendshipId: number) => {
    try {
      setIsActionLoading(true);
      await rejectFriendRequest(friendshipId);
      await loadFriendRequests();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      Alert.alert("Error", "Failed to reject friend request");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRemoveFriend = async (friendshipId: number) => {
    Alert.alert(
      "Remove Friend",
      "Are you sure you want to remove this friend?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setIsActionLoading(true);
              await removeFriend(friendshipId);
              await loadFriends();
            } catch (error) {
              console.error("Error removing friend:", error);
              Alert.alert("Error", "Failed to remove friend");
            } finally {
              setIsActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRequestSent = () => {
    // Refresh the friends list after sending a request
    loadFriends();
  };

  return (
    <SafeAreaView className="bg-black h-full py-8">
      <ScrollView>
        <View className="flex gap-10 px-4 py-4">
          <Header title="Friends" iconName="arrow-left" />

          {/* Tabs */}
          <View className="flex-row bg-secondary/10 rounded-lg p-1">
            <TouchableOpacity
              className={`flex-1 p-2 rounded ${
                activeTab === "friends" ? "bg-primary" : ""
              }`}
              onPress={() => setActiveTab("friends")}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "friends" ? "text-white" : "text-secondary"
                }`}
              >
                Friends ({friends.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 p-2 rounded ${
                activeTab === "requests" ? "bg-primary" : ""
              }`}
              onPress={() => setActiveTab("requests")}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "requests" ? "text-white" : "text-secondary"
                }`}
              >
                Requests ({friendRequests.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add Friend Form */}
          <FriendRequestForm onRequestSent={handleRequestSent} />

          {isLoading ? (
            <View className="flex items-center justify-center py-10">
              <ActivityIndicator size="large" color="#c1c1c1" />
            </View>
          ) : error ? (
            <View className="bg-red-500/20 p-4 rounded-lg">
              <Text className="text-red-500">{error}</Text>
            </View>
          ) : activeTab === "friends" ? (
            <View>
              <Text className="text-secondary text-xl font-bold mb-4">
                Your Friends
              </Text>
              {friends.length === 0 ? (
                <Text className="text-secondary/70">
                  You don't have any friends yet.
                </Text>
              ) : (
                friends.map((friend) => (
                  <FriendItem
                    key={friend.id}
                    friend={friend}
                    onRemove={handleRemoveFriend}
                    isLoading={isActionLoading}
                  />
                ))
              )}
            </View>
          ) : (
            <View>
              <Text className="text-secondary text-xl font-bold mb-4">
                Friend Requests
              </Text>
              {friendRequests.length === 0 ? (
                <Text className="text-secondary/70">
                  You don't have any pending friend requests.
                </Text>
              ) : (
                friendRequests.map((request) => (
                  <FriendRequest
                    key={request.id}
                    request={request}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                    isLoading={isActionLoading}
                  />
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Friends;
