import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { sendFriendRequest } from '@/services/friendship';

interface FriendRequestFormProps {
  onRequestSent: () => void;
}

const FriendRequestForm: React.FC<FriendRequestFormProps> = ({ onRequestSent }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await sendFriendRequest(username.trim());
      setSuccess(response.message);
      setUsername('');
      onRequestSent();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to send friend request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-secondary/10 p-4 rounded-lg mb-4">
      <Text className="text-secondary text-lg font-bold mb-2">Add Friend</Text>
      
      <View className="mb-3">
        <TextInput
          className="bg-secondary/20 p-3 rounded text-secondary"
          placeholder="Enter username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      
      {error ? (
        <Text className="text-red-500 mb-2">{error}</Text>
      ) : null}
      
      {success ? (
        <Text className="text-green-500 mb-2">{success}</Text>
      ) : null}
      
      <TouchableOpacity
        className="bg-primary p-3 rounded"
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-bold">Send Friend Request</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FriendRequestForm; 