import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Friendship } from '@/services/friendship';
import { acceptFriendRequest, rejectFriendRequest } from '@/services/friendship';

interface FriendRequestProps {
  request: Friendship;
  onAccept: (friendshipId: number) => void;
  onReject: (friendshipId: number) => void;
  isLoading: boolean;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ 
  request, 
  onAccept, 
  onReject,
  isLoading 
}) => {
  return (
    <View className="bg-secondary/10 p-4 rounded-lg mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-4">
          <View className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <Text className="text-primary text-lg font-bold">
              {request.friendUsername.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text className="text-secondary font-medium">
              {request.friendUsername}
            </Text>
            <Text className="text-secondary/70 text-sm">
              {new Date(request.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        {isLoading ? (
          <ActivityIndicator color="#c1c1c1" />
        ) : (
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="bg-green-500 px-3 py-1 rounded"
              onPress={() => onAccept(request.id)}
            >
              <Text className="text-white font-medium">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-500 px-3 py-1 rounded"
              onPress={() => onReject(request.id)}
            >
              <Text className="text-white font-medium">Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendRequest; 