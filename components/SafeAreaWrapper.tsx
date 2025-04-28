import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, className = '' }) => {
  // For iOS, we'll use SafeAreaView with proper insets
  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView className={`flex-1 ${className}`} edges={['top']}>
        <View style={{ paddingTop: 1 }}>
          {children}
        </View>
      </SafeAreaView>
    );
  }
  
  // For Android, we'll use a regular View with StatusBar height
  return (
    <View className={`flex-1 ${className}`} style={{ paddingTop: StatusBar.currentHeight }}>
      {children}
    </View>
  );
};

export default SafeAreaWrapper; 