import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Friendship } from '@/services/friendship';

interface FriendItemProps {
  friend: Friendship;
  onRemove: (friendshipId: number) => void;
  isLoading: boolean;
}

const FriendItem: React.FC<FriendItemProps> = ({ 
  friend, 
  onRemove,
  isLoading 
}) => {
  return (
    <View className="bg-secondary/10 p-4 rounded-lg mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-8">
          <View className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <Text className="text-primary text-lg font-bold">
              {friend.friendUsername.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="ml-2">
            <Text className="text-secondary font-medium">
              {friend.friendUsername}
            </Text>
            <Text className="text-secondary/70 text-sm">
              Friends since {new Date(friend.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        {isLoading ? (
          <ActivityIndicator color="#c1c1c1" />
        ) : (
          <TouchableOpacity
            className="bg-red-400/15 px-3 py-1 rounded"
            onPress={() => onRemove(friend.id)}
          >
            <Text className="text-red-400/60 font-medium">Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FriendItem; 